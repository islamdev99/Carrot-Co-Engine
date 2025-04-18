/**
 * Formats a number with Arabic numerals
 * @param num The number to format
 * @returns The formatted number string
 */
export function formatNumberArabic(num: number): string {
  return num.toLocaleString('ar-EG');
}

/**
 * Formats search time to display in Arabic
 * @param seconds The search time in seconds
 * @returns Formatted time string
 */
export function formatSearchTime(seconds: number): string {
  return seconds.toFixed(2);
}

/**
 * Extracts domain name from URL for display
 * @param url The full URL
 * @returns Simplified URL for display
 */
export function getDisplayUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return `${urlObj.hostname}${urlObj.pathname.length > 1 ? urlObj.pathname : ''}`;
  } catch (e) {
    return url;
  }
}

/**
 * Handles "I'm Feeling Lucky" navigation
 * @param results Array of search results
 * @returns URL to navigate to, or null if no results
 */
export function getFirstResultUrl(results: { url: string }[]): string | null {
  if (results && results.length > 0) {
    return results[0].url;
  }
  return null;
}
