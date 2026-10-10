import React from 'react';
import { FileText, Shield, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 mt-16 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <span className="font-black text-slate-800 text-base font-sans">DocuMorph PDF</span>
            <span className="text-xs text-slate-400 block">أداة تحويل وورد وصور إلى PDF فائقة الخصوصية</span>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs font-semibold text-slate-500">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>معالجة داخل المتصفح بنسبة 100%</span>
          </span>
          <span>•</span>
          <span>بدون علامات مائية</span>
          <span>•</span>
          <span>مجاني وغير محدود</span>
        </div>

        <p className="text-xs text-slate-400">
          © {new Date().getFullYear()} جميع الحقوق محفوظة
        </p>
      </div>
    </footer>
  );
};
