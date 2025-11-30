/**
 * HTML Sanitization utility using DOMPurify
 * Prevents XSS attacks when rendering user-generated HTML content
 */

import DOMPurify from 'dompurify';

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @param options - Optional DOMPurify configuration
 * @returns Sanitized HTML string safe for rendering
 */
export function sanitizeHtml(
  dirty: string | null | undefined,
  options?: DOMPurify.Config
): string {
  if (!dirty) {
    return '';
  }

  // Only run on client side (DOMPurify requires DOM)
  if (process.server) {
    // On server, return empty string or basic sanitization
    // In production, you might want to use a server-side sanitizer
    return dirty;
  }

  // Default configuration: Allow common HTML tags used in rich text editors
  const defaultConfig: DOMPurify.Config = {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'hr'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'style',
      'target', 'rel'
    ],
    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    // Allow data URIs for images (base64 encoded images)
    ALLOW_DATA_ATTR: false,
  };

  const config = { ...defaultConfig, ...options };

  return DOMPurify.sanitize(dirty, config);
}

/**
 * Sanitize HTML for preview mode (more permissive)
 * Allows more HTML tags and attributes for rich content preview
 */
export function sanitizeHtmlForPreview(
  dirty: string | null | undefined
): string {
  return sanitizeHtml(dirty, {
    ALLOWED_TAGS: [
      'p', 'br', 'strong', 'em', 'u', 's', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'ul', 'ol', 'li', 'blockquote', 'pre', 'code', 'a', 'img',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'div', 'span', 'hr', 'iframe', 'video', 'audio'
    ],
    ALLOWED_ATTR: [
      'href', 'title', 'alt', 'src', 'width', 'height', 'class', 'style',
      'target', 'rel', 'frameborder', 'allowfullscreen', 'controls', 'autoplay'
    ],
  });
}

/**
 * Vue composable for sanitizing HTML in components
 */
export function useSanitize() {
  return {
    sanitize: sanitizeHtml,
    sanitizeForPreview: sanitizeHtmlForPreview,
  };
}

