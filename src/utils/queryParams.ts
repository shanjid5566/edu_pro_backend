/**
 * Utility functions for handling Express query and params
 */

/**
 * Safely extract a string from query/params
 * Handles string, string[], and ParsedQs types
 */
export function getQueryString(value: any): string | undefined {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (Array.isArray(value)) {
    const first = value[0];
    if (typeof first === "string") return first;
    return undefined;
  }
  return undefined;
}

/**
 * Safely extract a number from query/params
 */
export function getQueryNumber(value: any, defaultValue: number = 0): number {
  const str = getQueryString(value);
  if (!str) return defaultValue;
  const num = parseInt(str, 10);
  return isNaN(num) ? defaultValue : num;
}

/**
 * Safely parse query parameter as string with type narrowing
 * Use this to tell TypeScript a value is definitely a string
 */
export function asQueryString(value: string | string[] | undefined): string {
  if (!value) return "";
  if (Array.isArray(value)) return value[0] || "";
  return value;
}
