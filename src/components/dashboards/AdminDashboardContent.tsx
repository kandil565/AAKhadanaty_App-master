import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import {
  Users,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";

interface AdminMetrics {
  totalUsers: number;
  totalProviders: number;
  totalBookings: number;
  totalRevenue: number;
  completionRate: number;
  pendingVerifications: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: "user" | "provider" | "admin";
  status: "active" | "inactive";
  joinDate: string;
}

const AdminDashboardContent = () => {
  const { t, isRTL } = useLanguage();
  const [metrics, setMetrics] = useState<AdminMetrics>({
    totalUsers: 0,
    totalProviders: 0,
    totalBookings: 0,
    totalRevenue: 0,
    completionRate: 0,
    pendingVerifications: 0,
  });

  const [users, setUsers] = useState<User[]>([]);

  const monthlyData: any[] = [];
  const categoryData: any[] = [];
  const statusData: any[] = [];

  const MetricCard = ({ label, value, icon: Icon, color, trend }: any) => (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold mt-2">{value}</p>
            {trend && <p className="text-xs text-green-600 mt-1">↑ {trend} from last month</p>}
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
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">{t("adminDashboard") || "Admin Dashboard"}</h2>
          <p className="text-muted-foreground mt-1">
            {t("systemOverview") || "Complete overview of your platform"}
          </p>
        </div>
        <Button variant="outline">{t("generateReport") || "Generate Report"}</Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label={t("totalUsers") || "Total Users"}
          value={metrics.totalUsers}
          icon={Users}
          color="bg-blue-500"
          trend="+12%"
        />
        <MetricCard
          label={t("totalProviders") || "Service Providers"}
          value={metrics.totalProviders}
          icon={TrendingUp}
          color="bg-green-500"
          trend="+8%"
        />
        <MetricCard
          label={t("totalRevenue") || "Total Revenue"}
          value={`$${(metrics.totalRevenue / 1000).toFixed(1)}K`}
          icon={DollarSign}
          color="bg-purple-500"
          trend="+15%"
        />
        <MetricCard
          label={t("totalBookings") || "Total Bookings"}
          value={metrics.totalBookings}
          icon={ShoppingCart}
          color="bg-orange-500"
        />
        <MetricCard
          label={t("completionRate") || "Avg Completion Rate"}
          value={`${metrics.completionRate}%`}
          icon={CheckCircle2}
          color="bg-cyan-500"
        />
        <MetricCard
          label={t("pending") || "Pending Verifications"}
          value={metrics.pendingVerifications}
          icon={AlertTriangle}
          color="bg-red-500"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly Stats */}
        <Card>
          <CardHeader>
            <CardTitle>{t("monthlyStatistics") || "Monthly Statistics"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings" fill="hsl(213, 80%, 50%)" name={t("bookings") || "Bookings"} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booking Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>{t("bookingStatus") || "Booking Status Distribution"}</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={{ fontSize: 12 }} outerRadius={80} dataKey="value">
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Management Tables */}
      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="users">{t("users") || "Users"}</TabsTrigger>
          <TabsTrigger value="providers">{t("providers") || "Service Providers"}</TabsTrigger>
          <TabsTrigger value="bookings">{t("bookings") || "Bookings"}</TabsTrigger>
        </TabsList>

        {/* Users Management */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("manageUsers") || "Manage Users"}</CardTitle>
              <CardDescription>{t("viewEditDeleteUsers") || "View, edit, and delete user accounts"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-2">{t("name") || "Name"}</th>
                      <th className="text-left py-2 px-2">{t("email") || "Email"}</th>
                      <th className="text-left py-2 px-2">{t("role") || "Role"}</th>
                      <th className="text-left py-2 px-2">{t("status") || "Status"}</th>
                      <th className="text-left py-2 px-2">{t("joinDate") || "Join Date"}</th>
                      <th className="text-left py-2 px-2">{t("actions") || "Actions"}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-2">{user.name}</td>
                        <td className="py-3 px-2 text-muted-foreground">{user.email}</td>
                        <td className="py-3 px-2">
                          <Badge variant="outline">{user.role}</Badge>
                        </td>
                        <td className="py-3 px-2">
                          <Badge className={user.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                            {user.status}
                          </Badge>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">{user.joinDate}</td>
                        <td className="py-3 px-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align={isRTL ? "start" : "end"}>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Eye className="w-4 h-4" />
                                {t("view") || "View"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 cursor-pointer">
                                <Edit2 className="w-4 h-4" />
                                {t("edit") || "Edit"}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="gap-2 cursor-pointer text-red-600">
                                <Trash2 className="w-4 h-4" />
                                {t("delete") || "Delete"}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Providers Management */}
        <TabsContent value="providers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("manageProviders") || "Manage Service Providers"}</CardTitle>
              <CardDescription>
                {metrics.pendingVerifications} {t("awaitingVerification") || "providers awaiting verification"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* TODO: جلب بيانات موفري الخدمات المعلقة من API الحقيقي */}
                <p className="text-muted-foreground text-sm">{t("noPendingVerifications") || "No pending verifications"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Bookings Management */}
        <TabsContent value="bookings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("allBookings") || "All Bookings"}</CardTitle>
              <CardDescription>{t("monitorAllOrders") || "Monitor all orders across the platform"}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* TODO: جلب بيانات الحجوزات من API الحقيقي */}
                <p className="text-muted-foreground text-sm">{t("noBookings") || "No bookings found"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboardContent;
