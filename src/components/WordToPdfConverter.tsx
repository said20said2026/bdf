import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  UploadCloud,
  Sparkles,
  Download,
  Eye,
  CheckCircle2,
  RefreshCw,
  Sliders,
  FileCheck2,
  Trash2,
  AlertCircle,
  FileCode,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { DocxFileItem, DocxToPdfOptions, ConvertedHistoryItem } from '../types';
import { renderDocxToContainer, convertDocxToPdf } from '../utils/docxToPdf';
import { generateSampleDocx } from '../utils/sampleFiles';

interface WordToPdfConverterProps {
  onConversionSuccess: (item: ConvertedHistoryItem) => void;
}

export const WordToPdfConverter: React.FC<WordToPdfConverterProps> = ({ onConversionSuccess }) => {
  const [activeFile, setActiveFile] = useState<File | null>(null);
  const [fileDetails, setFileDetails] = useState<{ name: string; size: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressStep, setProgressStep] = useState('');
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Conversion options
  const [options, setOptions] = useState<DocxToPdfOptions>({
    pageSize: 'a4',
    orientation: 'portrait',
    margins: 'normal',
    outputFileName: 'DocuMorph_Document.pdf',
    addPageNumbers: true,
  });

  // Converted result
  const [convertedResult, setConvertedResult] = useState<{
    url: string;
    size: number;
    pageCount: number;
    fileName: string;
    blob: Blob;
  } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load and render docx file
  const handleSelectFile = async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.docx')) {
      alert('يرجى اختيار ملف وورد بصيغة DOCX (.docx)');
      return;
    }

    setActiveFile(file);
    setFileDetails({ name: file.name, size: file.size });
    setConvertedResult(null);
    setIsParsing(true);
    setProgress(15);
    setProgressStep('جاري قراءة وتنسيق محتوى ملف وورد...');

    // Set default output file name
    const baseName = file.name.replace(/\.[^/.]+$/, '');
    setOptions((prev) => ({
      ...prev,
      outputFileName: `${baseName}.pdf`,
    }));

    setTimeout(async () => {
      if (previewContainerRef.current) {
        try {
          await renderDocxToContainer(file, previewContainerRef.current);
          setIsParsing(false);
        } catch (err: any) {
          console.error(err);
          setIsParsing(false);
          alert('تعذر قراءة المستند: ' + (err.message || 'خطأ في بنية الملف'));
        }
      }
    }, 100);
  };

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
      handleSelectFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleSelectFile(e.target.files[0]);
    }
  };

  const handleLoadSample = async () => {
    const sample = await generateSampleDocx();
    await handleSelectFile(sample);
  };

  const handleConvert = async () => {
    if (!activeFile) return;

    setIsConverting(true);
    setProgress(10);
    setProgressStep('بدء معالجة وتحويل صفحات المستند...');

    try {
      const result = await convertDocxToPdf(
        activeFile,
        options,
        (prog, step) => {
          setProgress(prog);
          setProgressStep(step);
        }
      );

      const fileName = options.outputFileName.trim().endsWith('.pdf')
        ? options.outputFileName.trim()
        : `${options.outputFileName.trim() || 'DocuMorph_Document'}.pdf`;

      const resultPayload = {
        url: result.url,
        size: result.size,
        pageCount: result.pageCount,
        fileName,
        blob: result.blob,
      };

      setConvertedResult(resultPayload);

      // Trigger confetti
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore
      }

      // Add to session history
      onConversionSuccess({
        id: `docx-${Date.now()}`,
        fileName,
        fileSize: result.size,
        pageCount: result.pageCount,
        type: 'word',
        createdAt: new Date(),
        blob: result.blob,
        downloadUrl: result.url,
      });
    } catch (err: any) {
      alert(`حدث خطأ أثناء إنشاء PDF: ${err.message || 'خطأ غير معروف'}`);
    } finally {
      setIsConverting(false);
    }
  };

  const handleClear = () => {
    setActiveFile(null);
    setFileDetails(null);
    setConvertedResult(null);
    if (previewContainerRef.current) {
      previewContainerRef.current.innerHTML = '';
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-8">
      {/* Upload Zone when no active file */}
      {!activeFile ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-3 border-dashed rounded-3xl p-8 sm:p-14 text-center cursor-pointer transition-all duration-300 ${
            isDragging
              ? 'border-blue-500 bg-blue-50/60 scale-[1.01]'
              : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50/50'
          } shadow-sm shadow-slate-100 flex flex-col items-center justify-center min-h-[380px]`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            className="hidden"
            onChange={handleFileInputChange}
          />
          <div className="w-20 h-20 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 shadow-md shadow-blue-100 group-hover:scale-110 transition-transform">
            <FileText className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-800 mb-2">
            اسحب وأفلت مستند Word (DOCX) هنا، أو انقر للاختيار
          </h3>
          <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
            تحويل كامل مع الحفاظ على التنسيقات، الخطوط العربية، الجداول، العناوين، والصور بجودة فائقة وبخصوصية تامة داخل متصفحك.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/25 transition-all flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>اختيار ملف Word من جهازك</span>
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleLoadSample();
              }}
              className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>جرّب مستند وورد تجريبي جاهز</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Main Document Viewer (Col 8) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Header Toolbar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm sm:text-base truncate max-w-xs sm:max-w-md" title={fileDetails?.name}>
                    {fileDetails?.name}
                  </h4>
                  <p className="text-xs text-slate-500 font-medium">
                    الحجم: {fileDetails ? formatBytes(fileDetails.size) : ''} • صيغة Microsoft Word DOCX
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowLivePreview(!showLivePreview)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                    showLivePreview
                      ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : 'bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{showLivePreview ? 'إخفاء المعاينة' : 'عرض المعاينة'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>تغيير الملف</span>
                </button>
              </div>
            </div>

            {/* Document Render Container */}
            <div className="relative">
              {isParsing && (
                <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center p-8 text-center min-h-[300px]">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mb-3" />
                  <p className="font-bold text-slate-800 text-sm">جاري معالجة مستند وورد وعرض الصفحات...</p>
                  <p className="text-xs text-slate-500 mt-1">يتم الحفاظ على التنسيقات العربية والخطوط بالكامل</p>
                </div>
              )}

              {/* Real docx-preview DOM mount node */}
              <div
                className={`bg-slate-200/50 p-4 sm:p-8 rounded-3xl border border-slate-200/80 overflow-x-auto max-h-[750px] overflow-y-auto ${
                  !showLivePreview ? 'hidden' : ''
                }`}
              >
                <div
                  ref={previewContainerRef}
                  className="docx-render-target flex flex-col items-center justify-center mx-auto"
                />
              </div>

              {!showLivePreview && (
                <div className="bg-white p-8 rounded-3xl border border-slate-200 text-center text-slate-500">
                  <p className="text-sm font-semibold">المعاينة مخفية لتسريع التصفح. محتوى المستند جاهز للتحويل إلى PDF في القائمة الجانبية.</p>
                </div>
              )}
            </div>
          </div>

          {/* Settings & Execution Panel (Col 4) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-6">
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <Sliders className="w-5 h-5 text-blue-600" />
                <h3 className="font-extrabold text-slate-800 text-lg">إعدادات ملف PDF الناتج</h3>
              </div>

              {/* Page Format */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">حجم الورقة القياسي:</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'a4', label: 'A4 (210×297 مم)' },
                    { id: 'letter', label: 'US Letter' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setOptions({ ...options, pageSize: s.id as any })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        options.pageSize === s.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
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
                <label className="text-xs font-bold text-slate-700 block">اتجاه المستند:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, orientation: 'portrait' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      options.orientation === 'portrait'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    عمودي (Portrait)
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptions({ ...options, orientation: 'landscape' })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                      options.orientation === 'landscape'
                        ? 'border-blue-600 bg-blue-50 text-blue-700'
                        : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    أفقي (Landscape)
                  </button>
                </div>
              </div>

              {/* Margins */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 block">الهوامش الجانبية:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'normal', label: 'قياسية' },
                    { id: 'compact', label: 'مدمجة' },
                    { id: 'none', label: 'بدون' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setOptions({ ...options, margins: m.id as any })}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        options.margins === m.id
                          ? 'border-blue-600 bg-blue-50 text-blue-700'
                          : 'border-slate-200 bg-slate-50/60 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page numbers toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-xs font-bold text-slate-700">ترقيم الصفحات أسفل المستند:</span>
                <input
                  type="checkbox"
                  checked={options.addPageNumbers}
                  onChange={(e) => setOptions({ ...options, addPageNumbers: e.target.checked })}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
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
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-sans focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    placeholder="DocuMorph_Document.pdf"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold pointer-events-none">
                    .pdf
                  </span>
                </div>
              </div>

              {/* Conversion progress */}
              {isConverting && (
                <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 space-y-2 animate-pulse">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-800">
                    <span>{progressStep}</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-blue-200/60 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Convert Button */}
              <button
                type="button"
                disabled={isConverting || isParsing}
                onClick={handleConvert}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
              >
                {isConverting ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>جاري توليد ملف PDF...</span>
                  </>
                ) : (
                  <>
                    <FileCheck2 className="w-5 h-5" />
                    <span>تحويل وورد إلى PDF الآن</span>
                  </>
                )}
              </button>
            </div>

            {/* Download Card */}
            {convertedResult && (
              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white p-6 rounded-3xl shadow-xl shadow-emerald-500/20 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-base">اكتمل تحويل المستند بنجاح!</h4>
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
                    <span>تحميل ملف PDF</span>
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
    </div>
  );
};
