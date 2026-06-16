import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ar, enUS } from "date-fns/locale";
import { CalendarIcon, CheckCircle, CreditCard, Banknote, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { services, formatPrice } from "@/data/services";
import { useBookings } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProviderCard from "@/components/ProviderCard";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

interface Provider {
  _id: string;
  userId: { name: string; profileImage?: string };
  services: string[];
  city: string;
  experience: number;
  averageRating: number;
  totalReviews: number;
  isVerified?: boolean;
  bio?: string;
}

const BookingPage = () => {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { addBooking } = useBookings();
  const { user } = useAuth();
  const { t, language, isRTL } = useLanguage();

  const [serviceId, setServiceId] = useState(params.get("service") || "");
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [email, setEmail] = useState(user?.email || "");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  // Provider selection
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "visa">("cash");
  const [visaNumber, setVisaNumber] = useState("");
  const [visaName, setVisaName] = useState("");
  const [visaExpiry, setVisaExpiry] = useState("");
  const [visaCvv, setVisaCvv] = useState("");

  const selectedService = services.find((s) => s.id === serviceId);

  // Map service id to service type
  const serviceTypeMap: Record<string, string> = {
    "1": "ac", "2": "plumbing", "3": "electrical", "4": "cleaning",
    "ac": "ac", "plumbing": "plumbing", "electrical": "electrical", "cleaning": "cleaning",
  };

  // Fetch providers when service changes
  useEffect(() => {
    const fetchProviders = async () => {
      if (!serviceId) { setProviders([]); return; }
      const serviceType = serviceTypeMap[serviceId] || serviceId.split("-")[0] || "ac";
      setLoadingProviders(true);
      try {
        const res = await fetch(`${API_BASE}/providers?service=${serviceType}&sort=rating`);
        const data = await res.json();
        if (data.success) setProviders(data.data);
      } catch {
        setProviders([]);
      } finally {
        setLoadingProviders(false);
      }
    };
    fetchProviders();
  }, [serviceId]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!serviceId) e.service = t("chooseService");
    if (!date) e.date = t("chooseDate");
    if (!time) e.time = t("chooseTime");
    if (!name.trim()) e.name = t("enterValidName");
    if (!phone.trim() || phone.length < 11) e.phone = t("enterValidPhone");
    if (!email.trim() || !email.includes("@")) e.email = t("enterValidEmail");
    if (paymentMethod === "visa") {
      if (!visaNumber || visaNumber.replace(/\s/g, "").length < 16) e.visa = isRTL ? "يرجى إدخال رقم بطاقة صحيح" : "Please enter a valid card number";
      if (!visaExpiry) e.visa = isRTL ? "يرجى إدخال تاريخ الانتهاء" : "Please enter expiry date";
      if (!visaCvv) e.visa = isRTL ? "يرجى إدخال CVV" : "Please enter CVV";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const success = await addBooking({
      serviceId,
      serviceName: selectedService?.name || "",
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      date: format(date!, "yyyy-MM-dd"),
      time,
      price: selectedService?.price || 0,
      notes,
      providerId: selectedProvider?._id,
      paymentMethod,
    });

    if (success) {
      setSubmitted(true);
      toast.success(t("bookingSuccessMsg"));
    } else {
      toast.error(t("bookingError"));
    }
  };

  const locale = language === "ar" ? ar : enUS;

  if (submitted) {
    return (
      <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h1 className="text-2xl font-bold">{t("bookingSuccessTitle")}</h1>
          <p className="text-muted-foreground">
            {t("bookedServiceOn")} <strong>{isRTL ? selectedService?.name : selectedService?.nameEn || selectedService?.name}</strong> {t("onDate")}{" "}
            <strong>{format(date!, "dd MMMM yyyy", { locale })}</strong> {t("atTime")} <strong>{time}</strong>.
          </p>
          {selectedProvider && (
            <p className="text-sm text-muted-foreground">
              {isRTL ? "مقدم الخدمة:" : "Provider:"} <strong>{selectedProvider.userId?.name}</strong>
            </p>
          )}
          <p className="text-sm text-muted-foreground">
            {isRTL ? "طريقة الدفع:" : "Payment:"} {paymentMethod === "cash" ? (isRTL ? "كاش عند الاستلام" : "Cash on delivery") : (isRTL ? "بطاقة Visa" : "Visa card")}
          </p>
          <p className="text-sm text-muted-foreground">{t("willContactYou")}</p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => navigate("/my-bookings")}>{t("myBookings")}</Button>
            <Button variant="outline" onClick={() => navigate("/")}>{t("homePage")}</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">{t("bookingTitle")}</h1>
          <p className="text-muted-foreground">{t("bookingDesc")}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card>
            <CardHeader><CardTitle>{t("bookingData")}</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              {/* Service */}
              <div className="space-y-2">
                <Label>{t("serviceLabel")} {t("required")}</Label>
                <Select value={serviceId} onValueChange={(v) => { setServiceId(v); setSelectedProvider(null); }}>
                  <SelectTrigger><SelectValue placeholder={t("selectService")} /></SelectTrigger>
                  <SelectContent>
                    {services.map((s) => (
                      <SelectItem key={s.id} value={s.id}>
                        {isRTL ? s.name : s.nameEn || s.name} - {formatPrice(s.price)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && <p className="text-sm text-destructive">{errors.service}</p>}
              </div>

              {/* Provider Selection */}
              {serviceId && (
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    {isRTL ? "اختيار مقدم الخدمة (اختياري)" : "Select Service Provider (optional)"}
                  </Label>
                  {loadingProviders ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground py-4">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {isRTL ? "جاري التحميل..." : "Loading providers..."}
                    </div>
                  ) : providers.length === 0 ? (
                    <p className="text-sm text-muted-foreground py-2">
                      {isRTL ? "لا يوجد مقدمو خدمة متاحون لهذه الخدمة حالياً" : "No providers available for this service yet"}
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3">
                      {providers.slice(0, 3).map((p) => (
                        <ProviderCard
                          key={p._id}
                          provider={p}
                          onSelect={setSelectedProvider}
                          selected={selectedProvider?._id === p._id}
                        />
                      ))}
                      {selectedProvider && (
                        <button type="button" onClick={() => setSelectedProvider(null)} className="text-xs text-muted-foreground hover:text-foreground underline text-center">
                          {isRTL ? "إلغاء اختيار مقدم الخدمة" : "Clear provider selection"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("dateLabel")} {t("required")}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-full justify-start", isRTL ? "text-right" : "text-left", !date && "text-muted-foreground")}>
                        <CalendarIcon className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
                        {date ? format(date, "dd/MM/yyyy") : t("selectDate")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={date} onSelect={setDate} disabled={(d) => d < new Date()} className="p-3 pointer-events-auto" locale={locale} />
                    </PopoverContent>
                  </Popover>
                  {errors.date && <p className="text-sm text-destructive">{errors.date}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("timeLabel")} {t("required")}</Label>
                  <Select value={time} onValueChange={setTime}>
                    <SelectTrigger><SelectValue placeholder={t("selectTime")} /></SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((ts) => <SelectItem key={ts} value={ts}>{ts}</SelectItem>)}
                    </SelectContent>
                  </Select>
                  {errors.time && <p className="text-sm text-destructive">{errors.time}</p>}
                </div>
              </div>

              {/* Contact */}
              <div className="space-y-2">
                <Label>{t("fullName")} {t("required")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("enterFullName")} />
                {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("phoneLabel")} {t("required")}</Label>
                  <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" type="tel" />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t("emailLabel")} {t("required")}</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" type="email" />
                  {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>{t("notes")}</Label>
                <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder={t("notesPlaceholder")} />
              </div>
            </CardContent>
          </Card>

          {/* Payment Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {isRTL ? "طريقة الدفع" : "Payment Method"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: "cash", icon: Banknote, labelAr: "كاش عند الاستلام", labelEn: "Cash on Delivery" },
                  { value: "visa", icon: CreditCard, labelAr: "بطاقة Visa", labelEn: "Visa Card" },
                ].map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => setPaymentMethod(p.value as "cash" | "visa")}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all",
                      paymentMethod === p.value ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                    )}
                  >
                    <p.icon className={cn("h-6 w-6", paymentMethod === p.value ? "text-primary" : "text-muted-foreground")} />
                    <span className="text-sm font-medium">{isRTL ? p.labelAr : p.labelEn}</span>
                  </button>
                ))}
              </div>

              {paymentMethod === "visa" && (
                <div className="space-y-3 p-4 bg-muted/30 rounded-xl border border-dashed border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">🎭 {isRTL ? "بيانات وهمية للعرض فقط" : "Mock Data - Demo Only"}</Badge>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">{isRTL ? "رقم البطاقة" : "Card Number"}</Label>
                    <Input
                      value={visaNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                        setVisaNumber(val.replace(/(.{4})/g, "$1 ").trim());
                      }}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm">{isRTL ? "اسم صاحب البطاقة" : "Cardholder Name"}</Label>
                    <Input value={visaName} onChange={(e) => setVisaName(e.target.value)} placeholder="JOHN DOE" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label className="text-sm">{isRTL ? "تاريخ الانتهاء" : "Expiry Date"}</Label>
                      <Input value={visaExpiry} onChange={(e) => setVisaExpiry(e.target.value)} placeholder="MM/YY" maxLength={5} />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">CVV</Label>
                      <Input value={visaCvv} onChange={(e) => setVisaCvv(e.target.value)} placeholder="123" maxLength={3} type="password" />
                    </div>
                  </div>
                  {errors.visa && <p className="text-sm text-destructive">{errors.visa}</p>}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          {selectedService && (
            <Card>
              <CardContent className="p-4 space-y-2">
                <h4 className="font-bold">{t("bookingSummary")}</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t("serviceLabel")}</span>
                  <span>{isRTL ? selectedService.name : selectedService.nameEn || selectedService.name}</span>
                </div>
                {selectedProvider && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{isRTL ? "مقدم الخدمة" : "Provider"}</span>
                    <span>{selectedProvider.userId?.name}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{isRTL ? "طريقة الدفع" : "Payment"}</span>
                  <span>{paymentMethod === "cash" ? (isRTL ? "كاش" : "Cash") : "Visa"}</span>
                </div>
                <div className="flex justify-between font-bold border-t border-border pt-2">
                  <span>{t("total")}</span>
                  <span className="text-primary">{formatPrice(selectedService.price)}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <Button type="submit" className="w-full" size="lg">
            {t("submitBooking")}
          </Button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default BookingPage;
