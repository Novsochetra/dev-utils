export function fileToDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string); // e.g. "data:image/png;base64,AAA..."
    reader.readAsDataURL(file);
  });
}
