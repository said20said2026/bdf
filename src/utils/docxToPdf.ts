import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { DocxToPdfOptions } from '../types';

/**
 * Render DOCX into a preview container using Mammoth for 100% reliable HTML presentation
 */
export async function renderDocxToContainer(
  fileOrBuffer: File | ArrayBuffer,
  container: HTMLElement
): Promise<{ html: string; isArabic: boolean }> {
  container.innerHTML = '';

  let buffer: ArrayBuffer;
  if (fileOrBuffer instanceof File) {
    buffer = await fileOrBuffer.arrayBuffer();
  } else {
    buffer = fileOrBuffer;
  }

  // Convert docx to HTML using Mammoth
  const result = await mammoth.convertToHtml(
    { arrayBuffer: buffer },
    {
      convertImage: mammoth.images.imgElement((image) => {
        return image.read('base64').then((imageBuffer) => {
          return {
            src: `data:${image.contentType};base64,${imageBuffer}`,
          };
        });
      }),
    }
  );

  const rawHtml = result.value || '<p>محتوى المستند فارغ</p>';
  const isArabic = /[\u0600-\u06FF]/.test(rawHtml);

  // Styled visual preview inside the container
  container.innerHTML = `
    <div class="w-full max-w-[820px] mx-auto bg-white rounded-2xl shadow-xl shadow-slate-300/40 p-8 sm:p-14 border border-slate-200 text-slate-900 leading-relaxed font-sans" dir="${isArabic ? 'rtl' : 'ltr'}">
      <style>
        .docx-preview-content h1 { font-size: 2rem; font-weight: 800; margin-bottom: 1rem; color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; }
        .docx-preview-content h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1e3a8a; }
        .docx-preview-content h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #334155; }
        .docx-preview-content p { margin-bottom: 1rem; line-height: 1.8; color: #334155; font-size: 1rem; }
        .docx-preview-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.95rem; }
        .docx-preview-content th, .docx-preview-content td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: ${isArabic ? 'right' : 'left'}; }
        .docx-preview-content th { background-color: #f1f5f9; font-weight: 700; color: #0f172a; }
        .docx-preview-content tr:nth-child(even) td { background-color: #f8fafc; }
        .docx-preview-content ul { list-style-type: disc; margin: 1rem 0 1rem 1.5rem; padding-${isArabic ? 'right' : 'left'}: 1.5rem; }
        .docx-preview-content ol { list-style-type: decimal; margin: 1rem 0 1rem 1.5rem; padding-${isArabic ? 'right' : 'left'}: 1.5rem; }
        .docx-preview-content li { margin-bottom: 0.5rem; color: #334155; }
        .docx-preview-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem auto; display: block; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
        .docx-preview-content blockquote { border-${isArabic ? 'right' : 'left'}: 4px solid #3b82f6; padding: 0.5rem 1rem; background: #eff6ff; margin: 1rem 0; border-radius: 4px; color: #1e40af; }
      </style>
      <div class="docx-preview-content">
        ${rawHtml}
      </div>
    </div>
  `;

  return { html: rawHtml, isArabic };
}

/**
 * Convert DOCX File or ArrayBuffer directly into a clean, paginated PDF
 */
