import React, { useState, useRef, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  RotateCw,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Trash2,
  Settings2,
  FileCheck2,
  Download,
  Eye,
  Plus,
  RefreshCw,
  Sparkles,
  Layers,
  Sliders,
  CheckCircle2,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ImageFileItem, ImageToPdfOptions, ConvertedHistoryItem } from '../types';
import { convertImagesToPdf } from '../utils/imageToPdf';
import { generateSampleImages } from '../utils/sampleFiles';

interface ImagesToPdfConverterProps {
  onConversionSuccess: (item: ConvertedHistoryItem) => void;
}

export const ImagesToPdfConverter: React.FC<ImagesToPdfConverterProps> = ({ onConversionSuccess }) => {
  const [images, setImages] = useState<ImageFileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [previewModalImage, setPreviewModalImage] = useState<ImageFileItem | null>(null);
  
  // Conversion options
  const [options, setOptions] = useState<ImageToPdfOptions>({
    pageSize: 'a4',
    orientation: 'auto',
    margin: 'small',
    imageFit: 'contain',
    quality: 0.9,
    addPageNumbers: true,
    outputFileName: 'DocuMorph_Images.pdf',
  });

  // Converted result state
  const [convertedResult, setConvertedResult] = useState<{
    url: string;
    size: number;
    pageCount: number;
    fileName: string;
    blob: Blob;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to load file as dataUrl and read dimensions
  const processFiles = useCallback(async (files: FileList | File[]) => {
    const fileList = Array.from(files);
    const validImageFiles = fileList.filter((f) => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      alert('يرجى اختيار ملفات صور صالحة (JPG, PNG, WebP, GIF, BMP).');
      return;
    }

    const loadedItems: ImageFileItem[] = [];

    for (const file of validImageFiles) {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      const { width, height } = await new Promise<{ width: number; height: number }>((resolve) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = () => resolve({ width: 800, height: 600 });
        img.src = dataUrl;
      });

      loadedItems.push({
        id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        size: file.size,
        dataUrl,
        width,
        height,
        rotation: 0,
      });
    }

    setImages((prev) => [...prev, ...loadedItems]);
    setConvertedResult(null);
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Reordering
  const moveImage = (index: number, direction: 'prev' | 'next') => {
    const targetIndex = direction === 'prev' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    const newImages = [...images];
    const [moved] = newImages.splice(index, 1);
    newImages.splice(targetIndex, 0, moved);
    setImages(newImages);
  };

  // Rotation
  const rotateImage = (id: string, delta: number) => {
    setImages((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newRot = (item.rotation + delta + 360) % 360;
          return { ...item, rotation: newRot };
        }
        return item;
      })
    );
  };

  // Remove
  const removeImage = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear all
  const clearAll = () => {
    setImages([]);
    setConvertedResult(null);
  };

  // Load sample images
  const handleLoadSamples = async () => {
    const sampleFiles = await generateSampleImages();
    await processFiles(sampleFiles);
  };

  // Convert to PDF
  const handleConvert = async () => {
    if (images.length === 0) return;
    setIsConverting(true);
    setProgress(5);
    setProgressText('بدء المعالجة وتجهيز الصفحات...');

    try {
      const result = await convertImagesToPdf(images, options, (prog, current, total) => {
        setProgress(prog);
        setProgressText(`معالجة الصورة ${current} من ${total} (${prog}%)...`);
      });

      const fileName = options.outputFileName.trim().endsWith('.pdf')
        ? options.outputFileName.trim()
        : `${options.outputFileName.trim() || 'DocuMorph_Images'}.pdf`;

      const resultPayload = {
        url: result.url,
        size: result.size,
        pageCount: result.pageCount,
        fileName,
        blob: result.blob,
      };

      setConvertedResult(resultPayload);

      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore if not loaded
      }

      // Add to session history
      onConversionSuccess({
        id: `img-${Date.now()}`,
        fileName,
        fileSize: result.size,
        pageCount: result.pageCount,
        type: 'image',
        createdAt: new Date(),
        blob: result.blob,
        downloadUrl: result.url,
      });
    } catch (err: any) {
      alert(`حدث خطأ أثناء التحويل: ${err.message || 'خطأ غير متوقع'}`);
    } finally {
      setIsConverting(false);
    }
  };

  // Format bytes
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Upload zone when no images or adding more */}
      {images.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-3 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-rose-500 bg-rose-50/60 scale-[1.01]'
              : 'border-slate-300 bg-white hover:border-rose-400 hover:bg-slate-50/50'
          } shadow-sm shadow-slate-100 flex flex-col items-center justify-center min-h-[380px]`}
        >
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
          <div className="w-20 h-20 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mb-6 shadow-md shadow-rose-100 group-hover:scale-110 transition-transform">
            <UploadCloud className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">
            اسحب وأفلت الصور هنا، أو انقر للاختيار
          </h3>
          <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
            يدعم جميع صيغ الصور الشهيرة (JPG, PNG, WebP, GIF, BMP). يمكنك تحديد عدة صور في آنٍ واحد لدمجها في ملف PDF واحد عالي الدقة.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm shadow-md shadow-rose-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>اختيار الصور من جهازك</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSamples();
              }}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>جرّب صور تجريبية الآن</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main List & Gallery (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Top Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                  {images.length}
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-base">
                    الصور المحددة للتحويل ({images.length})
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    يمكنك تدوير الصور، تغيير ترتيبها، أو حذف ما لا تحتاجه
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-rose-600" />
                  <span>إضافة صور</span>
                </button>
                <button
                  type="button"
                  onClick={clearAll}
                  className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>مسح الكل</span>
                </button>
              </div>
            </div>

            {/* Images Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col group relative"
                >
                  {/* Page index badge */}
                  <div className="absolute top-2.5 right-2.5 z-10 bg-slate-900/75 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                    <span>صفحة</span>
                    <span>{index + 1}</span>
                  </div>

                  {/* Thumbnail display with rotation */}
                  <div className="h-44 bg-slate-100 relative overflow-hidden flex items-center justify-center p-3">
                    <img
                      src={item.dataUrl}
                      alt={item.name}
                      style={{
                        transform: `rotate(${item.rotation}deg)`,
                        transition: 'transform 0.25s ease',
                      }}
                      className="max-h-full max-w-full object-contain drop-shadow-sm select-none"
                    />
                    
                    {/* Hover preview button */}
                    <button
                      type="button"
                      onClick={() => setPreviewModalImage(item)}
                      className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"
                      title="معاينة بالحجم الكامل"
                    >
                      <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors">
                        <Eye className="w-5 h-5 text-white" />
                      </span>
                    </button>
                  </div>

                  {/* Details & Actions */}
                  <div className="p-3.5 flex-1 flex flex-col justify-between bg-white border-t border-slate-100">
                    <div>
                      <div className="font-bold text-slate-800 text-xs truncate" title={item.name}>
                        {item.name}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1">
                        <span>{formatBytes(item.size)}</span>
                        <span>•</span>
                        <span>{item.width}×{item.height}px</span>
                        {item.rotation !== 0 && (
                          <>
                            <span>•</span>
                            <span className="text-rose-600 font-semibold">{item.rotation}°</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                      {/* Rotation */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => rotateImage(item.id, -90)}
                          title="تدوير 90 درجة لليسار"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => rotateImage(item.id, 90)}
                          title="تدوير 90 درجة لليمين"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                        >
                          <RotateCw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Move left / right (RTL ordering) */}
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveImage(index, 'prev')}
                          title="تقديم الترتيب"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          disabled={index === images.length - 1}
                          onClick={() => moveImage(index, 'next')}
                          title="تأخير الترتيب"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(item.id)}
                          title="حذف الصورة"
                          className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer mr-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Settings & Execution Panel (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Sliders className="w-5 h-5 text-rose-600" />
                <h3 className="font-extrabold text-slate-800 text-lg">خيارات وإعدادات PDF</h3>
              </div>

              {/* Page Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">حجم الورقة (Page Size):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'a4', label: 'A4 قياسي' },
                    { id: 'letter', label: 'Letter' },
                    { id: 'fit', label: 'مطابق للصورة' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setOptions({ ...options, pageSize: s.id as any })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        options.pageSize === s.id
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Orientation */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">اتجاه الصفحة (Orientation):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'auto', label: 'تلقائي' },
                    { id: 'portrait', label: 'عمودي' },
                    { id: 'landscape', label: 'أفقي' },
                  ].map((o) => (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() => setOptions({ ...options, orientation: o.id as any })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        options.orientation === o.id
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Margins */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">الهوامش (Margins):</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'بدون هوامش' },
                    { id: 'small', label: 'هوامش صغيرة' },
                    { id: 'medium', label: 'هوامش متوسطة' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setOptions({ ...options, margin: m.id as any })}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        options.margin === m.id
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Fit */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">طريقة ملاءمة الصورة:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, imageFit: 'contain' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      options.imageFit === 'contain'
                        ? 'border-rose-600 bg-rose-50 text-rose-700'
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    احتواء كامل (Contain)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, imageFit: 'cover' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      options.imageFit === 'cover'
                        ? 'border-rose-600 bg-rose-50 text-rose-700'
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    ملء الصفحة (Cover)
                  </button>
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">جودة الصورة والضغط:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { val: 0.98, label: 'أعلى دقة' },
                    { val: 0.85, label: 'متوازنة' },
                    { val: 0.65, label: 'حجم أصغر' },
                  ].map((q) => (
                    <button
                      key={q.val}
                      type="button"
                      onClick={() => setOptions({ ...options, quality: q.val })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        options.quality === q.val
                          ? 'border-rose-600 bg-rose-50 text-rose-700'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {q.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page numbers toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700">ترقيم الصفحات أسفل كل صفحة:</span>
                <input
                  type="checkbox"
                  checked={options.addPageNumbers}
                  onChange={(e) => setOptions({ ...options, addPageNumbers: e.target.checked })}
                  className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
                />
              </div>

              {/* Output File Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 block">اسم ملف PDF المخرج:</label>
                <div className="relative">
                  <input
                    type="text"
                    value={options.outputFileName}
                    onChange={(e) => setOptions({ ...options, outputFileName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20"
                    placeholder="DocuMorph_Images.pdf"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold pointer-events-none">
                    .pdf
                  </span>
                </div>
              </div>

              {/* Progress Bar when converting */}
              {isConverting && (
                <div className="p-4 rounded-2xl bg-rose-50/80 border border-rose-200 space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold text-rose-800">
                    <span>{progressText}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-rose-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-rose-600 rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                disabled={isConverting || images.length === 0}
                onClick={handleConvert}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 text-white font-black text-base shadow-lg shadow-rose-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري تحويل الملفات...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5" />
                    <span>تحويل {images.length} صورة إلى PDF الآن</span>
                  </>
                )}
              </button>
            </div>

            {/* Download Card if already converted */}
            {convertedResult && (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base">تم تجهيز ملف PDF بنجاح!</h4>
                    <p className="text-xs text-emerald-100">
                      {convertedResult.pageCount} صفحة • الحجم: {formatBytes(convertedResult.size)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-2">
                  <a
                    href={convertedResult.url}
                    download={convertedResult.fileName}
                    className="flex-1 py-3 px-4 rounded-xl bg-white text-emerald-800 font-black text-sm flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>تحميل الملف الآن</span>
                  </a>
                  <a
                    href={convertedResult.url}
                    target="_blank"
                    rel="noreferrer"
                    className="py-3 px-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm flex items-center justify-center gap-1.5 transition-all backdrop-blur-sm"
                  >
                    <Eye className="w-4 h-4" />
                    <span>معاينة</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for viewing single image in full */}
      {previewModalImage && (
        <div
          onClick={() => setPreviewModalImage(null)}
          className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl overflow-hidden max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl"
          >
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm truncate max-w-md">
                {previewModalImage.name}
              </span>
              <button
                type="button"
                onClick={() => setPreviewModalImage(null)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold px-2 py-1"
              >
                ✕ إغلاق
              </button>
            </div>
            <div className="p-4 flex-1 overflow-auto flex items-center justify-center bg-slate-100/60 min-h-[300px]">
              <img
                src={previewModalImage.dataUrl}
                alt={previewModalImage.name}
                style={{
                  transform: `rotate(${previewModalImage.rotation}deg)`,
                }}
                className="max-h-[70vh] max-w-full object-contain rounded-lg shadow-sm"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
