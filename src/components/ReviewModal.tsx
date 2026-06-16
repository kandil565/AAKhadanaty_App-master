import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import RatingStars from "@/components/RatingStars";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  providerName: string;
}

const ReviewModal = ({ open, onClose, onSubmit, providerName }: ReviewModalProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const { isRTL } = useLanguage();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(isRTL ? "يرجى اختيار تقييم" : "Please select a rating");
      return;
    }
    setLoading(true);
    try {
      await onSubmit(rating, comment);
      toast.success(isRTL ? "تم إرسال التقييم بنجاح" : "Review submitted successfully");
      setRating(0);
      setComment("");
      onClose();
    } catch {
      toast.error(isRTL ? "حدث خطأ، يرجى المحاولة مجدداً" : "An error occurred, please try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" dir={isRTL ? "rtl" : "ltr"}>
        <DialogHeader>
          <DialogTitle>
            {isRTL ? `تقييم ${providerName}` : `Rate ${providerName}`}
          </DialogTitle>
          <DialogDescription>
            {isRTL
              ? "شاركنا تجربتك مع مقدم الخدمة"
              : "Share your experience with the service provider"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5">
          <div className="flex flex-col items-center gap-3">
            <Label className="text-base font-semibold">
              {isRTL ? "تقييمك" : "Your Rating"}
            </Label>
            <RatingStars value={rating} onChange={setRating} size="lg" />
            <span className="text-sm text-muted-foreground">
              {rating > 0 && (
                isRTL
                  ? ["", "ضعيف", "مقبول", "جيد", "جيد جداً", "ممتاز"][rating]
                  : ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]
              )}
            </span>
          </div>
          <div className="space-y-2">
            <Label>{isRTL ? "تعليق (اختياري)" : "Comment (optional)"}</Label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={isRTL ? "اكتب تجربتك هنا..." : "Write your experience here..."}
              rows={3}
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              {isRTL ? "إلغاء" : "Cancel"}
            </Button>
            <Button onClick={handleSubmit} disabled={loading || rating === 0}>
              {loading
                ? (isRTL ? "جاري الإرسال..." : "Submitting...")
                : (isRTL ? "إرسال التقييم" : "Submit Review")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewModal;
