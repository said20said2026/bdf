import React from 'react';
import { FileText, Shield, Lock } from 'lucide-react';

interface FooterProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTermsOfService: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyPolicy, onOpenTermsOfService }) => {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 mt-16 text-slate-500 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-slate-800 text-base font-sans">DocuMorph PDF</span>
              <span className="text-xs text-slate-400 block">أداة تحويل وورد وصور إلى PDF فائقة السرعة والأمان</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-5 text-xs font-semibold text-slate-600">
            <button
              type="button"
              onClick={onOpenPrivacyPolicy}
              className="text-slate-700 hover:text-rose-600 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span>سياسة الخصوصية</span>
            </button>
            <span className="text-slate-300">•</span>
            <button
              type="button"
              onClick={onOpenTermsOfService}
              className="text-slate-700 hover:text-blue-600 font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <FileText className="w-3.5 h-3.5 text-blue-500" />
              <span>شروط الاستخدام</span>
            </button>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1 text-emerald-700">
              <Lock className="w-3.5 h-3.5 text-emerald-500" />
              <span>معالجة داخل المتصفح 100%</span>
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p>
            © {new Date().getFullYear()} DocuMorph PDF - جميع الحقوق محفوظة
          </p>
          <p>
            متوافق مع معايير الأمان وخصوصية المستخدم وإعلانات Google AdSense
          </p>
        </div>
      </div>
    </footer>
  );
};

