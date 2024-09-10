export async function generateRandomSha256() {
  const hashBuffer = await crypto.subtle.digest('SHA-256', crypto.getRandomValues(new Uint8Array(32)));
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
