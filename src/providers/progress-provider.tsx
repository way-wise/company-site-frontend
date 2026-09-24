"use client";

import { useEffect, useState } from "react";
import { ProgressProvider as AppProgressProvider } from "@bprogress/next/app";

/**
 * @bprogress/next/app renders its own <style> tag internally, which we don't control.
 * Browser extensions (dark-mode ones in particular) add a className to that tag between
 * SSR and hydration, which React can't reconcile and logs as a hydration mismatch.
 *
 * Deferring the wrapper to mount (server + first client render both skip it, matching
 * exactly) means the <style> tag only appears after hydration has already completed, as
 * an ordinary client-side update rather than something React diffs against server HTML.
 */
export const ProgressProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <>{children}</>;

  return (
    <AppProgressProvider options={{ showSpinner: false }}>
      {children}
    </AppProgressProvider>
  );
};
