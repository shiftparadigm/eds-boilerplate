/**
 * Video utility functions for URL normalization and ID extraction
 */

/**
 * Extracts the video ID from a YouTube URL
 * Handles: youtube.com/watch?v=ID, youtu.be/ID, youtube.com/embed/ID
 * @param {string} url - YouTube URL
 * @returns {string|null} Video ID or null if not found
 */
export function extractYouTubeId(url) {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('youtu.be')) {
      // youtu.be/VIDEO_ID
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      return pathParts[0] || null;
    }

    if (hostname.includes('youtube.com')) {
      // youtube.com/watch?v=VIDEO_ID or youtube.com/embed/VIDEO_ID
      const searchParams = new URLSearchParams(urlObj.search);
      const vParam = searchParams.get('v');
      if (vParam) {
        // Clean up any extra params that might be appended
        return vParam.split('&')[0].split('?')[0].trim();
      }

      // Check for embed URL: /embed/VIDEO_ID
      const pathParts = urlObj.pathname.split('/').filter(Boolean);
      if (pathParts[0] === 'embed' && pathParts[1]) {
        return pathParts[1];
      }
    }
  } catch (error) {
    // Invalid URL
  }

  return null;
}

/**
 * Extracts the video ID from a Vimeo URL
 * Handles: vimeo.com/ID, player.vimeo.com/video/ID, with or without query params
 * @param {string} url - Vimeo URL
 * @returns {string|null} Video ID or null if not found
 */
export function extractVimeoId(url) {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('vimeo.com')) {
      const pathParts = urlObj.pathname.split('/').filter(Boolean);

      // player.vimeo.com/video/ID
      if (pathParts[0] === 'video' && pathParts[1]) {
        // Extract just the numeric ID (strip any query-like suffixes)
        const id = pathParts[1].split('?')[0];
        return /^\d+$/.test(id) ? id : null;
      }

      // vimeo.com/ID (ID is the last path segment)
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart) {
        // Extract just the numeric ID
        const id = lastPart.split('?')[0];
        return /^\d+$/.test(id) ? id : null;
      }
    }
  } catch (error) {
    // Invalid URL
  }

  return null;
}

/**
 * Detects the type of video from a URL
 * @param {string} url - Video URL
 * @returns {Object|null} Video information object { type, url, id } or null
 */
export function detectVideoType(url) {
  if (!url) return null;

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      const id = extractYouTubeId(url);
      return { type: 'youtube', url, id };
    }

    if (hostname.includes('vimeo.com')) {
      const id = extractVimeoId(url);
      return { type: 'vimeo', url, id };
    }

    if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('.mp4')) {
      return { type: 'mp4', url, id: null };
    }

    if (url.toLowerCase().endsWith('.gif') || url.toLowerCase().includes('.gif')) {
      return { type: 'gif', url, id: null };
    }
  } catch (error) {
    // Invalid URL
  }

  return null;
}

/**
 * Normalizes a video URL for comparison by extracting a canonical form
 * For YouTube/Vimeo: returns a canonical URL based on video ID
 * For MP4: strips query parameters
 * @param {string} url - Video URL
 * @returns {string} Normalized URL for comparison
 */
export function normalizeVideoUrl(url) {
  if (!url) return '';

  const videoInfo = detectVideoType(url);
  if (!videoInfo) return '';

  switch (videoInfo.type) {
    case 'youtube':
      // Canonical form: youtube.com/watch?v=ID
      return videoInfo.id ? `youtube.com/watch?v=${videoInfo.id}` : '';

    case 'vimeo':
      // Canonical form: vimeo.com/ID
      return videoInfo.id ? `vimeo.com/${videoInfo.id}` : '';

    case 'mp4': {
      // Strip query parameters and normalize
      try {
        const urlObj = new URL(url);
        return `${urlObj.hostname}${urlObj.pathname}`.toLowerCase();
      } catch {
        return url.toLowerCase().split('?')[0];
      }
    }

    default:
      return '';
  }
}

/**
 * Checks if two video URLs refer to the same video
 * @param {string} url1 - First video URL
 * @param {string} url2 - Second video URL
 * @returns {boolean} True if URLs refer to the same video
 */
export function isSameVideo(url1, url2) {
  const normalized1 = normalizeVideoUrl(url1);
  const normalized2 = normalizeVideoUrl(url2);

  if (!normalized1 || !normalized2) return false;

  return normalized1 === normalized2;
}

// ============================================================================
// Video Schema Functions
// ============================================================================

/**
 * Parses a date string to ISO 8601 format (YYYY-MM-DD)
 * @param {string} dateString - Date string to parse
 * @returns {string|null} ISO date string or null if invalid
 */
export function parseDateToISO(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString.trim());
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Parses a duration string in format [hours]h[minutes]m[seconds]s to ISO 8601 duration
 * Examples: "2h30m5s" -> "PT2H30M5S", "5m" -> "PT5M", "30s" -> "PT30S"
 * @param {string} durationString - Duration in format like "2h30m5s"
 * @returns {string|null} ISO 8601 duration string or null if invalid
 */
