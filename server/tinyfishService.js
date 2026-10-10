import { URL } from 'url';

/**
 * Validates a target URL against SSRF and protocol misuse.
 * Rejects localhost, private IP subnets, loopbacks, and non-HTTP(S) schemes.
 */
export function validateTargetUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { valid: false, error: 'A valid website URL is required.' };
  }

  let parsed;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    return { valid: false, error: 'Malformed URL format. Must start with http:// or https://' };
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    return { valid: false, error: 'Only http:// and https:// URLs are permitted.' };
  }

  const hostname = parsed.hostname.toLowerCase();

  // Check prohibited hostnames
  const prohibitedHosts = ['localhost', '127.0.0.1', '::1', '0.0.0.0'];
  if (prohibitedHosts.includes(hostname)) {
    return { valid: false, error: 'Internal and loopback hosts (localhost) are prohibited.' };
  }

  // Check internal service / local TLDs
  if (
    hostname.endsWith('.local') ||
    hostname.endsWith('.internal') ||
    hostname.endsWith('.lan') ||
    hostname.endsWith('.home') ||
    hostname === 'metadata.google.internal'
  ) {
    return { valid: false, error: 'Internal domain names are prohibited.' };
  }

  // Check private IPv4 ranges (10.x, 172.16-31.x, 192.168.x, 169.254.x)
  const ipv4Regex = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
  const match = hostname.match(ipv4Regex);
  if (match) {
    const octet1 = parseInt(match[1], 10);
    const octet2 = parseInt(match[2], 10);

    if (octet1 === 10) {
      return { valid: false, error: 'Private IP space (10.0.0.0/8) is prohibited.' };
    }
    if (octet1 === 172 && octet2 >= 16 && octet2 <= 31) {
      return { valid: false, error: 'Private IP space (172.16.0.0/12) is prohibited.' };
    }
    if (octet1 === 192 && octet2 === 168) {
      return { valid: false, error: 'Private IP space (192.168.0.0/16) is prohibited.' };
    }
    if (octet1 === 169 && octet2 === 254) {
      return { valid: false, error: 'Link-local IP space (169.254.0.0/16) is prohibited.' };
    }
    if (octet1 === 127) {
      return { valid: false, error: 'Loopback IP addresses (127.0.0.0/8) are prohibited.' };
    }
    if (octet1 === 0) {
      return { valid: false, error: 'Current network IP space (0.0.0.0/8) is prohibited.' };
    }
  }

  return { valid: true, sanitizedUrl: parsed.href };
}

/**
 * Validates the natural-language research goal.
 */
export function validateResearchGoal(goal) {
  if (!goal || typeof goal !== 'string') {
    return { valid: false, error: 'Research goal is required.' };
  }

  const trimmed = goal.trim();
  if (trimmed.length < 5) {
    return { valid: false, error: 'Research goal must be at least 5 characters long.' };
  }
  if (trimmed.length > 3000) {
    return { valid: false, error: 'Research goal exceeds maximum permitted length of 3000 characters.' };
  }

  return { valid: true, sanitizedGoal: trimmed };
}

/**
 * TinyFish API Constants
 */
export const TINYFISH_ENDPOINTS = {
  AGENT_SSE: 'https://agent.tinyfish.ai/v1/automation/run-sse',
  SEARCH: 'https://api.search.tinyfish.ai/',
  FETCH: 'https://api.fetch.tinyfish.ai/'
};
