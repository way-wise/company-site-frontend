import {
   buildContactNotificationHtml,
   buildContactNotificationSubject,
   buildContactNotificationText,
} from "@/lib/email/contact-notification-template";
import {
   getFromAddress,
   getNotificationRecipients,
   getTransporter,
} from "@/lib/email/mailer";
import { NextResponse } from "next/server";
import { z } from "zod";

// nodemailer opens raw TCP sockets, which the edge runtime cannot do.
export const runtime = "nodejs";
// Never cache or prerender a mail-sending POST.
export const dynamic = "force-dynamic";

/**
 * POST /api/contact-email
 *
 * Notifies the team about a contact form submission that has ALREADY been
 * persisted by the backend. This route only sends mail — it is deliberately not
 * the system of record, so a failure here loses a notification, never a lead.
 *
 * This file route wins over the `/api/:path*` rewrite in next.config.ts because
 * a plain array of rewrites is applied as `afterFiles`, i.e. after filesystem
 * routes. Renaming this directory would silently proxy it to the backend.
 */

const contactEmailSchema = z.object({
   fullName: z.string().trim().min(2).max(120),
   email: z.string().trim().email().max(200),
   whatsappNumber: z.string().trim().min(6).max(40),
   serviceRequired: z.string().trim().min(1).max(80),
   projectBudget: z.string().trim().min(1).max(80),
   projectDescription: z.string().trim().min(10).max(5000),
});

/**
 * Best-effort in-process throttle. This endpoint is public and unauthenticated,
 * so without it anyone can loop a script and flood the team inbox.
 *
 * Caveat: serverless runs many isolated instances, so the real-world limit is
 * (this limit x live instances). It stops casual abuse, not a determined
 * attacker — put a proper limiter at the edge/WAF if that becomes a problem.
 */
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const hits = new Map<string, number[]>();

const isRateLimited = (key: string) => {
   const now = Date.now();
   const recent = (hits.get(key) ?? []).filter(
      (time) => now - time < RATE_WINDOW_MS
   );

   if (recent.length >= RATE_LIMIT) {
      hits.set(key, recent);
      return true;
   }

   recent.push(now);
   hits.set(key, recent);

   // Bound the map so a spray of unique IPs cannot grow it without limit.
   if (hits.size > 5000) {
      for (const [entryKey, times] of hits) {
         if (times.every((time) => now - time >= RATE_WINDOW_MS)) {
            hits.delete(entryKey);
         }
      }
   }

   return false;
};

const clientKey = (request: Request) => {
   const forwarded = request.headers.get("x-forwarded-for");
   return forwarded?.split(",")[0]?.trim() || "unknown";
};

export async function POST(request: Request) {
   if (isRateLimited(clientKey(request))) {
      return NextResponse.json(
         { success: false, message: "Too many requests. Please try again later." },
         { status: 429 }
      );
   }

   let payload: unknown;
   try {
      payload = await request.json();
   } catch {
      return NextResponse.json(
         { success: false, message: "Invalid JSON body." },
         { status: 400 }
      );
   }

   const parsed = contactEmailSchema.safeParse(payload);
   if (!parsed.success) {
      // Re-validated server-side: the client checks are for UX only and are
      // trivially bypassed by posting to this route directly.
      return NextResponse.json(
         { success: false, message: "Invalid submission." },
         { status: 400 }
      );
   }

   const data = parsed.data;

   try {
      const recipients = getNotificationRecipients();

      await getTransporter().sendMail({
         from: getFromAddress(),
         to: recipients,
         // Lets the team hit Reply and answer the visitor directly. The From
         // stays on our own domain so SPF/DKIM still pass.
         replyTo: `"${data.fullName.replace(/"/g, "")}" <${data.email}>`,
         subject: buildContactNotificationSubject(data),
         text: buildContactNotificationText(data),
         html: buildContactNotificationHtml(data),
      });

      return NextResponse.json({ success: true, message: "Notification sent." });
   } catch (error) {
      // Logged, not surfaced: the submission is already stored, so the visitor
      // gets their thank-you either way. Watch server logs for this line.
      console.error("[contact-email] Failed to send notification:", error);

      return NextResponse.json(
         { success: false, message: "Failed to send notification." },
         { status: 500 }
      );
   }
}
