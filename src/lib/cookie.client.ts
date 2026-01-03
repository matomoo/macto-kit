// Client-side cookie utilities.
// These functions manage cookies in the browser only.
// Server actions handle cookie updates on the server side.

const AUTH_COOKIE_NAME = "sb-auth-token";
const USER_COOKIE_NAME = "sb-user";
const SESSION_COOKIE_NAME = "sb-session";

function setCookieValue(cookieString: string) {
  // biome-ignore lint/suspicious/noDocumentCookie: Encapsulated cookie management
  document.cookie = cookieString;
}

export function setClientCookie(key: string, value: string, days = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  setCookieValue(`${key}=${value}; expires=${expires}; path=/; SameSite=Strict`);
}

export function getClientCookie(key: string) {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${key}=`))
    ?.split("=")[1];
}

export function deleteClientCookie(key: string) {
  setCookieValue(`${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`);
}

// Auth-specific cookie functions
export function setAuthCookie(token: string, days = 7) {
  setClientCookie(AUTH_COOKIE_NAME, token, days);
}

export function getAuthCookie() {
  return getClientCookie(AUTH_COOKIE_NAME);
}

export function deleteAuthCookie() {
  deleteClientCookie(AUTH_COOKIE_NAME);
}

export function setUserCookie<T>(userData: T, days = 7) {
  const userString = JSON.stringify(userData);
  setClientCookie(USER_COOKIE_NAME, encodeURIComponent(userString), days);
}

export function getUserCookie() {
  const cookie = getClientCookie(USER_COOKIE_NAME);
  if (!cookie) return null;
  try {
    return JSON.parse(decodeURIComponent(cookie));
  } catch {
    return null;
  }
}

export function deleteUserCookie() {
  deleteClientCookie(USER_COOKIE_NAME);
}

export function setSessionCookie<T>(sessionData: T, days = 7) {
  const sessionString = JSON.stringify(sessionData);
  setClientCookie(SESSION_COOKIE_NAME, encodeURIComponent(sessionString), days);
}

export function getSessionCookie() {
  const cookie = getClientCookie(SESSION_COOKIE_NAME);
  if (!cookie) return null;
  try {
    return JSON.parse(decodeURIComponent(cookie));
  } catch {
    return null;
  }
}

export function deleteSessionCookie() {
  deleteClientCookie(SESSION_COOKIE_NAME);
}

export function clearAllAuthCookies() {
  deleteAuthCookie();
  deleteUserCookie();
  deleteSessionCookie();
}
