/**
 * Robust cross-browser download utility
 * Works on: Chrome, Firefox, Safari, Samsung Internet, Bing Mobile, iOS Safari
 */

function logDebug(message: string, data?: any) {
  if (import.meta.env.DEV) {
    console.log(`[Download] ${message}`, data || '');
  }
}

export function downloadFile(blob: Blob, filename: string): void {
  logDebug('Starting download', { 
    filename, 
    size: blob.size, 
    type: blob.type,
    userAgent: navigator.userAgent 
  });

  // Try Microsoft-specific APIs first (Edge, IE, some Bing WebViews)
  if (typeof (navigator as any).msSaveOrOpenBlob === 'function') {
    logDebug('Using msSaveOrOpenBlob');
    (navigator as any).msSaveOrOpenBlob(blob, filename);
    return;
  }

  if (typeof (navigator as any).msSaveBlob === 'function') {
    logDebug('Using msSaveBlob');
    (navigator as any).msSaveBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  logDebug('Created object URL', url);

  // Create anchor element
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  
  // Some browsers need the element in DOM
  document.body.appendChild(a);

  // Try the standard click approach
  let downloadStarted = false;
  
  try {
    logDebug('Attempting a.click()');
    a.click();
    downloadStarted = true;
    logDebug('a.click() executed');
  } catch (e) {
    logDebug('a.click() failed', e);
  }

  // For Bing and some WebViews, a.click() may silently fail
  // Use a fallback after a short delay to check
  setTimeout(() => {
    // Clean up the anchor
    if (a.parentNode) {
      document.body.removeChild(a);
    }
    
    // If we suspect click didn't work (can't reliably detect),
    // we rely on the delayed revoke to give user time to save
  }, 100);

  // CRITICAL: Delay revoking the URL significantly
  // Bing/WebViews may need more time to process
  setTimeout(() => {
    logDebug('Revoking object URL after delay');
    URL.revokeObjectURL(url);
  }, 60000); // 60 seconds
}

/**
 * Alternative download with navigation fallback for problematic browsers
 * Use this when standard download fails
 */
export function downloadFileWithFallback(blob: Blob, filename: string): void {
  logDebug('Starting download with fallback', { 
    filename, 
    size: blob.size,
    userAgent: navigator.userAgent 
  });

  // Try Microsoft-specific APIs first
  if (typeof (navigator as any).msSaveOrOpenBlob === 'function') {
    logDebug('Using msSaveOrOpenBlob');
    (navigator as any).msSaveOrOpenBlob(blob, filename);
    return;
  }

  if (typeof (navigator as any).msSaveBlob === 'function') {
    logDebug('Using msSaveBlob');
    (navigator as any).msSaveBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  
  // Check if download attribute is supported
  const a = document.createElement('a');
  const supportsDownload = 'download' in a;
  
  logDebug('Download attribute supported', supportsDownload);

  if (supportsDownload) {
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    try {
      logDebug('Attempting anchor click');
      a.click();
    } catch (e) {
      logDebug('Anchor click failed, using location fallback', e);
      // Fallback: navigate to the blob URL
      window.location.href = url;
    }
    
    setTimeout(() => {
      if (a.parentNode) {
        document.body.removeChild(a);
      }
    }, 100);
  } else {
    // Browser doesn't support download attribute
    // Try opening in new window/tab for manual save
    logDebug('No download support, trying window.open');
    const newWindow = window.open(url, '_blank');
    
    if (!newWindow || newWindow.closed) {
      logDebug('Popup blocked, using location fallback');
      // Popup was blocked, try direct navigation
      window.location.href = url;
    }
  }

  // Delay revoking significantly for WebViews
  setTimeout(() => {
    logDebug('Revoking object URL');
    URL.revokeObjectURL(url);
  }, 60000);
}

/**
 * Download a File object directly
 */
export function downloadFileFromFile(file: File): void {
  downloadFile(file, file.name);
}

/**
 * Trigger download - this should be called directly from user click handler
 * Do NOT call this from async callbacks
 */
export function triggerDownload(blob: Blob, filename: string): void {
  // Detect if we're in a problematic browser
  const ua = navigator.userAgent.toLowerCase();
  const isBing = ua.includes('bingweb') || ua.includes('bing');
  const isWebView = ua.includes('wv') || ua.includes('webview');
  const isSamsungBrowser = ua.includes('samsungbrowser');
  
  logDebug('Browser detection', { isBing, isWebView, isSamsungBrowser, ua });

  if (isBing || isWebView) {
    // Use fallback approach for Bing/WebViews
    downloadFileWithFallback(blob, filename);
  } else {
    // Standard approach for most browsers
    downloadFile(blob, filename);
  }
}
