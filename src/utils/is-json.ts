export function isJson(value: string): boolean {
  try {
    const obj = JSON.parse(value);
    if (obj && typeof obj === 'object') {
      return true;
    }
  } catch {
    return false;
  }
  return false;
}
