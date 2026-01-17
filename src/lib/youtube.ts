/**
 * Extracts the YouTube Video ID from a variety of URL formats.
 * @param url The YouTube URL
 * @returns The 11-character Video ID or null
 */
export const getYouTubeID = (url?: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
};

/**
 * Returns the maximum resolution thumbnail URL for a YouTube video.
 * @param url The YouTube URL
 * @returns The thumbnail URL or null
 */
export const getYouTubeThumbnail = (url?: string) => {
    const id = getYouTubeID(url);
    if (!id) return null;
    // maxresdefault is 1280x720. hqdefault is 480x360 (safer fallback)
    return `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
};

/**
 * Generates the YouTube embed URL.
 * @param url The YouTube URL
 * @returns The embed URL or null
 */
export const getYouTubeEmbedUrl = (url?: string) => {
    const id = getYouTubeID(url);
    if (!id) return null;
    return `https://www.youtube.com/embed/${id}`;
};
