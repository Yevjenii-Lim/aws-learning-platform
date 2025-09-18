// Utility functions for handling links in tutorial content
import React from 'react';

/**
 * Detects URLs in text and converts them to clickable links
 * Supports http, https, and www URLs
 */
export function renderTextWithLinks(text: string): JSX.Element | null {
  if (!text) return null;

  // URL regex pattern that matches http, https, and www URLs
  const urlRegex = /(https?:\/\/[^\s]+|www\.[^\s]+)/g;
  
  const parts = text.split(urlRegex);
  
  return (
    <>
      {parts.map((part: string, index: number) => {
        if (urlRegex.test(part) || part.match(/^https?:\/\/|^www\./)) {
          // Ensure the URL has a protocol
          const href = part.startsWith('http') ? part : `https://${part}`;
          return (
            <a
              key={index}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-aws-orange hover:text-orange-600 underline transition-colors"
            >
              {part}
            </a>
          );
        }
        return part;
      })}
    </>
  );
}

/**
 * Validates if a string is a valid URL
 */
export function isValidUrl(string: string): boolean {
  try {
    const url = new URL(string.startsWith('http') ? string : `https://${string}`);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

/**
 * Formats a URL for display (removes protocol for cleaner display)
 */
export function formatUrlForDisplay(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '');
}
