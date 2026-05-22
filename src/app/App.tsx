import { useState, useRef, useEffect, type ChangeEvent, type CSSProperties, type RefObject } from "react";
import { Download, RefreshCw, Share2, Camera, Check, User, Link2 } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Gender = "female" | "male";
type Step = "hero" | "input" | "gender" | "loading" | "result";

interface UserData {
  username: string;
  name: string;
  bio: string;
  profileImage: string | null;
  agreed: boolean;
}

interface CardData {
  idNumber: string;
  issueDate: string;
  jobTitle: string;
  charge: string;
  reward: string | null;
  dangerLevel: number;
  secretSkill: string;
  accountCategory: string;
  warningNote: string;
}

// ─── Data ─────────────────────────────────────────────────────────────────────
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

const femaleJobTitles = [
  "مديرة التوثيق العاطفي",
  "خبيرة الستوريز الليلية",
  "رئيسة قسم الفلاتر التحليلية",
  "محللة سلوك المتابعين",
  "مديرة علاقات الريلز الدولية",
  "كبيرة مستشاري البايو",
  "وزيرة الفلاتر ذات الإضاءة الناعمة",
  "مفتشة نوايا اللايكات",
  "قائدة وحدة تصوير القهوة",
  "مدققة كابشنات رومانسية",
  "مهندسة زوايا السيلفي",
  "مستشارة ستوريز ما قبل النوم",
  "رئيسة أرشيف الصور المحذوفة",
  "سفيرة الرياكشنات الغامضة",
  "مديرة قسم الدلع الرقمي",
  "خبيرة اختفاء آخر ظهور",
  "محللة إيموجي القلب الوردي",
  "مراقبة حسابات الإكسات",
  "مديرة عمليات الرد بعد ساعتين",
  "رئيسة مجلس الهايلايت",
  "محققة في جرائم السكرين شوت",
  "منسقة جلسات الفوتوشوت العفوية",
  "خبيرة نشر بدون ما يبين أنها مهتمة",
  "قاضية محكمة البلوك المؤقت",
  "مشرفة قسم الفراشات والورد",
  "مستشارة اللوك اليومي",
  "رئيسة نقابة الكابشن القصير",
  "حارسة أسرار الكلوز فريندز",
  "مديرة شؤون الريلز الدرامية",
  "خبيرة ترتيب الصور بعد ألف محاولة",
  "مفتشة جودة المرايا",
  "مصممة ابتسامة البروفايل",
  "كبيرة علماء المزاج المتغير",
  "قائدة فرقة الظهور المفاجئ",
  "مديرة ملف الغيرة الهادئة",
  "مستشارة الرد بنقطة فقط",
];
const maleJobTitles = [
  "مدير الصمت الاستراتيجي",
  "خبير الاختفاء الدوري المتقدم",
  "رئيس قسم التجاهل الفعّال",
  "محلل الستوريز المجهولة",
  "مدير عمليات الغموض الرقمي",
  "كبير مستشاري الاختفاء",
  "وزير الرد بعد ثلاثة أيام",
  "قائد وحدة المشاهدة بصمت",
  "خبير فتح الرسالة وعدم الرد",
  "مدير شؤون الأونلاين الوهمي",
  "مفتش حسابات بدون صورة",
  "مهندس اللايك المتأخر",
  "رئيس مجلس الهدوء المفاجئ",
  "مستشار البايو الفارغ",
  "خبير وضع السماعات بدون موسيقى",
  "محقق في جرائم seen",
  "مدير قسم الظهور والاختفاء",
  "كابتن ستوريز منتصف الليل",
  "محلل نظرات البروفايل",
  "قائد فرقة الرد بكلمة تمام",
  "رئيس نقابة الشباب الغامض",
  "مستشار الكاريزما الصامتة",
  "مراقب الستوري من الحساب الثاني",
  "خبير تصوير السيارة من الداخل",
  "مدير عمليات ما شفت الرسالة",
  "قاضي محكمة الميوت",
  "رئيس قسم أنا مشغول",
  "مهندس ضحكة الرياكشن",
  "مدير أرشيف المحادثات المدفونة",
  "خبير متابعة بدون تفاعل",
  "مفتش الجودة على صور النادي",
  "قائد فريق التجاهل الهادئ",
  "كبير علماء اللامبالاة",
  "مستشار الرد بإيموجي واحد",
  "مدير ملف الغياب المريب",
  "حارس بوابة آخر ظهور",
];

const femaleCharges = [
  "نشر ستوريز فلسفية الساعة ٣ فجراً",
  "استخدام فلاتر بشكل مفرط على الواقع",
  "تصوير الكافيه بشكل يثير المشاعر العامة",
  "إلهام الآخرين بلا إذن مسبق",
  "رفع توقعات التصوير عند كل صاحباتها",
  "قول عادي وهي مو عادي نهائياً",
  "قلب المود العام بصورة مراية واحدة",
  "تخزين ٤٢ مسودة كابشن بدون تصريح",
  "اختفاء مفاجئ بعد جملة احكيلي",
  "استخدام أغنية حزينة على صورة عادية",
  "عمل لايك ثم سحبه كأنه لم يحدث",
  "زيادة مستوى اللطافة عن الحد القانوني",
  "إرسال سكرين شوت للجنة التحليل",
  "كتابة حاضر وهي ناوية لا",
  "تحويل كل طلعة لجلسة تصوير رسمية",
  "تنزيل ستوري مع عبارة لا حدا يرد",
  "سرقة الإضاءة الحلوة من المكان",
  "قراءة الرسالة بعينها الثالثة",
  "قيادة عصابة الكلوز فريندز",
  "حذف الستوري بعد ما الكل شافها",
  "قول ما بزعل ثم تنفيذ بلوك ناعم",
  "كابشن قصير تسبب بأزمة طويلة",
  "تصوير الطعام قبل ما يبرد ويفقد الأمل",
  "استخدام الهدوء كسلاح جماعي",
  "تغيير الصورة وانتظار مين يلاحظ",
  "إطلاق ضحكة معدية عبر الريلز",
  "توزيع نظرات جانبية بلا ترخيص",
  "تحويل البايو إلى لغز عاطفي",
  "تجميد الرد عند كلمة طيب",
  "تضليل الخوارزمية بصورة كيوت جداً",
  "إخفاء الزعل خلف قلب وردي",
  "فتح تحقيق كامل بسبب نقطة",
  "رفع مستوى الفراشات في المكان",
  "استخدام الكاريزما الناعمة لأغراض مجهولة",
];
const maleCharges = [
  "التلاشي المتكرر من المحادثات",
  "مشاهدة الستوريز بدون أي رد",
  "الصمت المتعمد على الرسائل",
  "النشاط الغامض في ساعات الفجر",
  "قول خمس دقايق والاختفاء ثلاث ساعات",
  "فتح الرسالة وتركها تتربى على seen",
  "اللايك المتأخر بعد انتهاء القضية",
  "إدارة حساب ثاني اسمه مجهول",
  "الرد بكلمة تمام على فقرة طويلة",
  "تنزيل ستوري قبل الرد على الرسائل",
  "ادعاء النوم وهو أونلاين من ١٣ دقيقة",
  "استخدام الغموض بدون رخصة",
  "عمل لايك على الميم وتجاهل السؤال",
  "إخفاء آخر ظهور عن الجهات المختصة",
  "قول والله كنت مشغول وهو كان يلعب",
  "تصوير الدركسون أكثر من الوجه",
  "سرقة جملة شو الأخبار",
  "الاختفاء بعد كلمة احكي",
  "إرسال ههههه وهو لم يضحك",
  "متابعة الستوري من بعيد لبعيد",
  "نشاط ليلي بلا تفسير",
  "ترك المحادثة على وشك الانهيار",
  "تشغيل وضع الطيران عاطفياً",
  "إخفاء المشاعر خلف صورة سيارة",
  "قول راجعلك ثم الهجرة رقمياً",
  "إدارة مكتب التجاهل العام",
  "إرسال رياكشن بدل الاعتذار",
  "تجميد المحادثات عمداً",
  "استخدام كلمة مشغول كهوية وطنية",
  "العودة بعد الغياب بسؤال شو الأخبار",
  "التعامل مع الأسئلة بنظام الضباب",
  "إخفاء النية خلف صورة سوداء",
  "تأخير الاعتذار حتى يبرد الموضوع",
  "استخدام الهدوء لإرباك الشهود",
];

