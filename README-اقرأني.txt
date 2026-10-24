موقع مكتب المستشار جمال عبدالناصر صادق — دليل سريع
=====================================================

الصفحات:
  index.html                          الرئيسية (عربي)
  en/index.html                       الرئيسية (English)
  company-formation/index.html        صفحة تأسيس الشركات (عربي) — صفحة مخصصة للسيو
  company-formation/<نوع>/index.html  صفحة لكل شكل شركة: single-person-company / limited-liability-company / joint-stock-company / partnerships
  en/company-formation/index.html     Company Formation (English)

للمعاينة: افتح index.html بالمتصفح مباشرة (الخطوط والفيديو والخريطة تحتاج اتصال إنترنت).

1) إضافة الريلز (إنستجرام / تيك توك / فيسبوك / يوتيوب شورتس)
   افتح الملف: assets/js/config.js
   وضع الروابط داخل قائمة reels بهذا الشكل:
     reels: [
       { url: "https://www.tiktok.com/@gamalabdelnassersadeq/video/1234567890", title: "خطوات تأسيس شركة" },
       { url: "https://www.instagram.com/reel/ABCDEFG/", title: "الفرق بين أنواع الشركات" },
       { url: "https://www.youtube.com/shorts/XXXXXXXXXXX", title: "صياغة العقود" },
     ],
   لو القائمة فاضية، الموقع يعرض تلقائيًا أحدث الشورتس من قناة اليوتيوب.

1-ب) أقوى الفيديوهات المدمجة: في نفس الملف assets/js/config.js ضع روابط اليوتيوب داخل featuredVideos.

2) رقم واتساب الذي تصل عليه طلبات الاستشارة: assets/js/config.js  ← whatsapp

3) النطاق (الدومين) — مهم للسيو قبل الرفع:
   النطاق الحالي مؤقت: https://www.gamalsadeklaw.com
   استبدله بالنطاق الحقيقي في كل الملفات (بحث واستبدال) — أو عدّل DOMAIN في _source/build.py ثم شغّل:  python build.py
   الملفات المتأثرة: كل صفحات html + sitemap.xml + robots.txt

4) بعد الرفع:
   - سجّل الموقع في Google Search Console وأرسل sitemap.xml
   - أنشئ/اربط ملف Google Business Profile بنفس العنوان والهاتف

5) تعديل النصوص: الأسهل تعديلها في _source/content.py ثم تشغيل build.py (يولّد اللغتين معًا).
   أو عدّل ملفات html مباشرة.

الرفع: ارفع محتويات هذا المجلد (ما عدا _source) إلى أي استضافة عادية (Hostinger / Netlify / Vercel / cPanel).
