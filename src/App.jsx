/* ════════════════════════════════════════════════════════════════════════
   ⚠️ خطوة ضرورية خارج هذا الملف لحل مشكلة "الزوم عند فتح الصفحة الأولى":
   افتح ملف index.html (الذي يحمّل هذا التطبيق) وأضف هذا السطر داخل
   <head> — قبل تحميل أي سكربت:

     <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">

   الحقن عبر useEffect بالأسفل يبقى فقط كحماية احتياطية (fallback)، لكنه
   لا يمنع وميض الزوم الأول لأنه يعمل بعد أول رسم للصفحة من المتصفح.
   ════════════════════════════════════════════════════════════════════════ */

/* ════════════════════════════════════════════════════════════════════════
   📐 فهرس طوابق الملف — كل طابق مسؤول عن نوع واحد فقط من الكود.
   عند الإضافة مستقبلاً: حدّد أولاً أي طابق ينتمي له الكود الجديد بدل
   إضافته بأي مكان عشوائي بالملف.

   ┌─ الطابق 0 — STORAGE KEYS ............ مفاتيح التخزين المحلي
   ├─ الطابق 1 — HOOKS ..................... خطافات React عامة (responsive..)
   ├─ الطابق 2 — DESIGN TOKENS ............ الألوان (CL) + الحركة (ANIM)
   ├─ الطابق 3 — DATA TEMPLATES ........... قوالب بيانات ثابتة (تصنيفات، تفاعلات..)
   ├─ الطابق 4 — UTILITIES ................. دوال مساعدة عامة (لا تستخدم state)
   ├─ الطابق 5 — I18N STRINGS .............. كل نصوص الواجهة (عربي/إنجليزي)
   ├─ الطابق 6 — SEED DATA ................. بيانات تجريبية أولية
   └─ الطابق 7 — MAIN COMPONENT ............ المكوّن الرئيسي، ومقسّم داخلياً إلى:
        7.1 State              7.4 Logic/Handlers
        7.2 Effects            7.5 Shared Styles
        7.3 Derived data       7.6 Render Helpers → 7.7 JSX Return
   ════════════════════════════════════════════════════════════════════════ */

import { useState, useEffect, useRef } from "react";

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ أيقونات SVG — بديل مرسوم يدوياً لكل الإيموجي الوظيفية بالموقع.       │
   │ كل أيقونة مكوّن صغير يقبل size/color/strokeWidth عبر props، بدون أي  │
   │ اعتماد على مكتبة خارجية (lucide/react-icons) — أقرب لخط lucide شكلاً │
   │ (stroke فقط، بلا تعبئة) حتى تنسجم بصرياً مع بعضها.                   │
   └──────────────────────────────────────────────────────────────────────┘ */
const svgBase = (size, color, strokeWidth) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round",
});