const femaleRewards = [
  "بليون دينار وكرتونة اندومي",
  "قهوة مثلجة واشتراك نت شهر",
  "شاحن آيفون أصلي ونصف بيتزا",
  "بوكيه ورد وكيس بطاطا حار",
  "مليون قلب وردي وعلبة شوكولاتة",
  "كرتونة اندومي وكاسة قهوة",
  "كوب ماتشا وخصم على جلسة تصوير",
  "اشتراك سبوتيفاي ومشبك شعر ذهبي",
  "دفتر كابشنات وقلم حبر وردي",
  "علبة فراشات وهمية وكيس مارشميلو",
  "باقة إنترنت وكاميرا أمامية نظيفة",
  "كوب قهوة وكرسي عند الشباك",
  "خمسة لايكات مضمونة وقطعة تشيزكيك",
  "سلة ورد وريموت المكيف",
  "شهادة ملكة الستوريز واندومي حار",
  "حساب نتفلكس يومين وشوكولاتة",
  "عطر صغير وورقة اعتذار جاهزة",
  "فلتر حصري وكوب لاتيه",
  "نص كيلو حلا وهدنة لمدة ساعة",
  "بطاقة هدايا وكلمة حاضر بدون نقاش",
  "باور بنك وردي وكرتونة شيبس",
  "تاج ورقي وعلبة بسكوت",
  "جلسة تصوير مجانية وقهوة باردة",
  "ميدالية فراشة واشتراك كلوز فريندز",
  "رسالة اعتذار مطبوعة ووافل",
  "حزمة قلوب وردية وسندويشة زنجر",
  "ساعة هدوء كاملة وكرتونة اندومي",
  "كيس ميك أب وهمي وبيبسي بارد",
  "مقعد جنب الشاحن وقطعة براوني",
  "صندوق أسرار ودفتر ملاحظات",
];
const maleRewards = [
  "بليون دينار وريموت التلفزيون",
  "كرتونة اندومي وباور بنك مشحون",
  "سندويشة شاورما وبيبسي",
  "كرتونة مشروبات غازية ونص دينار",
  "شاحن تايب سي واندومي حار",
  "بليون دينار مزيف وكيس بزر",
  "وجبة زنجر ورخصة غموض مؤقتة",
  "اشتراك بلايستيشن يومين وكاسة شاي",
  "باور بنك وشهادة ما شفت الرسالة",
  "كيس بطاطا حار وكلمة تمام ذهبية",
  "ريموت احتياطي وساعة نوم إضافية",
  "شاورما دبل وكوب لبن",
  "كرسي جنب الشاحن وعلبة عصير",
  "باقة إنترنت وكرتونة ميمات",
  "سماعات سلك أصلية واندومي دجاج",
  "كوب قهوة سادة واعتذار جاهز",
  "كيس بزر واشتراك صمت أسبوع",
  "شهادة خبير تجاهل وبيبسي بارد",
  "تايب سي أصلي ونص بيتزا",
  "بطارية ١٠٠٪ وهدنة محادثات",
  "مفتاح سيارة وهمي وساندويشة فلافل",
  "كرتونة شيبس ورخصة seen",
  "نظارة شمس وكوب نسكافيه",
  "ريموت المكيف ومليون دينار رمزي",
  "علبة تمر وقعدة هادئة",
  "كرتونة اندومي وكلمة مشغول مختومة",
  "وجبة كباب وملف أعذار جديد",
  "باقة دقائق وصورة بروفايل غامضة",
  "سندويشة بطاطا وشاحن سيارة",
  "كرتونة بزر وشهادة آخر ظهور",
];

const femaleSkills = [
  "فتح الستوري وإغلاقه بسرعة البرق",
  "تحليل المتابع الجديد في ثانيتين",
  "اكتشاف الفلتر المستخدم في أي صورة",
  "قراءة نوايا الكابشن الغامض",
  "تغيير المود العام بإيموجي واحد",
  "تصوير القهوة من زاوية تجعلها مشهورة",
  "معرفة مين شاف الستوري ومين تجاهلها",
  "كتابة تمام بنبرة فيها ٩ معاني",
  "تحويل المرآة إلى استوديو احترافي",
  "حذف الرسالة قبل ما الندم يوصل",
  "الرد بعد ساعة كأنه صار بعد دقيقة",
  "اكتشاف اللايك الغلط قبل صاحبه",
  "ترتيب الهايلايت حسب المزاج لا المنطق",
  "إطلاق نظرة جانبية توقف الاجتماع",
  "تصميم كابشن من ثلاث كلمات يربك الجميع",
  "تمييز الكذب من سرعة كتابة الطرف الآخر",
  "إرسال سكرين شوت بسرعة الطوارئ",
  "إقناع الكل أن الصورة عفوية وهي مشروع كامل",
  "اختيار أغنية ستوري تضرب بالمباشر",
  "قراءة الرسالة بدون فتحها روحياً",
  "صناعة دراما لطيفة من نقطة",
  "تدوير الصورة حتى تصير ممتازة بالغلط",
  "إخفاء الزعل خلف قلب وردي",
  "تشغيل وضع الملكة الهادئة",
  "تحويل اللايك إلى رسالة مبطنة",
  "تذكّر تعليق من عام ٢٠١٩",
  "تحديد مكان التصوير من لون الطاولة",
  "اكتشاف الفيك أكاونت من أول حرف",
  "اختيار فلتر يصلح الواقع مؤقتاً",
  "تحويل جملة عادي إلى ملف تحقيق",
  "التظاهر بعدم الاهتمام باحتراف",
  "إدارة مجلس صديقات الطوارئ",
  "نشر ستوري ثم مراقبة الكون",
];
const maleSkills = [
  "الاختفاء من المحادثات بدون أثر",
  "مشاهدة الستوريز دون ترك أثر",
  "الصمت الاستراتيجي لأكثر من ٧٢ ساعة",
  "إدارة حساب غامض بكفاءة عالية",
  "الرد بكلمة تمام وإنهاء أي نقاش",
  "تشغيل وضع مشغول وهو يتصفح",
  "إرسال رياكشن بدل شرح الموقف",
  "مشاهدة الستوري من الحساب الثاني",
  "تأخير الرد حتى ينسى السؤال نفسه",
  "تصوير القهوة السوداء كأنها إعلان",
  "اختراع عذر من كلمتين بسرعة",
  "إخفاء الارتباك خلف ههههه",
  "تحويل آخر ظهور إلى سر دولة",
  "فتح الرسالة ثم الهروب بلياقة",
  "إقناع الجميع أنه ما شاف الإشعار",
  "توزيع لايكات دون مسؤولية قانونية",
  "حفظ الميمات بدل المشاعر",
  "إدارة الغموض بكفاءة منخفضة الصوت",
  "الظهور فجأة بكلمة وينك",
  "قراءة الموقف والانسحاب فوراً",
  "تجميد المحادثة عند نقطة حساسة",
  "التصوير من داخل السيارة بلا سبب",
  "اختيار صورة بروفايل لا تكشف شيئاً",
  "التعامل مع السؤال بسؤال ثاني",
  "إرسال تمام بنبرة غامضة",
  "استخدام كلمة مشغول كدرع رسمي",
  "تأجيل الاعتذار لوقت غير معروف",
  "فهم الستوري وعدم الاعتراف",
  "الاختفاء عند كلمة لازم نحكي",
  "إدارة شبكة أعذار متعددة",
  "ترك الناس تتساءل هل هو حي",
  "التفاعل مع الميم وتجاهل الرسالة",
  "العودة من الغياب كأنه راح يجيب خبز",
];

const femaleCategories = [
  "حساب تحت المراقبة العاطفية العليا",
  "خطر استوري متكرر — درجة ثانية",
  "بايو فلسفي عالي الخطورة",
  "مطلوبة لدى قسم الفراشات الوردي",
  "ملكة الكلوز فريندز المعتمدة",
  "حساب يرفع ضغط الخوارزمية بلطافة",
  "ملف وردي عالي الدراما",
  "مشروع مؤثرة بدون ما تعترف",
  "مصدر إشعارات غير مستقر",
  "حالة رومانسية تحت التحليل",
  "درجة خطورة: كيوت لكن خطير",
  "مستوى دلع يحتاج موافقة أمنية",
  "أرشيف صور قابل للانفجار",
  "حساب يسبب اجتماع صديقات عاجل",
  "مشتبه بها في جرائم الكابشن",
  "فئة: ستوري واحد يكفي",
  "تأثير فراشات غير مرخص",
  "ملف قهوة وتصوير متقدم",
  "حساب مشع بنسبة ٩٨٪",
  "قوة ناعمة على الإنترنت",
  "مستوى غموض وردي ممتاز",
  "حساب يحتاج مترجم مشاعر",
  "قضية لايكات قيد البحث",
  "مراقبة بسبب الجاذبية المفاجئة",
  "تصنيف: لا تفتح البايو ليلاً",
  "وحدة عمليات المرآة",
  "خطر ابتسامة من الدرجة الأولى",
  "قسم الريلز اللطيفة والخطرة",
  "حساب يشتغل بطاقة الورد",
  "ملف اختفاء بنكهة فراولة",
  "مصنفة كأزمة لطيفة",
  "جهاز إنذار عاطفي متنقل",
];
const maleCategories = [
  "حساب غامض من الدرجة الأولى",
  "خطر تجاهل استراتيجي — مستوى متقدم",
  "مجهول الهوية الرقمية الكاملة",
  "مطلوب لدى قسم آخر ظهور",
  "ملف أزرق شديد الغموض",
  "مصدر seen غير قابل للتفسير",
  "حساب يعمل بنظام الصمت",
  "فئة: رد متأخر جداً",
  "مستوى لامبالاة مرخص",
  "مشروع كاريزما ساكتة",
  "قضية اختفاء تحت المتابعة",
  "درجة خطورة: أونلاين ولا يرد",
  "حساب يحتاج جهاز كشف أعذار",
  "مشتبه به في جرائم الميوت",
  "ملف شاورما وغياب",
  "حالة بروفايل غير مفهومة",
  "وحدة عمليات التجاهل الهادئ",
  "قسم الصور من السيارة",
  "خطر غموض من الدرجة الممتازة",
  "حساب يختفي عند الضغط",
  "تصنيف: رجعة مفاجئة",
  "مصدر رياكشنات بلا تفسير",
  "فئة الشباب الأزرق النادر",
  "حساب لا يعترف بالإشعارات",
  "مستوى هدوء يثير الشك",
  "قائد فريق ما شفتها",
  "ملف ميمات حساس",
  "حالة متابعة صامتة",
  "نظام تشغيل: مشغول دائماً",
  "تصنيف: تمام وانتهى النقاش",
  "خطر ظهور عند منتصف الليل",
  "حساب قابل للاختفاء الفوري",
];

