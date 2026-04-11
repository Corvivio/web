import { useAuth } from "@clerk/react-router"
import { useUserStore } from "~/store/user"

type ApiResult<T> = { data: T; error?: never } | { data?: never; error: string }

export function useApi() {
  const { getToken } = useAuth()
  const apiUrl = useUserStore((s) => s.apiUrl)

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<ApiResult<T>> {
    const token = await getToken()
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }

    const res = await fetch(`${apiUrl}${path}`, {
      method,
      headers,
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    })

    if (!res.ok) {
      return { error: res.statusText || `HTTP ${res.status}` }
    }

    if (res.status === 204 || res.headers.get("content-length") === "0") {
      return { data: undefined as T }
    }

    const data = (await res.json()) as T
    return { data }
  }

  return {
    get: <T>(path: string) => request<T>("GET", path),
    post: <T>(path: string, body: unknown) => request<T>("POST", path, body),
    patch: <T>(path: string, body: unknown) => request<T>("PATCH", path, body),
    del: <T>(path: string) => request<T>("DELETE", path),
  }
}
