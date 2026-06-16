import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import UserDashboardContent from "@/components/dashboards/UserDashboardContent";
import AdminDashboardContent from "@/components/dashboards/AdminDashboardContent";

const DashboardPage = () => {
  const { isAuthenticated, user } = useAuth();
  const { isRTL } = useLanguage();

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      <Navbar />
      <div className="container mx-auto px-4 py-10">
        {user?.isAdmin ? <AdminDashboardContent /> : <UserDashboardContent />}
      </div>
      <Footer />
    </div>
  );
};

export default DashboardPage;