const femaleWarnings = [
  "تحذير: هذا الحساب قادر على التأثير العاطفي المفاجئ",
  "ممنوع فتح حسابها بعد منتصف الليل",
  "قد يسبب إدمان المتابعة المستمرة",
  "الاقتراب من ستوريها دون لايك قد يسبب مساءلة",
  "قد ترسل تمام وتبدأ العاصفة بعدها",
  "لا تستهين بالقلب الوردي، قد يكون إنذاراً",
  "قد تحذف الستوري قبل أن تفهم الرسالة",
  "مشاهدة البايو أكثر من مرة قد تسبب فضول دائم",
  "تجاهلها بعد سؤال احكيلي تصرف عالي الخطورة",
  "قد تحوّل صورة القهوة إلى حدث اجتماعي",
  "لا تستخدم طيب معها إلا ومعك محام",
  "قد تعرف أنك زرت الحساب من إحساسها فقط",
  "لا تفتح الكلوز فريندز بدون استعداد نفسي",
  "الرد المتأخر قد يؤدي إلى جلسة تحقيق",
  "قد تسبب رغبة مفاجئة في تغيير صورة البروفايل",
  "ممنوع تحليل ستوريها بدون لجنة مختصة",
  "الضحكة في الريلز قد تكون معدية",
  "لا تسأل شو في إذا كنت غير جاهز للسرد",
  "قد تملك أرشيف سكرين شوت أقوى من الأدلة",
  "عدم ملاحظة الصورة الجديدة جريمة اجتماعية",
  "قد تتحول النقطة إلى ملف كامل",
  "لا تقول مبين عادي، الوضع ليس عادي",
  "قد تستخدم الصمت كخطة رد",
  "المكافأة على إرضائها: سلام داخلي مؤقت",
  "تكرار مشاهدة ستوريها قد يكشفك للخوارزمية",
  "قد تصنع أزمة من إيموجي في غير مكانه",
  "لا تناقش ترتيب الهايلايت",
  "قد تفوز عليك في أي تحقيق عاطفي",
  "تحذير: الفراشات هنا ليست للزينة فقط",
  "قد تسأل سؤال وهي تعرف الجواب",
  "النجاة تتطلب قهوة واعتذار واضح",
  "ممنوع قول براحتك بدون فهم العواقب",
];
const maleWarnings = [
  "تحذير: قد يختفي من المحادثات فجأة وبدون سابق إنذار",
  "ممنوع انتظار رده على الرسائل أكثر من ٢٤ ساعة",
  "قد يسبب الغموض الدائم لكل من يتابعه",
  "قد يقرأ الرسالة ثم يدخل في إجازة رقمية",
  "لا تثق بجملة خمس دقايق",
  "قد يظهر أونلاين وينكر علاقته بالإنترنت",
  "الرد بكلمة تمام لا يعني أن الموضوع تمام",
  "قد يستخدم الميم كبديل عن الاعتراف",
  "مشاهدة ستوريك لا تعني وجود خطة واضحة",
  "قد يختفي عند أول لازم نحكي",
  "لا تسأله وينك إذا كان يحمل شاحن ضعيف",
  "قد يرسل ههههه في لحظة مأساوية",
  "لا تنتظر شرحاً أطول من سطر",
  "قد يفتح المحادثة ثم يتذكر أنه مشغول",
  "آخر ظهور لديه مادة سرية",
  "قد يصور السيارة بدل حل المشكلة",
  "لا تفسر اللايك، حتى هو لا يعرف معناه",
  "قد يرد بعد انتهاء الموسم",
  "المكافأة على فهمه: كرتونة اندومي وشهادة صبر",
  "قد يستخدم كلمة مشغول كهوية وطنية",
  "لا ترسل فقرة طويلة وتتوقع أكثر من تمام",
  "قد يعود فجأة بسؤال شو الأخبار",
  "يتأثر بالضغط ثم يتحول إلى وضع الطيران",
  "قد يتركك مع ثلاثة أسئلة مفتوحة",
  "ممنوع الاعتماد على توقيت رده",
  "قد يختفي بسبب بطارية ٨٠٪",
  "لا تحاول فك شيفرة البايو الفارغ",
  "قد يتابع بصمت كأنه كاميرا مراقبة",
  "الاعتذار لديه يحتاج تحديث نظام",
  "قد ينجو من النقاش بإيموجي",
  "لا تقارنه بسرعة الإنترنت، هذا ظلم للإنترنت",
  "تحذير: الهدوء الزائد قابل للاشتعال",
];

const FLOATING_WORDS = [
  { text: "مطلوب بسبب الستوري", x: 4, y: 8, rot: -8, dur: 7 },
  { text: "خبير اختفاء", x: 72, y: 4, rot: 12, dur: 8 },
  { text: "درجة الغموض عالية", x: 18, y: 68, rot: -5, dur: 9 },
  { text: "بايو مقتول", x: 62, y: 58, rot: 8, dur: 7.5 },
  { text: "معدل فتح الستوري ٩٩٪", x: 8, y: 44, rot: 15, dur: 10 },
  { text: "ملك التجاهل", x: 82, y: 32, rot: -12, dur: 8.5 },
  { text: "خبيرة الفلاتر", x: 38, y: 82, rot: 6, dur: 9.5 },
  { text: "Instagram Certified", x: 52, y: 18, rot: -3, dur: 7 },
  { text: "تحت المراقبة الرقمية", x: 78, y: 72, rot: 10, dur: 11 },
  { text: "سري من الدرجة الأولى", x: 28, y: 28, rot: -9, dur: 8 },
  { text: "مكافأة: بليون دينار", x: 12, y: 18, rot: 7, dur: 9 },
  { text: "كرتونة اندومي لمن يجده", x: 58, y: 9, rot: -10, dur: 8 },
  { text: "آخر ظهور قيد التحقيق", x: 31, y: 12, rot: 14, dur: 10 },
  { text: "ملف سكرين شوت سري", x: 6, y: 61, rot: -14, dur: 8.5 },
  { text: "الرد تأخر رسمياً", x: 80, y: 48, rot: 6, dur: 9.2 },
  { text: "لايك مشبوه", x: 47, y: 72, rot: -7, dur: 7.8 },
  { text: "قضية قلب وردي", x: 18, y: 88, rot: 11, dur: 11 },
  { text: "مطلوب لدى شرطة الكابشن", x: 66, y: 84, rot: -5, dur: 8.3 },
  { text: "seen بدون رحمة", x: 86, y: 15, rot: -13, dur: 9.7 },
  { text: "فراشات عالية الخطورة", x: 36, y: 38, rot: 8, dur: 10.3 },
  { text: "ممنوع فتح البايو", x: 3, y: 31, rot: 12, dur: 8.8 },
  { text: "تمام لا تعني تمام", x: 71, y: 64, rot: -9, dur: 9.4 },
  { text: "مصادر تؤكد الغموض", x: 24, y: 53, rot: 4, dur: 7.6 },
  { text: "مراقبة من الحساب الثاني", x: 49, y: 4, rot: 9, dur: 10.5 },
  { text: "قهوة واعتذار مطلوب", x: 9, y: 76, rot: -4, dur: 8.9 },
  { text: "مطلوب مقابل شاحن أصلي", x: 77, y: 88, rot: 13, dur: 11.2 },
  { text: "بلاغ عن ضحكة معدية", x: 43, y: 91, rot: -11, dur: 9.6 },
  { text: "الكاريزما غير مرخصة", x: 59, y: 33, rot: 15, dur: 7.9 },
  { text: "الهايلايت تحت الفحص", x: 15, y: 38, rot: -6, dur: 8.7 },
  { text: "مطلوب عند دائرة الريلز", x: 88, y: 72, rot: 7, dur: 10.8 },
  { text: "إشعار مشبوه", x: 33, y: 74, rot: 13, dur: 8.1 },
  { text: "لا ترد بنقطة", x: 63, y: 42, rot: -15, dur: 9.1 },
  { text: "بوكيه ورد كفالة", x: 22, y: 5, rot: -3, dur: 10.1 },
  { text: "شاورما لمن يبلغ عنه", x: 83, y: 57, rot: 10, dur: 9.8 },
];

