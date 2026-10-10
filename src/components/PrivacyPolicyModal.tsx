import React from 'react';
import { X, Shield, Lock, Eye, FileText, Globe, CheckCircle } from 'lucide-react';

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({ isOpen, onClose }) => {
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
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">سياسة الخصوصية (Privacy Policy)</h2>
              <p className="text-xs text-slate-500 font-medium">
                آخر تحديث: {new Date().toLocaleDateString('ar-SA')} • متوافقة مع معايير Google AdSense
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
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed font-sans">
          {/* Summary Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-emerald-900 leading-relaxed">
              <strong>ضمان الخصوصية المطلق:</strong> نحن في <strong>DocuMorph PDF</strong> نؤمن بأن مستنداتك وصورك ملك خاص لك وحدك. يتم تحويل ملفات Word وصورك بالكامل داخل متصفح جهازك (Client-Side)، ولا يتم رفعها أو تخزينها أو الاطلاع عليها عبر أي خادم خارجي نهائياً.
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              1. مقدمة ونطاق السياسة
            </h3>
            <p>
              أهلاً بكم في موقع <strong>DocuMorph PDF</strong>. توضح سياسة الخصوصية هذه كيفية تعاملنا مع البيانات والمعلومات عند استخدامكم لخدماتنا الإلكترونية لتحويل ملفات وورد (DOCX) والصور (JPG, PNG, WebP) إلى ملفات PDF. باستخدامك للموقع، فإنك توافق على الممارسات الموضحة في هذه السياسة.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              2. معالجة الملفات والمستندات (عدم التخزين)
            </h3>
            <p>
              تعتمد أداتنا تقنية المعالجة المحلية من جانب العميل بنسبة 100%:
            </p>
            <ul className="list-disc list-inside space-y-1 pr-2 text-slate-600">
              <li>لا يتم رفع ملفات Word أو الصور أو ملفات PDF الناتجة إلى أي سيرفرات أو قواعد بيانات سحابية.</li>
              <li>تتم قراءة المستندات ومعالجتها حصرياً في ذاكرة التخزين العشوائي المؤقتة لمتصفح الإنترنت بجهازك.</li>
              <li>بمجرد إغلاق علامة تبويب المتصفح أو مسح الصفحة، يتم حذف كافة البيانات المؤقتة تلقائياً من جهازك.</li>
            </ul>
          </section>

          {/* Section 3: AdSense & Cookies */}
          <section className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Globe className="w-4 h-4 text-blue-600" />
              3. إعلانات Google وملفات تعريف الارتباط (Google AdSense & Cookies)
            </h3>
            <p>
              يستخدم موقعنا خدمة الإعلانات من <strong>Google AdSense</strong> لعرض الإعلانات عند زيارتكم لموقعنا:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pr-2 text-slate-600">
              <li>
                <strong>ملف تعريف الارتباط DoubleClick DART:</strong> تستخدم Google ملفات تعريف الارتباط لعرض الإعلانات للمستخدمين استناداً إلى زياراتهم السابقة لموقعنا أو لمواقع أخرى على شبكة الإنترنت.
              </li>
              <li>
                يجوز لموردي الجهات الخارجية، بما في ذلك Google، استخدام ملفات تعريف الارتباط لعرض الإعلانات بناءً على اهتمامات المستخدم وسجل التصفح غير الشخصي.
              </li>
              <li>
                <strong>إلغاء الاشتراك:</strong> يمكن للمستخدمين إلغاء الاشتراك في الإعلانات المخصصة عن طريق زيارة{' '}
                <a
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-bold"
                >
                  إعدادات إعلانات Google (Google Ads Settings)
                </a>{' '}
                أو عبر زيارة الموقع الخارجي{' '}
                <a
                  href="https://www.aboutads.info"
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline font-bold"
                >
                  www.aboutads.info
                </a>.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              4. ملفات السجل القياسية (Log Files)
            </h3>
            <p>
              مثل معظم مواقع الويب، يتبع موقعنا نظاماً قياسياً لتسجيل الزيارات مجهولة المصدر لأغراض التحليل الإحصائي وتحسين تجربة المستخدم، ويشمل ذلك: نوع المتصفح، نظام التشغيل، عنوان بروتوكول الإنترنت (IP)، ووقت وتاريخ الزيارة. هذه البيانات لا ترتبط بأي هوية شخصية ولا تُستخدم لتحديد هوية المستخدم الفردية.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              5. خصوصية الأطفال (COPPA)
            </h3>
            <p>
              حماية خصوصية الأطفال عبر الإنترنت أمر بالغ الأهمية بالنسبة لنا. نحن لا نجمع عن عمد أي معلومات تعريف شخصية من أطفال دون سن 13 عاماً. إذا كان لديك سبب للاعتقاد بأن طفلاً قدم لنا معلومات شخصية، يرجى التواصل معنا لحذفها على الفور.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              6. تحديثات سياسة الخصوصية
            </h3>
            <p>
              قد نقوم بتحديث سياسة الخصوصية من وقت لآخر لمواكبة التحديثات التقنية أو التنظيمية. سيتم نشر أي تغييرات في هذه الصفحة، وندعوكم لمراجعة هذه السياسة دورياً للاطلاع على أي مستجدات.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500"></span>
              7. التواصل والاستفسارات
            </h3>
            <p>
              إذا كانت لديكم أي أسئلة أو استفسارات بخصوص سياسة الخصوصية أو ممارسات موقعنا، يمكنكم التواصل معنا عبر البريد الإلكتروني الرسمي.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            DocuMorph PDF • حماية الخصوصية الرقمية
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            فهمت وموافق
          </button>
        </div>
      </div>
    </div>
  );
};
