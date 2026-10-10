import React from 'react';
import { FileText, Image as ImageIcon, ShieldCheck, Sparkles } from 'lucide-react';
import { ToolMode } from '../types';

interface NavbarProps {
  currentMode: ToolMode;
  onSelectMode: (mode: ToolMode) => void;
  convertedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({ currentMode, onSelectMode, convertedCount }) => {
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-rose-600 via-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-500/20">
            <FileText className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans">DocuMorph</span>
              <span className="px-2 py-0.5 text-[11px] font-bold rounded-full bg-rose-100 text-rose-700">PDF Pro</span>
            </div>
            <p className="text-xs text-slate-500 font-medium hidden sm:block">
              محول وورد وصور إلى PDF فائق السرعة والأمان
            </p>
          </div>
        </div>

        {/* Mode switcher tabs */}
        <nav className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
          <button
            type="button"
            onClick={() => onSelectMode('images-to-pdf')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              currentMode === 'images-to-pdf'
                ? 'bg-white text-rose-600 shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>الصور إلى PDF</span>
          </button>
          <button
            type="button"
            onClick={() => onSelectMode('word-to-pdf')}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-200 ${
              currentMode === 'word-to-pdf'
                ? 'bg-white text-blue-600 shadow-sm shadow-slate-200'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>وورد إلى PDF</span>
          </button>
        </nav>

        {/* Privacy badge */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>خصوصية 100% بدون خوادم</span>
        </div>
      </div>
    </header>
  );
};
