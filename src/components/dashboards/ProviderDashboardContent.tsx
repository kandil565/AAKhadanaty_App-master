import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, TrendingUp, Star, AlertCircle, MessageSquare, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProviderBooking {
  id: string;
  serviceName: string;
  customerName: string;
  date: string;
  time: string;
  price: number;
  status: string;
  notes?: string;
}

interface ProviderMetrics {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  rating: number;
  totalReviews: number;
  completionRate: number;
}

const ProviderDashboardContent = () => {
  const { t, isRTL } = useLanguage();
  const [bookings, setBookings] = useState<ProviderBooking[]>([]);
  const [metrics, setMetrics] = useState<ProviderMetrics>({
    totalOrders: 12,
    completedOrders: 10,
    pendingOrders: 2,
    rating: 4.8,
    totalReviews: 45,
    completionRate: 83,
  });

  useEffect(() => {
    // TODO: جلب البيانات من API الحقيقي
    setBookings([]);
  }, []);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800" },
      confirmed: { bg: "bg-blue-100", text: "text-blue-800" },
      in_progress: { bg: "bg-purple-100", text: "text-purple-800" },
      completed: { bg: "bg-green-100", text: "text-green-800" },
      canceled: { bg: "bg-red-100", text: "text-red-800" },
    };
    return colors[status] || colors.pending;
  };

  const MetricCard = ({ label, value, icon: Icon, color, subtext }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
          </div>
          <div className={`p-3 rounded-lg ${color}`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t("providerDashboard") || "Provider Dashboard"}</h2>
          <p className="text-muted-foreground mt-1">
            {t("manageOrders") || "Manage your orders and track your performance"}
          </p>
        </div>
        <Button variant="outline">{t("editProfile") || "Edit Profile"}</Button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label={t("totalOrders") || "Total Orders"}
          value={metrics.totalOrders}
          icon={CheckCircle2}
          color="bg-blue-500"
        />
        <MetricCard
          label={t("completedOrders") || "Completed"}
          value={metrics.completedOrders}
          icon={CheckCircle2}
          color="bg-green-500"
          subtext={`${metrics.completionRate}% ${t("completionRate") || "completion rate"}`}
        />
        <MetricCard
          label={t("pendingOrders") || "Pending"}
          value={metrics.pendingOrders}
          icon={Clock}
          color="bg-yellow-500"
          subtext={t("awaitingAction") || "Awaiting your action"}
        />
        <MetricCard
          label={t("avgRating") || "Average Rating"}
          value={metrics.rating.toFixed(1)}
          icon={Star}
          color="bg-purple-500"
          subtext={`${metrics.totalReviews} ${t("reviews") || "reviews"}`}
        />
      </div>

      {/* Orders Section */}
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t("orders") || "Your Orders"}
          </CardTitle>
          <CardDescription>{t("manageIncomingOrders") || "Accept, reject, or update order status"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="pending" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending">{t("pending") || "Pending"}</TabsTrigger>
              <TabsTrigger value="confirmed">{t("confirmed") || "Confirmed"}</TabsTrigger>
              <TabsTrigger value="inprogress">{t("inProgress") || "In Progress"}</TabsTrigger>
              <TabsTrigger value="all">{t("all") || "All"}</TabsTrigger>
            </TabsList>

            {/* Pending Orders */}
            <TabsContent value="pending" className="space-y-4 mt-4">
              {bookings.filter((b) => b.status === "pending").length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">{t("noPendingOrders") || "No pending orders"}</p>
                </div>
              ) : (
                bookings
                  .filter((b) => b.status === "pending")
                  .map((booking) => (
                    <div
                      key={booking.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                          <p className="text-sm text-muted-foreground italic">{booking.notes}</p>
                        </div>
                        <Badge className="bg-yellow-100 text-yellow-800">{t(booking.status) || booking.status}</Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">{t("customer") || "Customer"}</p>
                          <p className="font-medium">{booking.customerName}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("date") || "Date"}</p>
                          <p className="font-medium">{booking.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("time") || "Time"}</p>
                          <p className="font-medium">{booking.time}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">{t("price") || "Price"}</p>
                          <p className="font-medium">{booking.price} SAR</p>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {t("accept") || "Accept"}
                        </Button>
                        <Button size="sm" variant="outline" className="gap-1">
                          <XCircle className="w-4 h-4" />
                          {t("reject") || "Reject"}
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>

            {/* Confirmed Orders */}
            <TabsContent value="confirmed" className="space-y-4 mt-4">
              {bookings.filter((b) => b.status === "confirmed").length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">{t("noConfirmedOrders") || "No confirmed orders"}</p>
                </div>
              ) : (
                bookings
                  .filter((b) => b.status === "confirmed")
                  .map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                          <p className="text-sm text-muted-foreground">{booking.customerName}</p>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">{t(booking.status) || booking.status}</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="default" className="gap-1">
                          <Clock className="w-4 h-4" />
                          {t("markInProgress") || "Start"}
                        </Button>
                        <Button size="sm" variant="outline">
                          {t("details") || "Details"}
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>

            {/* In Progress Orders */}
            <TabsContent value="inprogress" className="space-y-4 mt-4">
              {bookings.filter((b) => b.status === "in_progress").length === 0 ? (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">{t("noInProgressOrders") || "No orders in progress"}</p>
                </div>
              ) : (
                bookings
                  .filter((b) => b.status === "in_progress")
                  .map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                          <p className="text-sm text-muted-foreground">{booking.customerName}</p>
                        </div>
                        <Badge className="bg-purple-100 text-purple-800">{t(booking.status) || booking.status}</Badge>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          {t("markCompleted") || "Mark as Completed"}
                        </Button>
                        <Button size="sm" variant="outline">
                          {t("contactCustomer") || "Contact Customer"}
                        </Button>
                      </div>
                    </div>
                  ))
              )}
            </TabsContent>

            {/* All Orders */}
            <TabsContent value="all" className="space-y-4 mt-4">
              {bookings.map((booking) => (
                <div key={booking.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold">{booking.serviceName}</h3>
                      <p className="text-sm text-muted-foreground">{booking.customerName}</p>
                    </div>
                    <Badge className={getStatusColor(booking.status).bg + " " + getStatusColor(booking.status).text}>
                      {t(booking.status) || booking.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Reviews Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            {t("recentReviews") || "Recent Reviews"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* TODO: جلب التقييمات من API الحقيقي */}
          <p className="text-muted-foreground text-sm">{t("noReviews") || "No reviews yet"}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDashboardContent;
