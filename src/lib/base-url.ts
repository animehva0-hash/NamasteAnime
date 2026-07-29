export function getBaseUrlFromRequest(request: Request): string {
  const host = request.headers.get("host") || "";
  
  // Always https for production/preview (non-localhost)
  if (host && !host.startsWith("0.0.0.0") && !host.includes("localhost") && !host.startsWith("127.")) {
    return `https://${host}`;
  }
  
  // Localhost
  const url = new URL(request.url);
  return `http://localhost:${url.port || "3000"}`;
}