const IconThumbsUp = ({ size = 15, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="M7 10v11" /><path d="M11 21h6.5a2 2 0 0 0 2-1.6l1.2-7A2 2 0 0 0 18.7 10H14V5a2 2 0 0 0-2-2l-3 7v11Z" />
  </svg>
);
const IconHandshake = ({ size = 15, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="m11 17 2 2a1 1 0 1 0 3-3" /><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
    <path d="m21 3 1 11h-2" /><path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" /><path d="M3 4h8" />
  </svg>
);
const IconHeart = ({ size = 15, color = "currentColor", strokeWidth = 2, filled = false }) => (
  <svg {...svgBase(size, color, strokeWidth)} fill={filled ? color : "none"}>
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);
const IconSparkles = ({ size = 15, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    <path d="M20 3v4" /><path d="M22 5h-4" /><path d="M4 17v2" /><path d="M5 18H3" />
  </svg>
);
const IconFlag = ({ size = 15, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><path d="M4 22v-7" />
  </svg>
);
const IconMessageCircle = ({ size = 15, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
  </svg>
);
const IconReply = ({ size = 15, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <polyline points="9 17 4 12 9 7" /><path d="M20 18v-2a4 4 0 0 0-4-4H4" />
  </svg>
);
const IconPencil = ({ size = 13, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /><path d="m15 5 4 4" />
  </svg>
);
const IconTrash = ({ size = 13, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);
const IconArrowRight = ({ size = 16, color = "currentColor", strokeWidth = 2.2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
  </svg>
);
const IconLock = ({ size = 12, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const IconUnlock = ({ size = 14, color = "currentColor", strokeWidth = 2 }) => (
  <svg {...svgBase(size, color, strokeWidth)}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 9.9-1" />
  </svg>
);
const REACTION_ICONS = {
  helpful: IconThumbsUp, agree: IconHandshake, relatable: IconHeart,
  inspiring: IconSparkles, flag: IconFlag,
};

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 0 — STORAGE KEYS                                              │
   └──────────────────────────────────────────────────────────────────────┘ */
const POSTS_KEY          = "inkore-posts-v5";
const LANG_KEY           = "inkore-lang-v5";
const OWNER_KEY          = "inkore-owner-v5";
const OWNED_REPLIES_KEY  = "inkore-owned-replies-v5";
const OWNED_COMMENTS_KEY = "inkore-owned-comments-v5";
const DEVICE_HASH_KEY    = "inkore-device-hash";
const BANNED_KEY         = "inkore-banned-devices";
const RATE_KEY           = "inkore-rate-limits";
const THEME_KEY          = "inkore-theme-pref"; // كان نصاً حرفياً مكرراً بمكانين، وُحِّد هنا كباقي المفاتيح

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 1 — HOOKS                                                     │
   └──────────────────────────────────────────────────────────────────────┘ */
// ── Responsive hook
// يرصد 3 مستويات: mobile (<640) / tablet (640-1024) / desktop (>1024)
// ويستخدم أيضاً media query (pointer: coarse) لاكتشاف أجهزة اللمس
// الكبيرة (مثل iPhone Pro Max بالوضع العمودي) التي قد يتجاوز عرضها 640px
//
// ── ملاحظة مهمة عن "وضع سطح المكتب" بمتصفحات الموبايل (كروم/سفاري):
// هذا الوضع يغيّر الـ User-Agent فقط ليوهم الموقع بأنه على جهاز مكتبي،
// لكنه لا يُغيّر بالضرورة window.innerWidth الفعلي لأن meta viewport
// (width=device-width) يبقى مطبّقاً في بعض الحالات — فكان القياس السابق
// يقرأ عرض الشاشة الحقيقي (مثلاً 360px) ويحكم عليه كـ mobile دائماً، حتى
// لو المستخدم فعّل "وضع سطح المكتب" فعلياً من قائمة المتصفح.
// الحل: استخدام document.documentElement.clientWidth بدل window.innerWidth
// فقط — فهو "عرض الـ layout viewport" الذي تُحسب عليه الصفحة فعلياً بعد
// تطبيق وضع سطح المكتب (يصبح ~980px أو أكثر)، بينما window.innerWidth قد
// يبقى صغيراً. نأخذ القيمة الأكبر بين الاثنين لضمان اكتشاف صحيح بكل الحالات.
const getBreakpoint = () => {
  if (typeof window === "undefined") return "desktop";
  const docW = document.documentElement?.clientWidth || 0;
  const w = Math.max(window.innerWidth || 0, docW);
  const isTouch = typeof window.matchMedia === "function"
    && window.matchMedia("(pointer: coarse)").matches;
  if (w < 640) return "mobile";
  if (w < 1024) return "tablet";
  // شاشة عريضة لكن تعمل باللمس بالكامل (هاتف كبير بالوضع العمودي) → نعاملها كموبايل
  // — باستثناء حالة "وضع سطح المكتب": هنا w سيكون كبيراً جداً (980px+) بفعل
  // تغيّر layout viewport فعلياً، وهذا سلوك مقصود من المستخدم يجب احترامه
  // كديسكتوب حقيقي، وليس مجرد هاتف بشاشة كبيرة.
  if (isTouch && w < 900) return "mobile";
  return "desktop";
};

const useBreakpoint = () => {
  const [bp, setBp] = useState(getBreakpoint);
  useEffect(() => {
    const handler = () => setBp(getBreakpoint());
    window.addEventListener("resize", handler);
    // ── "وضع سطح المكتب" لا يُطلق دائماً حدث resize فوراً عند التفعيل (لأن
    // عرض النافذة الفعلي window.innerWidth قد لا يتغيّر، بينما clientWidth
    // هو من يتغيّر). نضيف ResizeObserver على <html> لالتقاط هذا التغيّر
    // تحديداً، فيُعاد تقييم getBreakpoint حتى لو resize العادي لم يُطلق.
    let ro;
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(handler);
      ro.observe(document.documentElement);
    }
    return () => {
      window.removeEventListener("resize", handler);
      if (ro) ro.disconnect();
    };
  }, []);
  return bp; // "mobile" | "tablet" | "desktop"
};

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 2 — DESIGN TOKENS  (الألوان + قيم الحركة الموحّدة)            │
   └──────────────────────────────────────────────────────────────────────┘ */
// ── Palette
// نظام وراثي: بدل كائن ألوان ثابت واحد، عندنا قالبان كاملان بنفس المفاتيح
// تماماً (CL_DARK و CL_LIGHT). داخل المكوّن، يتم اختيار أحدهما حسب الثيم
// المفعّل ويُسمّى محلياً "CL" — فكل الاستخدامات بالملف (CL.bg, CL.text...)
// تبقى كما هي بدون أي تعديل، لكنها "ترث" قيمتها الفعلية من الثيم الحالي.
const CL_DARK = {
  bg:           "#1C1917",
  surface:      "#25211C",
  accent:       "#D97757",
  accentDim:    "rgba(217,119,87,0.11)",
  accentBorder: "rgba(217,119,87,0.27)",
  text:         "#EAE0D5",
  textSub:      "#8A7260",
  textMuted:    "#4A3F35",
  border:       "rgba(255,255,255,0.07)",
  borderFaint:  "rgba(255,255,255,0.04)",
  ok:           "#6BAE8A",
  okDim:        "rgba(107,174,138,0.09)",
  okBorder:     "rgba(107,174,138,0.2)",
  danger:       "#C0554A",
  dangerDim:    "rgba(192,85,74,0.12)",
  dangerBorder: "rgba(192,85,74,0.28)",
  edit:         "#7B9CD4",
  editDim:      "rgba(123,156,212,0.12)",
  editBorder:   "rgba(123,156,212,0.28)",
  flag:         "#E8B341",
  flagDim:      "rgba(232,179,65,0.12)",
  flagBorder:   "rgba(232,179,65,0.28)",
  reply:        "#A78BCC",
  replyDim:     "rgba(167,139,204,0.10)",
  replyBorder:  "rgba(167,139,204,0.25)",
};

// القالب النهاري: نفس المفاتيح حرفياً بنفس الترتيب، بقيم مناسبة لخلفية
// فاتحة — حافظنا على نفس ألوان accent/ok/danger/edit/flag/reply الأساسية
// قدر الإمكان (هوية بصرية واحدة) مع تعديل التباين فقط ليلائم الخلفية الفاتحة.
const CL_LIGHT = {
  bg:           "#FAF7F2",
  surface:      "#FFFFFF",
  accent:       "#C2603D",
  accentDim:    "rgba(194,96,61,0.10)",
  accentBorder: "rgba(194,96,61,0.30)",
  text:         "#2A2420",
  textSub:      "#6B5C4D",
  textMuted:    "#A89B8C",
  border:       "rgba(0,0,0,0.08)",
  borderFaint:  "rgba(0,0,0,0.045)",
  ok:           "#3F8462",
  okDim:        "rgba(63,132,98,0.10)",
  okBorder:     "rgba(63,132,98,0.25)",
  danger:       "#A8392F",
  dangerDim:    "rgba(168,57,47,0.10)",
  dangerBorder: "rgba(168,57,47,0.28)",
  edit:         "#43619A",
  editDim:      "rgba(67,97,154,0.10)",
  editBorder:   "rgba(67,97,154,0.28)",
  flag:         "#A87B1E",
  flagDim:      "rgba(168,123,30,0.12)",
  flagBorder:   "rgba(168,123,30,0.28)",
  reply:        "#7C5FA0",
  replyDim:     "rgba(124,95,160,0.10)",
  replyBorder:  "rgba(124,95,160,0.25)",
};

// ── Animation system: قيم موحّدة لكل الحركات بالموقع، بدل قيم متفرقة بكل عنصر.
// نفس فكرة CL (الألوان) وR (المقاسات) لكن لمتغيرات الحركة.
const ANIM = {
  // ── جميع المنحنيات الآن "فيزيائية" حقيقية (تسارع سريع + تباطؤ طبيعي
  // بالنهاية يحاكي احتكاك/كتلة حقيقية)، بدل "ease" العام اللي كان يحس
  // آلياً وجامداً. نفس منحنى Apple's "ease-out-expo" المستخدم بكل iOS.
  fast:   "0.12s cubic-bezier(0.22,1,0.36,1)",   // أزرار صغيرة، تبديل حالة لحظي (إعجاب، تبويب)
  normal: "0.2s cubic-bezier(0.22,1,0.36,1)",    // تغييرات أكبر (كرت، حدود، ألوان)
  sheet:  "0.3s cubic-bezier(0.32,0.72,0,1)",    // bottom sheet / مودالات (دخول وخروج)
  press:  "0.1s cubic-bezier(0.4,0,0.2,1)",      // داخل الضغط: سريع وحاد بدون ارتداد (ease-in-out)
  // ملاحظة: الارتداد (1.56 السابق) كان جيداً للـ scale الصعود (pop-in)
  // لكن للضغط النزول يُشعر بعدم الاستقرار — ease-in-out أدق فيزيائياً هنا.
  pressMs: 100,    // قيمة عددية مطابقة لـ press، تُستخدم بـ setTimeout قبل تنفيذ
                    // التنقل — تحت عتبة إدراك التأخير البشري (~100ms) فلا تُحس كبطء
  viewMs:  220,     // مدة دخول/خروج شاشة الثريد (انتقال كامل، ليس مجرد ضغطة زر)
};

// ── أنماط transition جاهزة، مكتوبة مرة واحدة هنا فقط.
// أي عنصر بالموقع يستخدم TRANSITIONS.colorChange بدل ما يكتب الجملة بنفسه —
// لو احتجنا نضيف خاصية أو نغيّر السرعة، نعدّل سطر واحد هنا وينعكس على كل الموقع تلقائياً.
// لو احتجت نمط جديد مختلف مستقبلاً (مثلاً نمط لتكبير الصور)، أضفه هنا بنفس الطريقة.
const TRANSITIONS = {
  // الأكثر استخدامًا: أزرار، تبويبات، كروت — أي عنصر يغيّر لونه عند hover/active/theme
  colorChange: `background-color ${ANIM.normal}, border-color ${ANIM.normal}, color ${ANIM.normal}`,

  // نفس colorChange لكن مع opacity و box-shadow إضافية (عناصر فيها ظل أو تبدّل شفافية)
  colorChangeExtended: `background ${ANIM.normal}, border-color ${ANIM.normal}, color ${ANIM.normal}, opacity ${ANIM.normal}, box-shadow ${ANIM.normal}`,

  // أثر الضغط بالحجم (كروت كبيرة فقط) — scale مناسب لعنصر بكتلة بصرية كافية
  press: `transform ${ANIM.press}`,

  // ضغط + ظل + شفافية (بطاقات تفاعلية كبيرة)
  pressShadow: `transform ${ANIM.press}, box-shadow ${ANIM.normal}, opacity ${ANIM.normal}`,
};

// ── سلّم نصف القطر (border-radius) الموحّد — قيم ثابتة لا تعتمد على isMobile/theme.
// نفس فكرة TRANSITIONS: تعريف بمكان واحد، استخدام بأي مكان عبر RADIUS.sm إلخ.
const RADIUS = {
  xs:   4,   // عناصر صغيرة جداً (مقبض bottom sheet مثلاً)
  sm:   8,   // أزرار صغيرة، شارات (badges)
  md:   10,  // أزرار عادية، تبويبات
  lg:   12,  // كروت ثانوية، حاويات
  pill: 20,  // أزرار على شكل كبسولة (تفاعلات، فلاتر)
  pillLg: 30, // كبسولة أكبر (نادرة الاستخدام)
  circle: "50%", // عناصر دائرية بالكامل (صور البروفايل، سبينر التحميل)
  sheetTop: "20px 20px 0 0", // الحافة العلوية لـ bottom sheet فقط
};
// ملاحظة: RADIUS.xl (كرت المنشور الرئيسي) يعتمد على isMobile، فهو معرّف
// داخل المكوّن نفسه (انظر بعد تعريف isMobile) وليس هنا، لأن isMobile غير
// متاح على مستوى الموديول.

// ── سلّم الخطوط (Typography Scale) — 71 موضع كانت تكتب أرقاماً خاماً (9/11/13...)
// بدلاً من ذلك كل موضع يستدعي FONT.x وهو اسم دلالي يعبّر عن الوظيفة البصرية.
// القيم الثابتة هنا فقط (non-responsive) — القيم الـ clamp() موجودة بـ R أعلاه.
// فائدة إضافية: تغيير حجم نص badge كامل الموقع = تعديل سطر واحد.
const FONT = {
  micro:    9,   // نص "تم التعديل ✏️"، عداد البلاغات — أصغر نص بالواجهة
  badge:    10,  // شارات الأقسام الصغيرة، timestamps الثانوية
  caption:  11,  // نصوص الأزرار الصغيرة، تسميات الإجراءات (الأكثر استخداماً ×25)
  label:    12,  // نصوص ثانوية، أخطاء، تعليقات مساعدة
  body:     13,  // نص الواجهة العام — قوائم الإعدادات، نصوص التأكيد
  bodyLg:   14,  // عناوين أقسام، نص التعليقات الرئيسي
  subhead:  15,  // نص المنشور في وضع الثريد، عناوين ثانوية
  heading:  16,  // عنوان رئيسي بحجم متوسط
  title:    18,  // عناوين الأقسام الرئيسية (settings، section titles)
  display:  28,  // أيقونات تحذيرية كبيرة (⚠️)
  displayLg:32,  // أيقونات حالة فارغة (⏳)
  displayXl:44,  // أيقونة الترحيب الرئيسية (🌱)
};

// ── الظلال (box-shadows) الموحّدة — كل نمط ظل متكرر يُعرّف هنا مرة واحدة.
// الظل الديناميكي (glow) مرتبط بعدد الأصوات فيبقى دالة منفصلة (انظر glow أدناه).
const SHADOWS = {
  modal:    "0 10px 40px rgba(0,0,0,0.4)",          // مودالات، bottom sheets
  danger:   "0 10px 50px rgba(192,85,74,0.25)",     // حوار الحذف / الإجراءات التدميرية
  postBtn:  "0 3px 16px rgba(217,119,87,0.28)",     // زر النشر عندما يكون نشطاً
};

// ── outline:none موحّد — بدل تكراره بكل input/textarea/div بشكل يدوي.
// الـ focus-visible (لوحة المفاتيح) محدّد CSS عام بالـ <style> أدناه ويغطي كل العناصر.
const OUTLINE_NONE = "none";

// ── الحدود (borders) الموحّدة. ملاحظة: BORDERS يعتمد على CL (الثيم)
// وهو متغيّر يتغيّر حسب الوضع الفاتح/الداكن، لذا تعريفه الفعلي داخل المكوّن
// بعد تحديد CL (انظر بعد سطر `const CL = themePref===...`)، وليس هنا
// على مستوى الموديول — هذا التعليق فقط للتوثيق والربط بين الاثنين.

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 3 — DATA TEMPLATES  (قوالب بيانات ثابتة لا تتغيّر بالـ state) │
   └──────────────────────────────────────────────────────────────────────┘ */
const CATS = {
  "رأي":   { en:"Opinion",    color:"#D97757", bg:"rgba(217,119,87,0.12)"  },
  "نصيحة": { en:"Advice",     color:"#6BAE8A", bg:"rgba(107,174,138,0.12)" },
  "تجربة": { en:"Experience", color:"#B87BAA", bg:"rgba(184,123,170,0.12)" },
  "سؤال":  { en:"Question",   color:"#C9A84C", bg:"rgba(201,168,76,0.12)"  },
  "أفكار": { en:"Ideas",      color:"#7B9CD4", bg:"rgba(123,156,212,0.12)" },
  "مواقف": { en:"Situations", color:"#C97B5B", bg:"rgba(201,123,91,0.12)"  },
  "توصية": { en:"Tip",        color:"#5BAF8C", bg:"rgba(91,175,140,0.12)"  },
  "عام":   { en:"General",    color:"#8A7260", bg:"rgba(138,114,96,0.12)"  },
};

const REACTIONS = [
  { key:"helpful",   emoji:"👍", labelKey:"rHelpful"   },
  { key:"agree",     emoji:"🤝", labelKey:"rAgree"     },
  { key:"relatable", emoji:"❤️", labelKey:"rRelatable" },
  { key:"inspiring", emoji:"✨", labelKey:"rInspiring" },
  { key:"flag",      emoji:"🚩", labelKey:"rFlag",     isModeration:true },
];

const PLACEHOLDERS = {
  ar: ["شارك درساً تعلمته اليوم...","ما هي الفكرة المجنونة التي تفكر بها؟",
    "نصيحة غيّرت حياتك؟","تجربة فشلت وتعلمت منها؟","رأيك الصريح عن الموضوع؟",
    "ماذا تريد أن تقول للعالم؟","شيء تود أن تشكر عليه شخصاً ما؟"],
  en: ["Share a lesson you learned today...","What crazy idea are you thinking about?",
    "Advice that changed your life?","A failure that taught you something?","Your honest take?",
    "What do you want to tell the world?","Something you're grateful for?"],
};

const RATE_LIMITS = {
  post:    { max:1, window:3*60*1000  },
  comment: { max:3, window:30*1000    },
  reply:   { max:5, window:60*1000    },
  flag:    { max:5, window:60*60*1000 },
};

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 4 — UTILITIES  (دوال مساعدة عامة، خارج المكوّن، بلا state)    │
   └──────────────────────────────────────────────────────────────────────┘ */
const emptyVotes = () => ({
  helpful:0,helpfulBy:[],agree:0,agreeBy:[],
  relatable:0,relatableBy:[],inspiring:0,inspiringBy:[],
  flag:0,flaggedBy:[],
});

const sumVotes = v => (v?.helpful||0)+(v?.agree||0)+(v?.relatable||0)+(v?.inspiring||0);

const generateDeviceHash = () => {
  try {
    // ملاحظة: لا نضمّن التاريخ هنا — كان هذا يجعل الـ hash يتغيّر كل يوم
    // ويُفقد نظام الحظر (banDevice) فعاليته تلقائياً عند منتصف الليل.
    const raw=[navigator.userAgent,`${window.innerWidth}x${window.innerHeight}`,
      new Date().getTimezoneOffset()].join("|");
    return btoa(unescape(encodeURIComponent(raw))).substring(0,12).toLowerCase();
  } catch { return Math.random().toString(36).substring(2,14); }
};

const safeSave = (key,value) => {
  try { localStorage.setItem(key,JSON.stringify(value)); }
  catch(e) {
    if (e.name==="QuotaExceededError"&&key===POSTS_KEY&&Array.isArray(value))
      try { localStorage.setItem(key,JSON.stringify(value.slice(0,Math.floor(value.length*.8)))); } catch {}
  }
};

// ── Data Access Layer (db): نقطة الاتصال الوحيدة بآلية التخزين الفعلية.
// كل بقية الملف يتعامل مع db.* فقط ولا يكتب localStorage.getItem/setItem
// مباشرة أبداً بعد الآن. الفائدة: يوم تربط الموقع بخدمة سحابية مستقبلاً،
// التعديل يصير بهذا الكائن فقط (تستبدل كل دالة بنداء API مكافئ بنفس
// الاسم) بدل مطاردة عشرات المواضع المتفرقة بالملف. كل دالة هنا متعمّدة
// أن تبقى متزامنة (sync) الآن مثل localStorage تماماً — لتصير async
// (إضافة async/await فقط) أسهل خطوة وحيدة وقت الربط الفعلي، بدون أي
// تغيير بشكل أو اسم الدوال نفسها بكل مكان تُستخدم فيه بالملف.
const db = {
  // المنشورات
  getPosts:          () => { try { return JSON.parse(localStorage.getItem(POSTS_KEY)||"[]"); } catch { return []; } },
  savePosts:         (posts) => safeSave(POSTS_KEY,posts),

  // الملكية المحلية (لأي منشور/تعليق/رد نشأ من هذا الجهاز)
  getOwnedPosts:     () => { try { return JSON.parse(localStorage.getItem(OWNER_KEY)||"{}"); } catch { return {}; } },
  saveOwnedPosts:    (v) => safeSave(OWNER_KEY,v),
  getOwnedComments:  () => { try { return JSON.parse(localStorage.getItem(OWNED_COMMENTS_KEY)||"{}"); } catch { return {}; } },
  saveOwnedComments: (v) => safeSave(OWNED_COMMENTS_KEY,v),
  getOwnedReplies:   () => { try { return JSON.parse(localStorage.getItem(OWNED_REPLIES_KEY)||"{}"); } catch { return {}; } },
  saveOwnedReplies:  (v) => safeSave(OWNED_REPLIES_KEY,v),

  // تفضيلات المستخدم
  getLang:           () => { try { return localStorage.getItem(LANG_KEY)||"ar"; } catch { return "ar"; } },
  saveLang:          (lang) => { try { localStorage.setItem(LANG_KEY,lang); } catch {} },
  getThemePref:      () => { try { return localStorage.getItem(THEME_KEY)||"dark"; } catch { return "dark"; } },
  saveThemePref:     (t) => { try { localStorage.setItem(THEME_KEY,t); } catch {} },

  // هوية الجهاز والحظر
  getDeviceHash:     () => { try { return localStorage.getItem(DEVICE_HASH_KEY); } catch { return null; } },
  saveDeviceHash:    (h) => { try { localStorage.setItem(DEVICE_HASH_KEY,h); } catch {} },
  getBannedDevices:  () => { try { return JSON.parse(localStorage.getItem(BANNED_KEY)||"{}"); } catch { return {}; } },
  saveBannedDevices: (v) => { try { localStorage.setItem(BANNED_KEY,JSON.stringify(v)); } catch {} },

  // الحد من معدّل الإجراءات (rate limiting)
  getRateLimitTimes:  (action) => { try { return JSON.parse(localStorage.getItem(`${RATE_KEY}-${action}`)||"[]"); } catch { return []; } },
  saveRateLimitTimes: (action,times) => { try { localStorage.setItem(`${RATE_KEY}-${action}`,JSON.stringify(times)); } catch {} },
};

const checkIfBanned = () => {
  const banned=db.getBannedDevices();
  const hash=db.getDeviceHash();
  if (!hash||!banned[hash]) return null;
  if (Date.now()>banned[hash]) {
    delete banned[hash];
    db.saveBannedDevices(banned);
    return null;
  }
  return banned[hash];
};

const banDevice = (hash,hours=24) => {
  const banned=db.getBannedDevices();
  banned[hash]=Date.now()+hours*3_600_000;
  db.saveBannedDevices(banned);
};

const canPerformAction = (action) => {
  const times=db.getRateLimitTimes(action);
  const now=Date.now(), limit=RATE_LIMITS[action];
  const recent=times.filter(t=>now-t<limit.window);
  if (recent.length>=limit.max)
    return {allowed:false,waitSeconds:Math.ceil((limit.window-(now-recent[0]))/1000)};
  recent.push(now);
  db.saveRateLimitTimes(action,recent);
  return {allowed:true};
};

// أحرف يُسمح بتكرارها بحرية لأنها تعبيرات طبيعية شائعة بالعربي (ضحك، تعجب، إطالة)
// "ههههههه" / "يااااي" / "آآآه" / "!!!!" يجب ألا تُرفض كسبام.
const FREE_REPEAT_CHARS = /[هاويأإآءٱ!？?.,\s]/;

const isSpamQuality = (text) => {
  if (!text||text.trim().length===0) return true;
  // امنع التكرار المفرط (10+ من نفس الحرف) فقط للأحرف خارج القائمة المسموحة أعلاه
  const repeatMatch = text.match(/(.)\1{9,}/);
  if (repeatMatch && !FREE_REPEAT_CHARS.test(repeatMatch[1])) return true;
  const words=text.trim().split(/\s+/);
  if (new Set(words).size===1&&words.length>5) return true;
  const freq={};
  for(const c of text) freq[c]=(freq[c]||0)+1;
  // نتجاهل من حساب "نسبة الحرف المهيمن" الأحرف المسموح تكرارها (كي لا تُحتسب "ههههه" ضدها)
  const dominantEntries=Object.entries(freq).filter(([c])=>!FREE_REPEAT_CHARS.test(c));
  const dominantMax=dominantEntries.length?Math.max(...dominantEntries.map(([,n])=>n)):0;
  if (text.length>0 && dominantMax/text.length>0.7) return true;
  return false;
};

const applyVoteToggle = (item,reactionKey,hash) => {
  const byKey=reactionKey==="flag"?"flaggedBy":`${reactionKey}By`;
  const byList=item.votes?.[byKey]||[];
  const voted=byList.includes(hash);
  return {
    ...item,
    votes:{
      ...item.votes,
      [reactionKey]:voted?Math.max(0,(item.votes?.[reactionKey]||0)-1):(item.votes?.[reactionKey]||0)+1,
      [byKey]:voted?byList.filter(h=>h!==hash):[...byList,hash],
    },
  };
};
const timeAgo=(ts,s)=>{const d=Math.floor((Date.now()-ts)/1000),m=Math.floor(d/60),h=Math.floor(m/60),dy=Math.floor(h/24);return s.ago(m,h,dy);};
const glow=(v)=>{const i=Math.min(sumVotes(v)/20,1);return `0 0 ${8+i*16}px rgba(217,119,87,${0.1+i*0.3})`;};
const readMdFile=(file,cb)=>{const r=new FileReader();r.onload=e=>cb({name:file.name,content:e.target.result});r.readAsText(file);};

// ── Markdown → HTML (خفيف، بدون مكتبات خارجية، يدعم الأساسيات الحديثة)
// يدعم: عناوين # ## ###، bold/italic، كود مضمّن + code fences، روابط،
// صور، اقتباس >، قوائم مرقّمة/نقطية، خط أفقي، فقرات.
// يُعقَّم HTML الخام أولاً (escape) قبل أي تحويل، فلا يمكن حقن سكربت.
const escapeHtml=(str)=>str
  .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
  .replace(/"/g,"&quot;").replace(/'/g,"&#39;");

const renderInlineMd=(line)=>{
  let t=escapeHtml(line);
  t=t.replace(/`([^`]+)`/g,(_,c)=>`<code style="background:var(--md-code-bg);padding:1px 5px;border-radius:4px;font-size:0.9em;">${c}</code>`);
  t=t.replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(_,alt,url)=>
    /^https?:\/\//.test(url)?`<img src="${url}" alt="${alt}" style="max-width:100%;border-radius:8px;margin:6px 0;"/>`:"");
  t=t.replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)/g,(_,label,url)=>
    /^https?:\/\//.test(url)?`<a href="${url}" target="_blank" rel="noopener noreferrer" style="color:var(--md-link);text-decoration:underline;">${label}</a>`:label);
  t=t.replace(/\*\*\*([^*]+)\*\*\*/g,"<strong><em>$1</em></strong>");
  t=t.replace(/\*\*([^*]+)\*\*/g,"<strong>$1</strong>");
  t=t.replace(/__([^_]+)__/g,"<strong>$1</strong>");
  t=t.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g,"<em>$1</em>");
  t=t.replace(/(?<!_)_([^_\n]+)_(?!_)/g,"<em>$1</em>");
  t=t.replace(/~~([^~]+)~~/g,"<del>$1</del>");
  return t;
};

const renderMarkdown=(src)=>{
  if(!src)return "";
  const lines=String(src).replace(/\r\n/g,"\n").split("\n");
  let html="",inCode=false,codeBuf=[],listType=null,listBuf=[],inQuote=false,quoteBuf=[];

  const flushList=()=>{
    if(!listType)return;
    const tag=listType==="ol"?"ol":"ul";
    html+=`<${tag} style="margin:6px 0;padding-inline-start:22px;">${listBuf.join("")}</${tag}>`;
    listType=null;listBuf=[];
  };
  const flushQuote=()=>{
    if(!inQuote)return;
    html+=`<blockquote style="border-inline-start:3px solid var(--md-quote);margin:8px 0;padding:2px 12px;color:var(--md-quote-text);">${quoteBuf.join("<br/>")}</blockquote>`;
    inQuote=false;quoteBuf=[];
  };

  for (let raw of lines) {
    const fence=raw.match(/^```(.*)$/);
    if (fence) {
      if (!inCode) { flushList();flushQuote();inCode=true;codeBuf=[]; }
      else {
        html+=`<pre style="background:var(--md-code-bg);border-radius:8px;padding:10px 12px;overflow-x:auto;margin:8px 0;"><code>${codeBuf.map(escapeHtml).join("\n")}</code></pre>`;
        inCode=false;
      }
      continue;
    }
    if (inCode) { codeBuf.push(raw); continue; }

    if (/^\s*$/.test(raw)) { flushList();flushQuote(); continue; }

    const h=raw.match(/^(#{1,6})\s+(.*)$/);
    if (h) {
      flushList();flushQuote();
      const lvl=h[1].length, sizes={1:"1.5em",2:"1.3em",3:"1.15em",4:"1.05em",5:"1em",6:"0.95em"};
      html+=`<h${lvl} style="margin:14px 0 6px;font-size:${sizes[lvl]};font-weight:700;line-height:1.4;">${renderInlineMd(h[2])}</h${lvl}>`;
      continue;
    }

    if (/^\s*(-{3,}|\*{3,}|_{3,})\s*$/.test(raw)) {
      flushList();flushQuote();
      html+=`<hr style="border:none;border-top:1px solid var(--md-border);margin:12px 0;"/>`;
      continue;
    }

    const q=raw.match(/^>\s?(.*)$/);
    if (q) { flushList(); inQuote=true; quoteBuf.push(renderInlineMd(q[1])); continue; }

    const ol=raw.match(/^\s*\d+[.)]\s+(.*)$/);
    const ul=raw.match(/^\s*[-*+]\s+(.*)$/);
    if (ol || ul) {
      flushQuote();
      const kind=ol?"ol":"ul";
      if (listType && listType!==kind) flushList();
      listType=kind;
      listBuf.push(`<li style="margin:3px 0;">${renderInlineMd((ol||ul)[1])}</li>`);
      continue;
    }

    flushList();flushQuote();
    html+=`<p style="margin:6px 0;line-height:1.75;">${renderInlineMd(raw)}</p>`;
  }
  flushList();flushQuote();
  return html;
};

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 5 — I18N STRINGS  (كل نصوص الواجهة عربي/إنجليزي بمكان واحد)   │
   └──────────────────────────────────────────────────────────────────────┘ */
const S = {
  ar:{
    d:"rtl",font:"system-ui,'Segoe UI',Tahoma,Arial,sans-serif",
    name:"Inkore",tag:"آراء · نصائح · تجارب",
    eShort:"اكتب أكثر قليلاً 😊",eLong:"300 حرف يكفي 👆",
    hint:n=>`${n}/300 · Ctrl+Enter للنشر`,
    notePh:"أضف ملاحظة قصيرة... (اختياري)",noteHint:n=>`${n}/100`,
    loadTxt:"جاري التحميل...",btn:"شارك الآن",btnPosting:"جاري النشر...",
    commentBtnPosting:"جاري النشر...",replyBtnPosting:"جاري الإرسال...",
    toastTitle:"شكراً على مشاركتك!",toastPosted:"نُشرت مشاركتك! 🎉",
    toastDeleted:"تم حذف المنشور.",toastEdited:"تم تعديل المنشور! ✏️",
    toastCommentEdited:"تم تعديل التعليق! ✏️",toastCommentDeleted:"تم حذف التعليق.",
    toastReplied:"تم إضافة ردك! 💬",toastReplyDeleted:"تم حذف الرد.",toastReplyEdited:"تم تعديل الرد! ✏️",
    t0:"الأحدث",t1:"الأكثر تفاعلاً",
    emH:"لا توجد مشاركات بعد!",emP:"كن أول من يشارك 👆",
    rHelpful:"استفدت!",rAgree:"أتفق!",rRelatable:"لامسني!",rInspiring:"ملهم!",rFlag:"إبلاغ",
    back:"رجوع",commentsTitle:"التعليقات",
    commentPh:"أضف تعليقك بشكل مجهول...",commentBtn:"نشر",
    noComments:"لا تعليقات بعد، كن أول من يعلّق! 👆",
    replyBtn:"رد",replyPh:"أضف ردك...",
    showReplies:n=>`${n} رد`,
    footer:"مجهول · لا تتبع · لا حكم 🔒",toggle:"EN",
    cat:k=>k,
    catLabel:"اختر التصنيف",
    ago:(m,h,d)=>m<1?"الآن":m<60?`${m}د`:h<24?`${h}س`:`${d}ي`,
    deletePost:"حذف",editPost:"تعديل",
    editComment:"تعديل",deleteComment:"حذف",
    editReply:"تعديل",deleteReply:"حذف",
    confirmDelete:"هل أنت متأكد من حذف هذا المنشور؟",
    confirmDeleteComment:"هل أنت متأكد من حذف هذا التعليق؟",
    confirmDeleteReply:"هل أنت متأكد من حذف هذا الرد؟",
    confirmYes:"حذف",confirmNo:"إلغاء",
    settings:"الإعدادات",settingsLang:"اللغة",
    settingsOpenFull:"فتح الإعدادات الكاملة",
    settingsTheme:"المظهر",themeDark:"داكن",themeLight:"فاتح",
    settingsLegalTitle:"الصفحات الرسمية",
    privacyPolicy:"سياسة الخصوصية",termsConditions:"الشروط والأحكام",contactUs:"تواصل معنا",
    settingsDangerZone:"منطقة خطرة",
    deleteContentBtn:"حذف منشوراتي وتعليقاتي نهائياً",
    deleteOwnershipBtn:"إلغاء ملكيتي فقط",
    dangerPurgeContent:"سيتم حذف كل منشوراتك وتعليقاتك وردودك من الموقع بشكل نهائي ولا يمكن التراجع عن هذا الإجراء.",
    dangerPurgeOwnership:"ستفقد القدرة على تعديل أو حذف منشوراتك وتعليقاتك السابقة، لكنها ستبقى موجودة بالموقع للجميع. لا يمكن التراجع عن هذا الإجراء.",
    dangerConfirmBtn:n=>n>0?`تأكيد الحذف (${n})`:"تأكيد الحذف",
    toastPurged:"تم حذف بياناتك نهائياً.",
    toastOwnershipCleared:"تم إلغاء ملكيتك المحلية.",
    editSave:"حفظ",editCancel:"إلغاء",editedLabel:"معدَّل",
    attachMd:"إرفاق .md",attachedFile:n=>`📎 ${n}`,
    mdPreview:"معاينة",removeFile:"إزالة",
    mdEditorTitle:"محرر Markdown",
    mdEditorTabWrite:"كتابة",mdEditorTabPreview:"معاينة",
    mdEditorUpload:"استيراد من الجهاز",
    mdEditorSave:"حفظ",mdEditorCancel:"إلغاء",
    mdEditorEmpty:"ابدأ الكتابة… أو استورد ملف .md من جهازك",
    mdEditorPreviewEmpty:"لا يوجد محتوى للمعاينة بعد",
    mdEditorPlaceholder:"# عنوان\n\nاكتب هنا بصيغة Markdown…",
    mdToolBold:"عريض",mdToolItalic:"مائل",mdToolStrike:"يتوسطه خط",
    mdToolH1:"عنوان كبير",mdToolH2:"عنوان متوسط",mdToolQuote:"اقتباس",
    mdToolCode:"كود مضمّن",mdToolCodeBlock:"كتلة كود",mdToolLink:"رابط",
    mdToolImage:"صورة",mdToolUl:"قائمة نقطية",mdToolOl:"قائمة مرقّمة",
    mdToolHr:"خط فاصل",
    mdFileName:"اسم الملف",mdFileNamePh:"ملاحظتي.md",
    mdEditorEditing:n=>`تعديل ${n}`,
    banned:"تم حظر جهازك مؤقتاً بسبب محتوى مخالف.",
    spamQuality:"يبدو أن هذا المحتوى غير واضح. حاول كتابة شيء أكثر معنى.",
    rateLimitPost:s=>`انتظر ${s} ثانية`,rateLimitComment:s=>`انتظر ${s} ثانية`,
    rateLimitReply:s=>`انتظر ${s} ثانية`,
    commentTooShort:"اكتب تعليقاً أطول قليلاً 😊",replyTooShort:"اكتب رداً أطول قليلاً 😊",
    profile:"ملفي الشخصي",profileTitle:"ملفي",
    profileMyPosts:"منشوراتي",profileMyComments:"تعليقاتي",
    sidebarViewProfile:"عرض ملفي الكامل",
    sidebarCatsTitle:"التصنيفات",sidebarCatAll:"الكل",
    profileStatPosts:"منشور",profileStatComments:"تعليق",profileStatReactions:"تفاعل",
    profileEmptyPosts:"لم تنشر شيئاً بعد",profileEmptyPostsSub:"منشوراتك من هذا الجهاز تظهر هنا",
    profileEmptyComments:"لم تعلّق بعد",profileEmptyCommentsSub:"تعليقاتك من هذا الجهاز تظهر هنا",
    profileLocalNote:"هذا الملف محلي على جهازك حالياً — سيتحول لحساب حقيقي قريباً 🔜",
    profileOnPost:"على منشور:",
    actionCopy:"نسخ النص",actionShare:"مشاركة",actionEdit:"تعديل",actionDelete:"حذف",
    actionMenuLabel:"خيارات",toastCopied:"تم نسخ النص! 📋",toastShared:"تمت المشاركة!",
    shareTitle:"مشاركة من Inkore",
  },
  en:{
    d:"ltr",font:"-apple-system,BlinkMacSystemFont,'Inter','Segoe UI',sans-serif",
    name:"Inkore",tag:"Opinions · Advice · Experiences",
    eShort:"Write a bit more 😊",eLong:"300 chars max 👆",
    hint:n=>`${n}/300 · Ctrl+Enter to post`,
    notePh:"Add a short note... (optional)",noteHint:n=>`${n}/100`,
    loadTxt:"Loading...",btn:"Share Now",btnPosting:"Posting...",
    commentBtnPosting:"Posting...",replyBtnPosting:"Sending...",
    toastTitle:"Thanks for sharing!",toastPosted:"Your post was published! 🎉",
    toastDeleted:"Post deleted.",toastEdited:"Post updated! ✏️",
    toastCommentEdited:"Comment updated! ✏️",toastCommentDeleted:"Comment deleted.",
    toastReplied:"Reply added! 💬",toastReplyDeleted:"Reply deleted.",toastReplyEdited:"Reply updated! ✏️",
    t0:"Recent",t1:"Most Helpful",
    emH:"No posts yet!",emP:"Be the first to share 👆",
    rHelpful:"Helpful!",rAgree:"Agree!",rRelatable:"Relatable!",rInspiring:"Inspiring!",rFlag:"Report",
    back:"Back",commentsTitle:"Comments",
    commentPh:"Add an anonymous comment...",commentBtn:"Post",
    noComments:"No comments yet. Be the first! 👆",
    replyBtn:"Reply",replyPh:"Add your reply...",
    showReplies:n=>`${n} ${n===1?"reply":"replies"}`,
    footer:"Anonymous · No tracking · No judgment 🔒",toggle:"عربي",
    cat:k=>CATS[k]?.en||k,
    catLabel:"Choose category",
    ago:(m,h,d)=>m<1?"now":m<60?`${m}m`:h<24?`${h}h`:`${d}d`,
    deletePost:"Delete",editPost:"Edit",
    editComment:"Edit",deleteComment:"Delete",
    editReply:"Edit",deleteReply:"Delete",
    confirmDelete:"Delete this post?",
    confirmDeleteComment:"Delete this comment?",
    confirmDeleteReply:"Delete this reply?",
    confirmYes:"Delete",confirmNo:"Cancel",
    settings:"Settings",settingsLang:"Language",
    settingsOpenFull:"Open full settings",
    settingsTheme:"Theme",themeDark:"Dark",themeLight:"Light",
    settingsLegalTitle:"Official Pages",
    privacyPolicy:"Privacy Policy",termsConditions:"Terms & Conditions",contactUs:"Contact Us",
    settingsDangerZone:"Danger Zone",
    deleteContentBtn:"Delete my posts & comments permanently",
    deleteOwnershipBtn:"Clear my ownership only",
    dangerPurgeContent:"All your posts, comments, and replies will be permanently deleted from the site. This cannot be undone.",
    dangerPurgeOwnership:"You'll lose the ability to edit or delete your past posts and comments, but they'll remain visible on the site. This cannot be undone.",
    dangerConfirmBtn:n=>n>0?`Confirm Delete (${n})`:"Confirm Delete",
    toastPurged:"Your data has been permanently deleted.",
    toastOwnershipCleared:"Your local ownership has been cleared.",
    editSave:"Save",editCancel:"Cancel",editedLabel:"edited",
    attachMd:"Attach .md",attachedFile:n=>`📎 ${n}`,
    mdPreview:"Preview",removeFile:"Remove",
    mdEditorTitle:"Markdown Editor",
    mdEditorTabWrite:"Write",mdEditorTabPreview:"Preview",
    mdEditorUpload:"Import from device",
    mdEditorSave:"Save",mdEditorCancel:"Cancel",
    mdEditorEmpty:"Start writing… or import a .md file from your device",
    mdEditorPreviewEmpty:"Nothing to preview yet",
    mdEditorPlaceholder:"# Heading\n\nWrite here in Markdown…",
    mdToolBold:"Bold",mdToolItalic:"Italic",mdToolStrike:"Strikethrough",
    mdToolH1:"Large heading",mdToolH2:"Medium heading",mdToolQuote:"Quote",
    mdToolCode:"Inline code",mdToolCodeBlock:"Code block",mdToolLink:"Link",
    mdToolImage:"Image",mdToolUl:"Bullet list",mdToolOl:"Numbered list",
    mdToolHr:"Divider",
    mdFileName:"File name",mdFileNamePh:"my-note.md",
    mdEditorEditing:n=>`Editing ${n}`,
    banned:"Your device has been temporarily banned.",
    spamQuality:"This content seems unclear. Write something more meaningful.",
    rateLimitPost:s=>`Wait ${s}s`,rateLimitComment:s=>`Wait ${s}s`,
    rateLimitReply:s=>`Wait ${s}s`,
    commentTooShort:"Write a bit more 😊",replyTooShort:"Write a bit more 😊",
    profile:"My Profile",profileTitle:"My Profile",
    profileMyPosts:"My Posts",profileMyComments:"My Comments",
    sidebarViewProfile:"View full profile",
    sidebarCatsTitle:"Categories",sidebarCatAll:"All",
    profileStatPosts:"Posts",profileStatComments:"Comments",profileStatReactions:"Reactions",
    profileEmptyPosts:"You haven't posted yet",profileEmptyPostsSub:"Your posts from this device will show up here",
    profileEmptyComments:"You haven't commented yet",profileEmptyCommentsSub:"Your comments from this device will show up here",
    profileLocalNote:"This profile is local to your device for now — real accounts are coming soon 🔜",
    profileOnPost:"On post:",
    actionCopy:"Copy text",actionShare:"Share",actionEdit:"Edit",actionDelete:"Delete",
    actionMenuLabel:"Options",toastCopied:"Text copied! 📋",toastShared:"Shared!",
    shareTitle:"Shared from Inkore",
  },
};

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 6 — SEED DATA  (بيانات تجريبية أولية تُستخدم عند أول تشغيل)   │
   └──────────────────────────────────────────────────────────────────────┘ */
const SEEDS = [
  {id:"seed-1",category:"تجربة",authorHash:"seed",
   text:"تعلمت أن الفشل الأول هو أفضل معلم في الحياة. عندما تفشل مرة، تفهم الطريق الصحيح للمرة القادمة.",
   votes:emptyVotes(),timestamp:Date.now()-86_400_000*3,edited:false,note:"من تجربتي الشخصية",comments:[],mdFile:null},
  {id:"seed-2",category:"نصيحة",authorHash:"seed",
   text:"اقرأ كتاباً واحداً يومياً ولو صفحة واحدة. ستفاجأ بكم المعلومات التي ستجمعها في السنة الواحدة.",
   votes:emptyVotes(),timestamp:Date.now()-86_400_000*2,edited:false,note:"",comments:[],mdFile:null},
  {id:"seed-3",category:"رأي",authorHash:"seed",
   text:"أعتقد أن التكنولوجيا وسيلة وليست غاية. ما يهم حقاً هو كيفية استخدامنا لها في الحياة اليومية.",
   votes:emptyVotes(),timestamp:Date.now()-86_400_000,edited:false,note:"رأي شخصي",comments:[],mdFile:null},
];

/* ┌──────────────────────────────────────────────────────────────────────┐
   │ الطابق 7 — MAIN COMPONENT                                            │
   │ مقسّم داخلياً بنفس منطق الطوابق: حالة → تأثيرات → بيانات مشتقة →     │
   │ دوال منطق → أنماط مشتركة → دوال عرض مساعدة → JSX النهائي            │
   └──────────────────────────────────────────────────────────────────────┘ */
export default function Inkore() {
  const breakpoint = useBreakpoint(); // "mobile" | "tablet" | "desktop"
  const isMobile = breakpoint === "mobile";   // يبقى للتوافقية مع باقي الكود
  const isTablet = breakpoint === "tablet";
  const isDesktop = breakpoint === "desktop";

  // ── Viewport meta: تأكيد احتياطي فقط — المصدر الحقيقي يجب أن يكون
  // وسم <meta name="viewport"> داخل index.html نفسه (راجع الملاحظة
  // أسفل الملف)، لأن الحقن عبر JS يحدث بعد أول رسم للصفحة فلا يمنع
  // وميض الزوم عند فتح الصفحة لأول مرة.
  useEffect(()=>{
    if (!document.querySelector('meta[name="viewport"]')) {
      const m=document.createElement("meta");
      m.name="viewport";
      m.content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover";
      document.head.appendChild(m);
    }

    // ── حماية من ترجمة المتصفح التلقائية (Google Translate / Safari Translate):
    // بدون هذا، المتصفح يغيّر نصوص الواجهة العربية لمرادفات مختلفة (مثلاً
    // "الموحّد" ← "وحش") لأنه يعتقد الصفحة بلغة أخرى ويحاول "تحسينها".
    // translate="no" يخبر المتصفح صراحةً: هذا المحتوى لا يحتاج ترجمة.
    // class="notranslate" تغطي محركات الترجمة الخارجية (Google Translate extension).
    document.documentElement.setAttribute("translate","no");
    document.documentElement.classList.add("notranslate");
    // meta tag إضافي يمنع Google Translate من اكتشاف اللغة تلقائياً
    if (!document.querySelector('meta[name="google"]')) {
      const mg=document.createElement("meta");
      mg.name="google"; mg.content="notranslate";
      document.head.appendChild(mg);
    }

    // Prevent horizontal overflow on body
    document.body.style.overflowX="hidden";
    document.body.style.margin="0";

    // ── iOS :active fix: على Safari/iOS لا تُفعَّل حالة :active في CSS
    // عند اللمس إلا بوجود مستمع touchstart فعلي على document — بدونه
    // اللمسات السريعة تتجاوز حركة الضغط (scale) وتنتقل فوراً، وهذا سبب
    // شعورك إن الأنيميشن "يتأخر" أو لا يظهر عند الضغط السريع.
    document.addEventListener("touchstart", function(){}, true);
  },[]);

  // ── Responsive values  (R = Responsive)
  // نستخدم clamp(min, الحجم المفضّل بوحدة vw, max) للقيم البصرية الأساسية:
  // يعني الخط/الـ padding يتدرّج تلقائياً وبسلاسة مع عرض الشاشة (يغطي
  // التابلت تلقائياً) بدل قفزة واحدة مفاجئة عند نقطة 640px.
  // القيم التي يجب أن تبقى رقماً ثابتاً بسبب قيود فعلية (مثل minHeight
  // للمس، أو خط الإدخال 16px على iOS لمنع الزووم التلقائي) تبقى بمنطقها الثنائي.
  const R = {
    pagePad:     isMobile ? "12px 14px" : isTablet ? "16px" : "20px",
    cardPad:     isMobile ? "12px 14px" : isTablet ? "13px 15px" : "15px 17px",
    titleSize:   "clamp(22px, 4vw, 28px)",
    tagSize:     "clamp(11px, 1.6vw, 12px)",
    bodyText:    "clamp(14px, 2vw, 15px)",
    commentText: "clamp(13px, 1.8vw, 14px)",
    replyText:   "clamp(12px, 1.6vw, 13px)",
    // iOS requires >= 16px to prevent auto-zoom on input focus — تبقى ثابتة
    inputFont:   isMobile ? 16 : 13,
    textareaFont:isMobile ? 16 : 16,
    btnFont:     "clamp(12px, 1.6vw, 13px)",
    metaFont:    10,
    reactionPad: isMobile ? "7px 10px" : "5px 10px",
    reactionFontSize: "clamp(11px, 1.5vw, 12px)",
    touchH:      isMobile ? 44 : "auto",  // min touch target
    replyIndent: isMobile ? 10 : isTablet ? 16 : 20,
    replyPadStart:isMobile? 8  : isTablet ? 10 : 12,
    gap:         isMobile ? 6  : isTablet ? 7 : 8,
    headerMb:    isMobile ? 18 : isTablet ? 21 : 24,
  };

  // ── Device hash
  const [deviceHash]=useState(()=>{
    let h=db.getDeviceHash();
    if (!h){h=generateDeviceHash();db.saveDeviceHash(h);}
    return h;
  });

  const [isBanned,setIsBanned]=useState(()=>checkIfBanned()!==null);
  const [banTimeLeft,setBanTimeLeft]=useState(()=>{const e=checkIfBanned();return e?Math.ceil((e-Date.now())/1000):0;});
  const [lang,setLang]=useState(()=>db.getLang());
  const s=S[lang];

  // ── مزامنة اتجاه/لغة المستند مع حالة التطبيق: خصائص CSS المنطقية المستخدمة
  // بكل الملف (insetInlineStart, borderInlineStart...) تعتمد فعلياً على سمة
  // dir الحقيقية لعنصر <html>، وليس فقط على متغير s.d الداخلي — بدون هذا
  // التزامن يبقى الاتجاه ثابتاً على القيمة الأولية بغض النظر عن تبديل اللغة.
  useEffect(()=>{
    document.documentElement.dir=s.d;
    document.documentElement.lang=lang;
  },[lang,s.d]);

  // ── Custom confirm modal (replaces window.confirm)
  const [confirmState,setConfirmState]=useState(null); // {message, onConfirm} | null
  const askConfirm=(message,onConfirm)=>setConfirmState({message,onConfirm});
  const closeConfirm=()=>setConfirmState(null);

  // ── Danger confirm modal (overlay أحمر + عدّاد تنازلي لإجراءات الحذف النهائية)
  const [dangerState,setDangerState]=useState(null); // {message, onConfirm} | null
  const [dangerCountdown,setDangerCountdown]=useState(0);
  const askDangerConfirm=(message,onConfirm)=>{
    setDangerState({message,onConfirm});
    setDangerCountdown(7);
  };
  const closeDangerConfirm=()=>{setDangerState(null);setDangerCountdown(0);};

  // ── Settings bottom sheet
  const [settingsOpen,setSettingsOpen]=useState(false);
  const [settingsPageOpen,setSettingsPageOpen]=useState(false);
  const [profilePageOpen,setProfilePageOpen]=useState(false);
  const [profileTab,setProfileTab]=useState("posts"); // "posts" | "comments"
  const [themePref,setThemePref]=useState(()=>db.getThemePref());

  // ── وراثة الثيم: من هنا فقط يُحدَّد أي قالب ألوان يُستخدم بكل الملف.
  // كل سطر بالكود يكتب CL.شيء (152 موضعاً) يرث تلقائياً من هذا المتغير
  // بدون الحاجة لتعديل أي منها يدوياً — هذا هو "النظام الوراثي" المطلوب.
  const CL = themePref==="light" ? CL_LIGHT : CL_DARK;

  // ── الحدود (borders) الموحّدة — كل نمط حد متكرر بالموقع (+30 موضع) يُعرّف
  // هنا مرة واحدة فقط ويرث تلقائياً تغييرات الثيم عبر CL. لو غيّرنا سماكة
  // الحد من 1px لـ 1.5px مستقبلاً، نعدّل سطر واحد فقط هنا.
  const BORDERS = {
    default: `1px solid ${CL.border}`,
    edit:    `1px solid ${CL.editBorder}`,
    reply:   `1px solid ${CL.replyBorder}`,
    danger:  `1px solid ${CL.dangerBorder}`,
    flag:    `1px solid ${CL.flagBorder}`,
    ok:      `1px solid ${CL.okBorder}`,
    accent:  `1px solid ${CL.accentBorder}`,
  };

  // RADIUS.xl (كرت المنشور الرئيسي) يعتمد على isMobile، فهو متغيّر محلي هنا
  // وليس جزءاً من RADIUS الثابت بمستوى الموديول (تجنباً لتعديل كائن مشترك).
  const radiusXl = isMobile ? 16 : 20;

  const [phIdx]=useState(()=>Math.floor(Math.random()*7));
  const currentPlaceholder=(PLACEHOLDERS[lang]||PLACEHOLDERS.ar)[phIdx%(PLACEHOLDERS[lang]?.length||7)];

  /* — 7.1 State — */
  // ── State
  const [text,setText]=useState("");
  const [note,setNote]=useState("");
  const [category,setCategory]=useState("عام");
  const [mdFile,setMdFile]=useState(null);
  const [mdPreview,setMdPreview]=useState(false);
  const [commentText,setCommentText]=useState("");
  const [commentMdFile,setCommentMdFile]=useState(null);
  const [commentMdPreview,setCommentMdPreview]=useState(false);
  const [replyingToId,setReplyingToId]=useState(null);
  const [expandedIds,setExpandedIds]=useState({});
  const [replyText,setReplyText]=useState("");
  const [replyMdFile,setReplyMdFile]=useState(null);
  const [replyMdPreview,setReplyMdPreview]=useState(false);
  // ── صفحة محرر Markdown الكاملة (استبدال إرفاق الملف المباشر بمحرر غني)
  // target: "post" | "comment" | "reply" — يحدد أي setXMdFile يُستدعى عند الحفظ
  const [mdEditorState,setMdEditorState]=useState(null); // {target, file:{name,content}} | null
  const openMdEditor=(target,existingFile)=>
    setMdEditorState({target, file: existingFile || {name:"", content:""}});
  const closeMdEditor=()=>setMdEditorState(null);
  const saveMdEditor=(file)=>{
    if (mdEditorState?.target==="post") setMdFile(file);
    else if (mdEditorState?.target==="comment") setCommentMdFile(file);
    else if (mdEditorState?.target==="reply") setReplyMdFile(file);
    closeMdEditor();
  };
  const [editingPostId,setEditingPostId]=useState(null);
  const [editingCommentId,setEditingCommentId]=useState(null);
  const [editingReplyInfo,setEditingReplyInfo]=useState(null);
  const [editPostText,setEditPostText]=useState("");
  const [editCommentText,setEditCommentText]=useState("");
  const [editReplyText,setEditReplyText]=useState("");
  const [err,setErr]=useState("");
  const [toast,setToast]=useState("");
  // ── قائمة ⋯ الموحّدة (نسخ/مشاركة/تعديل/حذف): نخزّن فقط أي عنصر مفتوح
  // حالياً بدل حالة منفصلة لكل منشور/تعليق/رد — قائمة واحدة بالشاشة كحد أقصى.
  // type: "post" | "comment" | "reply"
  const [openMenuFor,setOpenMenuFor]=useState(null); // {type, postId, commentId?, replyId?} | null
  // ── يتتبع أي بطاقة منشور بالفيد يمرّ الفأرة فوقها حالياً — خلفية hover
  // خفيفة بنمط Threads (mouse فقط؛ لا يُفعَّل باللمس فلا يزعج الموبايل)
  const [hoveredPostId,setHoveredPostId]=useState(null);
  const [loading,setLoading]=useState(true);
  // ── مؤشرات "جاري الإرسال" لكل نوع محتوى — تعطّل الزر وتغيّر نصه أثناء العملية
  const [isPosting,setIsPosting]=useState(false);
  const [isCommenting,setIsCommenting]=useState(false);
  const [isReplying2,setIsReplying2]=useState(false); // اسم مختلف عن replyingToId لتفادي التضارب
  const [posts,setPosts]=useState([]);
  const [displayed,setDisplayed]=useState([]);
  const [tab,setTab]=useState("recent");
  // ── فلتر التصنيف بالعمود الجانبي (ديسكتوب فقط) — null يعني "بدون فلتر/الكل"
  const [catFilter,setCatFilter]=useState(null);
  const [activePostId,setActivePostId]=useState(null);
  const [threadPending,setThreadPending]=useState(null); // id الكرت المضغوط حالياً وبانتظار اكتمال حركة الضغط قبل فتح الثريد
  const [threadClosing,setThreadClosing]=useState(false); // true أثناء تشغيل حركة خروج الثريد قبل إزالته فعلياً
  const [ownedPosts,setOwnedPosts]=useState({});
  const [ownedReplies,setOwnedReplies]=useState({});
  const [ownedComments,setOwnedComments]=useState({});

  const toastTimerRef=useRef();
  const activeCatRef=useRef(); // لضمان ظهور الفئة المختارة بصف الفئات (تحل مشكلة "عام" تخرج خارج حدود الشاشة)

  // ── Ban timer
  useEffect(()=>{
    if (!isBanned) return;
    const iv=setInterval(()=>{
      const e=checkIfBanned();
      if (!e){setIsBanned(false);setBanTimeLeft(0);}
      else setBanTimeLeft(Math.ceil((e-Date.now())/1000));
    },1000);
    return ()=>clearInterval(iv);
  },[isBanned]);

  /* — 7.2 Effects — */
  // ── Init
  useEffect(()=>{
    const stored=db.getPosts();
    if (stored.length===0){db.savePosts(SEEDS);setPosts(SEEDS);}
    else setPosts(stored);
    setOwnedPosts(db.getOwnedPosts());
    setOwnedReplies(db.getOwnedReplies());
    setOwnedComments(db.getOwnedComments());
    setLoading(false);
  },[]);

  // ── إغلاق قائمة ⋯ عند الضغط بأي مكان خارجها — بدل الاعتماد فقط على طبقة
  // شفافة محلية داخل كل كرت (كانت أحياناً تسمح للضغطة بالوصول لعنصر تحتها
  // مثل كرت آخر بالفيد، ففتح ثريد غير مقصود بدل إغلاق القائمة فقط).
  // نستخدم مرحلة capture (المعامل الثالث true) كي ينفّذ هذا المستمع *قبل*
  // أي معالج onClick آخر بالشجرة (مثل openThread على الكرت)، فتُغلق القائمة
  // أولاً ونمنع الحدث من الاستمرار بنفس الضغطة، بدل أن ينفّذا الاثنان معاً.
  useEffect(()=>{
    if (!openMenuFor) return;
    const closeMenu=(e)=>{
      // لو الضغطة وقعت داخل القائمة نفسها أو زر ⋯، نتركها تُعالَج طبيعياً
      // (أزرار نسخ/مشاركة/تعديل/حذف تتولى إغلاق القائمة بنفسها بعد التنفيذ)
      if (e.target.closest?.("[data-action-menu]")) return;
      setOpenMenuFor(null);
      e.stopPropagation();
    };
    document.addEventListener("click",closeMenu,true);
    return ()=>document.removeEventListener("click",closeMenu,true);
  },[openMenuFor]);

  // ── Filter + sort
  useEffect(()=>{
    let res=posts.filter(p=>(p.votes?.flaggedBy||[]).length<6);
    if (catFilter) res=res.filter(p=>p.category===catFilter);
    res=tab==="top"?[...res].sort((a,b)=>sumVotes(b.votes)-sumVotes(a.votes))
                   :[...res].sort((a,b)=>b.timestamp-a.timestamp);
    setDisplayed(res);
  },[posts,tab,catFilter]);

  // ── Keep the selected category pill visible (defaults can sit off-screen on mobile)
  useEffect(()=>{
    activeCatRef.current?.scrollIntoView({block:"nearest",inline:"nearest"});
  },[category]);

  // ── Scroll to top when opening or closing a thread
  useEffect(()=>{
    window.scrollTo({top:0,behavior:"smooth"});
  },[activePostId]);

  // ── Danger confirm countdown
  useEffect(()=>{
    if (!dangerState||dangerCountdown<=0) return;
    const t=setTimeout(()=>setDangerCountdown(c=>c-1),1000);
    return ()=>clearTimeout(t);
  },[dangerState,dangerCountdown]);

  /* — 7.4 Logic / Handlers — */
  // ── Helpers
  const savePosts=(fn)=>{
    setPosts(prev=>{const next=typeof fn==="function"?fn(prev):fn;db.savePosts(next);return next;});
  };
  const showToast=(msg,ms=2500)=>{
    clearTimeout(toastTimerRef.current);
    setToast(msg);
    toastTimerRef.current=setTimeout(()=>setToast(""),ms);
  };
  const getResp=(post)=>post.note||"";

  // ── updateVotes
  const updateVotes=(postId,commentId,reactionKey)=>{
    savePosts(prev=>prev.map(p=>{
      if (p.id!==postId) return p;
      if (commentId) return {...p,comments:(p.comments||[]).map(c=>c.id===commentId?applyVoteToggle(c,reactionKey,deviceHash):c)};
      const updated=applyVoteToggle(p,reactionKey,deviceHash);
      // ملاحظة أمان: هذا تطبيق محلي بالكامل (localStorage) بدون باك إند حقيقي،
      // لذلك لا يوجد طريقة فعلية للتحقق من أن كل "بلاغ" يأتي من جهاز مختلف فعلاً.
      // رفعنا العتبة وأبطلنا الحظر التلقائي الفوري لتقليل فرصة إساءة الاستخدام
      // (فتح عدة تبويبات خفية للإبلاغ على نفس المنشور)، لكن هذا تخفيف وليس حلاً
      // جذرياً — الحل الحقيقي يتطلب باك إند يربط البلاغ بهوية تحقق فعلية.
      if (reactionKey==="flag"&&(updated.votes?.flaggedBy||[]).length>=10&&updated.authorHash&&updated.authorHash!=="seed")
        banDevice(updated.authorHash,24);
      return updated;
    }));
  };

  // ── Submit post
  const submit=()=>{
    if (isBanned){setErr(s.banned);return;}
    if (!text.trim()||text.length<5){setErr(s.eShort);return;}
    if (text.length>300){setErr(s.eLong);return;}
    if (isSpamQuality(text)){setErr(s.spamQuality);return;}
    const rate=canPerformAction("post");
    if (!rate.allowed){setErr(s.rateLimitPost(rate.waitSeconds));return;}
    setIsPosting(true);
    const newPost={id:`post-${Date.now()}`,category,text:text.trim(),votes:emptyVotes(),
      timestamp:Date.now(),edited:false,note:note.trim(),comments:[],mdFile:mdFile||null,authorHash:deviceHash};
    // تأخير بسيط ليُحسّ المستخدم بحالة "جاري النشر" (ويصبح جاهزاً لو رُبط لاحقاً بطلب شبكة حقيقي)
    setTimeout(()=>{
      savePosts(prev=>[newPost,...prev]);
      const o={...ownedPosts,[newPost.id]:true};setOwnedPosts(o);db.saveOwnedPosts(o);
      setText("");setNote("");setMdFile(null);setCategory("عام");setErr("");
      setIsPosting(false);
      showToast(s.toastPosted,3000);
    },isMobile?350:200);
  };

  // ── Add comment
  const addComment=(postId)=>{
    if (isBanned){setErr(s.banned);return;}
    if (isSpamQuality(commentText)){setErr(s.spamQuality);return;}
    if (!commentText.trim()||commentText.length<2){setErr(s.commentTooShort);return;}
    const rate=canPerformAction("comment");
    if (!rate.allowed){setErr(s.rateLimitComment(rate.waitSeconds));return;}
    setIsCommenting(true);
    const c={id:`comment-${Date.now()}`,text:commentText.trim(),votes:emptyVotes(),
      timestamp:Date.now(),edited:false,mdFile:commentMdFile||null,replies:[]};
    setTimeout(()=>{
      savePosts(prev=>prev.map(p=>p.id!==postId?p:{...p,comments:[...(p.comments||[]),c]}));
      const owned={...ownedComments,[c.id]:true};setOwnedComments(owned);db.saveOwnedComments(owned);
      setCommentText("");setCommentMdFile(null);setCommentMdPreview(false);setErr("");
      setIsCommenting(false);
      showToast(lang==="ar"?"💬 تم إضافة تعليقك!":"💬 Comment added!");
    },isMobile?300:180);
  };

  // ── Add reply
  const addReply=(postId,commentId)=>{
    if (isBanned){setErr(s.banned);return;}
    if (isSpamQuality(replyText)){setErr(s.spamQuality);return;}
    if (!replyText.trim()||replyText.length<2){setErr(s.replyTooShort);return;}
    const rate=canPerformAction("reply");
    if (!rate.allowed){setErr(s.rateLimitReply(rate.waitSeconds));return;}
    setIsReplying2(true);
    const r={id:`reply-${Date.now()}`,text:replyText.trim(),timestamp:Date.now(),edited:false,mdFile:replyMdFile||null};
    setTimeout(()=>{
      savePosts(prev=>prev.map(p=>{
        if (p.id!==postId) return p;
        return {...p,comments:(p.comments||[]).map(c=>c.id!==commentId?c:{...c,replies:[...(c.replies||[]),r]})};
      }));
      const o={...ownedReplies,[r.id]:true};setOwnedReplies(o);db.saveOwnedReplies(o);
      setExpandedIds(prev=>({...prev,[commentId]:true}));
      setReplyText("");setReplyMdFile(null);setReplyMdPreview(false);setReplyingToId(null);setErr("");
      setIsReplying2(false);
      showToast(s.toastReplied);
    },isMobile?300:180);
  };

  // ── Delete / Edit
  const deletePost=(postId)=>{
    askConfirm(s.confirmDelete,()=>{
      savePosts(prev=>prev.filter(p=>p.id!==postId));
      const o={...ownedPosts};delete o[postId];setOwnedPosts(o);db.saveOwnedPosts(o);
      setActivePostId(null);showToast(s.toastDeleted);
    });
  };
  const deleteComment=(postId,commentId)=>{
    askConfirm(s.confirmDeleteComment,()=>{
      savePosts(prev=>prev.map(p=>p.id!==postId?p:{...p,comments:(p.comments||[]).filter(c=>c.id!==commentId)}));
      showToast(s.toastCommentDeleted);
    });
  };
  const deleteReply=(postId,commentId,replyId)=>{
    askConfirm(s.confirmDeleteReply,()=>{
      savePosts(prev=>prev.map(p=>{
        if (p.id!==postId) return p;
        return {...p,comments:(p.comments||[]).map(c=>c.id!==commentId?c:{...c,replies:(c.replies||[]).filter(r=>r.id!==replyId)})};
      }));
      showToast(s.toastReplyDeleted);
    });
  };
  const saveEditPost=(postId)=>{
    if (!editPostText.trim()||editPostText.length<5){setErr(s.eShort);return;}
    if (isSpamQuality(editPostText)){setErr(s.spamQuality);return;}
    savePosts(prev=>prev.map(p=>p.id!==postId?p:{...p,text:editPostText.trim(),edited:true}));
    setEditingPostId(null);setErr("");showToast(s.toastEdited);
  };
  const saveEditComment=(postId,commentId)=>{
    if (!editCommentText.trim()||editCommentText.length<2){setErr(s.commentTooShort);return;}
    if (isSpamQuality(editCommentText)){setErr(s.spamQuality);return;}
    savePosts(prev=>prev.map(p=>p.id!==postId?p:{...p,
      comments:(p.comments||[]).map(c=>c.id!==commentId?c:{...c,text:editCommentText.trim(),edited:true})}));
    setEditingCommentId(null);setErr("");showToast(s.toastCommentEdited);
  };
  const saveEditReply=(postId,commentId,replyId)=>{
    if (!editReplyText.trim()||editReplyText.length<2){setErr(s.replyTooShort);return;}
    if (isSpamQuality(editReplyText)){setErr(s.spamQuality);return;}
    savePosts(prev=>prev.map(p=>{
      if (p.id!==postId) return p;
      return {...p,comments:(p.comments||[]).map(c=>{
        if (c.id!==commentId) return c;
        return {...c,replies:(c.replies||[]).map(r=>r.id!==replyId?r:{...r,text:editReplyText.trim(),edited:true})};
      })};
    }));
    setEditingReplyInfo(null);setEditReplyText("");setErr("");showToast(s.toastReplyEdited);
  };
  const cancelEdit=()=>{
    setEditingPostId(null);setEditingCommentId(null);setEditingReplyInfo(null);
    setEditPostText("");setEditCommentText("");setEditReplyText("");setErr("");
  };

  // ── Data management (Settings → Danger zone)
  // يحذف نهائياً كل المنشورات/التعليقات/الردود التي أنشأها هذا الجهاز من الموقع بالكامل
  const purgeMyContent=()=>{
    savePosts(prev=>prev
      .filter(p=>!ownedPosts[p.id])
      .map(p=>({...p,
        comments:(p.comments||[])
          .filter(c=>!ownedComments[c.id])
          .map(c=>({...c,replies:(c.replies||[]).filter(r=>!ownedReplies[r.id])})),
      }))
    );
  };
  // يمسح فقط بصمة الملكية المحلية (الجهاز ينسى أنها له) دون التأثير على المحتوى نفسه بالموقع
  const purgeMyOwnership=()=>{
    setOwnedPosts({});db.saveOwnedPosts({});
    setOwnedComments({});db.saveOwnedComments({});
    setOwnedReplies({});db.saveOwnedReplies({});
  };
  const confirmPurgeContent=()=>{
    askDangerConfirm(s.dangerPurgeContent,()=>{
      purgeMyContent();purgeMyOwnership();
      setSettingsOpen(false);setSettingsPageOpen(false);showToast(s.toastPurged);
    });
  };
  const confirmPurgeOwnershipOnly=()=>{
    askDangerConfirm(s.dangerPurgeOwnership,()=>{
      purgeMyOwnership();
      setSettingsOpen(false);setSettingsPageOpen(false);showToast(s.toastOwnershipCleared);
    });
  };
  const openThread=(postId)=>{
    // نأخّر فتح الثريد فترة قصيرة جداً تساوي مدة حركة الضغط على الكرت
    // (ANIM.pressMs = 100ms، تحت عتبة إدراك التأخير البشري) — بهذا تكتمل
    // حركة الـ scale على الكرت بصرياً قبل ما يُستبدل فجأة بالثريد، بدل
    // أن تُقطع منتصف الحركة كما كان يحصل سابقاً.
    setThreadPending(postId);
    setTimeout(()=>{
      setActivePostId(postId);
      setCommentText("");setCommentMdFile(null);setCommentMdPreview(false);
      setReplyingToId(null);setReplyText("");setReplyMdFile(null);setReplyMdPreview(false);
      setExpandedIds({});cancelEdit();
      setThreadPending(null);
      // ندفع حالة جديدة لتاريخ المتصفح كي يقدر زر "رجوع" يرجّع المستخدم للفيد
      // بدل ما يطلّعه من التطبيق بالكامل (لأنه ما كان في history.pushState سابقاً).
      try { window.history.pushState({inkoreThread:postId},""); } catch {}
    }, ANIM.pressMs);
  };
  const closeThread=(fromPopState=false)=>{
    // الإغلاق هو انتقال شاشة كامل وليس مجرد ضغطة زر، فهنا فعلاً ننتظر
    // اكتمال حركة الخروج (threadExit) قبل تنفيذ الوظيفة (إزالة الثريد من
    // الـ DOM فعلياً) — بدل ما تُقطع الحركة منتصفها بإزالة فورية للعنصر.
    setThreadClosing(true);
    setTimeout(()=>{
      setActivePostId(null);
      setCommentText("");setCommentMdFile(null);setCommentMdPreview(false);
      setReplyingToId(null);setReplyText("");setReplyMdFile(null);setReplyMdPreview(false);
      setExpandedIds({});cancelEdit();
      setThreadClosing(false);
      // إذا أُغلقت الثريد بزر داخل التطبيق (مش عبر زر رجوع المتصفح)، نرجع خطوة
      // بالـ history حتى لا تتراكم حالات فارغة تخلي المستخدم يضغط رجوع مرتين.
      if (!fromPopState) {
        try { if (window.history.state?.inkoreThread) window.history.back(); } catch {}
      }
    }, ANIM.viewMs);
  };

  // ── ربط زر رجوع المتصفح بإغلاق الثريد بدل الخروج من التطبيق
  useEffect(()=>{
    const onPopState=()=>{
      if (activePostId!==null) closeThread(true);
    };
    window.addEventListener("popstate",onPopState);
    return ()=>window.removeEventListener("popstate",onPopState);
  },[activePostId]);
  // ── فتح ثريد منشور/تعليق من داخل صفحة الملف الشخصي: نغلق صفحة الملف
  // الشخصي أولاً ثم نفتح الثريد بنفس دالة openThread الموحّدة، حتى لا
  // تتراكم شاشتان overlay فوق بعض.
  const openThreadFromProfile=(postId)=>{
    setProfilePageOpen(false);
    openThread(postId);
  };

  // ── نسخ نص عنصر (منشور/تعليق/رد) للحافظة. navigator.clipboard غير متاح
  // ببعض السياقات (مثل iframe غير آمن)، لذا نوفر fallback عبر textarea مؤقت.
  const copyItemText=(text)=>{
    const done=()=>showToast(s.toastCopied);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(()=>fallbackCopy(text,done));
    } else fallbackCopy(text,done);
  };
  const fallbackCopy=(text,done)=>{
    try {
      const ta=document.createElement("textarea");
      ta.value=text; ta.style.position="fixed"; ta.style.opacity="0";
      document.body.appendChild(ta); ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      done();
    } catch {}
  };
  // ── مشاركة عنصر: يستخدم Web Share API إن كان متاحاً (يفتح قائمة المشاركة
  // الأصلية بالجهاز)، وإلا يرجع تلقائياً لنسخ النص كبديل عملي.
  const shareItemText=(text)=>{
    if (navigator.share) {
      navigator.share({title:s.shareTitle,text}).then(()=>showToast(s.toastShared)).catch(()=>{});
    } else copyItemText(text);
  };

  const toggleReplies=(cid)=>setExpandedIds(prev=>({...prev,[cid]:!prev[cid]}));
  const startReply=(cid)=>{
    if (replyingToId===cid){setReplyingToId(null);setReplyText("");setReplyMdFile(null);}
    else{setReplyingToId(cid);setExpandedIds(prev=>({...prev,[cid]:true}));setReplyText("");setReplyMdFile(null);}
    setErr("");
  };

  /* — 7.5 Shared Styles — */
  // ── Shared styles (responsive)
  // أضفنا transition هنا (بدل ما تتكرر يدوياً بكل زر) حتى ترث كل الأزرار
  // بالموقع نفس النعومة بالانتقال (لون/خلفية/حدود) تلقائياً دون استثناءات.
  const btn0={WebkitTapHighlightColor:"transparent",touchAction:"manipulation",cursor:"pointer",
    fontFamily:s.font,transition:TRANSITIONS.colorChangeExtended};
  const cardStyle={background:CL.surface,border:BORDERS.default,borderRadius:isMobile?14:18,padding:R.cardPad};
  const inputBase={
    background:"rgba(0,0,0,0.15)",border:BORDERS.default,borderRadius:RADIUS.sm,
    color:CL.text,fontSize:R.inputFont,fontFamily:s.font,
    boxSizing:"border-box",padding:"10px 12px",outline:OUTLINE_NONE,
    WebkitAppearance:"none",  // Fix iOS styling
  };
  const btnPrimary={...btn0,background:`linear-gradient(135deg,${CL.edit} 0%,#5475A8 100%)`,
    border:"none",borderRadius:RADIUS.sm,padding:"8px 14px",color:"#fff",
    fontSize:R.btnFont,fontWeight:700,minHeight:R.touchH};
  const btnSecondary={...btn0,background:CL.borderFaint,border:BORDERS.default,
    borderRadius:RADIUS.sm,padding:"8px 12px",color:CL.textSub,
    fontSize:R.btnFont,fontWeight:700,minHeight:R.touchH};

  /* — 7.6 Render Helpers (دوال صغيرة تُرجع JSX، تُستدعى داخل العرض الرئيسي) — */
  // ── زر الرجوع الموحّد: يُستخدم بكل مكان بالموقع فيه "رجوع" (الثريد، الإعدادات،
  // وأي صفحة مستقبلية) بنفس الشكل تماماً، حتى لا يختلف الوزن البصري أو السهم
  // باختلاف الصفحة. السهم يعكس اتجاهه تلقائياً حسب لغة الواجهة (rtl/ltr).
  // label اختياري: لو ما انعطى يظهر السهم لوحده (مفيد لو احتجنا زر رجوع مدمج
  // بصف فيه عنصر آخر مثل العنوان).
  const BackButton=({onClick,label})=>(
    <button onClick={onClick}
      style={{...btn0,background:CL.surface,border:BORDERS.default,
        borderRadius:RADIUS.lg,padding:isMobile?"11px 16px":"8px 14px",
        color:CL.accent,fontSize:FONT.body,fontWeight:700,
        minHeight:isMobile?44:"auto",display:"inline-flex",alignItems:"center",gap:6}}>
      <span style={{lineHeight:1,display:"flex",
        transform:s.d==="rtl"?"none":"scaleX(-1)" /* نفس أيقونة السهم، بانعكاس أفقي حسب اتجاه اللغة بدل رسم نسختين */}}>
        <IconArrowRight size={16} color={CL.accent}/>
      </span>
      {label&&<span>{label}</span>}
    </button>
  );

  // ── Reaction row
  const reactionRow=(postId,commentId,votes)=>(
    <div style={{display:"flex",gap:isMobile?4:5,flexWrap:"wrap",alignItems:"center"}}>
      {REACTIONS.map(r=>{
        const byKey=r.key==="flag"?"flaggedBy":`${r.key}By`;
        const hasVoted=(votes?.[byKey]||[]).includes(deviceHash);
        const count=votes?.[r.key]||0;
        const Icon=REACTION_ICONS[r.key];
        const iconColor=hasVoted?(r.isModeration?CL.flag:CL.accent):CL.textMuted;
        return(
          <button key={r.key}
            onClick={e=>{e.stopPropagation();updateVotes(postId,commentId,r.key);}}
            style={{...btn0,
              display:"flex",alignItems:"center",justifyContent:"center",gap:4,
              background:hasVoted?(r.isModeration?CL.flagDim:CL.accentDim):CL.borderFaint,
              border:hasVoted?(r.isModeration?BORDERS.flag:BORDERS.accent):BORDERS.default,
              borderRadius:RADIUS.pill,padding:R.reactionPad,minHeight:isMobile?36:"auto",
              color:iconColor,
              fontSize:R.reactionFontSize,fontWeight:700,transition:TRANSITIONS.colorChange,
            }}>
            <span style={{lineHeight:1,display:"flex"}}>
              <Icon size={14} color={iconColor} filled={r.key==="relatable"&&hasVoted}/>
            </span>
            {count>0&&<span>{count}</span>}
          </button>
        );
      })}
    </div>
  );

  // ── MD badge — بادج قابل للضغط: يفتح/يطوي معاينة Markdown مُصيَّرة فعلياً
  // (وليس نصاً خاماً) أسفله. يستخدم expandedIds بنفس آلية طيّ الردود، بمفتاح
  // مختلف (md-...) حتى لا يتعارض مع حالة طيّ التعليقات نفسها.
  const mdBadge=(file,badgeKey)=>{
    const open=!!expandedIds[`md-${badgeKey}`];
    return (
      <div style={{marginBottom:8}}>
        <button onClick={e=>{e.stopPropagation();setExpandedIds(prev=>({...prev,[`md-${badgeKey}`]:!prev[`md-${badgeKey}`]}));}}
          style={{...btn0,display:"inline-flex",alignItems:"center",gap:4,background:CL.editDim,
            border:BORDERS.edit,borderRadius:RADIUS.sm,padding:"4px 10px",
            fontSize:FONT.caption,color:CL.edit,maxWidth:"100%",overflow:"hidden",
            textOverflow:"ellipsis",whiteSpace:"nowrap",minHeight:isMobile?32:"auto"}}>
          {s.attachedFile(file.name)} {open?"▲":"▼"}
        </button>
        {open&&(
          <div className="md-render-scope"
            style={{marginTop:6,background:CL.borderFaint,border:BORDERS.edit,
              borderRadius:RADIUS.sm,padding:"8px 12px",maxHeight:220,overflowY:"auto",
              fontSize:FONT.label,wordBreak:"break-word"}}
            dangerouslySetInnerHTML={{__html:renderMarkdown(file.content)}}/>
        )}
      </div>
    );
  };

  // ── MD Attach Row (reusable) — الزر الرئيسي يفتح صفحة محرر Markdown الكاملة
  // بدل حقل رفع مباشر؛ refEl/onFile ما زالا مستخدمين داخل صفحة المحرر نفسها
  // للاستيراد من الجهاز، فيبقيان كـ props هنا لتمريرهما.
  const MdAttachRow=({target,file,onRemove})=>(
    <div style={{marginTop:6}}>
      <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
        <button onClick={()=>openMdEditor(target,file)}
          style={{...btn0,display:"inline-flex",alignItems:"center",gap:4,background:CL.editDim,
            border:BORDERS.edit,borderRadius:RADIUS.pill,padding:"6px 10px",
            color:CL.edit,fontSize:FONT.caption,fontWeight:700,minHeight:isMobile?36:"auto"}}>
          📎 {file ? s.mdEditorEditing(file.name||"") : s.attachMd}
        </button>
        {file&&(
          <>
            <span style={{background:CL.editDim,border:BORDERS.edit,
              borderRadius:RADIUS.sm,padding:"4px 8px",fontSize:FONT.caption,color:CL.edit,
              maxWidth:isMobile?100:160,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
              {s.attachedFile(file.name)}
            </span>
            <button onClick={onRemove}
              style={{...btn0,background:"transparent",border:BORDERS.danger,
                borderRadius:RADIUS.sm,padding:"4px 8px",color:CL.danger,fontSize:FONT.caption,minHeight:isMobile?32:"auto"}}>
              {s.removeFile}
            </button>
          </>
        )}
      </div>
    </div>
  );

  // ── MD Editor Page — صفحة كاملة (fixed overlay فوق كل شيء) تحل محل الرفع
  // المباشر. ديسكتوب: محرر + معاينة جنب بعض دائماً (split ثابت).
  // موبايل: تبويب واحد ظاهر (كتابة/معاينة) مع زر تبديل.
  // شريط أدوات يُدرج صياغة Markdown حول التحديد الحالي بالـ textarea (أو
  // بموضع المؤشر لو لا يوجد تحديد) عبر manipulation مباشر لـ selectionStart/End.
  const MdEditorPage=()=>{
    const [name,setName]=useState(mdEditorState.file.name||"");
    const [content,setContent]=useState(mdEditorState.file.content||"");
    const [mobileTab,setMobileTab]=useState("write"); // "write" | "preview"
    const taRef=useRef();
    const uploadRef=useRef();

    // ── يُدرج/يُحيط نص التنسيق حول التحديد الحالي داخل الـ textarea، ويُبقي
    // التركيز والمؤشر بمكان منطقي بعد الإدراج (بعد الفاصلة، لا بنهاية النص).
    const wrapSelection=(before,after="",placeholder="")=>{
      const ta=taRef.current;
      if(!ta){setContent(c=>c+before+placeholder+after);return;}
      const start=ta.selectionStart, end=ta.selectionEnd;
      const selected=content.slice(start,end)||placeholder;
      const next=content.slice(0,start)+before+selected+after+content.slice(end);
      setContent(next);
      requestAnimationFrame(()=>{
        ta.focus();
        const cursor=start+before.length+selected.length+after.length;
        ta.setSelectionRange(cursor,cursor);
      });
    };
    // ── يُدرج بادئة بداية كل سطر بالتحديد (للعناوين/الاقتباس/القوائم)
    const prefixLines=(prefix)=>{
      const ta=taRef.current;
      if(!ta){setContent(c=>c+prefix);return;}
      const start=ta.selectionStart, end=ta.selectionEnd;
      const lineStart=content.lastIndexOf("\n",start-1)+1;
      const before=content.slice(0,lineStart);
      const target=content.slice(lineStart,end)||"";
      const withPrefix=(target||"\u200b").split("\n").map(l=>prefix+l).join("\n");
      const next=before+withPrefix+content.slice(end);
      setContent(next);
      requestAnimationFrame(()=>{ta.focus();});
    };

    const tools=[
      {icon:"𝐁",label:s.mdToolBold,action:()=>wrapSelection("**","**","نص عريض")},
      {icon:"𝑰",label:s.mdToolItalic,action:()=>wrapSelection("*","*","نص مائل")},
      {icon:"S̶",label:s.mdToolStrike,action:()=>wrapSelection("~~","~~","نص")},
      {icon:"H1",label:s.mdToolH1,action:()=>prefixLines("# ")},
      {icon:"H2",label:s.mdToolH2,action:()=>prefixLines("## ")},
      {icon:"❝",label:s.mdToolQuote,action:()=>prefixLines("> ")},
      {icon:"•",label:s.mdToolUl,action:()=>prefixLines("- ")},
      {icon:"1.",label:s.mdToolOl,action:()=>prefixLines("1. ")},
      {icon:"</>",label:s.mdToolCode,action:()=>wrapSelection("`","`","code")},
      {icon:"{ }",label:s.mdToolCodeBlock,action:()=>wrapSelection("```\n","\n```","")},
      {icon:"🔗",label:s.mdToolLink,action:()=>wrapSelection("[","](https://)","نص الرابط")},
      {icon:"🖼",label:s.mdToolImage,action:()=>wrapSelection("![","](https://)","وصف الصورة")},
      {icon:"—",label:s.mdToolHr,action:()=>setContent(c=>c+(c.endsWith("\n")||!c?"":"\n")+"\n---\n")},
    ];

    const handleUploadFile=(file)=>{
      readMdFile(file,({name:fn,content:fc})=>{setName(fn);setContent(fc);});
    };

    const handleSave=()=>{
      saveMdEditor({name:name.trim()||"note.md",content});
    };

    const toolbarBtnStyle={...btn0,minWidth:isMobile?38:34,height:isMobile?38:32,
      display:"flex",alignItems:"center",justifyContent:"center",
      background:CL.borderFaint,border:BORDERS.default,borderRadius:RADIUS.sm,
      color:CL.text,fontSize:13,fontWeight:700,flexShrink:0};

    const writePane=(
      <div style={{display:"flex",flexDirection:"column",height:"100%",minHeight:0}}>
        <div style={{display:"flex",gap:6,padding:"8px 10px",overflowX:"auto",
          borderBottom:BORDERS.default,flexShrink:0,WebkitOverflowScrolling:"touch"}}>
          {tools.map((t,i)=>(
            <button key={i} type="button" title={t.label} onClick={t.action} style={toolbarBtnStyle}>
              {t.icon}
            </button>
          ))}
        </div>
        <textarea ref={taRef} value={content} onChange={e=>setContent(e.target.value)}
          placeholder={s.mdEditorPlaceholder}
          style={{flex:1,width:"100%",border:"none",outline:OUTLINE_NONE,resize:"none",
            padding:isMobile?"14px":"16px 20px",fontSize:R.textareaFont,lineHeight:1.7,
            fontFamily:"ui-monospace, SF Mono, Menlo, Consolas, monospace",
            background:"transparent",color:CL.text,boxSizing:"border-box",minHeight:0}}/>
      </div>
    );

    const previewPane=(
      <div className="md-render-scope" style={{flex:1,overflowY:"auto",
        padding:isMobile?"16px":"18px 24px",minHeight:0}}>
        {content.trim()?(
          <div dangerouslySetInnerHTML={{__html:renderMarkdown(content)}}/>
        ):(
          <div style={{textAlign:"center",padding:"48px 20px",color:CL.textMuted,fontSize:FONT.body}}>
            {s.mdEditorPreviewEmpty}
          </div>
        )}
      </div>
    );

    return (
      <div style={{position:"fixed",inset:0,zIndex:1200,background:CL.bg,
        display:"flex",flexDirection:"column",animation:`mdEditorFadeIn ${ANIM.normal}`}}>

        {/* ── Header */}
        <div style={{display:"flex",alignItems:"center",gap:10,flexShrink:0,
          padding:isMobile?"12px 14px":"14px 20px",borderBottom:BORDERS.default,
          background:CL.surface}}>
          <button onClick={closeMdEditor}
            style={{...btn0,color:CL.textSub,fontSize:FONT.heading,padding:"4px 8px",
              minHeight:isMobile?40:"auto"}}>
            {s.d==="rtl"?"→":"←"}
          </button>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:FONT.body,fontWeight:700,color:CL.text}}>{s.mdEditorTitle}</div>
          </div>
          <input value={name} onChange={e=>setName(e.target.value)} placeholder={s.mdFileNamePh}
            style={{...inputBase,width:isMobile?110:180,fontSize:FONT.caption,
              padding:"7px 10px",flexShrink:0}}/>
        </div>

        {/* ── Toolbar row 2: استيراد من الجهاز + تبويب موبايل */}
        <div style={{display:"flex",alignItems:"center",gap:8,flexShrink:0,
          padding:isMobile?"8px 14px":"10px 20px",borderBottom:BORDERS.default,
          flexWrap:"wrap"}}>
          <button onClick={()=>uploadRef.current?.click()}
            style={{...btn0,display:"inline-flex",alignItems:"center",gap:5,
              background:CL.borderFaint,border:BORDERS.default,borderRadius:RADIUS.pill,
              padding:"6px 12px",color:CL.textSub,fontSize:FONT.caption,fontWeight:700,
              minHeight:isMobile?36:"auto"}}>
            📥 {s.mdEditorUpload}
          </button>
          <input ref={uploadRef} type="file" accept=".md" style={{display:"none"}}
            onChange={e=>{if(e.target.files[0])handleUploadFile(e.target.files[0]);e.target.value="";}}/>

          {isMobile&&(
            <div style={{display:"flex",gap:4,marginInlineStart:"auto",background:CL.surface,
              borderRadius:RADIUS.md,padding:3,border:BORDERS.default}}>
              {[{k:"write",label:s.mdEditorTabWrite},{k:"preview",label:s.mdEditorTabPreview}].map(tb=>(
                <button key={tb.k} onClick={()=>setMobileTab(tb.k)}
                  style={{...btn0,padding:"6px 14px",borderRadius:RADIUS.sm,
                    background:mobileTab===tb.k?CL.accentDim:"transparent",
                    border:mobileTab===tb.k?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                    color:mobileTab===tb.k?CL.accent:CL.textMuted,
                    fontSize:FONT.caption,fontWeight:700,minHeight:32}}>
                  {tb.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── Body: split ثابت بالديسكتوب / تبويب واحد بالموبايل */}
        <div style={{flex:1,display:"flex",minHeight:0,
          flexDirection:isMobile?"column":"row"}}>
          {isMobile ? (
            mobileTab==="write" ? writePane : previewPane
          ) : (
            <>
              <div style={{flex:1,minWidth:0,borderInlineEnd:BORDERS.default,
                display:"flex",flexDirection:"column"}}>
                {writePane}
              </div>
              <div style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
                {previewPane}
              </div>
            </>
          )}
        </div>

        {/* ── Footer actions */}
        <div style={{display:"flex",gap:8,justifyContent:"flex-end",flexShrink:0,
          padding:isMobile?"12px 14px":"12px 20px",borderTop:BORDERS.default,
          background:CL.surface}}>
          <button onClick={closeMdEditor}
            style={{...btn0,background:CL.borderFaint,border:BORDERS.default,
              borderRadius:RADIUS.md,padding:isMobile?"11px 18px":"9px 18px",
              color:CL.textSub,fontSize:FONT.body,fontWeight:700,
              minHeight:isMobile?44:"auto"}}>
            {s.mdEditorCancel}
          </button>
          <button onClick={handleSave}
            style={{...btn0,background:`linear-gradient(135deg,${CL.edit} 0%,#5475A8 100%)`,
              border:"none",borderRadius:RADIUS.md,padding:isMobile?"11px 18px":"9px 18px",
              color:"#fff",fontSize:FONT.body,fontWeight:700,
              minHeight:isMobile?44:"auto"}}>
            {s.mdEditorSave}
          </button>
        </div>
      </div>
    );
  };

  // ── Owner buttons
  // ── قائمة ⋯ الموحّدة: تُستخدم لكل من المنشور/التعليق/الرد بنفس المكوّن.
  // isOwner يتحكم بظهور تعديل/حذف؛ نسخ/مشاركة متاحان دائماً لأي عنصر.
  // menuKey فريد لكل عنصر (post-id / comment-id / reply-id) لتحديد أي قائمة مفتوحة حالياً.
  const ActionMenuButton=({menuKey,text,isOwner,onEdit,onDelete})=>{
    const isOpen=openMenuFor===menuKey;
    return(
      <div data-action-menu style={{position:"relative"}} onClick={e=>e.stopPropagation()}>
        <button onClick={()=>setOpenMenuFor(isOpen?null:menuKey)} aria-label={s.actionMenuLabel}
          style={{...btn0,background:"none",border:"none",color:CL.textMuted,
            fontSize:FONT.subhead,fontWeight:800,lineHeight:1,
            padding:isMobile?"4px 8px":"2px 6px",minHeight:isMobile?32:"auto"}}>
          ⋯
        </button>
        {isOpen&&(
          <div style={{position:"absolute",top:"calc(100% + 4px)",
            [s.d==="rtl"?"left":"right"]:0,
            background:CL.surface,border:BORDERS.default,borderRadius:RADIUS.md,
            boxShadow:SHADOWS.modal,zIndex:1051,minWidth:150,overflow:"hidden",
            animation:`popInCard ${ANIM.fast}`}}>
            <button onClick={()=>{copyItemText(text);setOpenMenuFor(null);}}
              style={{...btn0,display:"flex",alignItems:"center",gap:8,width:"100%",
                textAlign:s.d==="rtl"?"right":"left",background:"none",border:"none",
                padding:"10px 14px",color:CL.text,fontSize:FONT.body,fontWeight:600}}>
              📋 {s.actionCopy}
            </button>
            <button onClick={()=>{shareItemText(text);setOpenMenuFor(null);}}
              style={{...btn0,display:"flex",alignItems:"center",gap:8,width:"100%",
                textAlign:s.d==="rtl"?"right":"left",background:"none",border:"none",
                padding:"10px 14px",color:CL.text,fontSize:FONT.body,fontWeight:600}}>
              🔗 {s.actionShare}
            </button>
            {isOwner&&(
              <>
                <div style={{height:1,background:CL.border}}/>
                <button onClick={()=>{onEdit();setOpenMenuFor(null);}}
                  style={{...btn0,display:"flex",alignItems:"center",gap:8,width:"100%",
                    textAlign:s.d==="rtl"?"right":"left",background:"none",border:"none",
                    padding:"10px 14px",color:CL.edit,fontSize:FONT.body,fontWeight:600}}>
                  <IconPencil size={13} color={CL.edit}/> {s.actionEdit}
                </button>
                <button onClick={()=>{onDelete();setOpenMenuFor(null);}}
                  style={{...btn0,display:"flex",alignItems:"center",gap:8,width:"100%",
                    textAlign:s.d==="rtl"?"right":"left",background:"none",border:"none",
                    padding:"10px 14px",color:CL.danger,fontSize:FONT.body,fontWeight:600}}>
                  <IconTrash size={13} color={CL.danger}/> {s.actionDelete}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  /* — 7.3 Derived Data (مشتقة من الـ state مباشرة، بدون منطق معقّد) — */
  const activePost=posts.find(p=>p.id===activePostId);

  // ── ملفي الشخصي (محلي حالياً): منشوراتي مرتبة بالأحدث أولاً
  const myPosts=posts
    .filter(p=>ownedPosts[p.id])
    .sort((a,b)=>b.timestamp-a.timestamp);

  // ── تعليقاتي: نمر على كل المنشورات ونستخرج تعليقاتي فقط، مع الاحتفاظ
  // بمرجع المنشور الأصل (postId + عنوان مختصر) للعرض والتنقل عند الضغط.
  const myComments=posts
    .flatMap(p=>(p.comments||[])
      .filter(c=>ownedComments[c.id])
      .map(c=>({...c,postId:p.id,postText:p.text})))
    .sort((a,b)=>b.timestamp-a.timestamp);

  // ── إجمالي التفاعلات المُستلمة على منشوراتي (مجموع كل الأصوات باستثناء البلاغات)
  const myTotalReactions=myPosts.reduce((sum,p)=>sum+sumVotes(p.votes),0);

  /* — 7.7 JSX Return (الواجهة النهائية المعروضة) — */
  return(
    <div style={{
      direction:s.d, fontFamily:s.font, background:CL.bg, color:CL.text,
      minHeight:"100dvh", width:"100%", padding:R.pagePad,
      boxSizing:"border-box", // ← بدونه كان padding يُضاف فوق 100%، فيتمدد العرض
                               //    الفعلي أكبر من الشاشة ويسبب الزوم/السكرول الأفقي
      overflowX:"hidden", // prevent horizontal scroll
      WebkitFontSmoothing:"antialiased",
      display:"flex", flexDirection:"column", // يسمح بتثبيت الفوتر بأسفل الشاشة دائماً
    }}>
      {/* ── Global tap/focus fix:
          يلغي الوميض الأزرق (tap highlight) والحواف البيضاء (outline)
          الافتراضية من المتصفح عند الضغط على أي عنصر، مع إبقاء outline
          واضح فقط عند التنقل بلوحة المفاتيح (Tab) حفاظاً على إمكانية الوصول */}
      <style>{`
        *, *::before, *::after {
          box-sizing: border-box; /* قاعدة أساسية تمنع أي عنصر مستقبلي من تكرار
            نفس مشكلة "تمدد العرض بسبب padding/border" بدون الحاجة لكتابتها
            يدوياً بكل عنصر */
        }
        html, body, #root {
          width: 100%;
          overflow-x: hidden;
          margin: 0; /* يلغي هامش body الافتراضي (8px بمعظم المتصفحات) الذي كان
            يترك فراغاً حول التطبيق بالكامل، خصوصاً ملحوظ بأعلى الصفحة */
          padding: 0;
        }
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }
        button, [role="button"], a, input, textarea, select {
          -webkit-tap-highlight-color: transparent;
        }
        button:focus, [role="button"]:focus, a:focus,
        input:focus, textarea:focus, select:focus, div:focus {
          outline: none;
        }
        button:focus-visible, [role="button"]:focus-visible, a:focus-visible,
        input:focus-visible, textarea:focus-visible, select:focus-visible, div:focus-visible {
          outline: 2px solid ${CL.accentBorder};
          outline-offset: 2px;
        }
        /* إخفاء شريط التمرير البصري لصف pills التصنيف، يبقى قابل للتمرير وظيفياً */
        [role="radiogroup"]::-webkit-scrollbar { display: none; }

        /* ── متغيرات عرض Markdown — تُقرأ من renderMarkdown عبر var()، وترث
           لون الثيم الحالي تلقائياً بدون تمرير CL يدوياً بكل عنصر HTML مُولَّد */
        .md-render-scope {
          --md-code-bg: ${CL.borderFaint};
          --md-link: ${CL.edit};
          --md-quote: ${CL.accent};
          --md-quote-text: ${CL.textSub};
          --md-border: ${CL.border};
          color: ${CL.text};
        }
        .md-render-scope pre, .md-render-scope code {
          font-family: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
        }
        .md-render-scope h1, .md-render-scope h2, .md-render-scope h3,
        .md-render-scope h4, .md-render-scope h5, .md-render-scope h6 { color: ${CL.text}; }
        .md-render-scope img { display: block; }

        @keyframes mdEditorSlideIn {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes mdEditorFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        /* ── Unified press feedback ─────────────────────────────────────────
           المشكلة مع scale: يبدو الزر "يهرب" من الإصبع على العناصر الصغيرة.
           المشكلة مع brightness: لا يعمل على خلفيات شفافة (borderFaint/surface).
           الحل: ::after pseudo-element overlay — طبقة شفافة فوق الزر تتحول
           لـ rgba عند :active، تعمل على أي خلفية (شفافة أو solid أو gradient)
           لأنها مستقلة عن لون الخلفية الأصلي. ────────────────────────────── */

        button, [role="button"], [role="radio"] {
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        button::after, [role="button"]::after, [role="radio"]::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background: transparent;
          transition: background ${ANIM.normal};
          pointer-events: none;
        }
        button:active::after, [role="button"]:active::after, [role="radio"]:active::after {
          background: rgba(0,0,0,0.10);
          transition: background 0s; /* فوري عند الضغط، ناعم عند الإفراج */
        }

        /* — الكروت الكبيرة تبقى على scale — لها كتلة بصرية كافية تجعله مناسباً */
        [data-pressable="card"] {
          transition: transform ${ANIM.press}, box-shadow ${ANIM.press};
          will-change: transform;
        }
        [data-pressable="card"]:active:not(:has(button:active)) {
          transform: scale(0.988);
        }
        [data-pressable="card"]:not(:active) {
          transition: transform ${ANIM.normal}, box-shadow ${ANIM.normal};
        }

        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popInCard {
          from { opacity: 0; transform: scale(0.96); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes inkoreSpin {
          to { transform: rotate(360deg); }
        }
        /* دخول/خروج شاشة الثريد — تُستخدم بالتزامن مع threadPending/threadClosing
           بالـ JS، فتُعطي إحساس انتقال متصل بدل تبديل فوري بين الفيد والثريد */
        @keyframes threadEnter {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes threadExit {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(14px); }
        }
      `}</style>

      {/* ── صفحة محرر Markdown الكاملة — أعلى مستوى تكديس بالتطبيق (zIndex:1200
          داخل المكوّن نفسه) لأنها تحل محل كل شيء أسفلها بالكامل مؤقتاً */}
      {mdEditorState&&<MdEditorPage/>}

      {/* ── Custom confirm modal (replaces window.confirm) */}
      {confirmState&&(
        <div onClick={closeConfirm}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",
            display:"flex",alignItems:"center",justifyContent:"center",
            padding:20,zIndex:1000,boxSizing:"border-box",
            animation:`fadeInOverlay ${ANIM.normal}`}}>
          <div onClick={e=>e.stopPropagation()}
            style={{...cardStyle,maxWidth:360,width:"100%",
              boxShadow:SHADOWS.modal,
              animation:`popInCard ${ANIM.sheet}`}}>
            <div style={{fontSize:FONT.subhead,color:CL.text,lineHeight:1.6,marginBottom:18,
              wordBreak:"break-word"}}>
              {confirmState.message}
            </div>
            <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
              <button onClick={closeConfirm}
                style={{...btn0,background:CL.borderFaint,border:BORDERS.default,
                  borderRadius:RADIUS.md,padding:isMobile?"11px 16px":"8px 16px",
                  color:CL.textSub,fontSize:FONT.body,fontWeight:700,
                  minHeight:isMobile?44:"auto"}}>
                {s.confirmNo}
              </button>
              <button onClick={()=>{const fn=confirmState.onConfirm;closeConfirm();fn();}}
                style={{...btn0,background:CL.dangerDim,border:BORDERS.danger,
                  borderRadius:RADIUS.md,padding:isMobile?"11px 16px":"8px 16px",
                  color:CL.danger,fontSize:FONT.body,fontWeight:700,
                  minHeight:isMobile?44:"auto"}}>
                {s.confirmYes}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Danger confirm modal: overlay أحمر + عدّاد تنازلي لإجراءات الحذف النهائية
          لا يُغلق بالضغط خارج المودال عمداً — يجب اتخاذ قرار واضح (إلغاء أو تأكيد) */}
      {dangerState&&(
        <div style={{position:"fixed",inset:0,
          background:"linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), rgba(192,85,74,0.18)",
          display:"flex",alignItems:"center",justifyContent:"center",
          padding:20,zIndex:1001,boxSizing:"border-box",
          animation:`fadeInOverlay ${ANIM.normal}`}}>
          <div style={{...cardStyle,maxWidth:380,width:"100%",
            border:BORDERS.danger,
            boxShadow:SHADOWS.danger,
            animation:`popInCard ${ANIM.sheet}`}}>
            <div style={{fontSize:FONT.display,textAlign:"center",marginBottom:10}}>⚠️</div>
            <div style={{fontSize:FONT.subhead,color:CL.text,lineHeight:1.7,marginBottom:20,
              wordBreak:"break-word",textAlign:"center"}}>
              {dangerState.message}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button onClick={()=>{const fn=dangerState.onConfirm;closeDangerConfirm();fn();}}
                disabled={dangerCountdown>0}
                style={{...btn0,
                  background:dangerCountdown>0?CL.borderFaint:CL.dangerDim,
                  border:dangerCountdown>0?BORDERS.default:BORDERS.danger,
                  borderRadius:RADIUS.md,padding:isMobile?"13px 16px":"10px 16px",
                  color:dangerCountdown>0?CL.textMuted:CL.danger,
                  fontSize:FONT.body,fontWeight:700,
                  cursor:dangerCountdown>0?"not-allowed":"pointer",
                  minHeight:isMobile?48:"auto",
                  opacity:dangerCountdown>0?0.7:1,
                  transition:TRANSITIONS.colorChange}}>
                {s.dangerConfirmBtn(dangerCountdown)}
              </button>
              <button onClick={closeDangerConfirm}
                style={{...btn0,background:CL.borderFaint,border:BORDERS.default,
                  borderRadius:RADIUS.md,padding:isMobile?"13px 16px":"10px 16px",
                  color:CL.textSub,fontSize:FONT.body,fontWeight:700,
                  minHeight:isMobile?48:"auto"}}>
                {s.confirmNo}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Settings bottom sheet (مختصر: مدخل سريع لصفحة الإعدادات الكاملة) */}
      {settingsOpen&&(
        <div onClick={()=>setSettingsOpen(false)}
          style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.55)",
            display:"flex",alignItems:"flex-end",justifyContent:"center",
            zIndex:999,animation:`fadeInOverlay ${ANIM.normal}`}}>
          <div onClick={e=>e.stopPropagation()}
            style={{background:CL.surface,borderRadius:RADIUS.sheetTop,
              maxWidth:700,width:"100%",boxSizing:"border-box",
              padding:isMobile?"16px 16px 28px":"20px 24px 28px",
              border:BORDERS.default,borderBottom:"none",
              animation:`slideUpSheet ${ANIM.sheet}`}}>

            {/* مقبض بصري للسحب */}
            <div style={{width:36,height:4,background:CL.border,borderRadius:RADIUS.xs,
              margin:"0 auto 18px"}}/>

            <button onClick={()=>{setSettingsOpen(false);setSettingsPageOpen(true);}}
              style={{...btn0,width:"100%",display:"flex",alignItems:"center",
                justifyContent:"space-between",
                background:CL.borderFaint,border:BORDERS.default,
                borderRadius:RADIUS.lg,padding:isMobile?"14px 16px":"12px 16px",
                color:CL.text,minHeight:isMobile?48:"auto"}}>
              <span style={{fontSize:FONT.subhead,fontWeight:800}}>{s.settings}</span>
              <span style={{fontSize:FONT.title,color:CL.textSub}}>⚙️</span>
            </button>
          </div>
        </div>
      )}

      {/* ── صفحة الإعدادات الكاملة (overlay يغطي كامل الشاشة) */}
      {settingsPageOpen&&(
        <div style={{position:"fixed",inset:0,background:CL.bg,zIndex:990,
          overflowY:"auto",animation:`fadeInOverlay ${ANIM.normal}`}}>
          <div style={{maxWidth:700,margin:"0 auto",width:"100%",boxSizing:"border-box",
            padding:isMobile?"14px 14px 40px":"20px 24px 40px"}}>

            {/* شريط علوي: رجوع + عنوان في المنتصف الحقيقي */}
            <div style={{position:"relative",display:"flex",alignItems:"center",
              marginBottom:24,paddingTop:isMobile?6:8,minHeight:44}}>
              <BackButton onClick={()=>setSettingsPageOpen(false)} label={s.back}/>
              <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",
                fontSize:FONT.title,fontWeight:800,color:CL.text,
                whiteSpace:"nowrap",pointerEvents:"none"}}>
                {s.settings}
              </div>
            </div>

            {/* اللغة */}
            <div style={{fontSize:FONT.caption,color:CL.textMuted,fontWeight:700,marginBottom:8}}>
              {s.settingsLang}
            </div>
            {/* نُثبّت الاتجاه LTR هنا عمداً بغض النظر عن لغة الواجهة، حتى يبقى
                مكان زري "العربية"/English ثابتاً بصرياً ولا ينقلب يمين/يسار
                عند تبديل اللغة. نفس قالب تبويبات الأحدث/الأكثر تفاعلاً
                بالصفحة الرئيسية: حاوية بـ padding وأزرار منفصلة بحدود مستديرة. */}
            <div style={{display:"flex",gap:5,background:CL.surface,borderRadius:RADIUS.lg,padding:4,
              marginBottom:22,border:BORDERS.default,direction:"ltr"}}>
              <button onClick={()=>{setLang("ar");db.saveLang("ar");}}
                style={{...btn0,flex:1,padding:isMobile?"11px 8px":"9px 12px",borderRadius:RADIUS.md,
                  background:lang==="ar"?CL.accentDim:"transparent",
                  border:lang==="ar"?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                  color:lang==="ar"?CL.accent:CL.textMuted,
                  fontSize:FONT.bodyLg,fontWeight:700,
                  minHeight:isMobile?44:"auto",transition:TRANSITIONS.colorChange}}>
                العربية
              </button>
              <button onClick={()=>{setLang("en");db.saveLang("en");}}
                style={{...btn0,flex:1,padding:isMobile?"11px 8px":"9px 12px",borderRadius:RADIUS.md,
                  background:lang==="en"?CL.accentDim:"transparent",
                  border:lang==="en"?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                  color:lang==="en"?CL.accent:CL.textMuted,
                  fontSize:FONT.bodyLg,fontWeight:700,
                  minHeight:isMobile?44:"auto",transition:TRANSITIONS.colorChange}}>
                English
              </button>
            </div>

            {/* الثيم — شكلي بدون وظيفة فعلية، فقط للعرض البصري حالياً.
                نفس قالب التبويبات أيضاً للحفاظ على لغة بصرية موحدة بالموقع. */}
            <div style={{fontSize:FONT.caption,color:CL.textMuted,fontWeight:700,marginBottom:8}}>
              {s.settingsTheme}
            </div>
            <div style={{display:"flex",gap:5,background:CL.surface,borderRadius:RADIUS.lg,padding:4,
              marginBottom:22,border:BORDERS.default,direction:"ltr"}}>
              <button onClick={()=>{setThemePref("dark");db.saveThemePref("dark");}}
                style={{...btn0,flex:1,padding:isMobile?"11px 8px":"9px 12px",borderRadius:RADIUS.md,
                  background:themePref==="dark"?CL.accentDim:"transparent",
                  border:themePref==="dark"?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                  color:themePref==="dark"?CL.accent:CL.textMuted,
                  fontSize:FONT.bodyLg,fontWeight:700,
                  minHeight:isMobile?44:"auto",transition:TRANSITIONS.colorChange,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                🌙 {s.themeDark}
              </button>
              <button onClick={()=>{setThemePref("light");db.saveThemePref("light");}}
                style={{...btn0,flex:1,padding:isMobile?"11px 8px":"9px 12px",borderRadius:RADIUS.md,
                  background:themePref==="light"?CL.accentDim:"transparent",
                  border:themePref==="light"?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                  color:themePref==="light"?CL.accent:CL.textMuted,
                  fontSize:FONT.bodyLg,fontWeight:700,
                  minHeight:isMobile?44:"auto",transition:TRANSITIONS.colorChange,
                  display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
                ☀️ {s.themeLight}
              </button>
            </div>

            {/* الصفحات الرسمية — أزرار شكلية بدون وظيفة حالياً */}
            <div style={{fontSize:FONT.caption,color:CL.textMuted,fontWeight:700,marginBottom:8}}>
              {s.settingsLegalTitle}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8,marginBottom:22}}>
              {[
                {label:s.privacyPolicy,icon:"🔒"},
                {label:s.termsConditions,icon:"📄"},
                {label:s.contactUs,icon:"✉️"},
              ].map(item=>(
                <button key={item.label}
                  style={{...btn0,textAlign:s.d==="rtl"?"right":"left",
                    display:"flex",alignItems:"center",justifyContent:"space-between",
                    background:CL.borderFaint,border:BORDERS.default,
                    borderRadius:RADIUS.md,padding:isMobile?"13px 14px":"11px 14px",
                    color:CL.textSub,fontSize:FONT.body,fontWeight:700,
                    minHeight:isMobile?46:"auto"}}>
                  <span style={{display:"flex",alignItems:"center",gap:8}}>
                    {item.icon} {item.label}
                  </span>
                  <span style={{color:CL.textMuted,fontSize:FONT.label}}>{s.d==="rtl"?"←":"→"}</span>
                </button>
              ))}
            </div>

            {/* منطقة خطرة: إدارة البيانات */}
            <div style={{fontSize:FONT.caption,color:CL.danger,fontWeight:700,marginBottom:8,
              display:"flex",alignItems:"center",gap:5}}>
              ⚠️ {s.settingsDangerZone}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              <button onClick={confirmPurgeContent}
                style={{...btn0,textAlign:s.d==="rtl"?"right":"left",
                  background:CL.dangerDim,border:BORDERS.danger,
                  borderRadius:RADIUS.md,padding:isMobile?"13px 14px":"11px 14px",
                  color:CL.danger,fontSize:FONT.body,fontWeight:700,
                  minHeight:isMobile?46:"auto"}}>
                <span style={{display:"inline-flex",verticalAlign:"middle",marginInlineEnd:6}}><IconTrash size={14} color={CL.danger}/></span>
                {s.deleteContentBtn}
              </button>
              <button onClick={confirmPurgeOwnershipOnly}
                style={{...btn0,textAlign:s.d==="rtl"?"right":"left",
                  background:CL.flagDim,border:BORDERS.flag,
                  borderRadius:RADIUS.md,padding:isMobile?"13px 14px":"11px 14px",
                  color:CL.flag,fontSize:FONT.body,fontWeight:700,
                  minHeight:isMobile?46:"auto"}}>
                <span style={{display:"inline-flex",verticalAlign:"middle",marginInlineEnd:6}}><IconUnlock size={14} color={CL.flag}/></span>
                {s.deleteOwnershipBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── صفحة الملف الشخصي (overlay يغطي كامل الشاشة، نفس نمط صفحة الإعدادات) */}
      {profilePageOpen&&(
        <div style={{position:"fixed",inset:0,background:CL.bg,zIndex:990,
          overflowY:"auto",animation:`fadeInOverlay ${ANIM.normal}`}}>
          <div style={{maxWidth:700,margin:"0 auto",width:"100%",boxSizing:"border-box",
            padding:isMobile?"14px 14px 40px":"20px 24px 40px"}}>

            {/* شريط علوي: رجوع + عنوان في المنتصف الحقيقي */}
            <div style={{position:"relative",display:"flex",alignItems:"center",
              marginBottom:20,paddingTop:isMobile?6:8,minHeight:44}}>
              <BackButton onClick={()=>setProfilePageOpen(false)} label={s.back}/>
              <div style={{position:"absolute",left:"50%",transform:"translateX(-50%)",
                fontSize:FONT.title,fontWeight:800,color:CL.text,
                whiteSpace:"nowrap",pointerEvents:"none"}}>
                {s.profileTitle}
              </div>
            </div>

            {/* بطاقة الإحصائيات */}
            <div style={{...cardStyle,marginBottom:14,display:"flex",
              justifyContent:"space-around",textAlign:"center"}}>
              {[
                {n:myPosts.length,label:s.profileStatPosts},
                {n:myComments.length,label:s.profileStatComments},
                {n:myTotalReactions,label:s.profileStatReactions},
              ].map((st,i)=>(
                <div key={i}>
                  <div style={{fontSize:FONT.title,fontWeight:800,color:CL.accent}}>{st.n}</div>
                  <div style={{fontSize:FONT.caption,color:CL.textMuted,marginTop:2}}>{st.label}</div>
                </div>
              ))}
            </div>

            {/* ملاحظة الحالة المحلية */}
            <div style={{background:CL.borderFaint,border:BORDERS.default,borderRadius:RADIUS.md,
              padding:"10px 12px",marginBottom:16,fontSize:FONT.label,color:CL.textSub,
              wordBreak:"break-word"}}>
              {s.profileLocalNote}
            </div>

            {/* تبويبات: منشوراتي / تعليقاتي */}
            <div style={{display:"flex",gap:5,background:CL.surface,borderRadius:RADIUS.lg,padding:4,
              marginBottom:14,border:BORDERS.default}}>
              {[{k:"posts",label:s.profileMyPosts},{k:"comments",label:s.profileMyComments}].map(tb=>(
                <button key={tb.k} onClick={()=>setProfileTab(tb.k)}
                  style={{...btn0,flex:1,padding:isMobile?"11px 8px":"9px 12px",borderRadius:RADIUS.md,
                    background:profileTab===tb.k?CL.accentDim:"transparent",
                    border:profileTab===tb.k?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                    color:profileTab===tb.k?CL.accent:CL.textMuted,
                    fontSize:13,fontWeight:700,
                    minHeight:isMobile?44:"auto",transition:TRANSITIONS.colorChange}}>
                  {tb.label}
                </button>
              ))}
            </div>

            {/* محتوى التبويب: منشوراتي */}
            {profileTab==="posts"&&(
              myPosts.length===0?(
                <div style={{textAlign:"center",padding:"48px 20px",color:CL.textMuted}}>
                  <div style={{fontSize:FONT.displayXl,marginBottom:12}}>📝</div>
                  <div style={{fontSize:FONT.heading,marginBottom:5}}>{s.profileEmptyPosts}</div>
                  <div style={{fontSize:FONT.body}}>{s.profileEmptyPostsSub}</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:isMobile?8:9}}>
                  {myPosts.map(p=>{
                    const ci=CATS[p.category]||CATS["عام"];
                    const commentCount=(p.comments||[]).length;
                    return(
                      <div key={p.id} data-pressable="card"
                        onClick={()=>openThreadFromProfile(p.id)}
                        style={{...cardStyle,cursor:"pointer",
                          WebkitTapHighlightColor:"transparent",
                          transition:TRANSITIONS.colorChange}}>
                        <div style={{display:"flex",justifyContent:"space-between",
                          alignItems:"flex-start",marginBottom:8,flexWrap:"wrap",gap:6}}>
                          <span style={{background:ci.bg,color:ci.color,
                            padding:"3px 10px",borderRadius:RADIUS.pill,fontSize:FONT.caption,fontWeight:700,flexShrink:0}}>
                            {s.cat(p.category)}
                          </span>
                          <span style={{fontSize:R.metaFont,color:CL.textMuted}}>{timeAgo(p.timestamp,s)}</span>
                        </div>
                        <p style={{margin:"0 0 8px",fontSize:R.bodyText,lineHeight:1.7,
                          color:CL.text,wordBreak:"break-word",
                          display:"-webkit-box",WebkitLineClamp:3,WebkitBoxOrient:"vertical",
                          overflow:"hidden"}}>{p.text}</p>
                        <div style={{display:"flex",alignItems:"center",gap:6,color:CL.textMuted,fontSize:FONT.caption}}>
                          <span style={{display:"flex"}}><IconMessageCircle size={13} color={CL.textMuted}/></span><span>{commentCount}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )
            )}

            {/* محتوى التبويب: تعليقاتي */}
            {profileTab==="comments"&&(
              myComments.length===0?(
                <div style={{textAlign:"center",padding:"48px 20px",color:CL.textMuted}}>
                  <div style={{fontSize:FONT.displayXl,marginBottom:12}}>💬</div>
                  <div style={{fontSize:FONT.heading,marginBottom:5}}>{s.profileEmptyComments}</div>
                  <div style={{fontSize:FONT.body}}>{s.profileEmptyCommentsSub}</div>
                </div>
              ):(
                <div style={{display:"flex",flexDirection:"column",gap:isMobile?8:9}}>
                  {myComments.map(c=>(
                    <div key={c.id} data-pressable="card"
                      onClick={()=>openThreadFromProfile(c.postId)}
                      style={{...cardStyle,cursor:"pointer",
                        WebkitTapHighlightColor:"transparent",
                        transition:TRANSITIONS.colorChange}}>
                      <div style={{fontSize:FONT.caption,color:CL.textMuted,marginBottom:6,
                        display:"flex",justifyContent:"space-between",gap:6,flexWrap:"wrap"}}>
                        <span style={{overflow:"hidden",textOverflow:"ellipsis",
                          whiteSpace:"nowrap",maxWidth:"70%"}}>
                          {s.profileOnPost} {c.postText}
                        </span>
                        <span style={{flexShrink:0}}>{timeAgo(c.timestamp,s)}</span>
                      </div>
                      <p style={{margin:0,fontSize:R.bodyText,lineHeight:1.7,
                        color:CL.text,wordBreak:"break-word",
                        display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical",
                        overflow:"hidden"}}>{c.text}</p>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* ── العمود الجانبي (ديسكتوب فقط) — بروفايل مختصر + فلتر تصنيفات.
          يظهر بجانب main فقط عند isDesktop لملء المساحة الإضافية بدل تركها
          فارغة، بينما الموبايل/التابلت يبقيان بنفس التخطيط الحالي تماماً
          دون أي تغيير (mainRow يتحول لعمود واحد عادي في غير الديسكتوب). */}
      <div style={{display:"flex",flexDirection:isDesktop?"row":"column",
        gap:isDesktop?28:0,maxWidth:isDesktop?980:700,margin:"0 auto",
        width:"100%",boxSizing:"border-box",flex:"1 0 auto",
        alignItems:"flex-start"}}>

        {isDesktop&&(
          <aside style={{width:260,flexShrink:0,position:"sticky",top:20,
            display:"flex",flexDirection:"column",gap:14}}>

            {/* بطاقة البروفايل المختصرة */}
            <div style={{...cardStyle,cursor:"pointer"}}
              onClick={()=>setProfilePageOpen(true)}>
              <div style={{display:"flex",justifyContent:"space-around",
                textAlign:"center",marginBottom:12}}>
                {[
                  {n:myPosts.length,label:s.profileStatPosts},
                  {n:myComments.length,label:s.profileStatComments},
                  {n:myTotalReactions,label:s.profileStatReactions},
                ].map((st,i)=>(
                  <div key={i}>
                    <div style={{fontSize:FONT.heading,fontWeight:800,color:CL.accent}}>{st.n}</div>
                    <div style={{fontSize:FONT.micro,color:CL.textMuted,marginTop:2}}>{st.label}</div>
                  </div>
                ))}
              </div>
              <div style={{textAlign:"center",fontSize:FONT.caption,color:CL.edit,fontWeight:700}}>
                👤 {s.sidebarViewProfile}
              </div>
            </div>

            {/* فلتر التصنيفات */}
            <div style={cardStyle}>
              <div style={{fontSize:FONT.label,fontWeight:700,color:CL.textMuted,
                marginBottom:10,textTransform:"uppercase",letterSpacing:0.4}}>
                {s.sidebarCatsTitle}
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                <button onClick={()=>setCatFilter(null)}
                  style={{...btn0,display:"flex",alignItems:"center",gap:8,width:"100%",
                    textAlign:s.d==="rtl"?"right":"left",padding:"8px 10px",borderRadius:RADIUS.md,
                    background:catFilter===null?CL.accentDim:"transparent",
                    border:catFilter===null?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                    color:catFilter===null?CL.accent:CL.textSub,
                    fontSize:FONT.body,fontWeight:catFilter===null?700:500}}>
                  <span style={{width:8,height:8,borderRadius:"50%",background:CL.textMuted,flexShrink:0}}/>
                  {s.sidebarCatAll}
                </button>
                {Object.keys(CATS).map(catKey=>{
                  const ci=CATS[catKey];
                  const active=catFilter===catKey;
                  return (
                    <button key={catKey} onClick={()=>setCatFilter(active?null:catKey)}
                      style={{...btn0,display:"flex",alignItems:"center",gap:8,width:"100%",
                        textAlign:s.d==="rtl"?"right":"left",padding:"8px 10px",borderRadius:RADIUS.md,
                        background:active?ci.bg:"transparent",
                        border:active?`1px solid ${ci.color}55`:"1px solid transparent",
                        color:active?ci.color:CL.textSub,
                        fontSize:FONT.body,fontWeight:active?700:500}}>
                      <span style={{width:8,height:8,borderRadius:"50%",background:ci.color,flexShrink:0}}/>
                      {s.cat(catKey)}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        )}

      <main style={{maxWidth:700,margin:isDesktop?0:"0 auto",width:"100%",boxSizing:"border-box",
        flex:"1 0 auto"}}>

        {/* ── Header */}
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:R.headerMb}}>
          <div>
            <h1 style={{margin:0,fontSize:R.titleSize,fontWeight:800,lineHeight:1.2}}>{s.name}</h1>
            <p style={{margin:"4px 0 0",fontSize:R.tagSize,color:CL.textMuted}}>{s.tag}</p>
          </div>
          <div style={{display:"flex",gap:8,flexShrink:0}}>
            <button onClick={()=>setProfilePageOpen(true)} aria-label={s.profile}
              style={{...btn0,background:CL.surface,border:BORDERS.default,
                borderRadius:RADIUS.lg,padding:isMobile?"10px 14px":"8px 12px",
                color:CL.textSub,fontSize:FONT.heading,fontWeight:700,minHeight:isMobile?44:"auto"}}>
              👤
            </button>
            <button onClick={()=>setSettingsOpen(true)} aria-label={s.settings}
              style={{...btn0,background:CL.surface,border:BORDERS.default,
                borderRadius:RADIUS.lg,padding:isMobile?"10px 14px":"8px 12px",
                color:CL.textSub,fontSize:FONT.heading,fontWeight:700,minHeight:isMobile?44:"auto"}}>
              ⚙️
            </button>
          </div>
        </div>

        {/* ── Ban notice */}
        {isBanned&&(
          <div style={{background:CL.dangerDim,border:BORDERS.danger,
            borderRadius:RADIUS.lg,padding:"12px 14px",marginBottom:14,color:CL.danger,
            fontSize:FONT.body,wordBreak:"break-word"}}>
            ⏸️ {s.banned} ({banTimeLeft}s)
          </div>
        )}

        {/* ════════ THREAD VIEW ════════ */}
        {activePostId?(
          <div style={{
            animation: threadClosing
              ? `threadExit ${ANIM.viewMs}ms cubic-bezier(0.32,0.72,0,1) forwards`
              : `threadEnter ${ANIM.viewMs}ms cubic-bezier(0.32,0.72,0,1)`,
            // نفس منطق الكرت: نجهّز المتصفح مسبقاً لحركة opacity+transform
            // القادمة بدل ما يكتشفها لحظة وقوعها — أهم هنا تحديداً لأن
            // هذي الشاشة فيها أكبر كمية محتوى (منشور كامل + تعليقات + ردود)
            willChange:"opacity, transform",
          }}>
            {/* Back button */}
            <div style={{marginBottom:14}}>
              <BackButton onClick={closeThread} label={s.back}/>
            </div>

            {/* Post card */}
            {activePost&&(
              <div style={{display:"flex",gap:11,marginBottom:6,position:"relative"}}>
                {/* أفاتار المنشور الرئيسي — أكبر قليلاً من أفاتار الفيد،
                    ومنه ينزل خط عمودي رفيع يربطه بقسم التعليقات أسفله
                    (نفس فكرة "الخيط" المرئي بتطبيق Threads) */}
                <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
                  <div style={{width:isMobile?40:42,height:isMobile?40:42,
                    borderRadius:RADIUS.circle,background:CATS[activePost.category]?.bg,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:FONT.title,fontWeight:800,color:CATS[activePost.category]?.color,
                    flexShrink:0}}>
                    {s.cat(activePost.category)?.trim()?.charAt(0)||"•"}
                  </div>
                  {/* الخط العمودي — يمتد بالـ flex ليملأ الفراغ حتى أول تعليق،
                      يختفي تلقائياً إن لم توجد تعليقات (flex:1 على حاوية فارغة
                      الارتفاع لا يُظهر شيئاً) */}
                  {(activePost.comments||[]).length>0&&(
                    <div style={{width:2,flex:1,minHeight:20,background:CL.borderFaint,marginTop:6}}/>
                  )}
                </div>

                <div style={{flex:1,minWidth:0}}>
                  {/* Meta row */}
                  <div style={{display:"flex",justifyContent:"space-between",
                    alignItems:"flex-start",marginBottom:6,gap:6,flexWrap:"wrap"}}>
                    <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                      <span style={{color:CATS[activePost.category]?.color,fontWeight:700,fontSize:R.bodyText}}>
                        {s.cat(activePost.category)}
                      </span>
                      <span style={{fontSize:R.metaFont,color:CL.textMuted}}>· {timeAgo(activePost.timestamp,s)}</span>
                      {activePost.edited&&<span style={{fontSize:FONT.micro,color:CL.textMuted,fontStyle:"italic",display:"inline-flex",alignItems:"center",gap:3}}><IconPencil size={9} color={CL.textMuted}/> {s.editedLabel}</span>}
                    </div>
                    <ActionMenuButton menuKey={`post-${activePost.id}`} text={activePost.text}
                      isOwner={!!ownedPosts[activePost.id]}
                      onEdit={()=>{setEditingPostId(activePost.id);setEditPostText(activePost.text);}}
                      onDelete={()=>deletePost(activePost.id)}/>
                  </div>

                  {editingPostId===activePost.id?(
                    <div style={{marginBottom:12}}>
                      <textarea value={editPostText} onChange={e=>setEditPostText(e.target.value)}
                        maxLength={300} autoFocus
                        style={{...inputBase,width:"100%",minHeight:80,resize:"none",
                          border:BORDERS.edit,fontSize:R.textareaFont}}/>
                      {err&&<div style={{color:"#D07070",fontSize:FONT.caption,marginTop:4,wordBreak:"break-word"}}>{err}</div>}
                      <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                        <button onClick={()=>saveEditPost(activePost.id)} style={btnPrimary}>{s.editSave}</button>
                        <button onClick={cancelEdit} style={btnSecondary}>{s.editCancel}</button>
                      </div>
                    </div>
                  ):(
                    <>
                      <p style={{margin:"0 0 10px",fontSize:R.bodyText,lineHeight:1.78,
                        color:CL.text,wordBreak:"break-word"}}>{activePost.text}</p>
                      {activePost.mdFile&&mdBadge(activePost.mdFile,`post-${activePost.id}`)}
                    </>
                  )}

                  {activePost.note&&(
                    <div style={{borderInlineStart:`3px solid ${CATS[activePost.category]?.color}`,
                      paddingInlineStart:10,paddingTop:4,paddingBottom:4,marginBottom:12,
                      fontSize:FONT.label,color:CL.textSub,fontStyle:"italic",wordBreak:"break-word"}}>
                      📝 {activePost.note}
                    </div>
                  )}
                  {reactionRow(activePost.id,null,activePost.votes)}
                </div>
              </div>
            )}

            {/* Comments section — بدون بطاقة/حدود منفصلة، امتداد طبيعي
                لنفس "الخيط" العمودي النازل من أفاتار المنشور أعلاه */}
            <div style={{marginBottom:14}}>
              <h3 style={{margin:"0 0 12px",fontSize:FONT.bodyLg,fontWeight:700,color:CL.accent}}>{s.commentsTitle}</h3>

              {/* Comment input */}
              {!isBanned&&(
                <div style={{marginBottom:14,paddingBottom:14,borderBottom:`1px solid ${CL.borderFaint}`}}>
                  <div style={{display:"flex",gap:8,marginBottom:6}}>
                    <textarea value={commentText}
                      onChange={e=>{setCommentText(e.target.value);setErr("");}}
                      onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();addComment(activePost?.id);}}}
                      placeholder={s.commentPh} maxLength={300} rows={1}
                      style={{...inputBase,flex:1,minHeight:isMobile?44:38,
                        resize:"vertical",maxHeight:140,fontFamily:s.font,lineHeight:1.4,
                        paddingTop:isMobile?12:9,paddingBottom:isMobile?12:9}}/>
                    <button onClick={()=>addComment(activePost?.id)} disabled={isCommenting}
                      style={{...btn0,background:CL.accentDim,border:BORDERS.accent,
                        borderRadius:RADIUS.sm,padding:"0 14px",color:CL.accent,fontSize:R.btnFont,fontWeight:700,
                        minHeight:isMobile?44:38,flexShrink:0,
                        display:"flex",alignItems:"center",gap:6,
                        opacity:isCommenting?0.7:1,cursor:isCommenting?"default":"pointer"}}>
                      {isCommenting&&<span style={{display:"inline-block",width:11,height:11,
                        border:`2px solid ${CL.accentBorder}`,borderTopColor:CL.accent,
                        borderRadius:RADIUS.circle,animation:"inkoreSpin 0.6s linear infinite"}}/>}
                      {isCommenting?s.commentBtnPosting:s.commentBtn}
                    </button>
                  </div>
                  <MdAttachRow target="comment" file={commentMdFile}
                    onRemove={()=>{setCommentMdFile(null);setCommentMdPreview(false);}}/>
                  <div style={{textAlign:s.d==="rtl"?"left":"right",fontSize:FONT.badge,
                    color:commentText.length>260?"#D07070":CL.textMuted,marginTop:4}}>
                    {commentText.length}/300
                  </div>
                  {err&&<div style={{color:"#D07070",fontSize:FONT.label,marginTop:6,wordBreak:"break-word"}}>{err}</div>}
                </div>
              )}

              {/* Comments list */}
              {(activePost?.comments||[]).length===0?(
                <div style={{color:CL.textMuted,fontSize:FONT.label,textAlign:"center",padding:"12px 0"}}>{s.noComments}</div>
              ):(
                <div style={{display:"flex",flexDirection:"column"}}>
                  {(activePost?.comments||[]).map((c,cIdx)=>{
                    const replies=c.replies||[];
                    const isExpanded=expandedIds[c.id];
                    const isReplying=replyingToId===c.id;
                    const showThread=isExpanded||isReplying;
                    const isLastComment=cIdx===(activePost?.comments||[]).length-1;

                    return(
                      <div key={c.id} style={{position:"relative",
                        zIndex:openMenuFor===`comment-${c.id}`?60:"auto",
                        borderBottom:isLastComment?"none":`1px solid ${CL.borderFaint}`,
                        paddingBottom:12,marginBottom:12}}>
                        {/* Comment row — أفاتار دائري صغير + خط عمودي رفيع
                            ينزل نحو الردود أسفله (بنمط Threads)، بدل بطاقة
                            بخلفية داكنة منفصلة */}
                        <div style={{display:"flex",gap:9}}>
                          <div style={{flexShrink:0,display:"flex",flexDirection:"column",alignItems:"center"}}>
                            <div style={{width:26,height:26,borderRadius:RADIUS.circle,
                              background:CL.borderFaint,display:"flex",alignItems:"center",
                              justifyContent:"center",flexShrink:0}}>
                              <IconLock size={11} color={CL.textMuted}/>
                            </div>
                            {showThread&&(
                              <div style={{width:2,flex:1,minHeight:16,background:CL.replyBorder,marginTop:6}}/>
                            )}
                          </div>

                          <div style={{flex:1,minWidth:0}}>
                            <div style={{display:"flex",justifyContent:"space-between",
                              alignItems:"flex-start",marginBottom:4,gap:6}}>
                              <div style={{display:"flex",alignItems:"center",gap:R.gap,flexWrap:"wrap"}}>
                                <span style={{fontSize:R.metaFont,color:CL.textMuted}}>{timeAgo(c.timestamp,s)}</span>
                                {c.edited&&<span style={{fontSize:FONT.micro,color:CL.textMuted,fontStyle:"italic",display:"inline-flex",alignItems:"center",gap:3}}><IconPencil size={9} color={CL.textMuted}/> {s.editedLabel}</span>}
                              </div>
                              <ActionMenuButton menuKey={`comment-${c.id}`} text={c.text}
                                isOwner={!!ownedComments[c.id]}
                                onEdit={()=>{setEditingCommentId(c.id);setEditCommentText(c.text);}}
                                onDelete={()=>deleteComment(activePost.id,c.id)}/>
                            </div>

                            {editingCommentId===c.id?(
                              <div style={{marginBottom:8}}>
                                <textarea value={editCommentText} onChange={e=>setEditCommentText(e.target.value)}
                                  maxLength={300} autoFocus rows={2}
                                  style={{...inputBase,width:"100%",border:BORDERS.edit,
                                    minHeight:isMobile?60:50,resize:"vertical",fontFamily:s.font,lineHeight:1.4}}/>
                                {err&&<div style={{color:"#D07070",fontSize:FONT.caption,marginTop:4}}>{err}</div>}
                                <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                                  <button onClick={()=>saveEditComment(activePost.id,c.id)} style={btnPrimary}>{s.editSave}</button>
                                  <button onClick={cancelEdit} style={btnSecondary}>{s.editCancel}</button>
                                </div>
                              </div>
                            ):(
                              <>
                                <p style={{margin:"0 0 8px",fontSize:R.commentText,lineHeight:1.7,
                                  color:CL.text,wordBreak:"break-word"}}>{c.text}</p>
                                {c.mdFile&&mdBadge(c.mdFile,`comment-${c.id}`)}
                              </>
                            )}

                            {/* Reactions + Reply row */}
                            <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:10}}>
                              {reactionRow(activePost.id,c.id,c.votes)}
                              {replies.length>0&&(
                                <button onClick={()=>toggleReplies(c.id)}
                                  style={{...btn0,display:"inline-flex",alignItems:"center",gap:5,
                                    background:"transparent",border:"none",padding:"4px 2px",
                                    color:isExpanded?CL.reply:CL.textMuted,
                                    fontSize:isMobile?12:11,fontWeight:700,
                                    minHeight:isMobile?32:"auto",transition:TRANSITIONS.colorChange}}>
                                  <IconMessageCircle size={12} color={isExpanded?CL.reply:CL.textMuted}/>
                                  {s.showReplies(replies.length)}
                                </button>
                              )}
                              {!isBanned&&(
                                <button onClick={()=>startReply(c.id)}
                                  style={{...btn0,display:"inline-flex",alignItems:"center",gap:5,
                                    background:"transparent",border:"none",padding:"4px 2px",
                                    color:isReplying?CL.reply:CL.textMuted,
                                    fontSize:isMobile?12:11,fontWeight:700,
                                    minHeight:isMobile?32:"auto",transition:TRANSITIONS.colorChange}}>
                                  <IconReply size={12} color={isReplying?CL.reply:CL.textMuted}/>
                                  {s.replyBtn}
                                </button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* ── Replies (نفس عرض التعليق الرئيسي، مُزاحة لتحاذي
                            بداية النص فوقها تماماً تحت خط "الخيط" العمودي) */}
                        {showThread&&(
                          <div style={{
                            marginTop:8,
                            marginInlineStart:35, /* 26px عرض الأفاتار + 9px الفجوة، لمحاذاة دقيقة تحت الخط العمودي */
                            display:"flex",flexDirection:"column",gap:10,
                          }}>
                            {/* Existing replies — نفس نمط أفاتار+نص التعليقات
                                لكن بحجم أصغر، بدون بطاقة/حدود منفصلة */}
                            {isExpanded&&replies.map(r=>(
                              <div key={r.id} style={{display:"flex",gap:8,
                                position:"relative",
                                zIndex:openMenuFor===`reply-${r.id}`?60:"auto"}}>
                                <div style={{flexShrink:0,width:20,height:20,borderRadius:RADIUS.circle,
                                  background:CL.replyDim,display:"flex",alignItems:"center",
                                  justifyContent:"center"}}>
                                  <IconReply size={10} color={CL.reply}/>
                                </div>
                                <div style={{flex:1,minWidth:0}}>
                                  <div style={{display:"flex",justifyContent:"space-between",
                                    alignItems:"flex-start",marginBottom:4,gap:6}}>
                                    <span style={{fontSize:R.metaFont,color:CL.textMuted}}>{timeAgo(r.timestamp,s)}</span>
                                    <div style={{display:"flex",alignItems:"center",gap:R.gap,flexWrap:"wrap"}}>
                                      {r.edited&&<span style={{fontSize:FONT.micro,color:CL.textMuted,fontStyle:"italic",display:"inline-flex",alignItems:"center",gap:3}}><IconPencil size={9} color={CL.textMuted}/> {s.editedLabel}</span>}
                                      <ActionMenuButton menuKey={`reply-${r.id}`} text={r.text}
                                        isOwner={!!ownedReplies[r.id]}
                                        onEdit={()=>{setEditingReplyInfo({commentId:c.id,replyId:r.id});setEditReplyText(r.text);}}
                                        onDelete={()=>deleteReply(activePost.id,c.id,r.id)}/>
                                    </div>
                                  </div>
                                  {editingReplyInfo?.replyId===r.id?(
                                    <div>
                                      <textarea value={editReplyText} onChange={e=>setEditReplyText(e.target.value)}
                                        maxLength={300} autoFocus rows={2}
                                        style={{...inputBase,width:"100%",border:BORDERS.reply,
                                          fontSize:isMobile?16:12,minHeight:isMobile?56:46,
                                          resize:"vertical",fontFamily:s.font,lineHeight:1.4}}/>
                                      {err&&<div style={{color:"#D07070",fontSize:FONT.caption,marginTop:4}}>{err}</div>}
                                      <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}>
                                        <button onClick={()=>saveEditReply(activePost.id,c.id,r.id)}
                                          style={{...btnPrimary,padding:isMobile?"8px 12px":"6px 10px",fontSize:FONT.caption}}>
                                          {s.editSave}
                                        </button>
                                        <button onClick={cancelEdit}
                                          style={{...btnSecondary,padding:isMobile?"8px 12px":"6px 10px",fontSize:FONT.caption}}>
                                          {s.editCancel}
                                        </button>
                                      </div>
                                    </div>
                                  ):(
                                    <>
                                      <p style={{margin:"0 0 4px",fontSize:R.replyText,lineHeight:1.65,
                                        color:CL.text,wordBreak:"break-word"}}>{r.text}</p>
                                      {r.mdFile&&mdBadge(r.mdFile,`reply-${r.id}`)}
                                    </>
                                  )}
                                </div>
                              </div>
                            ))}

                            {/* Reply input */}
                            {isReplying&&(
                              <div style={{background:"rgba(167,139,204,0.07)",
                                border:BORDERS.reply,borderRadius:RADIUS.md,
                                padding:isMobile?"10px":"10px 12px"}}>
                                <div style={{display:"flex",gap:8,marginBottom:6}}>
                                  <textarea value={replyText}
                                    onChange={e=>{setReplyText(e.target.value);setErr("");}}
                                    onKeyDown={e=>{if(e.key==="Enter"&&!e.shiftKey){e.preventDefault();addReply(activePost?.id,c.id);}}}
                                    autoFocus placeholder={s.replyPh} maxLength={300} rows={1}
                                    style={{...inputBase,flex:1,border:BORDERS.reply,
                                      fontSize:isMobile?16:13,minHeight:isMobile?44:38,
                                      resize:"vertical",maxHeight:140,fontFamily:s.font,lineHeight:1.4,
                                      paddingTop:isMobile?12:9,paddingBottom:isMobile?12:9}}/>
                                  <button onClick={()=>addReply(activePost?.id,c.id)} disabled={isReplying2}
                                    style={{...btn0,background:CL.replyDim,border:BORDERS.reply,
                                      borderRadius:RADIUS.sm,padding:"0 12px",color:CL.reply,
                                      fontSize:R.btnFont,fontWeight:700,
                                      minHeight:isMobile?44:38,flexShrink:0,
                                      display:"flex",alignItems:"center",gap:6,
                                      opacity:isReplying2?0.7:1,cursor:isReplying2?"default":"pointer"}}>
                                    {isReplying2?(
                                      <span style={{display:"inline-block",width:11,height:11,
                                        border:`2px solid ${CL.replyBorder}`,borderTopColor:CL.reply,
                                        borderRadius:RADIUS.circle,animation:"inkoreSpin 0.6s linear infinite"}}/>
                                    ):(<span style={{display:"flex"}}><IconReply size={13} color={CL.reply}/></span>)} {isReplying2?s.replyBtnPosting:s.replyBtn}
                                  </button>
                                </div>
                                <MdAttachRow target="reply" file={replyMdFile}
                                  onRemove={()=>{setReplyMdFile(null);setReplyMdPreview(false);}}/>
                                <div style={{textAlign:s.d==="rtl"?"left":"right",fontSize:FONT.badge,
                                  color:replyText.length>260?"#D07070":CL.textMuted,marginTop:4}}>
                                  {replyText.length}/300
                                </div>
                                {err&&<div style={{color:"#D07070",fontSize:FONT.label,marginTop:6,wordBreak:"break-word"}}>{err}</div>}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

        ):(
        /* ════════ MAIN FEED ════════ */
          <>
            {/* Post input */}
            <div style={{...cardStyle,borderRadius:radiusXl,padding:isMobile?"14px":"16px 18px",marginBottom:14}}>
              <textarea value={text}
                onChange={e=>{setText(e.target.value);setErr("");}}
                placeholder={currentPlaceholder} maxLength={300}
                onKeyDown={e=>{if(e.key==="Enter"&&e.ctrlKey&&!isMobile&&!isBanned)submit();}}
                style={{width:"100%",minHeight:isMobile?80:90,background:"transparent",
                  border:"none",outline:OUTLINE_NONE,resize:"none",color:CL.text,
                  fontSize:R.textareaFont,lineHeight:1.78,fontFamily:s.font,
                  boxSizing:"border-box",caretColor:CL.accent,
                  WebkitAppearance:"none",
                }}/>

              <div style={{paddingTop:6,marginBottom:4,borderTop:`1px solid ${CL.borderFaint}`}}>
                <MdAttachRow target="post" file={mdFile}
                  onRemove={()=>{setMdFile(null);setMdPreview(false);}}/>
              </div>

              <div style={{paddingTop:8,marginBottom:8,borderTop:`1px solid ${CL.borderFaint}`}}>
                <input value={note} onChange={e=>setNote(e.target.value.slice(0,100))}
                  placeholder={s.notePh} maxLength={100}
                  style={{width:"100%",background:"transparent",border:"none",outline:OUTLINE_NONE,
                    color:CL.textSub,fontSize:isMobile?16:13,fontStyle:"italic",
                    fontFamily:s.font,boxSizing:"border-box",caretColor:CL.accent,WebkitAppearance:"none"}}/>
                <div style={{textAlign:s.d==="rtl"?"left":"right",fontSize:FONT.badge,color:CL.textMuted,marginTop:2}}>
                  {s.noteHint(note.length)}
                </div>
              </div>

              <div style={{paddingTop:8,marginBottom:8,borderTop:`1px solid ${CL.borderFaint}`}}>
                <div role="radiogroup" aria-label={s.catLabel}
                  style={{display:"flex",gap:6,overflowX:"auto",paddingBottom:2,
                    WebkitOverflowScrolling:"touch",scrollbarWidth:"none"}}>
                  {Object.keys(CATS).map(cat=>{
                    const ci=CATS[cat];
                    const active=category===cat;
                    return (
                      <button key={cat} type="button" role="radio" aria-checked={active}
                        ref={active?activeCatRef:null}
                        onClick={()=>setCategory(cat)}
                        style={{...btn0,flexShrink:0,
                          background:active?ci.bg:CL.borderFaint,
                          border:`1px solid ${active?ci.color:CL.border}`,
                          borderRadius:RADIUS.pill,padding:isMobile?"9px 14px":"6px 13px",
                          color:active?ci.color:CL.textMuted,
                          fontSize:isMobile?13:12,fontWeight:700,
                          minHeight:isMobile?40:"auto",
                          transition:TRANSITIONS.colorChange}}>
                        {s.cat(cat)}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                paddingTop:10,borderTop:`1px solid ${CL.borderFaint}`,gap:8,flexWrap:"wrap"}}>
                <span style={{fontSize:FONT.caption,color:err?"#D07070":text.length>260?"#D07070":CL.textMuted,
                  wordBreak:"break-word",flex:1,minWidth:0}}>
                  {err||s.hint(text.length)}
                </span>
                <button onClick={submit} disabled={!text.trim()||isBanned||isPosting}
                  style={{...btn0,
                    background:!text.trim()||isBanned||isPosting?CL.accentDim:`linear-gradient(135deg,${CL.accent} 0%,#B5552F 100%)`,
                    color:!text.trim()||isBanned||isPosting?CL.textMuted:"#fff",border:"none",
                    borderRadius:11,padding:isMobile?"12px 20px":"9px 20px",
                    fontSize:isMobile?14:13,fontWeight:700,flexShrink:0,
                    minHeight:isMobile?48:"auto",
                    display:"flex",alignItems:"center",gap:7,
                    opacity:!text.trim()||isBanned?0.6:isPosting?0.85:1,
                    cursor:isPosting?"default":"pointer",
                    transition:TRANSITIONS.colorChange,
                    boxShadow:!text.trim()||isBanned||isPosting?"none":SHADOWS.postBtn}}>
                  {isPosting&&<span style={{display:"inline-block",width:13,height:13,
                    border:"2px solid rgba(255,255,255,0.4)",borderTopColor:"#fff",
                    borderRadius:RADIUS.circle,animation:"inkoreSpin 0.6s linear infinite"}}/>}
                  {isPosting?s.btnPosting:s.btn}
                </button>
              </div>
            </div>

            {/* Toast */}
            {toast&&(
              <div style={{background:CL.okDim,border:BORDERS.ok,
                borderRadius:RADIUS.lg,padding:"12px 14px",marginBottom:12,
                display:"flex",gap:10,alignItems:"flex-start"}}>
                <span style={{fontSize:FONT.title,flexShrink:0}}>✨</span>
                <div>
                  <div style={{color:CL.ok,fontWeight:700,fontSize:FONT.body,marginBottom:2}}>{s.toastTitle}</div>
                  <div style={{color:"#9DCAB5",fontSize:FONT.label,wordBreak:"break-word"}}>{toast}</div>
                </div>
              </div>
            )}

            {/* Tabs */}
            <div style={{display:"flex",gap:5,background:CL.surface,borderRadius:RADIUS.lg,padding:4,
              marginBottom:12,border:BORDERS.default}}>
              {[{k:"recent",label:`🕐 ${s.t0}`},{k:"top",label:`⭐ ${s.t1}`}].map(tb=>(
                <button key={tb.k} onClick={()=>setTab(tb.k)}
                  style={{...btn0,flex:1,padding:isMobile?"11px 8px":"9px 12px",borderRadius:RADIUS.md,
                    background:tab===tb.k?CL.accentDim:"transparent",
                    border:tab===tb.k?`1px solid ${CL.accentBorder}`:"1px solid transparent",
                    color:tab===tb.k?CL.accent:CL.textMuted,
                    fontSize:isMobile?13:13,fontWeight:700,
                    minHeight:isMobile?44:"auto",transition:TRANSITIONS.colorChange}}>
                  {tb.label}
                </button>
              ))}
            </div>

            {/* Feed */}
            {loading?(
              <div style={{textAlign:"center",padding:64,color:CL.textMuted}}>
                <div style={{fontSize:FONT.displayLg,marginBottom:10}}>⏳</div>
                <div style={{fontSize:FONT.body}}>{s.loadTxt}</div>
              </div>
            ):displayed.length===0?(
              <div style={{textAlign:"center",padding:"48px 20px",color:CL.textMuted}}>
                <div style={{fontSize:FONT.displayXl,marginBottom:12}}>🌱</div>
                <div style={{fontSize:FONT.heading,marginBottom:5}}>{s.emH}</div>
                <div style={{fontSize:FONT.body}}>{s.emP}</div>
              </div>
            ):(
              <div style={{display:"flex",flexDirection:"column"}}>
                {displayed.map((p,idx)=>{
                  const ci=CATS[p.category]||CATS["عام"];
                  const resp=getResp(p);
                  const commentCount=(p.comments||[]).length;
                  const replyCount=(p.comments||[]).reduce((a,c)=>a+(c.replies||[]).length,0);
                  const flagCount=(p.votes?.flaggedBy||[]).length;
                  const isLast=idx===displayed.length-1;
                  const isHovered=hoveredPostId===p.id;
                  return(
                    <div key={p.id} data-pressable="card" onClick={()=>openThread(p.id)}
                      onMouseEnter={()=>setHoveredPostId(p.id)}
                      onMouseLeave={()=>setHoveredPostId(prev=>prev===p.id?null:prev)}
                      style={{cursor:"pointer",opacity:flagCount>1?0.6:1,
                        WebkitTapHighlightColor:"transparent",
                        display:"flex",gap:10,
                        // خلفية hover خفيفة جداً بامتداد كامل الصف (بدون حدود
                        // بطاقة) — نفس إحساس Threads عند تمرير الفأرة، غير
                        // مزعجة على اللمس لأنها تُفعّل فقط بـ mouse events
                        background:isHovered?CL.borderFaint:"transparent",
                        margin:"0 -8px",padding:isMobile?"12px 8px":"12px 8px",
                        borderBottom:isLast?"none":`1px solid ${CL.borderFaint}`,
                        position:"relative",
                        zIndex:openMenuFor===`post-${p.id}`?60:"auto",
                        transform:threadPending===p.id?"scale(0.988)":"scale(1)",
                        transition:threadPending===p.id ? TRANSITIONS.press : `${TRANSITIONS.colorChange}, background-color 0.15s ease`,
                        willChange:"transform"}}>

                      {/* أفاتار دائري بنمط Threads — قابل للنقر بشكل مستقل عن
                          باقي البطاقة (stopPropagation) رغم أنه لا يقود لصفحة
                          بروفايل فعلية هنا (منشورات مجهولة الهوية)؛ يفتح نفس
                          الثريد حالياً، تماماً كما يفعل النقر على الاسم بـ Threads */}
                      <button onClick={e=>{e.stopPropagation();openThread(p.id);}}
                        aria-label={s.cat(p.category)}
                        style={{...btn0,flexShrink:0,width:isMobile?36:38,height:isMobile?36:38,
                          borderRadius:RADIUS.circle,background:ci.bg,
                          display:"flex",alignItems:"center",justifyContent:"center",
                          fontSize:FONT.heading,fontWeight:800,color:ci.color,
                          transition:TRANSITIONS.colorChange}}>
                        {s.cat(p.category)?.trim()?.charAt(0)||"•"}
                      </button>

                      <div style={{flex:1,minWidth:0}}>
                        <div style={{display:"flex",justifyContent:"space-between",
                          alignItems:"flex-start",marginBottom:3,flexWrap:"wrap",gap:6}}>
                          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
                            <span style={{color:ci.color,fontWeight:700,fontSize:R.bodyText}}>
                              {s.cat(p.category)}
                            </span>
                            <span style={{fontSize:R.metaFont,color:CL.textMuted}}>· {timeAgo(p.timestamp,s)}</span>
                            {p.edited&&<span style={{fontSize:FONT.micro,color:CL.textMuted,fontStyle:"italic",display:"inline-flex",alignItems:"center",gap:3}}><IconPencil size={9} color={CL.textMuted}/> {s.editedLabel}</span>}
                            {flagCount>0&&<span style={{fontSize:FONT.micro,color:CL.flag}}>🚩 {flagCount}</span>}
                          </div>
                          <ActionMenuButton menuKey={`post-${p.id}`} text={p.text}
                            isOwner={!!ownedPosts[p.id]}
                            onEdit={()=>{setEditingPostId(p.id);setEditPostText(p.text);}}
                            onDelete={()=>deletePost(p.id)}/>
                        </div>

                        {editingPostId===p.id?(
                          <div style={{marginBottom:12}} onClick={e=>e.stopPropagation()}>
                            <textarea value={editPostText} onChange={e=>setEditPostText(e.target.value)}
                              maxLength={300} autoFocus
                              style={{...inputBase,width:"100%",minHeight:80,resize:"none",
                                border:BORDERS.edit,fontSize:R.textareaFont}}/>
                            {err&&<div style={{color:"#D07070",fontSize:FONT.caption,marginTop:4,wordBreak:"break-word"}}>{err}</div>}
                            <div style={{display:"flex",gap:6,marginTop:8,flexWrap:"wrap"}}>
                              <button onClick={()=>saveEditPost(p.id)} style={btnPrimary}>{s.editSave}</button>
                              <button onClick={cancelEdit} style={btnSecondary}>{s.editCancel}</button>
                            </div>
                          </div>
                        ):(
                          <>
                            <p style={{margin:"0 0 8px",fontSize:R.bodyText,lineHeight:1.7,
                              color:CL.text,wordBreak:"break-word"}}>{p.text}</p>
                            {p.mdFile&&mdBadge(p.mdFile,`feed-${p.id}`)}
                          </>
                        )}

                        {resp?.trim()&&(
                          <div style={{borderInlineStart:`3px solid ${ci.color}`,paddingInlineStart:10,
                            paddingTop:4,paddingBottom:4,marginBottom:10,
                            fontSize:FONT.label,color:CL.textSub,fontStyle:"italic",wordBreak:"break-word"}}>
                            📝 {resp}
                          </div>
                        )}

                        <div style={{display:"flex",alignItems:"center",gap:14,marginTop:2}}>
                          {reactionRow(p.id,null,p.votes)}
                          <button onClick={e=>{e.stopPropagation();openThread(p.id);}}
                            style={{...btn0,display:"flex",alignItems:"center",gap:5,
                              background:"transparent",border:"none",padding:isMobile?"7px 4px":"5px 2px",
                              color:CL.textMuted,fontSize:FONT.caption,fontWeight:700,
                              minHeight:isMobile?36:"auto"}}>
                            <span style={{display:"flex"}}><IconMessageCircle size={15} color={CL.textMuted}/></span>
                            {commentCount>0&&<span>{commentCount}</span>}
                            {replyCount>0&&(
                              <span style={{color:CL.reply,display:"inline-flex",alignItems:"center",gap:2}}>
                                <IconReply size={12} color={CL.reply}/>{replyCount}
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
      </div>

      {/* الفوتر خارج main/الحاوية الجانبية عمداً: بهذا الترتيب داخل حاوية flex
          عمودية (flexDirection:column) فإنه يلتصق دائماً بأسفل الشاشة حتى لو
          كان محتوى main قصيراً (حالة فارغة/تحميل)، بدل أن يتبع المحتوى فقط. */}
      <div style={{textAlign:"center",paddingTop:32,color:CL.textMuted,fontSize:FONT.caption,
        paddingBottom:isMobile?16:0,flexShrink:0}}>
        {s.footer}
      </div>
    </div>
  );
}