const LOADING_TEXTS = [
  "جاري فحص مستواك الاجتماعي",
  "نحلل كمية الستوريز اليومية",
  "نقيس درجة الغموض لديك",
  "جاري استخراج شخصيتك الإنستقرامية",
  "نكشف مهاراتك السرية",
  "نراجع ملف آخر ظهور عندك",
  "نفتش عن اللايكات المشبوهة",
  "نحسب عدد مرات قولك عادي",
  "نقيس نسبة الكاريزما غير المرخصة",
  "نبحث في أرشيف السكرين شوت",
  "نطارد الحساب الثاني حول الحي الرقمي",
  "نجهز كرتونة الاندومي للمكافأة",
  "نستدعي لجنة تحليل الكابشن",
  "نقارن بين البايو والواقع",
  "نراقب سرعة الرد على الرسائل",
  "نفتح ملف الغموض الأزرق",
  "نلمع الفراشات الوردية",
  "نقيس حرارة الدراما اللطيفة",
  "نعد اللايكات التي سُحبت بسرعة",
  "نطبع الختم الرسمي للفضيحة",
  "نحسب كم مرة قلت خمس دقايق",
  "نبحث عن نوايا الإيموجي",
  "نختبر قوة كلمة تمام",
  "نراجع سجل المشاهدة بصمت",
  "نضبط مستوى البهارات في الهوية",
  "نستشير شرطة الستوريز",
  "نقيس عمق النظرة الجانبية",
  "نجهز مكافأة بليون دينار وهمي",
  "نفتش عن شاحن أصلي في الأدلة",
  "نحلل علاقة الصورة بالمزاج",
  "نبحث عن سبب حذف الستوري",
  "نقيس نسبة اللامبالاة الظاهرة",
  "نضيف ختم مطلوب لكن كيوت",
  "نجهز الهوية ونخفي الأدلة",
];

