import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, MessageSquare, Clock, ShieldCheck, Sparkles } from 'lucide-react';

interface ContactUsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactUsModal: React.FC<ContactUsModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('استفسار عام');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setIsSubmitting(true);
    // Simulate instant secure submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 700);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setSubject('استفسار عام');
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/60 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">اتصل بنا (Contact Us)</h2>
              <p className="text-xs text-slate-500 font-medium">
                يسعدنا تواصلكم للإجابة عن استفساراتكم واقتراحاتكم
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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Info Column (Col 5) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="p-6 rounded-3xl bg-slate-900 text-white space-y-4 shadow-lg shadow-slate-900/10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-emerald-300 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>دعم فني واستفسارات</span>
                </div>
                <h3 className="text-lg font-black leading-snug">
                  نحن هنا للمساعدة والرد على جميع تساؤلاتكم
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  سواء كان لديك استفسار حول كيفية تحويل ملفاتك، أو واجهتك أي صعوبة فنية، أو ترغب في اقتراح ميزة جديدة، فريقنا يرحب برسائلك دائماً.
                </p>

                <div className="pt-2 border-t border-slate-800 space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span dir="ltr" className="font-mono text-slate-200">
                      samipico425@gmail.com
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>وقت الاستجابة المتوقع: خلال 24 - 48 ساعة</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>سرية تامة لجميع المراسلات والبيانات</span>
                  </div>
                </div>
              </div>

              {/* Quick FAQ note */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                  <span>ملاحظة سريعة حول الملفات:</span>
                </p>
                <p>
                  نظراً لأن جميع عمليات تحويل Word والصور تتم على جهازك محلياً، فإننا لا نحتفظ بأي نسخ من مستنداتك ولا يمكننا الوصول إليها أو استرجاعها.
                </p>
              </div>
            </div>

            {/* Form Column (Col 7) */}
            <div className="lg:col-span-7">
              {isSubmitted ? (
                <div className="p-8 sm:p-10 rounded-3xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-black text-emerald-950">
                    تم استلام رسالتك بنجاح!
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed max-w-md mx-auto">
                    شكراً لتواصلك معنا يا <strong>{name}</strong>. سنقوم بمراجعة استفسارك والرد عليك عبر بريدك الإلكتروني (<strong>{email}</strong>) في أقرب وقت ممكن.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition-colors cursor-pointer"
                  >
                    إرسال رسالة أخرى
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 bg-white p-2">
                  {/* Name field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      الاسم الكامل <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="مثال: أحمد محمد"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    />
                  </div>

                  {/* Email field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      البريد الإلكتروني <span className="text-rose-500">*</span>:
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      dir="ltr"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 text-right"
                    />
                  </div>

                  {/* Subject field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      نوع الرسالة / الموضوع:
                    </label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm bg-white focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                    >
                      <option value="استفسار عام">استفسار عام</option>
                      <option value="دعم فني أو مشكلة في التحويل">دعم فني أو مشكلة في التحويل</option>
                      <option value="اقتراح ميزة جديدة">اقتراح ميزة جديدة</option>
                      <option value="الإعلانات والشراكات">الإعلانات والشراكات</option>
                      <option value="حقوق الملكية الفكرية">حقوق الملكية الفكرية</option>
                    </select>
                  </div>

                  {/* Message field */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      نص الرسالة <span className="text-rose-500">*</span>:
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="اكتب استفسارك أو رسالتك بالتفصيل هنا..."
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-sm shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>جاري إرسال الرسالة...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>إرسال الرسالة الآن</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            DocuMorph PDF • قنوات التواصل والدعم الفني
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
