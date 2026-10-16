/**
 * Safe Video URL Parser & Embed Generator
 * Strictly validates URLs and prevents unsafe arbitrary iframes or script injection.
 */

export interface ParsedVideo {
  type: 'youtube' | 'vimeo' | 'direct' | 'unknown';
  embedUrl: string | null;
  videoId: string | null;
  isValid: boolean;
}

export function parseVideoUrl(url: string | null | undefined): ParsedVideo {
  if (!url || typeof url !== 'string') {
    return { type: 'unknown', embedUrl: null, videoId: null, isValid: false };
  }

  const trimmed = url.trim();

  // 1. YouTube Validation & Parsing
  // Handles:
  // - https://www.youtube.com/watch?v=VIDEO_ID
  // - https://youtu.be/VIDEO_ID
  // - https://www.youtube.com/embed/VIDEO_ID
  // - https://www.youtube.com/shorts/VIDEO_ID
  const youtubeRegex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;
  const youtubeMatch = trimmed.match(youtubeRegex);

  if (youtubeMatch && youtubeMatch[1]) {
    const videoId = youtubeMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`,
      isValid: true,
    };
  }

  // 2. Vimeo Validation & Parsing
  // Handles:
  // - https://vimeo.com/123456789
  // - https://player.vimeo.com/video/123456789
  const vimeoRegex =
    /^(?:https?:\/\/)?(?:www\.|player\.)?vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[^\s]*)$/;
  const vimeoMatch = trimmed.match(vimeoRegex);

  if (vimeoMatch && vimeoMatch[1]) {
    const videoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId,
      embedUrl: `https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`,
      isValid: true,
    };
  }

  // 3. Direct Safe MP4 / WebM streaming links (must use https:// and end with safe extension)
  const directRegex = /^https:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(?:\/[^\s?]*)?\.(?:mp4|webm|mov)(?:\?[^\s]*)?$/i;
  if (directRegex.test(trimmed)) {
    return {
      type: 'direct',
      videoId: null,
      embedUrl: trimmed,
      isValid: true,
    };
  }

  // Google Storage / Cloud CDN sample videos
  if (trimmed.startsWith('https://commondatastorage.googleapis.com/') && trimmed.endsWith('.mp4')) {
    return {
      type: 'direct',
      videoId: null,
      embedUrl: trimmed,
      isValid: true,
    };
  }

  return { type: 'unknown', embedUrl: null, videoId: null, isValid: false };
}