export async function convertDocxToPdf(
  fileOrBuffer: File | ArrayBuffer,
  options: DocxToPdfOptions,
  onProgress?: (progress: number, stepText: string) => void
): Promise<{ blob: Blob; url: string; size: number; pageCount: number }> {
  let buffer: ArrayBuffer;
  if (fileOrBuffer instanceof File) {
    buffer = await fileOrBuffer.arrayBuffer();
  } else {
    buffer = fileOrBuffer;
  }

  if (onProgress) onProgress(15, 'تحليل وفك شفرة محتوى مستند Word...');

  // Convert DOCX to HTML via Mammoth with base64 inline images
  const conversionResult = await mammoth.convertToHtml(
    { arrayBuffer: buffer },
    {
      convertImage: mammoth.images.imgElement((image) => {
        return image.read('base64').then((imageBuffer) => {
          return {
            src: `data:${image.contentType};base64,${imageBuffer}`,
          };
        });
      }),
    }
  );

  const rawHtml = conversionResult.value || '<p>محتوى المستند فارغ</p>';
  const isArabic = /[\u0600-\u06FF]/.test(rawHtml);

  if (onProgress) onProgress(35, 'تنسيق صفحات المستند وتقسيم الفقرات...');

  // Page dimensions (standard A4 at 96 DPI: 794 x 1123 px)
  const isLandscape = options.orientation === 'landscape';
  const pageFormat = options.pageSize; // 'a4' | 'letter'

  // Dimensions in mm
  const pageWidthMm = pageFormat === 'letter' ? (isLandscape ? 279.4 : 215.9) : (isLandscape ? 297 : 210);
  const pageHeightMm = pageFormat === 'letter' ? (isLandscape ? 215.9 : 279.4) : (isLandscape ? 210 : 297);

  // In pixels (at 96 DPI standard web resolution)
  const baseWidthPx = pageFormat === 'letter' ? (isLandscape ? 1056 : 816) : (isLandscape ? 1123 : 794);
  const baseHeightPx = pageFormat === 'letter' ? (isLandscape ? 816 : 1056) : (isLandscape ? 794 : 1123);

  const marginPaddingPx = options.margins === 'none' ? 24 : options.margins === 'compact' ? 36 : 56;
  const maxContentHeightPx = baseHeightPx - marginPaddingPx * 2 - 30; // 30px buffer for footer

  // Offscreen container for clean pagination measurement
  const offscreenRoot = document.createElement('div');
  offscreenRoot.style.position = 'fixed';
  offscreenRoot.style.left = '-9999px';
  offscreenRoot.style.top = '0';
  offscreenRoot.style.width = `${baseWidthPx}px`;
  offscreenRoot.style.zIndex = '-9999';
  offscreenRoot.style.backgroundColor = '#ffffff';
  offscreenRoot.style.color = '#1e293b';
  document.body.appendChild(offscreenRoot);

  // Helper parser
  const parserDoc = document.createElement('div');
  parserDoc.innerHTML = rawHtml;
  const childNodes = Array.from(parserDoc.children) as HTMLElement[];

  // Fallback if no child elements (e.g. raw text nodes)
  if (childNodes.length === 0) {
    const p = document.createElement('p');
    p.innerHTML = rawHtml;
    childNodes.push(p);
  }

  // Create paginated sheet elements
  const pageSheets: HTMLElement[] = [];

  const createNewPageSheet = (): HTMLElement => {
    const sheet = document.createElement('div');
    sheet.style.width = `${baseWidthPx}px`;
    sheet.style.minHeight = `${baseHeightPx}px`;
    sheet.style.maxHeight = `${baseHeightPx}px`;
    sheet.style.overflow = 'hidden';
    sheet.style.backgroundColor = '#ffffff';
    sheet.style.color = '#1e293b';
    sheet.style.padding = `${marginPaddingPx}px`;
    sheet.style.boxSizing = 'border-box';
    sheet.style.fontFamily = "'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif";
    sheet.style.direction = isArabic ? 'rtl' : 'ltr';
    sheet.style.textAlign = isArabic ? 'right' : 'left';
    sheet.style.position = 'relative';

    const innerContent = document.createElement('div');
    innerContent.className = 'page-inner-content';
    innerContent.style.width = '100%';
    sheet.appendChild(innerContent);

    offscreenRoot.appendChild(sheet);
    pageSheets.push(sheet);
    return sheet;
  };

  let currentPage = createNewPageSheet();
  let currentInner = currentPage.querySelector('.page-inner-content') as HTMLElement;

  for (const node of childNodes) {
    const cloned = node.cloneNode(true) as HTMLElement;
    
    // Apply clean styling to cloned element
    applyElementStyles(cloned, isArabic);

    currentInner.appendChild(cloned);

    // If inner content exceeds maximum height, move this element to next page
    if (currentInner.offsetHeight > maxContentHeightPx && currentInner.children.length > 1) {
      currentInner.removeChild(cloned);
      currentPage = createNewPageSheet();
      currentInner = currentPage.querySelector('.page-inner-content') as HTMLElement;
      currentInner.appendChild(cloned);
    }
  }

  // Initialize jsPDF
  const orientation = isLandscape ? 'l' : 'p';
  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format: options.pageSize,
    compress: true,
  });

  const totalPages = pageSheets.length;

  try {
    for (let i = 0; i < totalPages; i++) {
      const pageEl = pageSheets[i];
      if (onProgress) {
        const prog = Math.round(40 + ((i + 1) / totalPages) * 50);
        onProgress(prog, `معالجة وتصيير الصفحة ${i + 1} من ${totalPages}...`);
      }

      // Capture page with html2canvas (patched against oklch errors)
      const canvas = await html2canvas(pageEl, {
        scale: 2, // 2x DPI for ultra-sharp typography
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: baseWidthPx,
        height: baseHeightPx,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      if (i > 0) {
        pdf.addPage(options.pageSize, orientation);
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');

      // Page numbers at the bottom
      if (options.addPageNumbers) {
        pdf.setFontSize(9);
        pdf.setTextColor(140, 140, 140);
        pdf.text(
          `${i + 1} / ${totalPages}`,
          pageWidthMm / 2,
          pageHeightMm - 5,
          { align: 'center' }
        );
      }
    }
  } catch (canvasErr) {
    console.warn('Canvas rendering encountered an error, falling back to direct PDF layout:', canvasErr);
    // Direct PDF fallback using extracted text
    return createDirectTextPdf(rawHtml, options, isArabic);
  } finally {
    // Clean up offscreen DOM
    if (offscreenRoot.parentNode) {
      offscreenRoot.parentNode.removeChild(offscreenRoot);
    }
  }

  if (onProgress) onProgress(98, 'تجهيز وحفظ ملف PDF النهائي...');

  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  const size = blob.size;

  if (onProgress) onProgress(100, 'اكتمل التحويل بنجاح!');

  return {
    blob,
    url,
    size,
    pageCount: totalPages,
  };
}

/**
 * Apply clean inline styling to elements for safe rendering without CSS conflicts
 */
function applyElementStyles(el: HTMLElement, isArabic: boolean) {
  const tag = el.tagName.toLowerCase();

  el.style.color = '#1e293b';
  el.style.boxSizing = 'border-box';

  if (tag === 'h1') {
    el.style.fontSize = '26px';
    el.style.fontWeight = '800';
    el.style.margin = '16px 0 10px 0';
    el.style.color = '#0f172a';
    el.style.borderBottom = '2px solid #e2e8f0';
    el.style.paddingBottom = '6px';
  } else if (tag === 'h2') {
    el.style.fontSize = '20px';
    el.style.fontWeight = '700';
    el.style.margin = '14px 0 8px 0';
    el.style.color = '#1e3a8a';
  } else if (tag === 'h3') {
    el.style.fontSize = '16px';
    el.style.fontWeight = '700';
    el.style.margin = '10px 0 6px 0';
    el.style.color = '#334155';
  } else if (tag === 'p') {
    el.style.fontSize = '14px';
    el.style.lineHeight = '1.7';
    el.style.margin = '0 0 10px 0';
    el.style.color = '#334155';
  } else if (tag === 'table') {
    el.style.width = '100%';
    el.style.borderCollapse = 'collapse';
    el.style.margin = '12px 0';
    el.style.fontSize = '13px';
    const cells = el.querySelectorAll('th, td');
    cells.forEach((c) => {
      const cell = c as HTMLElement;
      cell.style.border = '1px solid #cbd5e1';
      cell.style.padding = '8px 10px';
      cell.style.textAlign = isArabic ? 'right' : 'left';
    });
    const headers = el.querySelectorAll('th');
    headers.forEach((h) => {
      const header = h as HTMLElement;
      header.style.backgroundColor = '#f1f5f9';
      header.style.fontWeight = '700';
      header.style.color = '#0f172a';
    });
  } else if (tag === 'ul' || tag === 'ol') {
    el.style.margin = '8px 0 12px 0';
    el.style.padding = isArabic ? '0 24px 0 0' : '0 0 0 24px';
    el.style.fontSize = '14px';
    el.style.lineHeight = '1.6';
  } else if (tag === 'img') {
    el.style.maxWidth = '100%';
    el.style.height = 'auto';
    el.style.borderRadius = '6px';
    el.style.margin = '10px auto';
    el.style.display = 'block';
  }
}

/**
 * Secondary safety fallback: Generates PDF directly without html2canvas
 */
function createDirectTextPdf(
  rawHtml: string,
  options: DocxToPdfOptions,
  isArabic: boolean
): { blob: Blob; url: string; size: number; pageCount: number } {
  const isLandscape = options.orientation === 'landscape';
  const orientation = isLandscape ? 'l' : 'p';
  const format = options.pageSize;

  const pdf = new jsPDF({
    orientation,
    unit: 'mm',
    format,
  });

  const pageWidth = format === 'letter' ? (isLandscape ? 279.4 : 215.9) : (isLandscape ? 297 : 210);
  const pageHeight = format === 'letter' ? (isLandscape ? 215.9 : 279.4) : (isLandscape ? 210 : 297);
  const margin = options.margins === 'none' ? 10 : options.margins === 'compact' ? 15 : 20;
  const contentWidth = pageWidth - margin * 2;

  // Extract clean plain text paragraphs
  const temp = document.createElement('div');
  temp.innerHTML = rawHtml;
  const textContent = temp.innerText || temp.textContent || '';
  const lines = textContent.split('\n').filter((l) => l.trim().length > 0);

  let currentY = margin + 10;
  let pageCount = 1;

  pdf.setFontSize(11);
  pdf.setTextColor(30, 41, 59);

  for (const line of lines) {
    const wrapped = pdf.splitTextToSize(line, contentWidth);
    for (const subLine of wrapped) {
      if (currentY > pageHeight - margin - 15) {
        pdf.addPage(format, orientation);
        pageCount++;
        currentY = margin + 10;
      }
      pdf.text(subLine, isArabic ? pageWidth - margin : margin, currentY, {
        align: isArabic ? 'right' : 'left',
      });
      currentY += 7;
    }
    currentY += 3;
  }

  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  return {
    blob,
    url,
    size: blob.size,
    pageCount,
  };
}
