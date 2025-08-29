export function bytesToMB(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 MB";
  const MB = 1024 * 1024; // 1 MB = 1024 * 1024 bytes
  return (bytes / MB).toFixed(decimals) + " MB";
}
