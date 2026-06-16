import { Navigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBookings } from "@/contexts/BookingContext";
import { useAuth } from "@/contexts/AuthContext";
import { statusColors, formatPrice, services } from "@/data/services";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReviewModal from "@/components/ReviewModal";
import { useState, useEffect } from "react";
import { Loader2, Star } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { toast } from "sonner";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const statusIcons: Record<string, string> = {
  pending: "🕐",
  confirmed: "✅",
  in_progress: "🔧",
  completed: "✔️",
  cancelled: "❌",
  canceled: "❌",
};

const MyBookingsPage = () => {
  const { isAuthenticated } = useAuth();
  const { bookings, loading, fetchMyBookings } = useBookings();
  const [filter, setFilter] = useState<string>("all");
  const { t, isRTL } = useLanguage();

  // Review state
  const [reviewModal, setReviewModal] = useState<{ open: boolean; bookingId: string; providerName: string; providerId: string } | null>(null);

  const getLocalizedServiceName = (serviceId: string, fallbackName: string) => {
    if (isRTL) return fallbackName;
    const service = services.find((s) => s.id === serviceId);
    return service?.nameEn || fallbackName;
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMyBookings();
    }
  }, [isAuthenticated, fetchMyBookings]);

  if (!isAuthenticated) return <Navigate to="/login" />;

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const handleReviewSubmit = async (rating: number, comment: string) => {
    if (!reviewModal) return;
    const token = localStorage.getItem("a5adamaty_token");
    const res = await fetch(`${API_BASE}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ providerId: reviewModal.providerId, bookingId: reviewModal.bookingId, rating, comment }),
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message);
    await fetchMyBookings();
    toast.success(isRTL ? "تم إرسال التقييم!" : "Review submitted!");
  };

  return (
    <div className="min-h-screen" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">{t("myBookingsTitle")}</h1>
            <p className="text-muted-foreground">{t("trackOrders")}</p>
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder={t("all")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("all")}</SelectItem>
              <SelectItem value="pending">{t("pending")}</SelectItem>
              <SelectItem value="confirmed">{t("confirmed")}</SelectItem>
              <SelectItem value="in_progress">{isRTL ? "جاري التنفيذ" : "In Progress"}</SelectItem>
              <SelectItem value="completed">{t("completed")}</SelectItem>
              <SelectItem value="canceled">{t("canceled")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className={`${isRTL ? "mr-3" : "ml-3"} text-muted-foreground`}>{t("loadingBookings")}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((b) => (
              <Card key={b.id}>
                <CardContent className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-xl">{statusIcons[b.status] ?? "📋"}</span>
                        <span className="font-bold text-lg">{getLocalizedServiceName(b.serviceId, b.serviceName)}</span>
                        <Badge className={statusColors[b.status]}>
                          {isRTL
                            ? { pending: "قيد الانتظار", confirmed: "مؤكد", in_progress: "جاري التنفيذ", completed: "مكتمل", canceled: "ملغي", cancelled: "ملغي" }[b.status]
                            : t(b.status)}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        📅 {b.date} • ⏰ {b.time}
                      </div>
                      {b.paymentMethod && (
                        <div className="text-xs text-muted-foreground">
                          💳 {b.paymentMethod === "cash" ? (isRTL ? "كاش عند الاستلام" : "Cash on Delivery") : "Visa"}
                        </div>
                      )}
                      {b.notes && <div className="text-sm text-muted-foreground">📝 {b.notes}</div>}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="font-bold text-primary font-sans" dir="ltr">{formatPrice(b.price)}</span>
                      {/* Review button for completed bookings with a provider */}
                      {b.status === "completed" && b.providerId && !b.isReviewed && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs gap-1"
                          onClick={() => setReviewModal({
                            open: true,
                            bookingId: b.id,
                            providerId: b.providerId!,
                            providerName: isRTL ? "مقدم الخدمة" : "Service Provider",
                          })}
                        >
                          <Star className="h-3.5 w-3.5" />
                          {isRTL ? "تقييم" : "Rate"}
                        </Button>
                      )}
                      {b.status === "completed" && b.isReviewed && (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <Star className="h-3 w-3 fill-green-500 text-green-500" />
                          {isRTL ? "تم التقييم" : "Reviewed"}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Status messages */}
                  {b.status === "pending" && (
                    <p className="mt-3 text-sm text-yellow-600 bg-yellow-50 rounded-md px-3 py-2">{t("pendingReviewMsg")}</p>
                  )}
                  {b.status === "confirmed" && (
                    <p className="mt-3 text-sm text-green-600 bg-green-50 rounded-md px-3 py-2">{t("confirmedMsg")}</p>
                  )}
                  {b.status === "in_progress" && (
                    <p className="mt-3 text-sm text-blue-600 bg-blue-50 rounded-md px-3 py-2">
                      {isRTL ? "🔧 جاري تنفيذ الخدمة..." : "🔧 Service is in progress..."}
                    </p>
                  )}
                  {(b.status === "canceled" || b.status === "cancelled") && (
                    <p className="mt-3 text-sm text-red-600 bg-red-50 rounded-md px-3 py-2">{t("rejectedMsg")}</p>
                  )}
                </CardContent>
              </Card>
            ))}
            {filtered.length === 0 && (
              <p className="text-center text-muted-foreground py-12">{t("noBookings")}</p>
            )}
          </div>
        )}
      </div>

      {reviewModal && (
        <ReviewModal
          open={reviewModal.open}
          onClose={() => setReviewModal(null)}
          onSubmit={handleReviewSubmit}
          providerName={reviewModal.providerName}
        />
      )}

      <Footer />
    </div>
  );
};

export default MyBookingsPage;
