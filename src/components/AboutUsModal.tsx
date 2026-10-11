import React from 'react';
import { X, Users, Target, ShieldCheck, Zap, Sparkles, Heart, CheckCircle2 } from 'lucide-react';

interface AboutUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutUsModal: React.FC<AboutUsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">من نحن (About Us)</h2>
              <p className="text-xs text-slate-500 font-medium">
                تعرف على قصة ورؤية منصة DocuMorph PDF لتحويل المستندات
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-sm text-slate-700 leading-relaxed font-sans">
          {/* Hero Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-amber-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>رؤيتنا ورسالتنا الرقمية</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              أدوات تحويل احترافية تحترم خصوصيتك وسرية بياناتك بنسبة 100%
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
              تأسست <strong>DocuMorph PDF</strong> لتكون المنصة العربية الرائدة في معالجة وتحويل مستندات Word والصور إلى صيغة PDF مباشرة في متصفحك، دون الحاجة لرفع ملفاتك الخاصة إلى أي خادم خارجي.
            </p>
          </div>

          {/* Section: Who We Are */}
          <section className="space-y-3">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              من نحن؟
            </h3>
            <p>
              نحن فريق من المطورين والمهندسين الشغوفين ببناء حلول برمجية ذكية وسهلة الاستخدام عبر الويب. لاحظنا أن معظم خدمات تحويل ملفات Word والصور إلى PDF تتطلب رفع المستندات إلى سيرفرات بعيدة، مما يشكل خطراً حقيقياً على خصوصية وسرية العقود، الفواتير، الصور العائلية، والوثائق الحساسة.
            </p>
            <p>
              لذلك قررنا بناء <strong>DocuMorph PDF</strong> بالاعتماد على أحدث تقنيات المعالجة المحلية من جانب العميل (Client-Side Web Technologies)، لتمكين أي مستخدم في العالم من تحويل ملفاته في أجزاء من الثانية وبأعلى درجات الأمان.
            </p>
          </section>

          {/* Section: Core Pillars */}
          <section className="space-y-4">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              قيمنا وركائزنا الأساسية
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-2">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">الخصوصية أولاً ودائماً</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  ملفاتك لا تغادر جهازك أبداً. كل عمليات المعالجة والتقطيع والتوليد تتم في ذاكرة متصفحك وتختفي فور إغلاق الصفحة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">سرعة فائقة وخفة</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  لا مزيد من الانتظار لرفع الملفات الضخمة أو بطء شبكة الإنترنت؛ التحويل فوري وينتهي في ثوانٍ معدودة.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-2">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">دقة متناهية ودعم كامل للعربية</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  اهتمام خاص باتجاه النصوص من اليمين لليسار (RTL)، وتنسيقات الجداول، والخطوط العربية، وحفظ جودة الصور العالية.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-2">
                  <Heart className="w-4 h-4" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">مجانية ونظيفة بالكامل</h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  بدون اشتراكات مدفوعة، بدون علامات مائية على ملفاتك، وبدون قيود تعسفية على عدد الصفحات أو عدد التحويلات.
                </p>
              </div>
            </div>
          </section>

          {/* Section: Future Vision */}
          <section className="space-y-3 pt-2 border-t border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              التطوير المستمر
            </h3>
            <p>
              نعمل بشكل متواصل على إضافة أدوات وميزات جديدة تلبي احتياجات الطلاب، الباحثين، الشركات، والمستخدمين اليوميين، مع الالتزام الصارم بأعلى معايير جودة الكود، أمن المعلومات، وسياسات الشفافية المعلنة.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            DocuMorph PDF • نسعى لتقديم أفضل تجربة رقمية
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
