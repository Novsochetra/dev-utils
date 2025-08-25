export function decoder(value: string): string {
  try {
    return atob(value);
  } catch (error) {
    return "Invalid Base64";
  }
}
