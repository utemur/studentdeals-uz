/**
 * Currency formatting utilities for UZS (Uzbekistan Som)
 */

/**
 * Format amount in UZS with proper spacing and no decimals
 * @param amount - Amount in UZS
 * @param locale - Locale for formatting (ru or uz)
 * @returns Formatted string like "1 234 567 UZS"
 */
export function formatUZS(amount: number, locale: 'ru' | 'uz' = 'ru'): string {
  // Round to nearest integer (no decimals for UZS)
  const roundedAmount = Math.round(amount);
  
  // Format with spaces as thousand separators
  const formatted = new Intl.NumberFormat(locale === 'ru' ? 'ru-RU' : 'uz-UZ', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(roundedAmount);
  
  return `${formatted} UZS`;
}

/**
 * Format amount in UZS with short notation (K, M)
 * @param amount - Amount in UZS
 * @param locale - Locale for formatting
 * @returns Formatted string like "1.2K UZS" or "5M UZS"
 */
export function formatUZSShort(amount: number, locale: 'ru' | 'uz' = 'ru'): string {
  const roundedAmount = Math.round(amount);
  
  if (roundedAmount >= 1_000_000) {
    const millions = roundedAmount / 1_000_000;
    return `${millions.toFixed(1).replace('.0', '')}M UZS`;
  }
  
  if (roundedAmount >= 1_000) {
    const thousands = roundedAmount / 1_000;
    return `${thousands.toFixed(1).replace('.0', '')}K UZS`;
  }
  
  return formatUZS(roundedAmount, locale);
}

/**
 * Parse UZS string to number
 * @param value - String like "1 234 567 UZS" or "1234567"
 * @returns Number value
 */
export function parseUZS(value: string): number {
  // Remove all non-digit characters except decimal separator
  const cleaned = value.replace(/[^\d]/g, '');
  return parseInt(cleaned, 10) || 0;
}

/**
 * Calculate discount percentage
 * @param originalPrice - Original price in UZS
 * @param discountedPrice - Discounted price in UZS
 * @returns Discount percentage as integer
 */
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  if (originalPrice <= 0) return 0;
  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
  return Math.round(discount);
}

/**
 * Format discount percentage
 * @param percentage - Discount percentage
 * @returns Formatted string like "-25%"
 */
export function formatDiscount(percentage: number): string {
  return `-${Math.round(percentage)}%`;
}

