# Siyana Plus - منصة الخدمات المنزلية

منصة حديثة وآمنة لحجز الخدمات المنزلية والاستفادة من أفضل مقدمي الخدمات.

## المميزات

- 🏠 حجز الخدمات المنزلية بسهولة
- 👤 إدارة الملف الشخصي والحجوزات
- ⭐ تقييم مقدمي الخدمات
- 💬 تواصل مباشر مع مقدمي الخدمات
- 🌙 دعم الوضع الليلي
- 🇸🇦 دعم اللغة العربية
- 📱 تطبيق متجاوب على جميع الأجهزة

## الخدمات المتاحة

- تكييف الهواء والصيانة
- السباكة والإصلاحات المائية
- الأعمال الكهربائية
- التنظيف والصيانة
- وغيرها من الخدمات المنزلية

## كيفية الاستخدام؟

### الخطوة الأولى: استنساخ المشروع

```bash
git clone <YOUR_GIT_URL>
cd Siyana Plus_App-Deploy-master
```

### الخطوة الثانية: تثبيت المتطلبات

```bash
npm install --legacy-peer-deps
```

### الخطوة الثالثة: تشغيل الخادم التطويري

```bash
npm run dev
```

سيتم فتح التطبيق على `http://localhost:8080`

## الهندسة المعمارية

```
Siyana Plus/
├── src/
│   ├── pages/         # صفحات التطبيق
│   ├── components/    # المكونات المعاد استخدامها
│   ├── contexts/      # إدارة الحالة العامة
│   ├── hooks/         # التوابع المخصصة
│   ├── data/          # البيانات الثابتة
│   └── lib/           # الدوال المساعدة
├── backend/           # الخادم الخلفي (Node.js + MongoDB)
├── deploy/            # ملفات النشر
└── public/            # الملفات الثابتة
```

## التقنيات المستخدمة

**Frontend:**
- React 18
- TypeScript
- Tailwind CSS
- ShadCN UI
- Vite
- React Router
- Context API

**Backend:**
- Node.js & Express
- MongoDB
- JWT Authentication
- CORS

**Tools:**
- ESLint
- Vitest
- Vercel (للنشر)

## البيئات المتاحة

### تطوير محلي

```bash
npm run dev
```

### الإنتاج

```bash
npm run build
npm run preview
```

### الاختبار

```bash
npm run test
```

## التوثيق

- [دليل الإعداد](./SETUP_GUIDE.md)
- [ملخص التكامل](./INTEGRATION_SUMMARY.md)
- [دليل البدء السريع](./QUICKSTART.md)
- [تدفق البيانات](./DATA_FLOW.md)

## المساهمة

نرحب بالمساهمات! يرجى اتباع الخطوات التالية:

1. انسخ المشروع (fork)
2. إنشئ فرع للميزة الجديدة (`git checkout -b feature/amazing-feature`)
3. ارفع التغييرات (`git commit -m 'Add amazing feature'`)
4. ادفع إلى الفرع (`git push origin feature/amazing-feature`)
5. افتح طلب الدمج (Pull Request)

## الدعم

للحصول على الدعم، يرجى التواصل عبر:
- 📧 البريد الإلكتروني: support@siyanaplus.com
- 💬 وسائل التواصل الاجتماعي
- 🐛 تقرير الأخطاء في Github Issues

## الترخيص

هذا المشروع مرخص تحت MIT License
