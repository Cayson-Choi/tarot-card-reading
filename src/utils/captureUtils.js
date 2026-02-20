import html2canvas from 'html2canvas';

export async function captureElement(element) {
  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0e1a',
    scale: 2,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });
  return canvas;
}

export function downloadCanvas(canvas, filename = 'tarot-reading.png') {
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
