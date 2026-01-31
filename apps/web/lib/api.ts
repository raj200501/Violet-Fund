export type ApiResult<T> = {
  ok: boolean;
  status: number;
  data?: T | string;
  errorMessage?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const buildUrl = (path: string) => {
  if (path.startsWith("http")) {
    return path;
  }
  if (path.startsWith("/")) {
    return `${API_BASE}${path}`;
  }
  return `${API_BASE}/${path}`;
};

const extractErrorMessage = (data: unknown): string | undefined => {
  if (!data) {
    return undefined;
  }
  if (typeof data === "string" && data.trim()) {
    return data;
  }
  if (typeof data === "object") {
    const record = data as Record<string, unknown>;
    const detail = record.detail;
    if (Array.isArray(detail)) {
      const messages = detail
        .map((item) => {
          if (!item || typeof item !== "object") {
            return "";
          }
          const entry = item as Record<string, unknown>;
          if (typeof entry.msg === "string") {
            return entry.msg;
          }
          if (typeof entry.message === "string") {
            return entry.message;
          }
          return "";
        })
        .filter(Boolean);
      if (messages.length) {
        return messages.join(" ");
      }
    }
    if (typeof detail === "string" && detail.trim()) {
      return detail;
    }
    const message = record.message;
    if (typeof message === "string" && message.trim()) {
      return message;
    }
    const error = record.error;
    if (typeof error === "string" && error.trim()) {
      return error;
    }
  }
  return undefined;
};

export async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<ApiResult<T>> {
  const url = buildUrl(path);
  const headers = new Headers(options.headers);

  const requestOptions: RequestInit = {
    credentials: "include",
    ...options,
    headers
  };

  try {
    const response = await fetch(url, requestOptions);
    const contentType = response.headers.get("content-type") || "";
    let data: T | string | undefined;

    if (contentType.includes("application/json") || contentType.includes("+json")) {
      try {
        data = (await response.json()) as T;
      } catch (error) {
        data = undefined;
      }
    } else {
      try {
        data = await response.text();
      } catch (error) {
        data = undefined;
      }
    }

    const result: ApiResult<T> = {
      ok: response.ok,
      status: response.status,
      data
    };

    if (!response.ok) {
      result.errorMessage = extractErrorMessage(data);
    }

    return result;
  } catch (error) {
    return {
      ok: false,
      status: 0,
      errorMessage: "Unable to reach the API. Please try again."
    };
  }
}

export function safeErrorMessage(result: ApiResult<unknown>, fallback = "Something went wrong. Please try again.") {
  if (result.ok) {
    return "";
  }
  if (result.status === 0) {
    return "Unable to reach the API. Please check your connection and try again.";
  }
  if (result.status === 401 || result.status === 403) {
    return "Please log in to continue.";
  }
  if (result.errorMessage) {
    return result.errorMessage;
  }
  return fallback;
}
