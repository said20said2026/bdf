/**
 * Generates sample images as File objects for one-click testing
 */
export async function generateSampleImages(): Promise<File[]> {
  const samples = [
    {
      title: 'تقرير الأعمال والإحصائيات 2026',
      subtitle: 'DocuMorph Analytics - الملخص الربع سنوي',
      bgGradient: ['#1e293b', '#0f172a'],
      accentColor: '#38bdf8',
      accent2: '#818cf8',
      type: 'chart',
      fileName: 'business_report_sample.jpg',
    },
    {
      title: 'شهادة إتمام وتفوق معتمدة',
      subtitle: 'برنامج التحول الرقمي وتطوير الحلول السحابية',
      bgGradient: ['#f8fafc', '#e2e8f0'],
      accentColor: '#d97706',
      accent2: '#b45309',
      type: 'certificate',
      fileName: 'certificate_sample.jpg',
    },
    {
      title: 'فاتورة رسمية وعقد خدمات',
      subtitle: 'مؤسسة التقنية المتقدمة - رقم الفاتورة #INV-9824',
      bgGradient: ['#ffffff', '#f1f5f9'],
      accentColor: '#059669',
      accent2: '#10b981',
      type: 'invoice',
      fileName: 'service_invoice_sample.jpg',
    },
  ];

  const files: File[] = [];

  for (const s of samples) {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600; // standard portrait aspect ~A4 ratio
    const ctx = canvas.getContext('2d')!;

    // Background gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, s.bgGradient[0]);
    grad.addColorStop(1, s.bgGradient[1]);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Decorative frame/border
    ctx.strokeStyle = s.accentColor;
    ctx.lineWidth = 14;
    ctx.strokeRect(40, 40, canvas.width - 80, canvas.height - 80);

    ctx.strokeStyle = s.accent2;
    ctx.lineWidth = 2;
    ctx.strokeRect(55, 55, canvas.width - 110, canvas.height - 110);

    // Header badge
    ctx.fillStyle = s.accentColor;
    ctx.beginPath();
    ctx.roundRect(canvas.width / 2 - 160, 90, 320, 60, 30);
    ctx.fill();

    ctx.font = 'bold 24px "Cairo", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.fillText('DOCUMORPH VERIFIED', canvas.width / 2, 130);

    // Title & Subtitle
    ctx.fillStyle = s.type === 'chart' ? '#ffffff' : '#0f172a';
    ctx.font = 'bold 52px "Cairo", sans-serif';
    ctx.fillText(s.title, canvas.width / 2, 280);

    ctx.fillStyle = s.type === 'chart' ? '#94a3b8' : '#475569';
    ctx.font = '28px "Cairo", sans-serif';
    ctx.fillText(s.subtitle, canvas.width / 2, 340);

    // Content based on type
    if (s.type === 'chart') {
      // Draw dashboard cards and bars
      const cardY = 440;
      const cardW = 320;
      const cardH = 180;
      const gap = 30;
      const startX = (canvas.width - (3 * cardW + 2 * gap)) / 2;

      const metrics = [
        { label: 'إجمالي التحويلات', val: '148,290', change: '+24%' },
        { label: 'نسبة الدقة والجودة', val: '99.9%', change: '+3.2%' },
        { label: 'زمن المعالجة', val: '0.8s', change: '-45%' },
      ];

      metrics.forEach((m, idx) => {
        const x = startX + idx * (cardW + gap);
        ctx.fillStyle = '#1e293b';
        ctx.beginPath();
        ctx.roundRect(x, cardY, cardW, cardH, 16);
        ctx.fill();

        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#94a3b8';
        ctx.font = '22px "Cairo", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(m.label, x + cardW / 2, cardY + 50);

        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 42px "Cairo", sans-serif';
        ctx.fillText(m.val, x + cardW / 2, cardY + 115);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 18px "Cairo", sans-serif';
        ctx.fillText(m.change, x + cardW / 2, cardY + 155);
      });

      // Chart bars
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(startX, 680, 3 * cardW + 2 * gap, 480, 20);
      ctx.fill();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 28px "Cairo", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('نمو الاستخدام الشهري لملفات PDF', startX + (3 * cardW + 2 * gap) - 40, 740);

      // Bars
      const bars = [40, 65, 55, 80, 95, 70, 110, 130, 160, 190];
      const barW = 60;
      const barGap = 35;
      const barBaseY = 1100;
      bars.forEach((b, idx) => {
        const bx = startX + 60 + idx * (barW + barGap);
        const bh = b * 2.2;
        const barGrad = ctx.createLinearGradient(0, barBaseY - bh, 0, barBaseY);
        barGrad.addColorStop(0, '#38bdf8');
        barGrad.addColorStop(1, '#6366f1');
        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(bx, barBaseY - bh, barW, bh, 8);
        ctx.fill();
      });
    } else if (s.type === 'certificate') {
      // Certificate ribbon/seal
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(canvas.width / 2, 540, 70, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = '#78350f';
      ctx.font = 'bold 32px "Cairo", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('★ 2026 ★', canvas.width / 2, 550);

      // Recipient name
      ctx.fillStyle = '#0f172a';
      ctx.font = 'italic bold 44px "Cairo", serif';
      ctx.fillText('السيد / سامي عبد الرحمن والموقرين', canvas.width / 2, 700);

      ctx.fillStyle = '#475569';
      ctx.font = '24px "Cairo", sans-serif';
      ctx.fillText('تقديراً للمشاركة المتميزة وإنجاز كافة متطلبات التحويل الإلكتروني', canvas.width / 2, 770);
      ctx.fillText('بأعلى معايير الدقة والسرية والأمان وفق المواصفات القياسية.', canvas.width / 2, 815);

      // Signatures
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(250, 1100);
      ctx.lineTo(500, 1100);
      ctx.moveTo(700, 1100);
      ctx.lineTo(950, 1100);
      ctx.stroke();

      ctx.fillStyle = '#334155';
      ctx.font = '22px "Cairo", sans-serif';
      ctx.fillText('توقيع المشرف العام', 375, 1140);
      ctx.fillText('الختم والاعتماد الرسمي', 825, 1140);
    } else {
      // Invoice sample
      const startY = 460;
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(140, startY, canvas.width - 280, 680, 16);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Table header
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.roundRect(160, startY + 20, canvas.width - 320, 60, 8);
      ctx.fill();

      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 22px "Cairo", sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText('الوصف والخدمة', canvas.width - 200, startY + 58);
      ctx.fillText('الكمية', canvas.width - 550, startY + 58);
      ctx.fillText('السعر الإفرادي', canvas.width - 720, startY + 58);
      ctx.fillText('الإجمالي', 220, startY + 58);

      // Rows
      const items = [
        { desc: 'تحويل وتجهيز مستندات Word و DOCX', qty: '15 ملف', price: '$20.00', total: '$300.00' },
        { desc: 'معالجة وتجميع ملفات الصور إلى PDF عالي الجودة', qty: '40 صورة', price: '$10.00', total: '$400.00' },
        { desc: 'خدمة التدقيق والتنسيق والضغط الفوري', qty: 'حزمة كاملة', price: '$50.00', total: '$50.00' },
      ];

      items.forEach((row, idx) => {
        const ry = startY + 120 + idx * 70;
        ctx.fillStyle = '#334155';
        ctx.font = '20px "Cairo", sans-serif';
        ctx.textAlign = 'right';
        ctx.fillText(row.desc, canvas.width - 200, ry);
        ctx.fillText(row.qty, canvas.width - 550, ry);
        ctx.fillText(row.price, canvas.width - 720, ry);
        ctx.fillText(row.total, 220, ry);

        ctx.strokeStyle = '#e2e8f0';
        ctx.beginPath();
        ctx.moveTo(160, ry + 20);
        ctx.lineTo(canvas.width - 160, ry + 20);
        ctx.stroke();
      });

      // Total block
      ctx.fillStyle = '#059669';
      ctx.font = 'bold 32px "Cairo", sans-serif';
      ctx.fillText('المجموع النهائي المطلوب: $750.00', canvas.width - 200, startY + 450);
    }

    // Footer
    ctx.fillStyle = s.type === 'chart' ? '#64748b' : '#94a3b8';
    ctx.font = '18px "Cairo", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('تم التوليد للاختبار الفوري بواسطة DocuMorph PDF Engine - 2026', canvas.width / 2, canvas.height - 70);

    const blob = await new Promise<Blob>((resolve) => {
      canvas.toBlob((b) => resolve(b!), 'image/jpeg', 0.92);
    });

    files.push(new File([blob], s.fileName, { type: 'image/jpeg' }));
  }

  return files;
}

/**
 * Generates a valid sample DOCX file with rich Arabic content, headings, and table
 * Using standard minimal OpenXML ZIP structure
 */
export async function generateSampleDocx(): Promise<File> {
  // We can construct a minimal valid docx structure using JS zip format
  // Or create a base64 encoded docx containing clean Arabic formatted content!
  const docxXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"
            xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:bidi/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Cairo" w:cs="Cairo"/>
          <w:b/>
          <w:sz w:val="56"/>
          <w:color w:val="0F172A"/>
        </w:rPr>
        <w:t>وثيقة العمل الرسمية والتقرير النموذجي</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="center"/>
        <w:bidi/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Cairo" w:cs="Cairo"/>
          <w:sz w:val="28"/>
          <w:color w:val="64748B"/>
        </w:rPr>
        <w:t>مستند Word (DOCX) تجريبي لاختبار التحويل المباشر إلى صيغة PDF</w:t>
      </w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="right"/>
        <w:bidi/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Cairo" w:cs="Cairo"/>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="1E3A8A"/>
        </w:rPr>
        <w:t>1. مقدمة حول المستند</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="right"/>
        <w:bidi/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Cairo" w:cs="Cairo"/>
          <w:sz w:val="26"/>
          <w:color w:val="334155"/>
        </w:rPr>
        <w:t>تم تجهيز هذا الملف بصيغة Microsoft Word DOCX لاختبار قدرات التحويل الفوري وعرض النصوص العربية والفقرات المتعددة والجداول داخل المتصفح بأمان وخصوصية 100% دون إرسال البيانات لأي خادم خارجي.</w:t>
      </w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:p>
      <w:pPr>
        <w:jc w:val="right"/>
        <w:bidi/>
      </w:pPr>
      <w:r>
        <w:rPr>
          <w:rFonts w:ascii="Cairo" w:cs="Cairo"/>
          <w:b/>
          <w:sz w:val="36"/>
          <w:color w:val="1E3A8A"/>
        </w:rPr>
        <w:t>2. مميزات نظام التحويل</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Cairo" w:cs="Cairo"/><w:sz w:val="24"/><w:color w:val="059669"/></w:rPr>
        <w:t>✓ سرعة فائقة ومعالجة فورية داخل جهازك.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Cairo" w:cs="Cairo"/><w:sz w:val="24"/><w:color w:val="059669"/></w:rPr>
        <w:t>✓ دقة عالية في تخطيط الصفحات والهوامش وحفظ الخطوط.</w:t>
      </w:r>
    </w:p>
    <w:p>
      <w:pPr><w:jc w:val="right"/><w:bidi/></w:pPr>
      <w:r>
        <w:rPr><w:rFonts w:ascii="Cairo" w:cs="Cairo"/><w:sz w:val="24"/><w:color w:val="059669"/></w:rPr>
        <w:t>✓ الحفاظ الكامل على الخصوصية والسرية المصرفية والوثائقية.</w:t>
      </w:r>
    </w:p>
    <w:p><w:r><w:t></w:t></w:r></w:p>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="5000" w:type="pct"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:left w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:bottom w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:right w:val="single" w:sz="6" w:space="0" w:color="CBD5E1"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="E2E8F0"/>
        </w:tblBorders>
      </w:tblPr>
      <w:tr>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>الحالة</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>الصيغة الناتجة</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:rPr><w:b/><w:sz w:val="24"/></w:rPr><w:t>نوع الملف المصدر</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:t>مدعوم بالكامل 100%</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:t>PDF عالي الجودة</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:t>Word (DOCX)</w:t></w:r></w:p></w:tc>
      </w:tr>
      <w:tr>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:t>مدعوم بالكامل 100%</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:t>PDF مجمع أو فردي</w:t></w:r></w:p></w:tc>
        <w:tc><w:p><w:pPr><w:jc w:val="center"/><w:bidi/></w:pPr><w:r><w:t>الصور (JPG, PNG, WebP)</w:t></w:r></w:p></w:tc>
      </w:tr>
    </w:tbl>
    <w:sectPr>
      <w:pgSz w:w="11906" w:h="16838"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  // Create a minimal in-memory zip for docx using standard zip spec
  const zipBuffer = buildSimpleZip([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: relsXml },
    { name: 'word/document.xml', content: docxXml },
  ]);

  return new File([zipBuffer], 'sample_document_نموذج_وورد.docx', {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
}

/**
 * Minimal lightweight pure JS ZIP builder for uncompressed store files
 */
function buildSimpleZip(files: { name: string; content: string }[]): ArrayBuffer {
  const fileRecords: {
    nameBytes: Uint8Array;
    contentBytes: Uint8Array;
    offset: number;
    crc: number;
  }[] = [];

  let currentOffset = 0;
  const parts: Uint8Array[] = [];

  for (const f of files) {
    const enc = new TextEncoder();
    const nameBytes = enc.encode(f.name);
    const contentBytes = enc.encode(f.content);
    const crc = crc32(contentBytes);

    // Local file header (30 bytes + name length)
    const header = new Uint8Array(30 + nameBytes.length);
    const view = new DataView(header.buffer);
    view.setUint32(0, 0x04034b50, true); // signature
    view.setUint16(4, 10, true); // version needed
    view.setUint16(6, 0, true); // general purpose flags
    view.setUint16(8, 0, true); // compression: 0 = store
    view.setUint16(10, 0, true); // mod time
    view.setUint16(12, 0, true); // mod date
    view.setUint32(14, crc, true); // crc32
    view.setUint32(18, contentBytes.length, true); // compressed size
    view.setUint32(22, contentBytes.length, true); // uncompressed size
    view.setUint16(26, nameBytes.length, true); // filename length
    view.setUint16(28, 0, true); // extra field length
    header.set(nameBytes, 30);

    fileRecords.push({
      nameBytes,
      contentBytes,
      offset: currentOffset,
      crc,
    });

    parts.push(header);
    parts.push(contentBytes);
    currentOffset += header.length + contentBytes.length;
  }

  // Central directory
  const cdOffset = currentOffset;
  let cdSize = 0;

  for (const rec of fileRecords) {
    const cdHeader = new Uint8Array(46 + rec.nameBytes.length);
    const view = new DataView(cdHeader.buffer);
    view.setUint32(0, 0x02014b50, true); // signature
    view.setUint16(4, 10, true); // version made by
    view.setUint16(6, 10, true); // version needed
    view.setUint16(8, 0, true); // flags
    view.setUint16(10, 0, true); // compression: 0 = store
    view.setUint16(12, 0, true); // time
    view.setUint16(14, 0, true); // date
    view.setUint32(16, rec.crc, true); // crc
    view.setUint32(20, rec.contentBytes.length, true); // comp size
    view.setUint32(24, rec.contentBytes.length, true); // uncomp size
    view.setUint16(28, rec.nameBytes.length, true); // name len
    view.setUint16(30, 0, true); // extra len
    view.setUint16(32, 0, true); // comment len
    view.setUint16(34, 0, true); // disk start
    view.setUint16(36, 0, true); // internal attr
    view.setUint32(38, 0, true); // external attr
    view.setUint32(42, rec.offset, true); // local header offset
    cdHeader.set(rec.nameBytes, 46);

    parts.push(cdHeader);
    cdSize += cdHeader.length;
  }

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const viewEocd = new DataView(eocd.buffer);
  viewEocd.setUint32(0, 0x06054b50, true); // signature
  viewEocd.setUint16(4, 0, true); // disk num
  viewEocd.setUint16(6, 0, true); // disk cd start
  viewEocd.setUint16(8, fileRecords.length, true); // num records on disk
  viewEocd.setUint16(10, fileRecords.length, true); // total records
  viewEocd.setUint32(12, cdSize, true); // cd size
  viewEocd.setUint32(16, cdOffset, true); // cd offset
  viewEocd.setUint16(20, 0, true); // comment len
  parts.push(eocd);

  // Combine
  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const merged = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    merged.set(p, pos);
    pos += p.length;
  }

  return merged.buffer;
}

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = (c >>> 8) ^ table[(c ^ bytes[i]) & 0xff];
  }
  return (c ^ 0xffffffff) >>> 0;
}

const table = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  }
  table[n] = c;
}
