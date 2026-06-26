/**
 * Catch-all API proxy.
 *
 * Browsers call same-origin /api/* (NEXT_PUBLIC_API_BASE_URL stays empty in
 * deployments); this handler forwards the request to the backend over the
 * private network (INTERNAL_API_BASE_URL, e.g. http://backend:5000) at runtime.
 * No public backend URL, no CORS.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HOP_BY_HOP_HEADERS = [
  "connection",
  "content-length",
  "host",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "transfer-encoding",
  "upgrade",
];

function getInternalApiBaseUrl(): string {
  return (process.env.INTERNAL_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
}

async function proxyRequest(
  request: Request,
  context: { params: Promise<{ path?: string[] }> }
): Promise<Response> {
  const params = await context.params;
  const path = Array.isArray(params?.path)
    ? params.path.map((segment) => encodeURIComponent(segment)).join("/")
    : "";
  const requestUrl = new URL(request.url);
  const upstreamUrl = new URL(`${getInternalApiBaseUrl()}/api/${path}`);
  upstreamUrl.search = requestUrl.search;

  const headers = new Headers(request.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => headers.delete(header));

  const init: RequestInit = {
    method: request.method,
    headers,
    redirect: "manual",
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  const upstreamResponse = await fetch(upstreamUrl, init);
  const responseHeaders = new Headers(upstreamResponse.headers);
  HOP_BY_HOP_HEADERS.forEach((header) => responseHeaders.delete(header));

  return new Response(upstreamResponse.body, {
    status: upstreamResponse.status,
    statusText: upstreamResponse.statusText,
    headers: responseHeaders,
  });
}

export const GET = proxyRequest;
export const HEAD = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
export const OPTIONS = proxyRequest;
