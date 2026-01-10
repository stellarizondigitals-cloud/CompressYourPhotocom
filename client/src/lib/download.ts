export function downloadFile(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  a.setAttribute('target', '_blank');
  a.setAttribute('rel', 'noopener noreferrer');
  
  document.body.appendChild(a);
  
  if (typeof a.click === 'function') {
    a.click();
  } else {
    const evt = document.createEvent('MouseEvents');
    evt.initEvent('click', true, true);
    a.dispatchEvent(evt);
  }
  
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
}

export function downloadFileFromFile(file: File): void {
  downloadFile(file, file.name);
}
