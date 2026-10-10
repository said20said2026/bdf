import React from 'react';
import { ShieldCheck, Zap, Layers, Sparkles, SlidersHorizontal, Lock } from 'lucide-react';

export const FeaturesGuide: React.FC = () => {
  const features = [
    {
      icon: <Lock className="w-6 h-6 text-rose-600" />,
      bg: 'bg-rose-50',
      title: 'أمان وخصوصية 100%',
      desc: 'المعالجة تتم بالكامل داخل متصفح جهازك. لا يتم رفع أي مستند أو صورة إلى أي خادم خارجي على الإطلاق.',
    },
    {
      icon: <Zap className="w-6 h-6 text-amber-500" />,
      bg: 'bg-amber-50',
      title: 'تحويل فوري بدون انتظار',
      desc: 'سرعة تحويل فائقة تنجز صفحاتك وصورك في ثوانٍ معدودة دون تأخير طوابير الرفع والإنترنت.',
    },
    {
      icon: <Layers className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50',
      title: 'دعم كامل للغة العربية',
      desc: 'يحافظ على اتجاه النصوص من اليمين لليسار (RTL)، الخطوط العربية المتنوعة، الجداول، والعناوين.',
    },
    {
      icon: <SlidersHorizontal className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50',
      title: 'خيارات تحكم وتخصيص',
      desc: 'تحكم في حجم الورق (A4 أو Letter)، الهوامش، اتجاه الصفحة، ضغط الجودة، وترقيم الصفحات تلقائياً.',
    },
  ];

  return (
    <section className="py-8">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
          لماذا تختار محول DocuMorph PDF؟
        </h2>
        <p className="text-slate-600 text-sm leading-relaxed">
          حل متكامل واحترافي لتحويل مستنداتك الرقمية وصورك بكل سهولة وموثوقية
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((f, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col items-start"
          >
            <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-4`}>
              {f.icon}
            </div>
            <h3 className="font-extrabold text-base text-slate-900 mb-2">{f.title}</h3>
            <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};
