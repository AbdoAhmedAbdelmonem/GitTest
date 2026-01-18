/**
 * Security Audit Logger
 * 
 * Logs suspicious activity and security events.
 * In production, this should be connected to a logging service
 * like Datadog, Sentry, or CloudWatch.
 */

export enum AuditEventType {
  // Authentication events
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILED = 'login_failed',
  LOGOUT = 'logout',
  PASSWORD_RESET_REQUEST = 'password_reset_request',
  PASSWORD_RESET_SUCCESS = 'password_reset_success',
  
  // Authorization events
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  FORBIDDEN_ACTION = 'forbidden_action',
  
  // Rate limiting
  RATE_LIMIT_EXCEEDED = 'rate_limit_exceeded',
  RATE_LIMIT_BLOCKED = 'rate_limit_blocked',
  
  // Suspicious activity
  SQL_INJECTION_ATTEMPT = 'sql_injection_attempt',
  XSS_ATTEMPT = 'xss_attempt',
  INVALID_TOKEN = 'invalid_token',
  SUSPICIOUS_FILE_UPLOAD = 'suspicious_file_upload',
  
  // Admin actions
  ADMIN_ACTION = 'admin_action',
  USER_BANNED = 'user_banned',
  USER_UNBANNED = 'user_unbanned',
}

export interface AuditLog {
  timestamp: string
  eventType: AuditEventType
  userId?: number
  authId?: string
  identifier: string // IP or token hash
  userAgent?: string
  path: string
  method: string
  details?: Record<string, any>
  severity: 'low' | 'medium' | 'high' | 'critical'
}

// In-memory store (in production, send to external service)
const auditLogs: AuditLog[] = []
const MAX_LOGS = 10000 // Keep last 10k logs in memory

/**
 * Log a security event
 */
export function logSecurityEvent(
  eventType: AuditEventType,
  request: Request,
  details?: {
    userId?: number
    authId?: string
    identifier?: string
    message?: string
    metadata?: Record<string, any>
  }
): void {
  const url = new URL(request.url)
  
  const log: AuditLog = {
    timestamp: new Date().toISOString(),
    eventType,
    userId: details?.userId,
    authId: details?.authId,
    identifier: details?.identifier || getRequestIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    path: url.pathname,
    method: request.method,
    details: details?.metadata,
    severity: getSeverity(eventType),
  }

  // Add to in-memory store
  auditLogs.push(log)
  
  // Keep only last MAX_LOGS entries
  if (auditLogs.length > MAX_LOGS) {
    auditLogs.shift()
  }

  // Log to console (in production, send to external service)
  const severityEmoji = {
    low: '📝',
    medium: '⚠️',
    high: '🚨',
    critical: '🔥',
  }

  console.log(
    `${severityEmoji[log.severity]} [${log.severity.toUpperCase()}] ${log.eventType}`,
    `- ${log.identifier} - ${log.path}`,
    details?.message ? `- ${details.message}` : ''
  )

  // Alert on critical events
  if (log.severity === 'critical') {
    console.error('🔥 CRITICAL SECURITY EVENT:', log)
    // In production: Send alert via email, Slack, PagerDuty, etc.
  }
}

/**
 * Get request IP address
 */
function getRequestIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}

/**
 * Determine severity based on event type
 */
function getSeverity(eventType: AuditEventType): 'low' | 'medium' | 'high' | 'critical' {
  const severityMap: Record<AuditEventType, 'low' | 'medium' | 'high' | 'critical'> = {
    [AuditEventType.LOGIN_SUCCESS]: 'low',
    [AuditEventType.LOGIN_FAILED]: 'medium',
    [AuditEventType.LOGOUT]: 'low',
    [AuditEventType.PASSWORD_RESET_REQUEST]: 'medium',
    [AuditEventType.PASSWORD_RESET_SUCCESS]: 'medium',
    [AuditEventType.UNAUTHORIZED_ACCESS]: 'high',
    [AuditEventType.FORBIDDEN_ACTION]: 'high',
    [AuditEventType.RATE_LIMIT_EXCEEDED]: 'medium',
    [AuditEventType.RATE_LIMIT_BLOCKED]: 'high',
    [AuditEventType.SQL_INJECTION_ATTEMPT]: 'critical',
    [AuditEventType.XSS_ATTEMPT]: 'critical',
    [AuditEventType.INVALID_TOKEN]: 'high',
    [AuditEventType.SUSPICIOUS_FILE_UPLOAD]: 'high',
    [AuditEventType.ADMIN_ACTION]: 'low',
    [AuditEventType.USER_BANNED]: 'medium',
    [AuditEventType.USER_UNBANNED]: 'medium',
  }

  return severityMap[eventType] || 'medium'
}

/**
 * Get recent security events
 */
export function getRecentEvents(limit: number = 100): AuditLog[] {
  return auditLogs.slice(-limit)
}

/**
 * Get events by identifier (IP or user)
 */
export function getEventsByIdentifier(identifier: string, limit: number = 50): AuditLog[] {
  return auditLogs
    .filter(log => log.identifier === identifier || log.userId?.toString() === identifier)
    .slice(-limit)
}

/**
 * Get events by severity
 */
export function getEventsBySeverity(
  severity: 'low' | 'medium' | 'high' | 'critical',
  limit: number = 100
): AuditLog[] {
  return auditLogs.filter(log => log.severity === severity).slice(-limit)
}

/**
 * Check if identifier has suspicious activity pattern
 */
export function checkSuspiciousActivity(identifier: string): {
  suspicious: boolean
  reason?: string
  score: number
} {
  const recentEvents = getEventsByIdentifier(identifier, 50)
  let score = 0

  // Count different types of suspicious events
  const criticalEvents = recentEvents.filter(e => e.severity === 'critical').length
  const highEvents = recentEvents.filter(e => e.severity === 'high').length
  const rateLimitEvents = recentEvents.filter(e => 
    e.eventType === AuditEventType.RATE_LIMIT_EXCEEDED ||
    e.eventType === AuditEventType.RATE_LIMIT_BLOCKED
  ).length
  const failedLogins = recentEvents.filter(e => e.eventType === AuditEventType.LOGIN_FAILED).length

  // Calculate suspicion score
  score += criticalEvents * 50
  score += highEvents * 20
  score += rateLimitEvents * 10
  score += failedLogins * 5

  // Check for patterns
  const reasons: string[] = []
  
  if (criticalEvents > 0) {
    reasons.push(`${criticalEvents} critical security events`)
  }
  if (failedLogins >= 5) {
    reasons.push(`${failedLogins} failed login attempts`)
  }
  if (rateLimitEvents >= 3) {
    reasons.push(`${rateLimitEvents} rate limit violations`)
  }

  return {
    suspicious: score >= 50,
    reason: reasons.join(', '),
    score,
  }
}
