import { DEFAULT_PROXY_ROUTE, TARGET_URL_HEADER } from "./fal-proxy"

interface FalClientOptions {
  proxyUrl?: string
}

interface FalSubscribeOptions<T> {
  input: T
  logs?: boolean
  onQueueUpdate?: (update: any) => void
}

class FalClient {
  private proxyUrl: string

  constructor(options: FalClientOptions = {}) {
    this.proxyUrl = options.proxyUrl || DEFAULT_PROXY_ROUTE
  }

  async subscribe<T, R>(modelPath: string, options: FalSubscribeOptions<T>): Promise<{ data: R; requestId: string }> {
    const url = `https://fal.run/${modelPath}`

    const response = await fetch(this.proxyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [TARGET_URL_HEADER]: url,
      },
      body: JSON.stringify(options.input),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`FAL API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return {
      data,
      requestId: response.headers.get("x-request-id") || "unknown",
    }
  }
}

export const fal = new FalClient()

