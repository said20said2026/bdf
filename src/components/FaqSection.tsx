import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'هل ملفاتي ومستنداتي آمنة ولا يتم حفظها على خوادم؟',
      a: 'نعم، 100%! تم تصميم هذا التطبيق ليعمل بتقنية المعالجة المحلية من طرف العميل (Client-Side). جميع ملفات Word والصور تظل في ذاكرة متصفح جهازك ولا ترسل إطلاقاً إلى أي سيرفر خارجي، مما يضمن أقصى معايير السرية والأمان للمستندات الحساسة.',
    },
    {
      q: 'ما هي صيغ الصور المدعومة لتحويلها إلى PDF؟',
      a: 'ندعم جميع صيغ الصور الشائعة بما في ذلك: JPG، JPEG، PNG، WebP، GIF، BMP، و SVG. يمكنك رفع عدة صور في نفس الوقت وترتيبها وتدويرها كما ترغب.',
    },
    {
      q: 'كيف يمكنني تحويل ملف Word (DOCX) إلى PDF مع الحفاظ على التنسيق؟',
      a: 'يقوم المحول بقراءة ملف DOCX بدقة عبر محرك معالجة متقدم يترجم الخطوط والجداول والفقرات والاتجاه العربي، مع إمكانية معاينة المستند مباشرة قبل تنزيل ملف PDF الناتج بجودة عالية.',
    },
    {
      q: 'هل توجد علامة مائية أو رسوم على التحميل؟',
      a: 'لا توجد أي علامات مائية على الإطلاق، والأداة مجانية بالكامل ومفتوحة دون قيود على عدد الصفحات أو عدد التحويلات اليومية.',
    },
    {
      q: 'كيف أتحكم في حجم وهوامش ملف PDF الناتج؟',
      a: 'من خلال لوحة الخيارات الجانبية، يمكنك تحديد حجم الورقة (A4 أو Letter أو مطابق للصورة)، واختيار الهوامش (بدون هوامش، هوامش صغيرة، أو هوامش متوسطة)، وتفعيل ترقيم الصفحات التلقائي.',
    },
  ];

  const toggle = (i: number) => {
    setOpenIndex(openIndex === i ? null : i);
  };

  return (
    <section className="py-8 border-t border-slate-200">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>مركز المساعدة والمعلومات</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
          الأسئلة الشائعة
        </h2>
        <p className="text-slate-600 text-sm">
          كل ما تحتاج معرفته حول تحويل المستندات والصور إلى PDF
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs transition-all"
          >
            <button
              type="button"
              onClick={() => toggle(i)}
              className="w-full p-5 text-right font-bold text-slate-800 text-sm sm:text-base flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/50"
            >
              <span>{item.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                  openIndex === i ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>
            {openIndex === i && (
              <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/40">
                {item.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};
