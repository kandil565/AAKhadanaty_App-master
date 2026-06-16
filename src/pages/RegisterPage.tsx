import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { toast } from "sonner";
import { Eye, EyeOff, User, Wrench, CheckCircle2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

const SERVICES = [
  { id: "ac", labelAr: "تكييف", labelEn: "AC Repair", icon: "❄️" },
  { id: "plumbing", labelAr: "سباكة", labelEn: "Plumbing", icon: "💧" },
  { id: "electrical", labelAr: "كهرباء", labelEn: "Electrical", icon: "⚡" },
  { id: "cleaning", labelAr: "تنظيف", labelEn: "Cleaning", icon: "🧹" },
];

const RegisterPage = () => {
  const [role, setRole] = useState<"user" | "serviceProvider">("user");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Provider-specific fields
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [city, setCity] = useState("");
  const [experience, setExperience] = useState("1");
  const [bio, setBio] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const { t, isRTL } = useLanguage();

  const toggleService = (svcId: string) => {
    setSelectedServices((prev) =>
      prev.includes(svcId) ? prev.filter((s) => s !== svcId) : [...prev, svcId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !password) {
      toast.error(t("fillAllFields"));
      return;
    }
    if (password.length < 6) {
      toast.error(t("passwordMin"));
      return;
    }
    if (role === "serviceProvider" && selectedServices.length === 0) {
      toast.error(isRTL ? "يرجى اختيار خدمة واحدة على الأقل" : "Please select at least one service");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(
        name,
        email,
        phone,
        password,
        role,
        role === "serviceProvider"
          ? { services: selectedServices, city: city || "Cairo", experience: Number(experience) || 1, bio }
          : undefined
      );
      if (result.success) {
        toast.success(t("registerSuccess"));
        navigate("/");
      } else {
        toast.error(result.message || t("emailRegistered"));
      }
    } catch {
      toast.error(t("registerError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container mx-auto px-4 py-12 flex items-center justify-center">
        <Card className="w-full max-w-lg shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl">{t("registerTitle")}</CardTitle>
            <CardDescription>{t("registerDesc")}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Selector */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { value: "user", icon: User, labelAr: "مستخدم", labelEn: "User", descAr: "أحجز خدمات", descEn: "Book services" },
                { value: "serviceProvider", icon: Wrench, labelAr: "مقدم خدمة", labelEn: "Service Provider", descAr: "أقدم خدمات", descEn: "Offer services" },
              ].map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setRole(r.value as typeof role)}
                  className={cn(
                    "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
                    role === r.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", role === r.value ? "bg-primary text-primary-foreground" : "bg-muted")}>
                    <r.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{isRTL ? r.labelAr : r.labelEn}</div>
                    <div className="text-xs text-muted-foreground">{isRTL ? r.descAr : r.descEn}</div>
                  </div>
                </button>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Common Fields */}
              <div className="space-y-2">
                <Label>{t("fullName")}</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder={t("enterName")} />
              </div>
              <div className="space-y-2">
                <Label>{t("email")}</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="space-y-2">
                <Label>{t("phone")}</Label>
                <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01XXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>{t("password")}</Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t("minChars")}
                    className="pr-10"
                  />
                  <Button type="button" variant="ghost" size="sm" className="absolute inset-y-0 right-0 h-full px-3" onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <EyeOff className="h-4 w-4 text-muted-foreground" /> : <Eye className="h-4 w-4 text-muted-foreground" />}
                  </Button>
                </div>
              </div>

              {/* Provider Extra Fields */}
              {role === "serviceProvider" && (
                <div className="space-y-4 pt-2 border-t border-dashed border-border">
                  <div>
                    <Label className="mb-2 block">
                      {isRTL ? "الخدمات التي تقدمها *" : "Services you offer *"}
                    </Label>
                    <div className="grid grid-cols-2 gap-2">
                      {SERVICES.map((s) => (
                        <button
                          key={s.id}
                          type="button"
                          onClick={() => toggleService(s.id)}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all",
                            selectedServices.includes(s.id)
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-border hover:border-primary/30"
                          )}
                        >
                          <span>{s.icon}</span>
                          <span>{isRTL ? s.labelAr : s.labelEn}</span>
                          {selectedServices.includes(s.id) && <CheckCircle2 className="h-4 w-4 ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <Label>{isRTL ? "المدينة" : "City"}</Label>
                      <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder={isRTL ? "القاهرة" : "Cairo"} />
                    </div>
                    <div className="space-y-2">
                      <Label>{isRTL ? "سنوات الخبرة" : "Years of Experience"}</Label>
                      <Input type="number" min="0" max="50" value={experience} onChange={(e) => setExperience(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{isRTL ? "نبذة عنك (اختياري)" : "Bio (optional)"}</Label>
                    <Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder={isRTL ? "صف تجربتك ومهاراتك..." : "Describe your experience and skills..."} rows={2} />
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? t("creatingAccount") : t("registerBtn")}
              </Button>
            </form>

            <p className="text-center text-sm mt-4 text-muted-foreground">
              {t("alreadyHaveAccount")}{" "}
              <Link to="/login" className="text-primary hover:underline font-medium">{t("loginTitle")}</Link>
            </p>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
};

export default RegisterPage;
