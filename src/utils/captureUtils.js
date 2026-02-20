import html2canvas from 'html2canvas';

export async function captureElement(element) {
  // Clone the element to avoid html2canvas issues with transforms/animations
  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0e1a',
    scale: 2,
    useCORS: true,
    allowTaint: false,
    logging: false,
    // Ignore framer-motion transform styles that break html2canvas
    onclone: (doc, clonedEl) => {
      // Remove all transform styles from cloned elements to prevent rendering issues
      const allElements = clonedEl.querySelectorAll('*');
      allElements.forEach((el) => {
        if (el.style.transform) {
          el.style.transform = 'none';
        }
      });
    },
  });
  return canvas;
}

export function downloadCanvas(canvas, filename = 'tarot-reading.png') {
  // Use blob approach for better browser compatibility
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Clean up the object URL after a short delay
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }, 'image/png');
}
