/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Image as ImageIcon,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Zap,
  Lock,
  Layers,
} from 'lucide-react';
import { ToolMode, ConvertedHistoryItem } from './types';
import { Navbar } from './components/Navbar';
import { ImagesToPdfConverter } from './components/ImagesToPdfConverter';
import { WordToPdfConverter } from './components/WordToPdfConverter';
import { ConversionHistory } from './components/ConversionHistory';
import { FeaturesGuide } from './components/FeaturesGuide';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { PrivacyPolicyModal } from './components/PrivacyPolicyModal';
import { TermsOfServiceModal } from './components/TermsOfServiceModal';

export default function App() {
  const [currentMode, setCurrentMode] = useState<ToolMode>('images-to-pdf');
  const [history, setHistory] = useState<ConvertedHistoryItem[]>([]);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const handleConversionSuccess = (item: ConvertedHistoryItem) => {
    setHistory((prev) => [item, ...prev]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans selection:bg-rose-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={setCurrentMode}
        convertedCount={history.length}
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Hero Section with Quick Mode Switch */}
        <section className="text-center pt-4 pb-2 space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>محول رقمي ذكي وسريع • بدون حدود أو علامات مائية</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            {currentMode === 'images-to-pdf' ? (
              <>
                تحويل <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600">الصور المتعددة</span> إلى ملف PDF
              </>
            ) : (
              <>
                تحويل <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">مستندات Word</span> إلى ملف PDF
              </>
            )}
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {currentMode === 'images-to-pdf'
              ? 'اجمع ورتّب صورك (JPG, PNG, WebP) واضبط الهوامش والاتجاه والجودة وحوّلها في ثوانٍ إلى ملف PDF موحد عالي الدقة، دون رفعها لأي خادم خارجي.'
              : 'حوّل مستندات Word (DOCX) إلى ملفات PDF منسقة بدقة واحترافية عالية مع الحفاظ على الخطوط العربية والجداول والفقرات، مع إمكانية المعاينة قبل التحميل.'}
          </p>

          {/* Quick Tool Selector Pills in Hero */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setCurrentMode('images-to-pdf')}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                currentMode === 'images-to-pdf'
                  ? 'bg-rose-600 text-white shadow-rose-500/25 ring-2 ring-rose-600/30 ring-offset-2'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>تحويل الصور إلى PDF</span>
            </button>
            <button
              type="button"
              onClick={() => setCurrentMode('word-to-pdf')}
              className={`px-5 py-3 rounded-2xl font-bold text-sm transition-all shadow-sm flex items-center gap-2 cursor-pointer ${
                currentMode === 'word-to-pdf'
                  ? 'bg-blue-600 text-white shadow-blue-500/25 ring-2 ring-blue-600/30 ring-offset-2'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>تحويل وورد (DOCX) إلى PDF</span>
            </button>
          </div>
        </section>

        {/* Active Tool Workspace */}
        <section className="transition-all duration-300">
          {currentMode === 'images-to-pdf' ? (
            <ImagesToPdfConverter onConversionSuccess={handleConversionSuccess} />
          ) : (
            <WordToPdfConverter onConversionSuccess={handleConversionSuccess} />
          )}
        </section>

        {/* Session Conversion History */}
        <ConversionHistory items={history} onClear={handleClearHistory} />

        {/* Feature Cards */}
        <FeaturesGuide />

        {/* FAQ Section */}
        <FaqSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacyPolicy={() => setIsPrivacyModalOpen(true)}
        onOpenTermsOfService={() => setIsTermsModalOpen(true)}
      />

      {/* Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Terms of Service Modal */}
      <TermsOfServiceModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
      />
    </div>
  );
}
