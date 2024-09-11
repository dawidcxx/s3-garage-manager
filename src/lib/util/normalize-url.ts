export function normalizeURL(urlString: string): string {
  try {
    // Attempt to parse the URL as an absolute URL
    let url = new URL(urlString);
    // The URL constructor normalizes the URL components
    return url.href;
  } catch (e) {
    try {
      // If the URL is relative, use the current location as the base
      let base = window.location.href;
      let url = new URL(urlString, base);
      return url.href;
    } catch (e2) {
      throw new Error(`Invalid URL provided`, { cause: e2 });
    }
  }
}
