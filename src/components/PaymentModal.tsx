import { useState } from "react";
import { CreditCard, Banknote, AlertCircle, CheckCircle2, X, Lock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  serviceName: string;
  onPaymentSuccess: (method: "cash" | "visa", details?: any) => void;
  isLoading?: boolean;
}

type PaymentMethod = "cash" | "visa";

const PaymentModal: React.FC<PaymentModalProps> = ({
  open,
  onOpenChange,
  amount,
  serviceName,
  onPaymentSuccess,
  isLoading = false,
}) => {
  const { isRTL, t } = useLanguage();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [submitted, setSubmitted] = useState(false);
  const [visaData, setVisaData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned
      .slice(0, 16)
      .match(/.{1,4}/g)
      ?.join(" ") || "";
    return formatted;
  };

  const formatExpiry = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateCardForm = () => {
    const newErrors: Record<string, string> = {};

    const cardNumber = visaData.cardNumber.replace(/\s/g, "");
    if (!cardNumber || cardNumber.length !== 16) {
      newErrors.cardNumber = isRTL ? "رقم البطاقة يجب أن يكون 16 رقم" : "Card number must be 16 digits";
    }

    if (!visaData.cardHolder.trim()) {
      newErrors.cardHolder = isRTL ? "اسم حامل البطاقة مطلوب" : "Card holder name is required";
    }

    if (!visaData.expiryDate || !/^\d{2}\/\d{2}$/.test(visaData.expiryDate)) {
      newErrors.expiryDate = isRTL ? "تاريخ الانتهاء يجب أن يكون MM/YY" : "Expiry date must be MM/YY";
    }

    if (!visaData.cvv || visaData.cvv.length !== 3) {
      newErrors.cvv = isRTL ? "CVV يجب أن يكون 3 أرقام" : "CVV must be 3 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePaymentSubmit = async () => {
    if (paymentMethod === "cash") {
      setSubmitted(true);
      setTimeout(() => {
        onPaymentSuccess("cash");
        handleClose();
      }, 1500);
    } else {
      if (!validateCardForm()) return;
      setSubmitted(true);
      setTimeout(() => {
        onPaymentSuccess("visa", visaData);
        handleClose();
      }, 1500);
    }
  };

  const handleClose = () => {
    setSubmitted(false);
    setVisaData({ cardNumber: "", cardHolder: "", expiryDate: "", cvv: "" });
    setErrors({});
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        {!submitted ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-primary" />
                {isRTL ? "اختر طريقة الدفع" : "Payment Method"}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Amount Summary */}
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-muted-foreground">
                      {isRTL ? "الخدمة:" : "Service:"}
                    </span>
                    <span className="font-semibold text-sm">{serviceName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold">
                      {isRTL ? "المبلغ الإجمالي:" : "Total Amount:"}
                    </span>
                    <span className="text-2xl font-bold text-primary">{amount} SAR</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Methods */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  {isRTL ? "اختر طريقة الدفع" : "Select Payment Method"}
                </Label>

                {/* Cash Option */}
                <button
                  onClick={() => {
                    setPaymentMethod("cash");
                    setErrors({});
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3",
                    paymentMethod === "cash"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 transition-all",
                      paymentMethod === "cash"
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}
                  >
                    {paymentMethod === "cash" && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                    <div className="flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-green-600" />
                      <span className="font-semibold">
                        {isRTL ? "الدفع نقداً" : "Pay with Cash"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isRTL
                        ? "ادفع عند وصول مقدم الخدمة"
                        : "Pay when service provider arrives"}
                    </p>
                  </div>
                </button>

                {/* Card Option */}
                <button
                  onClick={() => {
                    setPaymentMethod("visa");
                    setErrors({});
                  }}
                  className={cn(
                    "w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-3",
                    paymentMethod === "visa"
                      ? "border-primary bg-primary/10"
                      : "border-border hover:border-primary/50"
                  )}
                >
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 transition-all",
                      paymentMethod === "visa"
                        ? "border-primary bg-primary"
                        : "border-border"
                    )}
                  >
                    {paymentMethod === "visa" && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                  <div className={cn("flex-1", isRTL ? "text-right" : "text-left")}>
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      <span className="font-semibold">
                        {isRTL ? "بطاقة ائتمان" : "Credit Card"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {isRTL ? "Visa / Mastercard" : "Visa / Mastercard"}
                    </p>
                  </div>
                </button>
              </div>

              {/* Card Form */}
              {paymentMethod === "visa" && (
                <Card className="border-border/50">
                  <CardContent className="pt-4 space-y-3">
                    <Alert className="bg-blue-50 border-blue-200">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <AlertDescription className="text-xs text-blue-800 ml-2">
                        {isRTL
                          ? "هذا النموذج آمن 100% - بيانات البطاقة لن تُحفظ"
                          : "This form is 100% secure - card data won't be saved"}
                      </AlertDescription>
                    </Alert>

                    {/* Card Number */}
                    <div>
                      <Label htmlFor="cardNumber" className="text-sm">
                        {isRTL ? "رقم البطاقة" : "Card Number"}
                      </Label>
                      <Input
                        id="cardNumber"
                        placeholder="0000 0000 0000 0000"
                        value={visaData.cardNumber}
                        onChange={(e) =>
                          setVisaData({
                            ...visaData,
                            cardNumber: formatCardNumber(e.target.value),
                          })
                        }
                        className={cn(
                          "mt-1 font-mono text-lg tracking-widest",
                          errors.cardNumber && "border-red-500"
                        )}
                      />
                      {errors.cardNumber && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.cardNumber}
                        </p>
                      )}
                    </div>

                    {/* Card Holder */}
                    <div>
                      <Label htmlFor="cardHolder" className="text-sm">
                        {isRTL ? "اسم حامل البطاقة" : "Cardholder Name"}
                      </Label>
                      <Input
                        id="cardHolder"
                        placeholder={isRTL ? "الاسم الكامل" : "Full Name"}
                        value={visaData.cardHolder}
                        onChange={(e) =>
                          setVisaData({
                            ...visaData,
                            cardHolder: e.target.value.toUpperCase(),
                          })
                        }
                        className={cn(
                          "mt-1 uppercase",
                          errors.cardHolder && "border-red-500"
                        )}
                      />
                      {errors.cardHolder && (
                        <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {errors.cardHolder}
                        </p>
                      )}
                    </div>

                    {/* Expiry & CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="expiryDate" className="text-sm">
                          {isRTL ? "تاريخ الانتهاء" : "Expiry Date"}
                        </Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={visaData.expiryDate}
                          onChange={(e) =>
                            setVisaData({
                              ...visaData,
                              expiryDate: formatExpiry(e.target.value),
                            })
                          }
                          className={cn(
                            "mt-1 font-mono",
                            errors.expiryDate && "border-red-500"
                          )}
                        />
                        {errors.expiryDate && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.expiryDate}
                          </p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="cvv" className="text-sm">
                          CVV
                        </Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={visaData.cvv}
                          onChange={(e) =>
                            setVisaData({
                              ...visaData,
                              cvv: e.target.value.slice(0, 3),
                            })
                          }
                          className={cn(
                            "mt-1 font-mono",
                            errors.cvv && "border-red-500"
                          )}
                          type="password"
                        />
                        {errors.cvv && (
                          <p className="text-xs text-red-500 mt-1">
                            {errors.cvv}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1"
                  disabled={isLoading}
                >
                  {isRTL ? "إلغاء" : "Cancel"}
                </Button>
                <Button
                  onClick={handlePaymentSubmit}
                  className="flex-1"
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⚙️</span>
                      {isRTL ? "جاري المعالجة..." : "Processing..."}
                    </>
                  ) : (
                    <>{isRTL ? "تأكيد الدفع" : "Confirm Payment"}</>
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          /* Success State */
          <div className="space-y-4 py-8 text-center">
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-10 h-10 text-success" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                {isRTL ? "تم الدفع بنجاح! ✅" : "Payment Successful! ✅"}
              </h3>
              <p className="text-sm text-muted-foreground mt-2">
                {isRTL
                  ? "شكراً لك! سيتم تأكيد حجزك في الحال"
                  : "Thank you! Your booking will be confirmed shortly"}
              </p>
            </div>
            <div className="bg-success/10 border border-success/30 rounded-lg p-3">
              <p className="text-xs text-success font-semibold">
                {isRTL ? "المبلغ: " : "Amount: "}
                {amount} SAR
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
