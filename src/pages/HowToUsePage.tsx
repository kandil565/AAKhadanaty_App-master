import { Link } from "react-router-dom";
import { UserPlus, Search, CalendarCheck, Clock, Star, Briefcase, Plus, Inbox, Wrench, Award, CheckCircle2, MessageSquare, AlertCircle, ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const userSteps = [
  {
    icon: UserPlus,
    titleAr: "إنشاء حساب مجاني",
    titleEn: "Create a Free Account",
    descAr: "قم بالتسجيل بخطوة واحدة. أدخل اسمك وبريدك الإلكتروني ورقم الهاتف واختر 'مستخدم' كنوع الحساب.",
    descEn: "Register in one step. Enter your name, email, phone number, and select 'User' as account type.",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Search,
    titleAr: "البحث عن الخدمات",
    titleEn: "Browse Services",
    descAr: "استعرض جميع الخدمات: تكييف الهواء، السباكة، الكهرباء، والتنظيف. ابحث حسب نوع الخدمة أو المدينة.",
    descEn: "Browse all services: AC, Plumbing, Electrical, Cleaning. Filter by service type or location.",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: CalendarCheck,
    titleAr: "اختيار مقدم خدمة",
    titleEn: "Select a Provider",
    descAr: "اختر من بين مقدمي الخدمات الموثوقين بناءً على التقييمات والخبرة",
    descEn: "Choose from trusted providers based on ratings and experience",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: Clock,
    titleAr: "حجز الموعد",
    titleEn: "Book an Appointment",
    descAr: "اختر التاريخ والوقت المناسب، وأضف تفاصيل إضافية، واختر طريقة الدفع (كاش أو بطاقة)",
    descEn: "Choose date and time, add details, and select payment method (cash or card)",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Star,
    titleAr: "تقييم الخدمة",
    titleEn: "Rate & Review",
    descAr: "بعد انتهاء الخدمة، قيّم الخدمة من 1 إلى 5 نجوم واترك تعليقك",
    descEn: "After service completion, rate 1-5 stars and leave your feedback",
    color: "bg-red-500/10 text-red-500",
  },
];

const providerSteps = [
  {
    icon: Briefcase,
    titleAr: "إنشاء حساب خدمة",
    titleEn: "Create Provider Account",
    descAr: "سجل بحسابك كمقدم خدمة، أضف مدينتك وسنوات الخبرة والخدمات التي تقدمها",
    descEn: "Register as provider, add your city, experience, and services offered",
    color: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: Plus,
    titleAr: "إضافة خدماتك",
    titleEn: "List Your Services",
    descAr: "حدد الخدمات التي تقدمها: تكييف، سباكة، كهرباء، تنظيف، وأضف سعراً تقريبياً",
    descEn: "Specify services: AC, Plumbing, Electrical, Cleaning, and set prices",
    color: "bg-purple-500/10 text-purple-500",
  },
  {
    icon: Inbox,
    titleAr: "استقبال الطلبات",
    titleEn: "Receive Orders",
    descAr: "سيتلقى حسابك طلبات من العملاء. تابع لوحة التحكم الخاصة بك للطلبات الجديدة",
    descEn: "Receive booking requests from customers. Check your provider dashboard",
    color: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: Wrench,
    titleAr: "إدارة الطلبات",
    titleEn: "Manage Orders",
    descAr: "قبل أو ارفض الطلب، و تابع الطلب عند استقباله",
    descEn: "Accept/reject requests, update order status in real-time",
    color: "bg-green-500/10 text-green-500",
  },
  {
    icon: Award,
    titleAr: "بناء سمعتك",
    titleEn: "Build Reputation",
    descAr: "احصل على تقييمات من العملاء، وارفع مستوى ملفك الشخصي وزيادة الطلبات",
    descEn: "Earn ratings, improve profile, attract more customers",
    color: "bg-red-500/10 text-red-500",
  },
];

const faqItems = [
  {
    questionAr: "هل التسجيل مجاني؟",
    questionEn: "Is registration free?",
    answerAr: "نعم، التسجيل مجاني تماماً لكل المستخدمين ومقدمي الخدمات. لا توجد رسوم إخفية.",
    answerEn: "Yes, registration is completely free for all users and service providers. No hidden fees.",
  },
  {
    questionAr: "كيف أدفع للخدمة؟",
    questionEn: "How do I pay for services?",
    answerAr: "يمكنك الدفع بطريقتين: (1) الدفع نقداً عند التسليم (2) الدفع ببطاقة ائتمان Visa",
    answerEn: "Two payment options: (1) Cash on delivery (2) Credit card (Visa)",
  },
  {
    questionAr: "هل الخدمة مضمونة؟",
    questionEn: "Is the service guaranteed?",
    answerAr: "نعم، نضمن جودة الخدمة. إذا لم تكن راضياً، يمكنك ترك تقييم سلبي وسنعمل على تحسينها",
    answerEn: "Yes, we guarantee service quality. Leave feedback if unsatisfied",
  },
  {
    questionAr: "كم الوقت المتوقع؟",
    questionEn: "How long does it take?",
    answerAr: "عادة يتم قبول الطلب خلال 24 ساعة، والخدمة تتم في الموعد المتفق عليه",
    answerEn: "Orders typically accepted within 24 hours, service at agreed time",
  },
  {
    questionAr: "هل يمكنني إلغاء الحجز؟",
    questionEn: "Can I cancel booking?",
    answerAr: "نعم، يمكنك إلغاء قبل قبول مقدم الخدمة. بعد القبول، تواصل مع مقدم الخدمة مباشرة",
    answerEn: "Yes, cancel before provider accepts. After that, contact provider directly",
  },
  {
    questionAr: "ماذا لو لم یقبل مقدم الخدمة؟",
    questionEn: "What if provider declines?",
    answerAr: "لا مشكلة! يمكنك اختيار مقدم خدمة آخر من القائمة. ستحصل على خيارات متعددة",
    answerEn: "No problem! Choose another provider from the list. Multiple options available",
  },
];

const HowToUsePage = () => {
  const { isRTL, t } = useLanguage();

  const StepCard = ({ step, idx }: any) => (
    <Card className="relative overflow-hidden group hover:shadow-lg transition-all duration-300 border-l-4 border-l-transparent hover:border-l-primary">
      <CardContent className="p-6 flex flex-col items-center text-center gap-4">
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-primary/20 text-primary text-xs font-bold flex items-center justify-center">
          {idx + 1}
        </div>
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${step.color} group-hover:scale-110 transition-transform`}>
          <step.icon className="h-8 w-8" />
        </div>
        <h3 className="font-bold text-lg">{isRTL ? step.titleAr : step.titleEn}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{isRTL ? step.descAr : step.descEn}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary/80 to-primary/60 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isRTL ? "كيف تستخدم منصتنا؟" : "How to Use Our Platform?"}
          </h1>
          <p className="text-lg text-white/90 max-w-2xl mx-auto">
            {isRTL
              ? "دليل شامل يساعدك على الاستفادة الكاملة من خدمات منصة التوظيف المنزلية"
              : "Your complete guide to getting the most from our home services platform"}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16 space-y-20">
        {/* Tabs for User/Provider */}
        <Tabs defaultValue="user" className="w-full">
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="user" className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                {isRTL ? "أنا مستخدم" : "I'm a User"}
              </TabsTrigger>
              <TabsTrigger value="provider" className="flex items-center gap-2">
                <Briefcase className="w-4 h-4" />
                {isRTL ? "أنا مقدم خدمة" : "I'm a Provider"}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* User Guide Tab */}
          <TabsContent value="user" className="space-y-8">
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">
                  {isRTL ? "5 خطوات سهلة للحصول على الخدمة" : "5 Simple Steps to Get Service"}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {isRTL
                    ? "اتبع هذه الخطوات البسيطة للحصول على خدمة احترافية من مقدمين موثوقين"
                    : "Follow these simple steps to get professional service from trusted providers"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {userSteps.map((step, idx) => (
                  <StepCard key={idx} step={step} idx={idx} />
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: CheckCircle2, titleAr: "مقدمون موثوقون", titleEn: "Trusted Providers", descAr: "جميع مقدمي الخدمات معهم تقييمات وتعليقات من عملاء حقيقيين", descEn: "All providers verified with real customer reviews" },
                  { icon: Clock, titleAr: "حجز سریع", titleEn: "Quick Booking", descAr: "احجز خدمتك في دقائق معدودة من حاسوبك أو هاتفك", descEn: "Book service in minutes from your phone or computer" },
                  { icon: Star, titleAr: "تقييمات حقيقية", titleEn: "Real Reviews", descAr: "اقرأ تقييمات أخرى المستخدمين واتخذ قرار واثق", descEn: "Read genuine reviews from other customers" },
                ].map((benefit, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <benefit.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="font-bold mb-2">{isRTL ? benefit.titleAr : benefit.titleEn}</h3>
                      <p className="text-sm text-muted-foreground">{isRTL ? benefit.descAr : benefit.descEn}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link to="/register">
                  <Button size="lg" className="px-8 gap-2">
                    {isRTL ? "ابدأ الآن كمستخدم" : "Start Now as User"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </section>
          </TabsContent>

          {/* Provider Guide Tab */}
          <TabsContent value="provider" className="space-y-8">
            <section>
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-3">
                  {isRTL ? "5 خطوات للبدء كمقدم خدمة" : "5 Steps to Get Started as Provider"}
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  {isRTL
                    ? "انضم إلى مئات مقدمي الخدمات الذين يكسبون دخل إضافي عن طريق منصتنا"
                    : "Join hundreds of service providers earning extra income through our platform"}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {providerSteps.map((step, idx) => (
                  <StepCard key={idx} step={step} idx={idx} />
                ))}
              </div>

              {/* Benefits */}
              <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: TrendingUp, titleAr: "زيادة الدخل", titleEn: "Earn More", descAr: "احصل على طلبات منتظمة وزيادة دخلك من خدماتك", descEn: "Get regular bookings and increase your income" },
                  { icon: MessageSquare, titleAr: "تواصل مباشر", titleEn: "Direct Contact", descAr: "تواصل مباشرة مع العملاء بدون وسيط", descEn: "Direct communication with customers" },
                  { icon: Award, titleAr: "بناء سمعة", titleEn: "Build Reputation", descAr: "اكسب تقييمات عالية وبناء سمعة قوية في المنصة", descEn: "Build strong reputation with high ratings" },
                ].map((benefit, idx) => (
                  <Card key={idx}>
                    <CardContent className="pt-6">
                      <benefit.icon className="w-10 h-10 text-primary mb-4" />
                      <h3 className="font-bold mb-2">{isRTL ? benefit.titleAr : benefit.titleEn}</h3>
                      <p className="text-sm text-muted-foreground">{isRTL ? benefit.descAr : benefit.descEn}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 text-center">
                <Link to="/register">
                  <Button size="lg" variant="outline" className="px-8 gap-2">
                    {isRTL ? "انضم كمقدم خدمة" : "Join as Service Provider"}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </section>
          </TabsContent>
        </Tabs>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold mb-8 text-center">
            {isRTL ? "الأسئلة الشائعة" : "Frequently Asked Questions"}
          </h2>

          <Accordion type="single" collapsible className="max-w-2xl mx-auto">
            {faqItems.map((item, idx) => (
              <AccordionItem key={idx} value={`item-${idx}`} className="border-b border-border last:border-b-0">
                <AccordionTrigger className="hover:no-underline hover:text-primary py-4">
                  <span className="text-left font-semibold">
                    {isRTL ? item.questionAr : item.questionEn}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="pb-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {isRTL ? item.answerAr : item.answerEn}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 rounded-3xl bg-gradient-to-r from-primary/10 via-accent/10 to-primary/5 border border-border">
          <AlertCircle className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-3">
            {isRTL ? "جاهز للبدء؟" : "Ready to Get Started?"}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {isRTL
              ? "انضم إلى آلاف المستخدمين ومقدمي الخدمات على منصتنا اليوم"
              : "Join thousands of users and service providers on our platform today"}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link to="/register">
              <Button size="lg">{isRTL ? "إنشاء حساب مجاناً" : "Create Free Account"}</Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline">{isRTL ? "تصفح الخدمات" : "Browse Services"}</Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="ghost">{isRTL ? "العودة للرئيسية" : "Home"}</Button>
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default HowToUsePage;