export function parseDurationToISO8601(durationString) {
  if (!durationString) return null;

  // Normalize: trim whitespace, convert to lowercase
  const normalized = durationString.trim().toLowerCase();
  if (!normalized) return null;

  // Extract hours, minutes, seconds using regex
  const hoursMatch = normalized.match(/(\d+)\s*h/);
  const minutesMatch = normalized.match(/(\d+)\s*m(?!s)/); // m but not ms
  const secondsMatch = normalized.match(/(\d+)\s*s/);

  const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
  const minutes = minutesMatch ? parseInt(minutesMatch[1], 10) : 0;
  const seconds = secondsMatch ? parseInt(secondsMatch[1], 10) : 0;

  // If nothing was parsed, return null
  if (hours === 0 && minutes === 0 && seconds === 0) return null;

  // Build ISO 8601 duration string
  let iso8601 = 'PT';
  if (hours > 0) iso8601 += `${hours}H`;
  if (minutes > 0) iso8601 += `${minutes}M`;
  if (seconds > 0) iso8601 += `${seconds}S`;

  return iso8601;
}

/**
 * Fetches video schema metadata from the video-schema sheet
 * @returns {Promise<Array>} Array of video metadata objects
 */
async function fetchVideoSchemaData() {
  if (!window.videoSchemaData) {
    window.videoSchemaData = new Promise((resolve) => {
      fetch('/video-schema.json')
        .then((resp) => {
          if (resp.ok) {
            return resp.json();
          }
          return { data: [] };
        })
        .then((json) => {
          const videoData = json.data || [];
          window.videoSchemaData = videoData;
          resolve(videoData);
        })
        .catch(() => {
          window.videoSchemaData = [];
          resolve([]);
        });
    });
  }
  return window.videoSchemaData;
}

/**
 * Builds a VideoObject schema from video metadata
 * @param {Object} videoMeta - Video metadata from sheet
 * @returns {Object} VideoObject schema object
 */
function buildVideoObjectSchema(videoMeta) {
  const schema = {
    '@type': 'VideoObject',
  };

  if (videoMeta.name) {
    schema.name = videoMeta.name;
  }

  if (videoMeta.description) {
    schema.description = videoMeta.description;
  }

  if (videoMeta.thumbnailUrl) {
    schema.thumbnailUrl = videoMeta.thumbnailUrl;
  }

  if (videoMeta.uploadDate) {
    const parsedDate = parseDateToISO(videoMeta.uploadDate);
    if (parsedDate) {
      schema.uploadDate = parsedDate;
    }
  }

  if (videoMeta.duration) {
    const isoDuration = parseDurationToISO8601(videoMeta.duration);
    if (isoDuration) {
      schema.duration = isoDuration;
    }
  }

  if (videoMeta.videoUrl) {
    schema.contentUrl = videoMeta.videoUrl;
  }

  return schema;
}

// Track processed video URLs to avoid duplicate schema entries
const processedVideoUrls = new Set();

/**
 * Builds video schema for collected video URLs
 * @param {Array<string>} videoUrls - Array of video URLs to process
 * @param {Function} addSchema - Function to add schema to document (addLinkedDataSchema)
 */
export async function buildVideoSchema(videoUrls, addSchema) {
  if (!videoUrls || videoUrls.length === 0) return;

  const videoSchemaData = await fetchVideoSchemaData();
  if (!videoSchemaData || videoSchemaData.length === 0) return;

  // Create a map of normalized URLs to metadata for efficient lookup
  const videoMetaMap = new Map();
  videoSchemaData.forEach((row) => {
    const url = row['Video URL'] || row['Video Url'] || row.videoUrl || row['video-url'];
    if (url) {
      videoMetaMap.set(normalizeVideoUrl(url), {
        videoUrl: url,
        name: row.Name || row.name,
        description: row.Description || row.description,
        thumbnailUrl: row['Thumbnail URL'] || row['Thumbnail Url'] || row.thumbnailUrl || row['thumbnail-url'],
        uploadDate: row['Upload Date'] || row.uploadDate || row['upload-date'],
        duration: row.Duration || row.duration,
      });
    }
  });

  // Generate schema for each video URL
  videoUrls.forEach((videoUrl) => {
    const normalized = normalizeVideoUrl(videoUrl);
    if (!normalized || processedVideoUrls.has(normalized)) return;

    // Mark as processed to avoid duplicates
    processedVideoUrls.add(normalized);

    const videoMeta = videoMetaMap.get(normalized);
    if (videoMeta) {
      if (!videoMeta.name) {
        // eslint-disable-next-line no-console
        console.warn(`No name found for video URL: ${normalized}`);
      }

      const schema = buildVideoObjectSchema(videoMeta);
      addSchema(schema);
    } else {
      // eslint-disable-next-line no-console
      console.warn(`No metadata found for video URL: ${videoUrl} (normalized: ${normalized})`);
    }
  });
}
