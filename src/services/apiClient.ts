
export type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export interface ApiRequest {
  url: string;
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: string;
}

export interface ApiResponse {
  status: number;
  statusText: string;
  data: unknown;
  headers: Record<string, string>;
  duration: number;
}

export async function sendApiRequest(
  request: ApiRequest
): Promise<ApiResponse> {
  const startTime = performance.now();

  const headers = new Headers(request.headers);

  const options: RequestInit = {
    method: request.method,
    headers,
  };

  if (
    request.body &&
    !["GET", "DELETE"].includes(request.method)
  ) {
    options.body = request.body;

    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json");
    }
  }

  const response = await fetch(request.url, options);
  const duration = Math.round(performance.now() - startTime);

  const responseText = await response.text();

  let data: unknown = responseText;

  try {
    data = responseText ? JSON.parse(responseText) : null;
  } catch {
    // Keep the response as plain text if it isn't JSON.
  }

  const responseHeaders: Record<string, string> = {};

  response.headers.forEach((value, key) => {
    responseHeaders[key] = value;
  });

  return {
    status: response.status,
    statusText: response.statusText,
    data,
    headers: responseHeaders,
    duration,
  };
}
