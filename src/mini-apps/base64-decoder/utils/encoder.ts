export function encoder(value: string): string {
  try {
    return btoa(value);
  } catch (error) {
    return "Invalid Input";
  }
}
