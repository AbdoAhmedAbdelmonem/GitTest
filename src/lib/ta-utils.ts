/**
 * Utility functions for Graduated TA (Teaching Assistant) identification and display
 */

/**
 * Check if a user is a Graduated TA based on their level
 * Level 5 users are considered Graduated TAs
 */
export function isGraduatedTA(level: number): boolean {
  return level === 5
}

/**
 * Format a username with TA prefix if the user is a Graduated TA
 * @param username - The user's username
 * @param level - The user's current level
 * @returns Formatted username with "TA/" prefix for level 5 users
 */
export function formatTAName(username: string, level: number): string {
  if (isGraduatedTA(level)) {
    return `TA/${username}`
  }
  return username
}

/**
 * Check if a user has full access (admin OR graduated TA)
 * @param user - User object with is_admin and current_level properties
 * @returns true if user is admin or graduated TA
 */
export function hasFullAccess(user: { is_admin: boolean; current_level: number }): boolean {
  return user.is_admin === true || isGraduatedTA(user.current_level)
}
