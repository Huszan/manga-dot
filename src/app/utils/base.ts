export function fakeArray(length: number): number[] {
  return Array.from({ length }, (_, index) => index + 1);
}
