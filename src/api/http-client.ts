import { mapOptional } from '@/lib/util/mapOptional';
import { normalizeURL } from '@/lib/util/normalize-url';

export interface HttpClientWithArgs {
  token: string | null;
  baseUrl: string | null;
}

export interface HttpOptions {
  params: Record<string, string>;
  body: unknown | null;
}

export class HttpClient {
  private constructor(
    private readonly baseUrl: string | null,
    private readonly token: string | null,
  ) {
    this.baseUrl = mapOptional(baseUrl, normalizeURL);
  }

  static with({ token = null, baseUrl = null }: Partial<HttpClientWithArgs>) {
    return new HttpClient(baseUrl, token);
  }

  with({ baseUrl = this.baseUrl, token = this.token }: Partial<HttpClientWithArgs>) {
    return new HttpClient(baseUrl, token);
  }

  async GET(path: string, options: Partial<HttpOptions> = {}): Promise<Response> {
    const url = this.buildUrl(path, options);
    const headers = this.buildHeaders();
    const body = mapOptional(options.body, (body) => JSON.stringify(body));
    return fetch(url, { method: 'GET', headers, body });
  }

  async POST(path: string, options: Partial<HttpOptions> = {}): Promise<Response> {
    const body = mapOptional(options.body, (body) => JSON.stringify(body));
    return fetch(this.buildUrl(path, options), { method: 'POST', body, headers: this.buildHeaders() });
  }

  async DELETE(path: string, options: Partial<HttpOptions> = {}): Promise<Response> {
    const body = mapOptional(options.body, (body) => JSON.stringify(body));
    return fetch(this.buildUrl(path, options), { method: 'DELETE', body, headers: this.buildHeaders() });
  }

  private buildUrl(path: string, options: Partial<HttpOptions> = {}): URL {
    const url = new URL(`${this.baseUrl}${path}`);
    const params = mapOptional(options.params, (params) => new URLSearchParams(params).toString());
    if (params) {
      url.search = params;
    }
    return url;
  }

  private buildHeaders(): HeadersInit {
    const headers = new Headers();
    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }
    return headers;
  }
}
