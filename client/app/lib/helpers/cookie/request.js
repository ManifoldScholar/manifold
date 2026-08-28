/**
 * Read a cookie value from a server-side loader/action/middleware `request`.
 */
export default function getRequestCookie(request, name) {
  const cookieHeader = request?.headers?.get("cookie") || "";
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? decodeURIComponent(match[1]) : null;
}
