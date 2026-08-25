import { getBudgetLabel, getServiceLabel } from "@/lib/contact-options";
import type { ContactFormData } from "@/services/ContactService";

/**
 * Every value below is attacker-controlled — it comes straight from a public,
 * unauthenticated form. Escaping is mandatory: without it a submitter could
 * inject markup or a link into an email your team is going to read and trust.
 */
const escapeHtml = (value: string) =>
   value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

const BRAND = "#00a3ff";

const row = (label: string, value: string) => `
      <tr>
        <td style="padding:12px 0;border-bottom:1px solid #eaeef2;vertical-align:top;width:170px;color:#64748b;font-size:13px;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(
           label
        )}</td>
        <td style="padding:12px 0;border-bottom:1px solid #eaeef2;vertical-align:top;color:#1B3447;font-size:14px;font-family:Arial,Helvetica,sans-serif;">${value}</td>
      </tr>`;

export const buildContactNotificationSubject = (data: ContactFormData) =>
   `New Inquiry: ${getServiceLabel(data.serviceRequired)} — ${data.fullName}`;

/**
 * Plain-text alternative. Not optional: a text/plain part measurably improves
 * deliverability, and some mobile notifications preview it instead of the HTML.
 */
export const buildContactNotificationText = (data: ContactFormData) =>
   [
      "New contact form submission — waywisetech.com",
      "",
      `Name:        ${data.fullName}`,
      `Email:       ${data.email}`,
      `Phone:       ${data.whatsappNumber}`,
      `Service:     ${getServiceLabel(data.serviceRequired)}`,
      `Budget:      ${getBudgetLabel(data.projectBudget)}`,
      "",
      "Project description:",
      data.projectDescription,
      "",
      "---",
      "Reply directly to this email to reach the sender.",
   ].join("\n");

/**
 * Table-based layout with inline styles — the only thing that renders reliably
 * in Outlook. No <style> block, no flexbox, no external assets.
 */
export const buildContactNotificationHtml = (data: ContactFormData) => `<!doctype html>
<html>
  <body style="margin:0;padding:24px 12px;background:#f4f6f8;">
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      <tr>
        <td style="background:${BRAND};padding:24px 28px;">
          <p style="margin:0;color:#ffffff;font-size:18px;font-weight:bold;font-family:Arial,Helvetica,sans-serif;">New Contact Form Submission</p>
          <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:13px;font-family:Arial,Helvetica,sans-serif;">waywisetech.com / contact-us</p>
        </td>
      </tr>
      <tr>
        <td style="padding:8px 28px 24px;">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
            ${row("Full Name", escapeHtml(data.fullName))}
            ${row(
               "Email",
               // Safe to interpolate into href: the route validates this as an
               // email address with zod before the template ever runs, and
               // escapeHtml neutralises the quote that would break out of the
               // attribute.
               `<a href="mailto:${escapeHtml(data.email)}" style="color:${BRAND};text-decoration:none;">${escapeHtml(data.email)}</a>`
            )}
            ${row("Phone", escapeHtml(data.whatsappNumber))}
            ${row("Service Required", escapeHtml(getServiceLabel(data.serviceRequired)))}
            ${row("Project Budget", escapeHtml(getBudgetLabel(data.projectBudget)))}
          </table>

          <p style="margin:24px 0 8px;color:#64748b;font-size:13px;font-family:Arial,Helvetica,sans-serif;">Project Description</p>
          <div style="padding:16px;background:#f8fafc;border-left:3px solid ${BRAND};border-radius:4px;color:#1B3447;font-size:14px;line-height:1.6;white-space:pre-wrap;font-family:Arial,Helvetica,sans-serif;">${escapeHtml(
             data.projectDescription
          )}</div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0;color:#94a3b8;font-size:12px;font-family:Arial,Helvetica,sans-serif;">Reply directly to this email to respond to ${escapeHtml(
             data.fullName
          )}.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
