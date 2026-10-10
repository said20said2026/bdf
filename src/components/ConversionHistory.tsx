import React from 'react';
import { History, Download, Trash2, FileText, Image as ImageIcon, CheckCircle } from 'lucide-react';
import { ConvertedHistoryItem } from '../types';

interface ConversionHistoryProps {
  items: ConvertedHistoryItem[];
  onClear: () => void;
}

export const ConversionHistory: React.FC<ConversionHistoryProps> = ({ items, onClear }) => {
  if (items.length === 0) return null;

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <section className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-slate-700" />
          <h3 className="font-extrabold text-slate-800 text-base">سجل التحويلات الحديثة ({items.length})</h3>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="text-xs font-bold text-slate-500 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>مسح السجل</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex items-center justify-between gap-3 hover:bg-slate-100/70 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === 'image'
                    ? 'bg-rose-100 text-rose-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {item.type === 'image' ? (
                  <ImageIcon className="w-4 h-4" />
                ) : (
                  <FileText className="w-4 h-4" />
                )}
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-800 truncate" title={item.fileName}>
                  {item.fileName}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {item.pageCount} صفحة • {formatBytes(item.fileSize)}
                </p>
              </div>
            </div>

            <a
              href={item.downloadUrl}
              download={item.fileName}
              className="p-2 rounded-xl bg-white hover:bg-slate-200/80 text-slate-700 shadow-sm border border-slate-200 shrink-0 transition-colors"
              title="تحميل"
            >
              <Download className="w-4 h-4" />
            </a>
          </div>
        ))}
      </div>
    </section>
  );
};
