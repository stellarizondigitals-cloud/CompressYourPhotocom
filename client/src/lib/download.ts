export function downloadFile(blob: Blob, filename: string): void {
  // Try navigator.msSaveOrOpenBlob first (works on some Microsoft browsers)
  if (typeof (navigator as any).msSaveOrOpenBlob === 'function') {
    (navigator as any).msSaveOrOpenBlob(blob, filename);
    return;
  }

  // Try navigator.msSaveBlob (older Microsoft browsers)
  if (typeof (navigator as any).msSaveBlob === 'function') {
    (navigator as any).msSaveBlob(blob, filename);
    return;
  }

  const url = URL.createObjectURL(blob);
  
  // Check if we can use the download attribute
  const a = document.createElement('a');
  const supportsDownload = 'download' in a;
  
  if (supportsDownload) {
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    
    // Use multiple click methods for compatibility
    try {
      a.click();
    } catch (e) {
      // Fallback: dispatch a mouse event
      const evt = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
      });
      a.dispatchEvent(evt);
    }
    
    setTimeout(() => {
      if (a.parentNode) {
        document.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 250);
  } else {
    // Fallback for browsers that don't support download attribute
    // Open in new window/tab and let user save manually
    const newWindow = window.open(url, '_blank');
    if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
      // Popup blocked - try location change as last resort
      window.location.href = url;
    }
    
    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 60000); // Keep URL alive longer for manual save
  }
}

export function downloadFileFromFile(file: File): void {
  downloadFile(file, file.name);
}

// Alternative approach: trigger download via iframe for problematic browsers
export function downloadFileViaIframe(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  
  // Create hidden iframe
  let iframe = document.getElementById('download-iframe') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'download-iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }
  
  // For browsers that support it, try to set content-disposition
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.style.display = 'none';
  
  if (iframe.contentDocument) {
    iframe.contentDocument.body.appendChild(a);
    a.click();
    setTimeout(() => {
      if (a.parentNode) {
        iframe.contentDocument?.body.removeChild(a);
      }
      URL.revokeObjectURL(url);
    }, 250);
  } else {
    // Fallback
    downloadFile(blob, filename);
  }
}