function generateCardData(gender: Gender): CardData {
  const isF = gender === "female";
  const now = new Date();
  const charge = pick(isF ? femaleCharges : maleCharges);
  return {
    idNumber: `IG-${now.getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
    issueDate: `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}/${now.getFullYear()}`,
    jobTitle: pick(isF ? femaleJobTitles : maleJobTitles),
    charge,
    reward: charge ? pick(isF ? femaleRewards : maleRewards) : null,
    dangerLevel: Math.floor(62 + Math.random() * 37),
    secretSkill: pick(isF ? femaleSkills : maleSkills),
    accountCategory: pick(isF ? femaleCategories : maleCategories),
    warningNote: pick(isF ? femaleWarnings : maleWarnings),
  };
}

// ─── SVG Icons ────────────────────────────────────────────────────────────────
function ButterflyIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 44 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <ellipse cx="11" cy="16" rx="10" ry="13" fill="url(#bfl)" opacity="0.85" transform="rotate(-22 11 16)" />
      <ellipse cx="33" cy="16" rx="10" ry="13" fill="url(#bfr)" opacity="0.85" transform="rotate(22 33 16)" />
      <path d="M22 6 Q22 16 22 26" stroke="#D946EF" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M22 7 Q19 3 16 1" stroke="#D946EF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <path d="M22 7 Q25 3 28 1" stroke="#D946EF" strokeWidth="1.2" strokeLinecap="round" fill="none" />
      <defs>
        <linearGradient id="bfl" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F9A8D4" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>
        <linearGradient id="bfr" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#F9A8D4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function RoseIcon({ style }: { style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={style}>
      <circle cx="16" cy="13" r="5.5" fill="#FB7185" />
      <ellipse cx="16" cy="7.5" rx="4.5" ry="3.5" fill="#F43F5E" transform="rotate(-30 16 7.5)" />
      <ellipse cx="22" cy="14" rx="4.5" ry="3.5" fill="#FB7185" transform="rotate(60 22 14)" />
      <ellipse cx="16" cy="19.5" rx="4.5" ry="3.5" fill="#F43F5E" transform="rotate(30 16 19.5)" />
      <ellipse cx="10" cy="14" rx="4.5" ry="3.5" fill="#FB7185" transform="rotate(-60 10 14)" />
      <ellipse cx="9.5" cy="8.5" rx="3.5" ry="2.5" fill="#FDA4AF" transform="rotate(-15 9.5 8.5)" />
      <ellipse cx="22.5" cy="8.5" rx="3.5" ry="2.5" fill="#FDA4AF" transform="rotate(15 22.5 8.5)" />
      <path d="M16 22 Q16 27 15 30" stroke="#86EFAC" strokeWidth="2" strokeLinecap="round" />
      <path d="M13 26 Q9 24 10 21" stroke="#86EFAC" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ─── Vintage Identity Card ────────────────────────────────────────────────────
const HANDWRITTEN_FONT = "'Amiri', 'Aref Ruqaa', serif";
const TYPEWRITER_FONT = "'Amiri', 'Courier New', serif";
const CLASSIC_CARD_DESIGN_WIDTH = 760;
const CLASSIC_CARD_MIN_HEIGHT = 452;

interface VintageTheme {
  holderLabel: string;
  paper: string;
  wash: string;
  accent: string;
  accentDark: string;
  accentSoft: string;
  stamp: string;
  ink: string;
  shadow: string;
  hasButterflies: boolean;
}

function getVintageTheme(gender: Gender): VintageTheme {
  if (gender === "female") {
    return {
      holderLabel: "صاحبة الحساب",
      paper: "linear-gradient(135deg, #ffe8f1 0%, #f9cddd 48%, #fff5f8 100%)",
      wash: "rgba(207, 71, 127, 0.12)",
      accent: "#c94f83",
      accentDark: "#6f203d",
      accentSoft: "rgba(201, 79, 131, 0.16)",
      stamp: "rgba(166, 54, 96, 0.58)",
      ink: "#7a2346",
      shadow: "0 22px 50px rgba(86, 28, 55, 0.22)",
      hasButterflies: true,
    };
  }

  return {
    holderLabel: "صاحب الحساب",
    paper: "linear-gradient(135deg, #dff4fb 0%, #bfe1f0 48%, #edf9fd 100%)",
    wash: "rgba(33, 130, 184, 0.13)",
    accent: "#2f8fc2",
      accentDark: "#143e61",
      accentSoft: "rgba(47, 143, 194, 0.15)",
      stamp: "rgba(25, 83, 125, 0.58)",
      ink: "#174b72",
      shadow: "0 22px 50px rgba(18, 56, 82, 0.24)",
      hasButterflies: false,
  };
}

function PaperTexture({ theme }: { theme: VintageTheme }) {
  return (
    <>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: theme.paper,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.36,
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 7px), repeating-linear-gradient(90deg, rgba(255,255,255,0.18) 0px, rgba(255,255,255,0.18) 1px, transparent 1px, transparent 11px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          opacity: 0.24,
          backgroundImage:
            "radial-gradient(circle at 20% 22%, rgba(0,0,0,0.14) 0 1px, transparent 1.5px), radial-gradient(circle at 74% 62%, rgba(255,255,255,0.55) 0 1px, transparent 1.5px)",
          backgroundSize: "31px 29px, 43px 37px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: "14px",
          border: `1px solid ${theme.ink}`,
          borderRadius: "24px",
          opacity: 0.42,
          pointerEvents: "none",
        }}
      />
    </>
  );
}

function StarBorder({ theme }: { theme: VintageTheme }) {
  const topBottom = Array.from({ length: 13 }, (_, i) => 8 + i * 7);
  const sides = Array.from({ length: 6 }, (_, i) => 17 + i * 13);
  const stars = [
    ...topBottom.map((left, i) => ({ key: `top-${i}`, top: "18px", left: `${left}%` })),
    ...topBottom.map((left, i) => ({ key: `bottom-${i}`, bottom: "17px", left: `${left}%` })),
    ...sides.map((top, i) => ({ key: `right-${i}`, top: `${top}%`, right: "18px" })),
    ...sides.map((top, i) => ({ key: `left-${i}`, top: `${top}%`, left: "18px" })),
  ];

  return (
    <>
      {stars.map((star) => (
        <span
          key={star.key}
          style={{
            position: "absolute",
            ...star,
            color: theme.ink,
            fontSize: "24px",
            lineHeight: 1,
            opacity: 0.9,
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
          }}
        >
          ★
        </span>
      ))}
    </>
  );
}

function ButterflyTrail({ theme }: { theme: VintageTheme }) {
  if (!theme.hasButterflies) return null;

  return (
    <>
      <ButterflyIcon style={{ position: "absolute", top: "68px", left: "74px", width: "54px", height: "40px", opacity: 0.7, transform: "rotate(-12deg)" }} />
      <ButterflyIcon style={{ position: "absolute", bottom: "70px", right: "78px", width: "48px", height: "36px", opacity: 0.62, transform: "rotate(14deg) scaleX(-1)" }} />
      <ButterflyIcon style={{ position: "absolute", top: "44%", left: "49%", width: "34px", height: "25px", opacity: 0.34, transform: "rotate(7deg)" }} />
    </>
  );
}

function PhotoFrame({ userData, theme }: { userData: UserData; theme: VintageTheme }) {
  return (
    <div
      style={{
        alignSelf: "start",
        justifySelf: "center",
        width: "100%",
        maxWidth: "255px",
        padding: "10px 10px 28px",
        background: "rgba(255, 255, 247, 0.88)",
        border: "1px solid rgba(0,0,0,0.2)",
        boxShadow: "7px 9px 18px rgba(0,0,0,0.22)",
        transform: "rotate(-1.3deg)",
        position: "relative",
      }}
    >
      <div
        style={{
          width: "100%",
          aspectRatio: "1 / 1.1",
          background: `linear-gradient(135deg, ${theme.accentSoft}, rgba(255,255,255,0.8))`,
          border: "1px solid rgba(0,0,0,0.18)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {userData.profileImage ? (
          <img src={userData.profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover", filter: "saturate(0.88) contrast(0.98)" }} />
        ) : (
          <User size={58} color={theme.accentDark} strokeWidth={1.35} />
        )}
      </div>
      <div
        style={{
          position: "absolute",
          left: "10px",
          right: "10px",
          bottom: "7px",
          textAlign: "center",
          color: theme.ink,
          opacity: 0.72,
          fontFamily: TYPEWRITER_FONT,
          fontSize: "11px",
          fontStyle: "italic",
        }}
      >
        Photograph of authorized account
      </div>
    </div>
  );
}

function DottedField({
  label,
  value,
  theme,
}: {
  label: string;
  value: string | number;
  theme: VintageTheme;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "104px minmax(0, 1fr)",
        gap: "8px",
        alignItems: "end",
        marginBottom: "8px",
      }}
    >
      <span
        style={{
          color: theme.ink,
          fontFamily: TYPEWRITER_FONT,
          fontSize: "15px",
          fontWeight: 700,
          lineHeight: 1,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      <span
        style={{
          minHeight: "27px",
          borderBottom: `2px dotted ${theme.ink}`,
          display: "block",
          padding: "0 8px 1px",
        }}
      >
        <span
          style={{
            color: theme.ink,
            fontFamily: HANDWRITTEN_FONT,
            fontSize: "23px",
            fontWeight: 400,
            lineHeight: 1.05,
            overflowWrap: "anywhere",
          }}
        >
          {value}
        </span>
      </span>
    </div>
  );
}

function FrontFace({ userData, cardData, gender, theme }: { userData: UserData; cardData: CardData; gender: Gender; theme: VintageTheme }) {
  const displayName = userData.name || (gender === "female" ? "اسم المستخدمة" : "اسم المستخدم");
  const username = userData.username || "username";

  return (
    <div className="classic-id-face" style={{ background: "#d9eef7", boxShadow: theme.shadow }}>
      <PaperTexture theme={theme} />
      <StarBorder theme={theme} />
      <ButterflyTrail theme={theme} />

      <div className="classic-id-inner">
        <header style={{ textAlign: "center", marginBottom: "18px", color: theme.ink }}>
          <div style={{ fontFamily: TYPEWRITER_FONT, fontSize: "15px", fontWeight: 700, textTransform: "uppercase" }}>PERMANENT INSTAGRAM IDENTITY CARD</div>
          <div style={{ fontSize: "24px", fontWeight: 900, marginTop: "2px", color: theme.accentDark }}>بطاقة هوية إنستغرام دائمة</div>
          <div style={{ height: "2px", background: theme.ink, opacity: 0.35, margin: "10px auto 0", width: "72%" }} />
        </header>

        <div className="classic-id-body">
          <PhotoFrame userData={userData} theme={theme} />

          <section>
            <div style={{ textAlign: "center", marginBottom: "10px", color: theme.ink }}>
              <div style={{ fontFamily: TYPEWRITER_FONT, fontSize: "14px", fontWeight: 700 }}>NO. {cardData.idNumber}</div>
            </div>

            <DottedField label="الاسم" value={displayName} theme={theme} />
            <DottedField label="المستخدم" value={`@${username}`} theme={theme} />
            <DottedField label="الإصدار" value={cardData.issueDate} theme={theme} />
            <DottedField label="التصنيف" value={cardData.accountCategory} theme={theme} />

            <div style={{ marginTop: "11px", padding: "9px 12px", background: theme.accentSoft, border: `1px solid ${theme.accent}`, color: theme.accentDark }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px" }}>
                <span style={{ fontFamily: TYPEWRITER_FONT, fontSize: "13px", fontWeight: 700 }}>مستوى الخطورة</span>
                <span style={{ fontFamily: HANDWRITTEN_FONT, fontSize: "24px", color: theme.ink }}>{cardData.dangerLevel}%</span>
              </div>
              <div style={{ height: "7px", background: "rgba(255,255,255,0.46)", border: `1px solid ${theme.accentDark}`, overflow: "hidden" }}>
                <div style={{ width: `${cardData.dangerLevel}%`, height: "100%", background: theme.accentDark }} />
              </div>
            </div>

            <div
              style={{
                display: "inline-flex",
                marginTop: "14px",
                padding: "6px 18px",
                border: `2px solid ${theme.stamp}`,
                color: theme.stamp,
                fontFamily: TYPEWRITER_FONT,
                fontSize: "13px",
                fontWeight: 700,
                transform: "rotate(-4deg)",
              }}
            >
              INSTAGRAM VERIFIED
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function BackFace({ userData, cardData, gender, theme }: { userData: UserData; cardData: CardData; gender: Gender; theme: VintageTheme }) {
  const displayName = userData.name || (gender === "female" ? "اسم المستخدمة" : "اسم المستخدم");
  const holder = theme.holderLabel;

  return (
    <div className="classic-id-face" style={{ background: "#d9eef7", boxShadow: theme.shadow }}>
      <PaperTexture theme={theme} />
      <StarBorder theme={theme} />
      <ButterflyTrail theme={theme} />

      <div className="classic-id-inner">
        <header style={{ textAlign: "center", color: theme.ink, marginBottom: "12px" }}>
          <div style={{ fontFamily: TYPEWRITER_FONT, fontSize: "16px", fontWeight: 700 }}>BACK OF IDENTITY CARD</div>
          <div style={{ fontSize: "23px", fontWeight: 900, color: theme.accentDark }}>الجهة الخلفية للهوية</div>
        </header>

        <section
          style={{
            position: "relative",
            padding: "16px 18px",
            border: `1px solid rgba(0,0,0,0.28)`,
            background: "rgba(255,255,255,0.24)",
            color: theme.ink,
            marginBottom: "12px",
          }}
        >
          <p style={{ margin: 0, fontFamily: TYPEWRITER_FONT, fontSize: "15px", lineHeight: 1.55 }}>
            This is to certify that the account named above is permitted to post, watch stories, vanish, and return dramatically unless detained by weak signal.
          </p>
          <div
            style={{
              position: "absolute",
              left: "9%",
              top: "34%",
              border: `3px solid ${theme.stamp}`,
              color: theme.stamp,
              borderRadius: "50%",
              padding: "10px 28px",
              fontFamily: TYPEWRITER_FONT,
              fontSize: "28px",
              fontWeight: 700,
              transform: "rotate(-12deg)",
              opacity: 0.62,
            }}
          >
            CERTIFIED
          </div>
        </section>

        <div className="classic-id-back-grid">
          <DottedField label="الصفة" value={cardData.jobTitle} theme={theme} />
          {cardData.charge && <DottedField label="التهمة" value={cardData.charge} theme={theme} />}
          <DottedField label="المهارة" value={cardData.secretSkill} theme={theme} />
          <DottedField label="ملاحظة" value={cardData.warningNote} theme={theme} />
        </div>

        {userData.bio && (
          <div style={{ marginTop: "8px", color: theme.ink }}>
            <div style={{ fontFamily: TYPEWRITER_FONT, fontSize: "13px", fontWeight: 700, marginBottom: "3px" }}>Bio note</div>
            <div style={{ border: `1px dashed ${theme.ink}`, padding: "8px 10px", fontFamily: HANDWRITTEN_FONT, fontSize: "20px", lineHeight: 1.25 }}>
              "{userData.bio}"
            </div>
          </div>
        )}

        <footer style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", marginTop: "14px", alignItems: "end" }}>
          <div style={{ color: theme.ink }}>
            <div style={{ borderBottom: `2px dotted ${theme.ink}`, minHeight: "32px", paddingInline: "6px" }}>
              <span style={{ fontFamily: HANDWRITTEN_FONT, fontSize: "27px" }}>{displayName}</span>
            </div>
            <div style={{ textAlign: "center", fontFamily: TYPEWRITER_FONT, fontSize: "11px", marginTop: "2px" }}>Signature of {holder}</div>
          </div>
          {cardData.charge && cardData.reward ? (
            <div
              style={{
                justifySelf: "end",
                width: "min(100%, 230px)",
                border: "3px solid #b91c1c",
                color: "#b91c1c",
                padding: "8px 10px",
                textAlign: "center",
                fontFamily: TYPEWRITER_FONT,
                fontWeight: 900,
                transform: "rotate(-3deg)",
                background: "rgba(255, 255, 255, 0.16)",
                boxShadow: "inset 0 0 0 1px rgba(185, 28, 28, 0.25)",
              }}
            >
              <div style={{ fontSize: "12px", letterSpacing: "0.08em" }}>مكافأة القبض</div>
              <div style={{ fontSize: "18px", lineHeight: 1.25, marginTop: "2px" }}>{cardData.reward}</div>
            </div>
          ) : (
            <div style={{ justifySelf: "end", color: theme.accentDark, fontFamily: TYPEWRITER_FONT, fontSize: "12px", fontWeight: 700 }}>
              هذه الهوية للتسلية فقط
            </div>
          )}
        </footer>
      </div>
    </div>
  );
}

function ClassicIdentityCards({
  userData,
  cardData,
  gender,
  cardRef,
}: {
  userData: UserData;
  cardData: CardData;
  gender: Gender;
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const theme = getVintageTheme(gender);
  const [mobileLayout, setMobileLayout] = useState({
    compact: false,
    scale: 1,
    heights: [CLASSIC_CARD_MIN_HEIGHT, CLASSIC_CARD_MIN_HEIGHT],
  });

  useEffect(() => {
    const updateLayout = () => {
      const container = cardRef.current;
      if (!container) return;

      const compact = window.matchMedia("(max-width: 640px)").matches;
      const containerWidth = container.getBoundingClientRect().width || CLASSIC_CARD_DESIGN_WIDTH;
      const scale = compact ? Math.min(1, containerWidth / CLASSIC_CARD_DESIGN_WIDTH) : 1;
      const faces = Array.from(container.querySelectorAll<HTMLElement>(".classic-id-face"));
      const heights = faces.map((face) => Math.max(CLASSIC_CARD_MIN_HEIGHT, face.scrollHeight));
      const nextHeights = [
        heights[0] ?? CLASSIC_CARD_MIN_HEIGHT,
        heights[1] ?? CLASSIC_CARD_MIN_HEIGHT,
      ];

      setMobileLayout((prev) => {
        const unchanged =
          prev.compact === compact &&
          Math.abs(prev.scale - scale) < 0.001 &&
          prev.heights[0] === nextHeights[0] &&
          prev.heights[1] === nextHeights[1];

        return unchanged ? prev : { compact, scale, heights: nextHeights };
      });
    };

    updateLayout();
    const raf = window.requestAnimationFrame(updateLayout);
    const resizeObserver = typeof ResizeObserver !== "undefined" ? new ResizeObserver(updateLayout) : null;

    if (cardRef.current && resizeObserver) {
      resizeObserver.observe(cardRef.current);
    }

    window.addEventListener("resize", updateLayout);

    return () => {
      window.cancelAnimationFrame(raf);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateLayout);
    };
  }, [cardRef, userData, cardData, gender]);

  const exportStyle = { "--classic-card-scale": mobileLayout.scale } as CSSProperties;
  const getFaceWrapStyle = (height: number): CSSProperties | undefined =>
    mobileLayout.compact ? { height: `${Math.ceil(height * mobileLayout.scale)}px` } : undefined;

  return (
    <div ref={cardRef} className="classic-id-export" style={exportStyle}>
      <div className="classic-id-face-wrap" data-card-side="front" style={getFaceWrapStyle(mobileLayout.heights[0])}>
        <FrontFace userData={userData} cardData={cardData} gender={gender} theme={theme} />
      </div>
      <div className="classic-id-face-wrap" data-card-side="back" style={getFaceWrapStyle(mobileLayout.heights[1])}>
        <BackFace userData={userData} cardData={cardData} gender={gender} theme={theme} />
      </div>
    </div>
  );
}

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ onStart }: { onStart: () => void }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 24px",
        textAlign: "center",
      }}
    >
      {/* Badge */}
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 16px",
          borderRadius: "99px",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid rgba(255,255,255,0.1)",
          backdropFilter: "blur(16px)",
          marginBottom: "24px",
          fontSize: "12px",
          color: "#C084FC",
          fontWeight: 600,
          letterSpacing: "0.05em",
        }}
      >
        ✦ الجديد على إنستقرام ✦
      </div>

      {/* Headline */}
      <h1
        style={{
          fontSize: "clamp(42px, 10vw, 80px)",
          fontWeight: 900,
          lineHeight: 1.1,
          marginBottom: "20px",
          fontFamily: "'Cairo', sans-serif",
        }}
      >
        <span
          style={{
            background: "linear-gradient(135deg, #A855F7, #EC4899, #F97316)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          هويّة
        </span>
        <br />
        <span style={{ color: "#F0E8FF" }}>إنستقرامية</span>
      </h1>

      <p
        style={{
          fontSize: "clamp(16px, 3vw, 20px)",
          color: "#94A3B8",
          maxWidth: "420px",
          lineHeight: 1.65,
          marginBottom: "10px",
        }}
      >
        اصنع هويتك الإنستقرامية خلال ثواني
      </p>
      <p style={{ fontSize: "13px", color: "#475569", maxWidth: "360px", lineHeight: 1.65, marginBottom: "40px" }}>
        حط حسابك وخلي الموقع يطلع لك بطاقة هوية فكاهية قابلة للتنزيل والمشاركة
      </p>

      {/* Preview floating card */}
      <div style={{ position: "relative", marginBottom: "48px" }}>
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            padding: "16px 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "14px",
            animation: "pulse-glow 3s ease-in-out infinite",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #A855F7, #EC4899)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              flexShrink: 0,
            }}
          >
            👤
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#F0E8FF" }}>@your_username</div>
            <div style={{ fontSize: "11px", color: "#C084FC" }}>مديرة التوثيق العاطفي</div>
          </div>
          <div style={{ marginRight: "auto" }}>
            <div
              style={{
                fontSize: "9px",
                color: "#FB7185",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "99px",
                background: "rgba(244,63,94,0.15)",
                border: "1px solid rgba(244,63,94,0.25)",
                whiteSpace: "nowrap",
              }}
            >
              خطر 87%
            </div>
          </div>
        </div>

        {/* Floating labels */}
        <div
          style={{
            position: "absolute",
            top: "-16px",
            right: "-16px",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "99px",
            padding: "4px 12px",
            fontSize: "11px",
            color: "#FDE68A",
            whiteSpace: "nowrap",
            animation: "float0 4.5s ease-in-out infinite",
          }}
        >
          🌹 مطلوبة بسبب الستوري
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "-14px",
            left: "-12px",
            background: "rgba(255,255,255,0.07)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "99px",
            padding: "4px 12px",
            fontSize: "11px",
            color: "#7DD3FC",
            whiteSpace: "nowrap",
            animation: "float1 5.5s ease-in-out infinite",
          }}
        >
          🎖️ مدير الصمت الاستراتيجي
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={onStart}
        style={{
          background: "linear-gradient(135deg, #8B5CF6, #EC4899, #F97316)",
          backgroundSize: "200% 200%",
          color: "#fff",
          fontWeight: 700,
          fontSize: "18px",
          padding: "16px 48px",
          borderRadius: "18px",
          border: "none",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          boxShadow: "0 0 40px rgba(139,92,246,0.4), 0 8px 32px rgba(236,72,153,0.2)",
          marginBottom: "16px",
          fontFamily: "'Cairo', sans-serif",
          animation: "shimmer 3s ease infinite",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "scale(1.06)";
          e.currentTarget.style.boxShadow = "0 0 60px rgba(139,92,246,0.5), 0 12px 40px rgba(236,72,153,0.3)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "scale(1)";
          e.currentTarget.style.boxShadow = "0 0 40px rgba(139,92,246,0.4), 0 8px 32px rgba(236,72,153,0.2)";
        }}
      >
        ابدأ الآن ✨
      </button>

      <p style={{ fontSize: "12px", color: "#374151" }}>للتسلية فقط — لا نقوم بحفظ بياناتك</p>
    </div>
  );
}

// ─── Input Section ─────────────────────────────────────────────────────────────
function InputSection({
  userData,
  onChange,
  onImageUpload,
  onNext,
}: {
  userData: UserData;
  onChange: (data: UserData) => void;
  onImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  onNext: () => void;
}) {
  const canProceed = userData.username.trim().length > 0 && userData.name.trim().length > 0 && userData.agreed;

  const inputStyle = {
    width: "100%",
    padding: "12px 40px 12px 14px",
    borderRadius: "12px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.1)",
    color: "#F0E8FF",
    fontSize: "14px",
    fontFamily: "'Cairo', sans-serif",
    direction: "rtl" as const,
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box" as const,
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#F0E8FF", marginBottom: "6px", fontFamily: "'Cairo', sans-serif" }}>
            أدخل بياناتك
          </h2>
          <p style={{ fontSize: "13px", color: "#475569" }}>معلوماتك تبقى عندك — ما نحفظ شي</p>
        </div>

        <div
          style={{
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.09)",
            borderRadius: "24px",
            padding: "28px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Profile upload */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <label style={{ cursor: "pointer" }}>
              <div
                style={{
                  width: "76px",
                  height: "76px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid rgba(168,85,247,0.4)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.15)",
                  transition: "transform 0.2s",
                  flexShrink: 0,
                }}
              >
                {userData.profileImage ? (
                  <img src={userData.profileImage} alt="profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      background: "linear-gradient(135deg, rgba(88,28,135,0.6), rgba(157,23,77,0.5))",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "4px",
                    }}
                  >
                    <Camera size={20} color="rgba(255,255,255,0.4)" />
                    <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>صورتك</span>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*" onChange={onImageUpload} style={{ display: "none" }} />
            </label>
            <span style={{ fontSize: "11px", color: "#374151" }}>اضغط لرفع صورة البروفايل</span>
          </div>

          {/* Username field */}
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "6px", fontWeight: 600 }}>
              رابط أو يوزر الإنستقرام *
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }}>
                <Link2 size={15} />
              </div>
              <input
                type="text"
                placeholder="@username"
                value={userData.username}
                onChange={(e) => onChange({ ...userData, username: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(168,85,247,0.5)";
                  e.target.style.boxShadow = "0 0 16px rgba(168,85,247,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Name field */}
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "6px", fontWeight: 600 }}>
              الاسم *
            </label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "#475569" }}>
                <User size={15} />
              </div>
              <input
                type="text"
                placeholder="اسمك الكامل"
                value={userData.name}
                onChange={(e) => onChange({ ...userData, name: e.target.value })}
                style={inputStyle}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(168,85,247,0.5)";
                  e.target.style.boxShadow = "0 0 16px rgba(168,85,247,0.12)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.1)";
                  e.target.style.boxShadow = "none";
                }}
              />
            </div>
          </div>

          {/* Bio field */}
          <div>
            <label style={{ display: "block", fontSize: "12px", color: "#64748B", marginBottom: "6px", fontWeight: 600 }}>
              البايو (اختياري)
            </label>
            <textarea
              placeholder="وصفك في الإنستقرام..."
              value={userData.bio}
              onChange={(e) => onChange({ ...userData, bio: e.target.value })}
              rows={2}
              style={{
                ...inputStyle,
                padding: "12px 14px",
                resize: "none",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "rgba(168,85,247,0.5)";
                e.target.style.boxShadow = "0 0 16px rgba(168,85,247,0.12)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "rgba(255,255,255,0.1)";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Consent */}
          <div
            onClick={() => onChange({ ...userData, agreed: !userData.agreed })}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "10px",
              padding: "12px",
              borderRadius: "12px",
              background: userData.agreed ? "rgba(168,85,247,0.08)" : "rgba(255,255,255,0.02)",
              border: `1px solid ${userData.agreed ? "rgba(168,85,247,0.3)" : "rgba(255,255,255,0.07)"}`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            <div
              style={{
                flexShrink: 0,
                width: "20px",
                height: "20px",
                borderRadius: "6px",
                background: userData.agreed
                  ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                  : "rgba(255,255,255,0.08)",
                border: userData.agreed ? "none" : "1px solid rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                marginTop: "1px",
              }}
            >
              {userData.agreed && <Check size={12} color="#fff" />}
            </div>
            <p style={{ fontSize: "12px", color: "#94A3B8", lineHeight: 1.55 }}>
              أوافق على استخدام بياناتي العامة لإنشاء الهوية فقط
            </p>
          </div>

          {/* Privacy note */}
          <div
            style={{
              padding: "10px 14px",
              borderRadius: "10px",
              background: "rgba(34,197,94,0.04)",
              border: "1px solid rgba(34,197,94,0.12)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "10px", color: "rgba(74,222,128,0.6)", lineHeight: 1.6 }}>
              🔒 لا يتم حفظ أي بيانات أو صور. يتم إنشاء الهوية مؤقتًا على جهازك فقط
            </p>
          </div>

          {/* CTA */}
          <button
            onClick={onNext}
            disabled={!canProceed}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: "14px",
              border: "none",
              background: canProceed
                ? "linear-gradient(135deg, #8B5CF6, #EC4899)"
                : "rgba(255,255,255,0.06)",
              color: canProceed ? "#fff" : "#374151",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "'Cairo', sans-serif",
              cursor: canProceed ? "pointer" : "not-allowed",
              transition: "transform 0.2s, box-shadow 0.2s",
              boxShadow: canProceed ? "0 0 24px rgba(139,92,246,0.3)" : "none",
            }}
            onMouseEnter={(e) => {
              if (canProceed) e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            التالي: اختر أسلوبك ✦
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Gender Selection ──────────────────────────────────────────────────────────
function GenderSelection({
  selected,
  onSelect,
  onGenerate,
  onBack,
}: {
  selected: Gender | null;
  onSelect: (g: Gender) => void;
  onGenerate: () => void;
  onBack: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "60px 20px" }}>
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ fontSize: "28px", fontWeight: 900, color: "#F0E8FF", marginBottom: "6px", fontFamily: "'Cairo', sans-serif" }}>
            اختر أسلوب هويتك
          </h2>
          <p style={{ fontSize: "13px", color: "#475569" }}>كل أسلوب له تصميم مختلف ومميز</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "20px" }}>
          {/* Female */}
          <button
            onClick={() => onSelect("female")}
            style={{
              position: "relative",
              padding: "24px 16px",
              borderRadius: "24px",
              background:
                selected === "female"
                  ? "linear-gradient(135deg, rgba(252,228,236,0.18), rgba(237,233,254,0.18))"
                  : "rgba(255,255,255,0.03)",
              border:
                selected === "female"
                  ? "2px solid rgba(244,114,182,0.55)"
                  : "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                selected === "female"
                  ? "0 0 35px rgba(244,114,182,0.2), 0 0 70px rgba(192,132,252,0.1)"
                  : "none",
              cursor: "pointer",
              transform: selected === "female" ? "scale(1.04)" : "scale(1)",
              transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {selected === "female" && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #F9A8D4, #C084FC)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={11} color="#fff" />
              </div>
            )}
            <div style={{ fontSize: "38px", marginBottom: "4px" }}>🌸</div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 900,
                background: "linear-gradient(135deg, #F9A8D4, #C084FC)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              أنثى
            </div>
            <p style={{ fontSize: "10px", color: "rgba(249,168,212,0.6)", lineHeight: 1.5, textAlign: "center" }}>
              وردي • لافندر فراشات • ورود
            </p>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              {["#F9A8D4", "#C084FC", "#FB7185", "#FDE68A"].map((c) => (
                <div key={c} style={{ width: "10px", height: "10px", borderRadius: "50%", background: c }} />
              ))}
            </div>
          </button>

          {/* Male */}
          <button
            onClick={() => onSelect("male")}
            style={{
              position: "relative",
              padding: "24px 16px",
              borderRadius: "24px",
              background:
                selected === "male"
                  ? "linear-gradient(135deg, rgba(13,17,23,0.85), rgba(28,42,58,0.85))"
                  : "rgba(255,255,255,0.03)",
              border:
                selected === "male"
                  ? "2px solid rgba(79,195,247,0.45)"
                  : "1px solid rgba(255,255,255,0.07)",
              boxShadow:
                selected === "male"
                  ? "0 0 35px rgba(79,195,247,0.15), 0 0 70px rgba(14,165,233,0.08)"
                  : "none",
              cursor: "pointer",
              transform: selected === "male" ? "scale(1.04)" : "scale(1)",
              transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "6px",
            }}
          >
            {selected === "male" && (
              <div
                style={{
                  position: "absolute",
                  top: "10px",
                  left: "10px",
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #38BDF8, #4FC3F7)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Check size={11} color="#fff" />
              </div>
            )}
            <div style={{ fontSize: "38px", marginBottom: "4px" }}>🌑</div>
            <div
              style={{
                fontSize: "22px",
                fontWeight: 900,
                background: "linear-gradient(135deg, #B0BEC5, #4FC3F7)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              ذكر
            </div>
            <p style={{ fontSize: "10px", color: "rgba(79,195,247,0.6)", lineHeight: 1.5, textAlign: "center" }}>
              أزرق داكن • فضي نيون • غامض
            </p>
            <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
              {["#1C2A3A", "#4FC3F7", "#B0BEC5", "#80CBC4"].map((c) => (
                <div
                  key={c}
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: c,
                    border: "1px solid rgba(255,255,255,0.1)",
                  }}
                />
              ))}
            </div>
          </button>
        </div>

        <button
          onClick={onGenerate}
          disabled={!selected}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: "16px",
            border: "none",
            background: selected
              ? "linear-gradient(135deg, #8B5CF6, #EC4899, #F97316)"
              : "rgba(255,255,255,0.05)",
            backgroundSize: "200% 200%",
            color: selected ? "#fff" : "#374151",
            fontSize: "16px",
            fontWeight: 700,
            fontFamily: "'Cairo', sans-serif",
            cursor: selected ? "pointer" : "not-allowed",
            transition: "transform 0.2s, box-shadow 0.2s",
            boxShadow: selected ? "0 0 35px rgba(139,92,246,0.35)" : "none",
            marginBottom: "12px",
            animation: selected ? "shimmer 3s ease infinite" : "none",
          }}
          onMouseEnter={(e) => {
            if (selected) e.currentTarget.style.transform = "scale(1.03)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          {selected ? "🎉 اصنع هويتي الآن!" : "اختر أسلوبك أولاً"}
        </button>

        <button
          onClick={onBack}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            border: "none",
            background: "transparent",
            color: "#374151",
            fontSize: "14px",
            fontFamily: "'Cairo', sans-serif",
            cursor: "pointer",
            transition: "color 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#94A3B8")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#374151")}
        >
          ← رجوع
        </button>
      </div>
    </div>
  );
}

// ─── Loading Screen ────────────────────────────────────────────────────────────
function LoadingScreen() {
  const [textIdx, setTextIdx] = useState(0);
  const [dotCount, setDotCount] = useState(1);

  useEffect(() => {
    const t1 = setInterval(() => setTextIdx((i) => (i + 1) % LOADING_TEXTS.length), 650);
    const t2 = setInterval(() => setDotCount((d) => (d === 3 ? 1 : d + 1)), 400);
    return () => {
      clearInterval(t1);
      clearInterval(t2);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px",
        textAlign: "center",
      }}
    >
      {/* Spinning ring */}
      <div style={{ position: "relative", width: "96px", height: "96px", marginBottom: "32px" }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            background: "conic-gradient(from 0deg, #8B5CF6, #EC4899, #F97316, #8B5CF6)",
            animation: "spin 1.4s linear infinite",
          }}
        />
        <div
          style={{
            position: "absolute",
            inset: "3px",
            borderRadius: "50%",
            background: "#07070f",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "36px",
          }}
        >
          📱
        </div>
      </div>

      <p style={{ fontSize: "18px", fontWeight: 700, color: "#F0E8FF", marginBottom: "6px", fontFamily: "'Cairo', sans-serif" }}>
        {LOADING_TEXTS[textIdx]}
        {"...".slice(0, dotCount)}
      </p>
      <p style={{ fontSize: "13px", color: "#374151" }}>جاري استخراج شخصيتك الإنستقرامية</p>

      <div style={{ display: "flex", gap: "8px", marginTop: "32px" }}>
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: "8px",
              height: "8px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              animation: `bounce-dot 1.2s ease-in-out ${i * 0.15}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Result Section ────────────────────────────────────────────────────────────
function ResultSection({
  userData,
  cardData,
  gender,
  cardRef,
  onDownload,
  onShare,
  onReset,
}: {
  userData: UserData;
  cardData: CardData;
  gender: Gender;
  cardRef: RefObject<HTMLDivElement | null>;
  onDownload: () => void;
  onShare: () => void;
  onReset: () => void;
}) {
  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ width: "100%", maxWidth: "1180px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "24px", fontWeight: 900, color: "#F0E8FF", marginBottom: "4px", fontFamily: "'Cairo', sans-serif" }}>
            هويتك جاهزة! 🎉
          </h2>
          <p style={{ fontSize: "13px", color: "#A8B2C2" }}>الوجه الأمامي والخلفي جاهزين للتنزيل</p>
        </div>

        {/* Card */}
        <div style={{ animation: "bounce-in 0.5s cubic-bezier(0.34,1.56,0.64,1) forwards" }}>
          <ClassicIdentityCards userData={userData} cardData={cardData} gender={gender} cardRef={cardRef} />
        </div>

        {/* Actions */}
        <div style={{ margin: "28px auto 0", display: "flex", flexDirection: "column", gap: "10px", width: "100%", maxWidth: "520px" }}>
          <button
            onClick={onDownload}
            style={{
              width: "100%",
              padding: "15px",
              borderRadius: "16px",
              border: "none",
              background: "linear-gradient(135deg, #8B5CF6, #EC4899)",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              fontFamily: "'Cairo', sans-serif",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "0 0 30px rgba(139,92,246,0.3)",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.02)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Download size={18} />
            تنزيل الوجهين منفصلين
          </button>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <button
              onClick={onReset}
              style={{
                padding: "13px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                color: "#94A3B8",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Cairo', sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "transform 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.color = "#F0E8FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              <RefreshCw size={15} />
              مرة أخرى
            </button>
            <button
              onClick={onShare}
              style={{
                padding: "13px",
                borderRadius: "14px",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "rgba(255,255,255,0.04)",
                backdropFilter: "blur(12px)",
                color: "#94A3B8",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Cairo', sans-serif",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                transition: "transform 0.2s, color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.02)";
                e.currentTarget.style.color = "#F0E8FF";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.color = "#94A3B8";
              }}
            >
              <Share2 size={15} />
              مشاركة
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState<Step>("hero");
  const [gender, setGender] = useState<Gender | null>(null);
  const [userData, setUserData] = useState<UserData>({
    username: "",
    name: "",
    bio: "",
    profileImage: null,
    agreed: false,
  });
  const [cardData, setCardData] = useState<CardData | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setUserData((prev) => ({ ...prev, profileImage: reader.result as string }));
    reader.readAsDataURL(file);
  };

  const handleGenerate = () => {
    if (!gender) return;
    setStep("loading");
    setTimeout(() => {
      setCardData(generateCardData(gender));
      setStep("result");
    }, 2600);
  };

  const handleDownload = async () => {
    if (!cardRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const cards = Array.from(cardRef.current.querySelectorAll<HTMLElement>("[data-card-side]"));

      for (const card of cards) {
        const canvas = await html2canvas(card, {
          scale: 3,
          backgroundColor: null,
          logging: false,
          useCORS: true,
        });
        const sideName = card.dataset.cardSide === "back" ? "الخلفية" : "الأمامية";
        const link = document.createElement("a");
        link.download = `هويتي-الانستقرامية-${sideName}.png`;
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        link.remove();
        await new Promise((resolve) => window.setTimeout(resolve, 180));
      }
    } catch (err) {
      console.error("Download failed", err);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "هويّتي الإنستقرامية",
          text: `شوفوا هويتي الإنستقرامية! @${userData.username}`,
          url: window.location.href,
        });
      } catch {
        /* user cancelled */
      }
    }
  };

  return (
    <div dir="rtl" style={{ minHeight: "100vh", fontFamily: "'Cairo', 'Tajawal', sans-serif", overflowX: "hidden", position: "relative" }}>
      <style>{`
        @keyframes float0 {
          0%, 100% { transform: translateY(0px) rotate(-8deg); }
          50% { transform: translateY(-18px) rotate(-5deg); }
        }
        @keyframes float1 {
          0%, 100% { transform: translateY(0px) rotate(5deg); }
          50% { transform: translateY(-22px) rotate(9deg); }
        }
        @keyframes float2 {
          0%, 100% { transform: translateY(0px) rotate(12deg); }
          50% { transform: translateY(-12px) rotate(16deg); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(168,85,247,0.2); }
          50% { box-shadow: 0 0 50px rgba(168,85,247,0.45), 0 0 90px rgba(236,72,153,0.2); }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes bounce-in {
          0% { opacity: 0; transform: scale(0.82) translateY(24px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes bounce-dot {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50% { transform: translateY(-10px); opacity: 1; }
        }
        * { -webkit-scrollbar-width: none; scrollbar-width: none; }
        *::-webkit-scrollbar { display: none; }
        .classic-id-export {
          display: grid;
          grid-template-columns: repeat(2, minmax(320px, 1fr));
          gap: 22px;
          width: 100%;
          align-items: start;
        }
        .classic-id-face-wrap {
          width: 100%;
        }
        .classic-id-face {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          min-height: 452px;
          border: 1px solid rgba(10, 10, 10, 0.38);
          isolation: isolate;
        }
        .classic-id-inner {
          position: relative;
          z-index: 1;
          padding: 48px 52px 42px;
          min-height: inherit;
          box-sizing: border-box;
        }
        .classic-id-body {
          display: grid;
          grid-template-columns: minmax(190px, 0.82fr) minmax(0, 1.18fr);
          gap: 26px;
          align-items: start;
        }
        .classic-id-back-grid {
          display: grid;
          gap: 1px;
        }
        @media (max-width: 980px) {
          .classic-id-export {
            grid-template-columns: 1fr;
            max-width: 760px;
            margin: 0 auto;
          }
        }
        @media (max-width: 640px) {
          .classic-id-export {
            gap: 18px;
          }
          .classic-id-face-wrap {
            position: relative;
            aspect-ratio: ${CLASSIC_CARD_DESIGN_WIDTH} / ${CLASSIC_CARD_MIN_HEIGHT};
            overflow: visible;
          }
          .classic-id-face-wrap > .classic-id-face {
            position: absolute;
            top: 0;
            right: 0;
            width: ${CLASSIC_CARD_DESIGN_WIDTH}px;
            min-height: ${CLASSIC_CARD_MIN_HEIGHT}px;
            transform: scale(var(--classic-card-scale, 1));
            transform-origin: top right;
          }
        }
      `}</style>

      {/* Background texture */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #171516 0%, #23201d 45%, #151b22 100%), repeating-linear-gradient(0deg, rgba(255,255,255,0.025) 0px, rgba(255,255,255,0.025) 1px, transparent 1px, transparent 9px)",
          }}
        />
      </div>

      {/* Floating words */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: 0 }}>
        {FLOATING_WORDS.map((w, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: `${w.y}%`,
              left: `${w.x}%`,
              fontSize: "11px",
              fontWeight: 700,
              color: "rgba(255,255,255,0.035)",
              transform: `rotate(${w.rot}deg)`,
              animation: `float${i % 3} ${w.dur}s ease-in-out infinite`,
              animationDelay: `${i * 0.45}s`,
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            {w.text}
          </div>
        ))}
      </div>

      {/* Steps */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {step === "hero" && <HeroSection onStart={() => setStep("input")} />}
        {step === "input" && (
          <InputSection
            userData={userData}
            onChange={setUserData}
            onImageUpload={handleImageUpload}
            onNext={() => setStep("gender")}
          />
        )}
        {step === "gender" && (
          <GenderSelection
            selected={gender}
            onSelect={setGender}
            onGenerate={handleGenerate}
            onBack={() => setStep("input")}
          />
        )}
        {step === "loading" && <LoadingScreen />}
        {step === "result" && cardData && gender && (
          <ResultSection
            userData={userData}
            cardData={cardData}
            gender={gender}
            cardRef={cardRef}
            onDownload={handleDownload}
            onShare={handleShare}
            onReset={() => {
              setStep("input");
              setCardData(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
