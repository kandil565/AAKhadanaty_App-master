import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AdminDashboardContent from "@/components/dashboards/AdminDashboardContent";

const AdminDashboardPage = () => {
  const { user, isAuthenticated } = useAuth();
  const { isRTL } = useLanguage();

  if (!isAuthenticated) return <Navigate to="/login" />;
  if (!user?.isAdmin && user?.role !== "admin") return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        <AdminDashboardContent />
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboardPage;
