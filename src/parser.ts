/**
 * Parse string bytes to number
 *  1kb = 1024 bytes
 *  1mb = 1048576 bytes
 *  1gb = 1073741824 bytes
 *  1tb = 1099511627776 bytes
 *
 * @param bytes
 * @returns
 */
export function parseStringBytesToNumber(bytes: string | number): number {
  if (typeof bytes !== 'string') return bytes

  const [, size, unit] = bytes.match(/^(\d+)([kmgt]b?)$/i) || []
  if (!size || !unit) return 0
  const sizeNumber = parseInt(size)
  if (isNaN(sizeNumber)) return 0
  switch (unit.toLowerCase()) {
    case 'tb':
      return sizeNumber * 1024 * 1024 * 1024 * 1024
    case 'gb':
      return sizeNumber * 1024 * 1024 * 1024
    case 'mb':
      return sizeNumber * 1024 * 1024
    case 'kb':
      return sizeNumber * 1024
    default:
      return sizeNumber
  }
}

/**
 * Parse a number to a string representing bytes, kilobytes, megabytes, gigabytes, or terabytes based on the input number.
 *
 * @param {number} bytes - The number of bytes to be converted.
 * @return {string} The formatted string representing the converted bytes.
 */
export function parseNumberToStringBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes}b`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)}kb`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)}mb`
  if (bytes < 1024 * 1024 * 1024 * 1024)
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)}gb`
  return `${(bytes / 1024 / 1024 / 1024 / 1024).toFixed(2)}tb`
}

/**
 * If detect string is number or boolean, parse it to number or boolean
 */
export function parseStringToAutoDetectValue(val?: string | null): any {
  switch (true) {
    case val == null:
      return undefined
    case /^(no|n|false|f|off)$/i.test(val!):
      return false
    case /^(yes|y|true|t|on)$/i.test(val!):
      return true
    case !isNaN(parseFloat(val!)):
      return parseFloat(val!)
    default:
      return val
  }
}
