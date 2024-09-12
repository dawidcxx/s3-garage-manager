export function normalizeURL(urlString: string): string {
  try {
    // Attempt to parse the URL as an absolute URL
    const url = new URL(urlString);
    // The URL constructor normalizes the URL components
    return url.href;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch(e) {
    try {
      // If the URL is relative, use the current location as the base
      const base = window.location.href;
      const url = new URL(urlString, base);
      return url.href;
    } catch (e2) {
      throw new Error(`Invalid URL provided`, { cause: e2 });
    }
  }
}
