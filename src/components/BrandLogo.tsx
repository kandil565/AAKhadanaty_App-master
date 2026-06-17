import { useLanguage } from "@/contexts/LanguageContext";

const BrandLogo = ({ className }: { className?: string }) => {
  const { t } = useLanguage();

  return (
    <img
      src="/logo.png"
      alt={t("appName")}
      className={`h-10 w-10 rounded-lg object-cover ${className || ""}`}
    />
  );
};

export default BrandLogo;
