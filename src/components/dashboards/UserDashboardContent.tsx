import { useEffect, useState } from "react";
import { ChevronRight, Calendar, DollarSign, Star, CheckCircle2, Clock, AlertCircle, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useBookings } from "@/contexts/BookingContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Link } from "react-router-dom";

interface BookingSummary {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  revenue: number;
}

const UserDashboardContent = () => {
  const { bookings } = useBookings();
  const { t, isRTL } = useLanguage();
  const [summary, setSummary] = useState<BookingSummary>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    revenue: 0,
  });

  useEffect(() => {
    const completed = bookings.filter((b) => b.status === "completed").length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const totalRevenue = bookings.filter((b) => b.status === "completed").reduce((sum, b) => sum + b.price, 0);

    setSummary({
      total: bookings.length,
      pending,
      confirmed,
      completed,
      revenue: totalRevenue,
    });
  }, [bookings]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", icon: "bg-yellow-500" },
      confirmed: { bg: "bg-blue-100", text: "text-blue-800", icon: "bg-blue-500" },
      in_progress: { bg: "bg-purple-100", text: "text-purple-800", icon: "bg-purple-500" },
      completed: { bg: "bg-green-100", text: "text-green-800", icon: "bg-green-500" },
      canceled: { bg: "bg-red-100", text: "text-red-800", icon: "bg-red-500" },
    };
    return colors[status] || colors.pending;
  };

  const StatCard = ({ label, value, icon: Icon, color }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
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
          <h2 className="text-3xl font-bold text-gray-900">{t("myDashboard") || "My Dashboard"}</h2>
          <p className="text-muted-foreground mt-1">{t("welcomeBack") || "Welcome back! Here's your service overview"}</p>
        </div>
        <Link to="/booking">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            {t("bookNewService") || "Book New Service"}
          </Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t("totalBookings") || "Total Bookings"} value={summary.total} icon={Calendar} color="bg-blue-500" />
        <StatCard label={t("pending") || "Pending"} value={summary.pending} icon={Clock} color="bg-yellow-500" />
        <StatCard label={t("confirmed") || "Confirmed"} value={summary.confirmed} icon={CheckCircle2} color="bg-purple-500" />
        <StatCard label={t("completed") || "Completed"} value={summary.completed} icon={DollarSign} color="bg-green-500" />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="current" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">{t("current") || "Current"}</TabsTrigger>
          <TabsTrigger value="history">{t("history") || "History"}</TabsTrigger>
          <TabsTrigger value="reviews">{t("myReviews") || "My Reviews"}</TabsTrigger>
        </TabsList>

        {/* Current Bookings */}
        <TabsContent value="current" className="space-y-4">
          {bookings.filter((b) => ["pending", "confirmed", "in_progress"].includes(b.status)).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">{t("noCurrentBookings") || "No active bookings"}</p>
                <Link to="/booking">
                  <Button variant="outline" className="mt-4">
                    {t("bookNow") || "Book Now"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            bookings
              .filter((b) => ["pending", "confirmed", "in_progress"].includes(b.status))
              .map((booking) => {
                const colors = getStatusColor(booking.status);
                return (
                  <Card key={booking.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{booking.serviceName}</h3>
                            <Badge className={colors.bg + " " + colors.text}>{t(booking.status) || booking.status}</Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
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
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/my-bookings?id=${booking.id}`}>
                            <Button variant="outline" size="sm" className="gap-1">
                              {t("details") || "Details"}
                              <ChevronRight className="w-4 h-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>

        {/* Booking History */}
        <TabsContent value="history" className="space-y-4">
          {bookings.filter((b) => ["completed", "canceled"].includes(b.status)).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">{t("noHistory") || "No booking history"}</p>
              </CardContent>
            </Card>
          ) : (
            bookings
              .filter((b) => ["completed", "canceled"].includes(b.status))
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map((booking) => {
                const colors = getStatusColor(booking.status);
                return (
                  <Card key={booking.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold">{booking.serviceName}</h3>
                          <p className="text-sm text-muted-foreground">{booking.date}</p>
                        </div>
                        <Badge className={colors.bg + " " + colors.text}>{t(booking.status) || booking.status}</Badge>
                        {booking.status === "completed" && !booking.isReviewed && (
                          <Link to={`/my-bookings?id=${booking.id}&review=true`}>
                            <Button variant="ghost" size="sm" className="gap-1 ml-2">
                              <Star className="w-4 h-4" />
                              {t("review") || "Review"}
                            </Button>
                          </Link>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })
          )}
        </TabsContent>

        {/* Reviews Given */}
        <TabsContent value="reviews" className="space-y-4">
          {bookings.filter((b) => b.isReviewed).length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Star className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">{t("noReviews") || "No reviews yet"}</p>
              </CardContent>
            </Card>
          ) : (
            bookings
              .filter((b) => b.isReviewed)
              .map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold">{booking.serviceName}</h3>
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">5.0</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{booking.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboardContent;
