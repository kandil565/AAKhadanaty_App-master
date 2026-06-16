import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, ChevronRight, ArrowLeft, Lightbulb, Phone, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
}

interface Problem {
  id: string;
  icon: string;
  titleAr: string;
  titleEn: string;
  steps: { ar: string; en: string }[];
}

const COMMON_PROBLEMS: Problem[] = [
  {
    id: "ac_not_cooling",
    icon: "❄️",
    titleAr: "التكييف لا يبرد",
    titleEn: "AC not cooling",
    steps: [
      { ar: "تأكد من أن الجهاز متصل بالكهرباء وموضوع على وضع التبريد", en: "Make sure the unit is plugged in and set to cooling mode" },
      { ar: "نظف فلتر الهواء — يمكن أن يتسبب الفلتر المتسخ في ضعف التبريد", en: "Clean the air filter — dirty filters reduce cooling effectiveness" },
      { ar: "تحقق من أن الباب والنوافذ مغلقة لمنع تسرب الهواء البارد", en: "Ensure doors and windows are closed to prevent cold air escape" },
      { ar: "افحص سيفون الهواء الساخن خارج المبنى للتأكد من خلوه من الأوساخ", en: "Check the outdoor condenser unit and ensure it's free from debris" },
      { ar: "إذا استمرت المشكلة → احجز فني تكييف من خلال المنصة", en: "If the problem persists → Book an AC technician through the platform" },
    ],
  },
  {
    id: "water_leak",
    icon: "💧",
    titleAr: "تسريب مياه",
    titleEn: "Water leak",
    steps: [
      { ar: "أوقف صنبور الماء الرئيسي فوراً لمنع تفاقم المشكلة", en: "Immediately shut off the main water valve to prevent further damage" },
      { ar: "حدد مصدر التسريب (أنبوب، صنبور، أو وصلة)", en: "Identify the source of the leak (pipe, faucet, or joint)" },
      { ar: "ضع وعاءً أو منشفة لتجميع الماء المتسرب مؤقتاً", en: "Place a bucket or towel to collect dripping water temporarily" },
      { ar: "لا تستخدم الأجهزة الكهربائية القريبة من منطقة التسريب", en: "Do not use electrical devices near the leak area" },
      { ar: "احجز فني سباكة على الفور من خلال المنصة للإصلاح الدائم", en: "Book a plumber immediately through the platform for a permanent fix" },
    ],
  },
  {
    id: "electrical_problem",
    icon: "⚡",
    titleAr: "مشكلة في الكهرباء",
    titleEn: "Electrical problem",
    steps: [
      { ar: "لا تلمس أي أسلاك كهربائية مكشوفة — سلامتك أولاً", en: "Do not touch any exposed electrical wires — your safety is first" },
      { ar: "تحقق من لوحة المنزل: هل انقطع أي قاطع (circuit breaker)؟", en: "Check the electrical panel: Is any circuit breaker tripped?" },
      { ar: "افصل الأجهزة الكهربائية غير الضرورية من المنافذ", en: "Unplug non-essential appliances from outlets" },
      { ar: "إذا شممت رائحة احتراق → اخرج من المنزل واتصل بالدفاع المدني", en: "If you smell burning → evacuate and call emergency services" },
      { ar: "احجز كهربائي متخصص عبر المنصة لإصلاح آمن ومضمون", en: "Book a certified electrician through the platform for a safe fix" },
    ],
  },
  {
    id: "drain_blockage",
    icon: "🚿",
    titleAr: "انسداد الصرف",
    titleEn: "Drain blockage",
    steps: [
      { ar: "جرب استخدام مضخة الانسداد (plunger) عدة مرات بقوة", en: "Try using a plunger vigorously several times" },
      { ar: "صب ماء مغلياً ببطء في حوض الصرف لإذابة الدهون", en: "Slowly pour boiling water down the drain to dissolve grease" },
      { ar: "استخدم خليط صودا الخبز والخل ثم انتظر 30 دقيقة قبل الغسل", en: "Use baking soda + vinegar mix, wait 30 minutes, then flush" },
      { ar: "تجنب استخدام مواد كيميائية قد تتلف الأنابيب", en: "Avoid harsh chemical drain cleaners that may damage pipes" },
      { ar: "إذا استمر الانسداد → احجز فني سباكة متخصص من منصتنا", en: "If blockage persists → Book a specialized plumber from our platform" },
    ],
  },
  {
    id: "booking_help",
    icon: "📅",
    titleAr: "مساعدة في الحجز",
    titleEn: "Booking Assistance",
    steps: [
      { ar: "اختر الخدمة التي تحتاجها من قائمة الخدمات", en: "Select the service you need from the services list" },
      { ar: "اختر مقدم خدمة بناءً على التقييمات والخبرة", en: "Choose a provider based on ratings and experience" },
      { ar: "حدد التاريخ والوقت المناسب لك", en: "Select a convenient date and time" },
      { ar: "اختر طريقة الدفع (دفع نقداً أو ببطاقة ائتمان)", en: "Choose payment method (cash or credit card)" },
      { ar: "سيصلك تأكيد الحجز عبر البريد الإلكتروني والموقع", en: "You'll receive booking confirmation via email and dashboard" },
    ],
  },
  {
    id: "payment_help",
    icon: "💳",
    titleAr: "مساعدة في الدفع",
    titleEn: "Payment Help",
    steps: [
      { ar: "نحن نقبل طريقتي دفع: النقد عند التسليم و بطاقة Visa", en: "We accept two payment methods: Cash on delivery and Visa card" },
      { ar: "الدفع بالبطاقة آمن وسريع - استخدم بطاقتك الائتمانية مباشرة", en: "Card payment is secure and fast - use your credit card directly" },
      { ar: "لا نحفظ بيانات البطاقة - يتم الدفع عبر بوابة آمنة فقط", en: "We don't store card data - payment is through a secure gateway only" },
      { ar: "يمكنك الدفع نقداً عند وصول مقدم الخدمة إلى منزلك", en: "You can pay cash when the provider arrives at your home" },
      { ar: "كل عملية دفع عليها ضمان - استرجع أموالك في حالة عدم الرضا", en: "Every payment is guaranteed - get refund if unsatisfied" },
    ],
  },
];

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [showProblems, setShowProblems] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isRTL } = useLanguage();
  let msgId = useRef(0);

  const addMessage = (text: string, sender: "user" | "bot") => {
    msgId.current += 1;
    setMessages((prev) => [...prev, { id: msgId.current, text, sender }]);
  };

  const handleOpen = () => {
    setOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        addMessage(
          isRTL
            ? "👋 مرحباً! أنا مساعدك الذكي لخدمات الصيانة المنزلية. اختر مشكلتك من القائمة أو اكتب سؤالك في أي وقت أنت مستعد! 🚀"
            : "👋 Hi! I'm your smart home maintenance assistant. Choose your problem from the list or type your question anytime! 🚀",
          "bot"
        );
      }, 300);
    }
  };

  const handleProblemClick = (problem: Problem) => {
    setSelectedProblem(problem);
    setShowProblems(false);
    addMessage(isRTL ? problem.titleAr : problem.titleEn, "user");
    setTimeout(() => {
      const stepsText = problem.steps
        .map((s, i) => `${i + 1}. ${isRTL ? s.ar : s.en}`)
        .join("\n");
      addMessage(
        (isRTL ? `خطوات حل "${problem.titleAr}":\n\n` : `Steps to solve "${problem.titleEn}":\n\n`) + stepsText,
        "bot"
      );
    }, 500);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    addMessage(input, "user");
    const q = input.toLowerCase();
    setInput("");

    setTimeout(() => {
      let response = isRTL
        ? "شكراً لتواصلك! يمكنني مساعدتك في مشاكل التكييف، السباكة، الكهرباء، وانسداد الصرف. اختر من القائمة أو احجز فني متخصص."
        : "Thanks for reaching out! I can help with AC, plumbing, electrical, and drain issues. Select from the list or book a specialist.";

      if (q.includes("تكييف") || q.includes("بارد") || q.includes("ac") || q.includes("cool")) {
        response = isRTL
          ? "يبدو أن لديك مشكلة في التكييف. اضغط على '❄️ التكييف لا يبرد' من القائمة للحصول على خطوات الحل التفصيلية."
          : "Looks like you have an AC issue. Click '❄️ AC not cooling' from the list for detailed steps.";
      } else if (q.includes("مياه") || q.includes("تسريب") || q.includes("leak") || q.includes("water")) {
        response = isRTL
          ? "مشكلة تسريب المياه خطيرة! اضغط على '💧 تسريب مياه' للحصول على خطوات الحل الفورية."
          : "Water leak is serious! Click '💧 Water leak' for immediate solution steps.";
      } else if (q.includes("كهرباء") || q.includes("electric") || q.includes("current")) {
        response = isRTL
          ? "مشاكل الكهرباء تحتاج حذراً. اضغط على '⚡ مشكلة في الكهرباء' لمعرفة كيف تتعامل معها بأمان."
          : "Electrical issues need caution. Click '⚡ Electrical problem' for safe handling steps.";
      } else if (q.includes("صرف") || q.includes("انسداد") || q.includes("drain") || q.includes("block")) {
        response = isRTL
          ? "يمكن حل انسداد الصرف بطرق بسيطة. اضغط على '🚿 انسداد الصرف' لمعرفة الخطوات."
          : "Drain blockages can be solved simply. Click '🚿 Drain blockage' for the steps.";
      }

      addMessage(response, "bot");
      setShowProblems(true);
    }, 700);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center",
          "bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:from-primary/90 hover:to-primary transition-all duration-300",
          "hover:scale-110 active:scale-95 dark:shadow-2xl dark:shadow-primary/30",
          isRTL ? "left-6" : "right-6",
          open && "hidden"
        )}
        aria-label="Open chatbot"
        title={isRTL ? "افتح المساعد الذكي" : "Open Smart Assistant"}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className={cn(
            "fixed bottom-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-2xl shadow-2xl flex flex-col",
            "animate-in slide-in-from-bottom-4 duration-300 dark:bg-slate-900 dark:border-slate-700",
            isRTL ? "left-6" : "right-6"
          )}
          style={{ height: "480px" }}
          dir={isRTL ? "rtl" : "ltr"}
        >
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-t-2xl">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-lg">
                🤖
              </div>
              <div>
                <div className="font-semibold text-sm">
                  {isRTL ? "مساعد خدادماتي الذكي" : "Khadamaty Smart Assistant"}
                </div>
                <div className="text-xs text-white/80 flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
                  {isRTL ? "متاح الآن" : "Online"}
                </div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="hover:bg-white/20 rounded-full p-1 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-background dark:bg-slate-950">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn("flex", msg.sender === "user" ? (isRTL ? "justify-start" : "justify-end") : (isRTL ? "justify-end" : "justify-start"))}
              >
                <div
                  className={cn(
                    "max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap",
                    msg.sender === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm dark:bg-primary/90"
                      : "bg-muted text-foreground rounded-bl-sm dark:bg-slate-800 dark:text-slate-100"
                  )}
                >
                  {msg.text}
                </div>
              </div>
            ))}

            {/* Common Problems List */}
            {showProblems && (
              <div className="space-y-2 mt-2">
                <p className="text-xs text-muted-foreground text-center font-semibold px-2 dark:text-slate-300">
                  {isRTL ? "🔥 الأسئلة الشائعة:" : "🔥 Popular Questions:"}
                </p>
                {COMMON_PROBLEMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleProblemClick(p)}
                    className="w-full text-sm flex items-center gap-2 p-2.5 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-150 text-start group dark:border-slate-700 dark:hover:border-primary/40 dark:hover:bg-primary/10"
                  >
                    <span className="text-base group-hover:scale-125 transition-transform">{p.icon}</span>
                    <span className="flex-1 font-medium group-hover:text-primary transition-colors dark:text-slate-100 dark:group-hover:text-primary/80">{isRTL ? p.titleAr : p.titleEn}</span>
                    <ChevronRight className={cn("h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors dark:text-slate-400 dark:group-hover:text-primary/80", isRTL && "rotate-180")} />
                  </button>
                ))}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border dark:border-slate-700 bg-background dark:bg-slate-950">
            {selectedProblem && !showProblems && (
              <button
                onClick={() => { setSelectedProblem(null); setShowProblems(true); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground dark:text-slate-400 dark:hover:text-slate-200 mb-2 transition-colors"
              >
                <ArrowLeft className={cn("h-3 w-3", isRTL && "rotate-180")} />
                {isRTL ? "المشاكل الشائعة" : "All problems"}
              </button>
            )}
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder={isRTL ? "اكتب سؤالك هنا..." : "Type your question..."}
                className="flex-1 text-sm h-9 dark:bg-slate-800 dark:text-white dark:placeholder-slate-500 dark:border-slate-700"
              />
              <Button size="sm" onClick={handleSend} className="h-9 w-9 p-0 dark:bg-primary dark:hover:bg-primary/90">
                <Send className={cn("h-4 w-4", isRTL && "rotate-180")} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
