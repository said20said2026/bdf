import { jsPDF } from 'jspdf';
import { ImageFileItem, ImageToPdfOptions } from '../types';

// Helper to get rotated image data URL via canvas
export async function getRotatedImageData(item: ImageFileItem): Promise<{ dataUrl: string; width: number; height: number }> {
  if (item.rotation === 0) {
    return { dataUrl: item.dataUrl, width: item.width, height: item.height };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ dataUrl: item.dataUrl, width: item.width, height: item.height });
        return;
      }

      const isRotated90or270 = item.rotation === 90 || item.rotation === 270;
      canvas.width = isRotated90or270 ? img.height : img.width;
      canvas.height = isRotated90or270 ? img.width : img.height;

      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((item.rotation * Math.PI) / 180);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const rotatedDataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve({
        dataUrl: rotatedDataUrl,
        width: canvas.width,
        height: canvas.height,
      });
    };
    img.src = item.dataUrl;
  });
}

export async function convertImagesToPdf(
  images: ImageFileItem[],
  options: ImageToPdfOptions,
  onProgress?: (progress: number, current: number, total: number) => void
): Promise<{ blob: Blob; url: string; size: number; pageCount: number }> {
  if (images.length === 0) {
    throw new Error('لا توجد صور للتحويل');
  }

  // Margin in mm
  const marginMm = options.margin === 'none' ? 0 : options.margin === 'small' ? 10 : 20;

  // Initialize jsPDF with standard dummy or first page
  let pdf: jsPDF | null = null;
  const total = images.length;

  for (let i = 0; i < total; i++) {
    const item = images[i];
    const rotated = await getRotatedImageData(item);

    // Determine orientation and page dimensions in mm
    let orientation: 'p' | 'l' = 'p';
    let pageWidthMm = 210;
    let pageHeightMm = 297;

    if (options.pageSize === 'letter') {
      pageWidthMm = 215.9;
      pageHeightMm = 279.4;
    }

    if (options.pageSize === 'fit') {
      // Fit page to image aspect ratio (normalized to standard width ~210mm)
      const aspect = rotated.width / rotated.height;
      pageWidthMm = 210;
      pageHeightMm = 210 / aspect;
      orientation = aspect > 1 ? 'l' : 'p';
    } else {
      // a4 or letter
      if (options.orientation === 'portrait') {
        orientation = 'p';
      } else if (options.orientation === 'landscape') {
        orientation = 'l';
      } else {
        // auto
        orientation = rotated.width > rotated.height ? 'l' : 'p';
      }

      if (orientation === 'l') {
        const temp = pageWidthMm;
        pageWidthMm = pageHeightMm;
        pageHeightMm = temp;
      }
    }

    if (i === 0) {
      pdf = new jsPDF({
        orientation,
        unit: 'mm',
        format: options.pageSize === 'fit' ? [pageWidthMm, pageHeightMm] : options.pageSize,
        compress: true,
      });
    } else {
      pdf!.addPage(
        options.pageSize === 'fit' ? [pageWidthMm, pageHeightMm] : options.pageSize,
        orientation
      );
    }

    // Available drawing area
    const printableWidth = Math.max(pageWidthMm - marginMm * 2, 10);
    const printableHeight = Math.max(pageHeightMm - marginMm * 2, 10);

    const imgAspect = rotated.width / rotated.height;
    const printAspect = printableWidth / printableHeight;

    let finalImgWidth = printableWidth;
    let finalImgHeight = printableHeight;
    let posX = marginMm;
    let posY = marginMm;

    if (options.imageFit === 'contain') {
      if (imgAspect > printAspect) {
        // Image is wider than printable area
        finalImgWidth = printableWidth;
        finalImgHeight = printableWidth / imgAspect;
        posX = marginMm;
        posY = marginMm + (printableHeight - finalImgHeight) / 2;
      } else {
        // Image is taller than printable area
        finalImgHeight = printableHeight;
        finalImgWidth = printableHeight * imgAspect;
        posX = marginMm + (printableWidth - finalImgWidth) / 2;
        posY = marginMm;
      }
    } else {
      // cover
      if (imgAspect > printAspect) {
        finalImgHeight = printableHeight;
        finalImgWidth = printableHeight * imgAspect;
        posX = marginMm - (finalImgWidth - printableWidth) / 2;
        posY = marginMm;
      } else {
        finalImgWidth = printableWidth;
        finalImgHeight = printableWidth / imgAspect;
        posX = marginMm;
        posY = marginMm - (finalImgHeight - printableHeight) / 2;
      }
    }

    // Add image to page
    pdf!.addImage(
      rotated.dataUrl,
      'JPEG',
      posX,
      posY,
      finalImgWidth,
      finalImgHeight,
      undefined,
      'FAST'
    );

    // Optional Page Numbers
    if (options.addPageNumbers) {
      pdf!.setFontSize(10);
      pdf!.setTextColor(120, 120, 120);
      const pageText = `${i + 1} / ${total}`;
      pdf!.text(pageText, pageWidthMm / 2, pageHeightMm - 5, { align: 'center' });
    }

    if (onProgress) {
      const prog = Math.round(((i + 1) / total) * 100);
      onProgress(prog, i + 1, total);
    }
  }

  if (!pdf) {
    throw new Error('فشل إنشاء ملف PDF');
  }

  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  const size = blob.size;

  return {
    blob,
    url,
    size,
    pageCount: total,
  };
}
