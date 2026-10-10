import React from 'react';
import { X, FileText, CheckCircle, AlertCircle, Scale, ShieldAlert } from 'lucide-react';

interface TermsOfServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsOfServiceModal: React.FC<TermsOfServiceModalProps> = ({ isOpen, onClose }) => {
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
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">شروط الاستخدام (Terms of Service)</h2>
              <p className="text-xs text-slate-500 font-medium">
                آخر تحديث: {new Date().toLocaleDateString('ar-SA')} • القواعد والأحكام المنظمة للخدمة
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
          {/* Brief Banner */}
          <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm text-blue-900 leading-relaxed">
              <strong>اتفاقية واضحة ومباشرة:</strong> خدمة <strong>DocuMorph PDF</strong> مجانية ومصممة لمساعدتك على تحويل وتنظيم مستنداتك وصورك بأمان فوري. استخدامك للموقع يعني موافقتك على الشروط الواردة في هذه الوثيقة.
            </div>
          </div>

          {/* Section 1 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              1. الموافقة على الشروط
            </h3>
            <p>
              من خلال الوصول إلى موقع <strong>DocuMorph PDF</strong> أو استخدامه، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بشروط الاستخدام هذه وبسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على أي جزء من هذه الشروط، فيرجى عدم استخدام خدماتنا.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              2. وصف الخدمة
            </h3>
            <p>
              يقدم موقعنا أدوات مجانية عبر الويب لتحويل ملفات مايكروسوفت وورد (DOCX) ومختلف صيغ الصور (JPG, PNG, WebP وغيرها) إلى صيغة مستندات PDF. تتم جميع عمليات التحويل مباشرة على جهاز المستخدم من خلال متصفح الويب (Client-Side) دون تحميل الملفات على أي خوادم خارجية.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              3. حقوق الملكية الفكرية ومحتوى المستخدم
            </h3>
            <ul className="list-disc list-inside space-y-1.5 pr-2 text-slate-600">
              <li>
                <strong>ملكية ملفاتك:</strong> تظل أنت المالك الحصري لجميع حقوق الطبع والنشر والملكية الفكرية للمستندات والصور التي تقوم بتحويلها عبر الموقع. لا نطالب بأي حقوق ملكية في أي من ملفاتك.
              </li>
              <li>
                <strong>ملكية الموقع:</strong> جميع التصاميم، الشعارات، البرمجيات، والأكواد المصدرية لموقع DocuMorph PDF هي ملك للموقع ومحمية بموجب قوانين الملكية الفكرية المعمول بها.
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              4. الاستخدام المقبول والمحظورات
            </h3>
            <p>
              يوافق المستخدم على استخدام الخدمة للأغراض المشروعة فقط، ويتعهد بعدم:
            </p>
            <ul className="list-disc list-inside space-y-1 pr-2 text-slate-600">
              <li>استخدام الخدمة لمعالجة أي محتوى غير قانوني أو ضار أو تشهيري أو ينتهك حقوق الآخرين.</li>
              <li>محاولة تعطيل أو التحميل الزائد على البنية التحتية للموقع أو شن هجمات حجب الخدمة.</li>
              <li>استخدام أي برامج روبوتية أو أدوات استخراج آلية لاستغلال الموقع بشكل يتعارض مع أهدافه العادية.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              5. إخلاء المسؤولية عن الضمانات (Disclaimer of Warranties)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              تُقدم الخدمة على أساس &quot;كما هي&quot; (AS IS) و &quot;كما هي متاحة&quot; (AS AVAILABLE) دون أي ضمانات من أي نوع، سواء كانت صريحة أو ضمنية. نحن نبذل قصارى جهدنا لضمان دقة واستقرار تحويل المستندات، ولكننا لا نضمن أن الخدمة ستكون خالية من الأخطاء تماماً أو متوافقة مع كافة أنواع التنسيقات غير القياسية.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              6. حدود المسؤولية (Limitation of Liability)
            </h3>
            <p>
              إلى أقصى حد يسمح به القانون المعمول به، لا يتحمل الموقع أو القائمون عليه أي مسؤولية عن أي أضرار مباشرة أو غير مباشرة أو تبعية أو خسارة بيانات قد تنشأ عن استخدامك للخدمة أو عدم قدرتك على استخدامها.
            </p>
          </section>

          {/* Section 7 */}
          <section className="space-y-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              7. إعلانات ومواقع الطرف الثالث
            </h3>
            <p>
              قد يعرض الموقع إعلانات مقدمة من أطراف ثالثة مثل شبكة Google AdSense، أو روابط لمواقع خارجية. نحن لسنا مسؤولين عن محتوى أو سياسات أو ممارسات أي مواقع أو خدمات تابعة لأطراف ثالثة.
            </p>
          </section>

          {/* Section 8 */}
          <section className="space-y-2 pt-2 border-t border-slate-100">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              8. تعديل الشروط
            </h3>
            <p>
              نحتفظ بالحق في تحديث أو تعديل شروط الاستخدام هذه في أي وقت دون إشعار مسبق. يسري مفعول أي تعديلات فور نشرها على هذه الصفحة. استمرار استخدامك للموقع بعد أي تعديل يُعد موافقة صريحة على الشروط الجديدة.
            </p>
          </section>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            DocuMorph PDF • اتفاقية الاستخدام والشروط
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors cursor-pointer"
          >
            موافق وقبول الشروط
          </button>
        </div>
      </div>
    </div>
  );
};
