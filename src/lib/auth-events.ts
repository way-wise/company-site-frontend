export const AUTH_LOGOUT_EVENT = "auth:logout";

export const dispatchAuthLogoutEvent = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(new Event(AUTH_LOGOUT_EVENT));
};

export const subscribeToAuthLogout = (handler: () => void) => {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  window.addEventListener(AUTH_LOGOUT_EVENT, handler);

  return () => {
    window.removeEventListener(AUTH_LOGOUT_EVENT, handler);
  };
};

