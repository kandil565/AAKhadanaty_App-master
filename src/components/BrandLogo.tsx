import { useLanguage } from "@/contexts/LanguageContext";

const BrandLogo = ({ className }: { className?: string }) => {
  const { t } = useLanguage();

  return (
    <span className={`inline-flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary font-black text-base ${className || ""}`}>
      {t("footerBrandLetter")}
    </span>
  );
};

export default BrandLogo;
