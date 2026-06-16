import { MapPin, Briefcase, Star, CheckCircle, Wrench, Droplets, Zap, Wind } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RatingStars from "@/components/RatingStars";
import { useLanguage } from "@/contexts/LanguageContext";

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

interface ProviderCardProps {
  provider: Provider;
  onSelect?: (provider: Provider) => void;
  selected?: boolean;
}

const serviceIconMap: Record<string, React.ReactNode> = {
  ac: <Wind className="h-3.5 w-3.5" />,
  plumbing: <Droplets className="h-3.5 w-3.5" />,
  electrical: <Zap className="h-3.5 w-3.5" />,
  cleaning: <Wrench className="h-3.5 w-3.5" />,
};

const serviceLabels: Record<string, { ar: string; en: string }> = {
  ac: { ar: "تكييف", en: "AC" },
  plumbing: { ar: "سباكة", en: "Plumbing" },
  electrical: { ar: "كهرباء", en: "Electrical" },
  cleaning: { ar: "تنظيف", en: "Cleaning" },
};

const ProviderCard = ({ provider, onSelect, selected }: ProviderCardProps) => {
  const { isRTL } = useLanguage();
  const name = provider.userId?.name || (isRTL ? "مقدم الخدمة" : "Provider");

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        selected ? "ring-2 ring-primary border-primary" : "hover:border-primary/40"
      }`}
      onClick={() => onSelect?.(provider)}
    >
      <CardContent className="p-4 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg flex-shrink-0">
            {name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="font-semibold truncate">{name}</span>
              {provider.isVerified && (
                <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" title={isRTL ? "موثق" : "Verified"} />
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {provider.city}
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <RatingStars value={Math.round(provider.averageRating)} readonly size="sm" />
          <span className="text-sm font-medium">{provider.averageRating.toFixed(1)}</span>
          <span className="text-xs text-muted-foreground">
            ({provider.totalReviews} {isRTL ? "تقييم" : "reviews"})
          </span>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Briefcase className="h-3.5 w-3.5" />
          {provider.experience} {isRTL ? "سنوات خبرة" : "years experience"}
        </div>

        {/* Services */}
        <div className="flex flex-wrap gap-1.5">
          {provider.services.map((s) => (
            <Badge key={s} variant="secondary" className="flex items-center gap-1 text-xs">
              {serviceIconMap[s]}
              {isRTL ? serviceLabels[s]?.ar : serviceLabels[s]?.en}
            </Badge>
          ))}
        </div>

        {/* Bio */}
        {provider.bio && (
          <p className="text-xs text-muted-foreground line-clamp-2">{provider.bio}</p>
        )}

        {onSelect && (
          <Button
            size="sm"
            variant={selected ? "default" : "outline"}
            className="w-full mt-1"
          >
            {selected
              ? (isRTL ? "✓ تم الاختيار" : "✓ Selected")
              : (isRTL ? "اختيار مقدم الخدمة" : "Select Provider")}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default ProviderCard;
