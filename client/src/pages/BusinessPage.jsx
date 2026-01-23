import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router";
import { fetchBusinessById } from "../store/businessSlice";
import { fetchLatestSummary, generateInsight, sendEmailReport } from "../store/aiInsightSlice";
import { fetchDashboard } from "../store/analyticsSlice";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
} from "recharts";
import BusinessSidebar from "../components/BusinessSidebar";
import StatCard from "../components/StatCard";
import AIInsightCard from "../components/AIInsightCard";
import ChartCard from "../components/ChartCard";

export default function BusinessPage() {
  const { businessId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [randomIndex, setRandomIndex] = useState(() => null);
  const [hasAttemptedGeneration, setHasAttemptedGeneration] = useState(false);

  const { selectedBusiness, loading: businessLoading } = useSelector((state) => state.business);
  const {
    latestSummary,
    generating,
    sendingEmail,
    loading: aiLoading,
    error: aiError,
  } = useSelector((state) => state.aiInsight);
  const { dashboard, loading: analyticsLoading } = useSelector((state) => state.analytics);
  const { isAuthenticated } = useSelector((state) => state.auth);

  console.log("Latest Summary:", latestSummary);

  // Update random index when latestSummary changes
  useEffect(() => {
    const randomIndex = () => {
      if (latestSummary?.summary?.insights?.length > 0) {
        setRandomIndex(Math.floor(Math.random() * latestSummary.summary.insights.length));
      } else {
        setRandomIndex(null);
      }
    };
    randomIndex();
  }, [latestSummary]);

  // Derived insight from the random index
  const randomInsight =
    randomIndex !== null && latestSummary?.summary?.insights ? latestSummary.summary.insights[randomIndex] : null;

  const handleGenerateInsights = async () => {
    if (businessId) {
      setEmailSent(false); // Reset email sent status when generating new insights
      setHasAttemptedGeneration(true); // Track that user attempted generation
      await dispatch(generateInsight({ businessId, params: { type: "daily" } }));
      // Refresh the latest summary after generation
      dispatch(fetchLatestSummary(businessId));
    }
  };

  const handleSendEmail = async () => {
    if (businessId && latestSummary?.insightId) {
      const result = await dispatch(sendEmailReport({ businessId, id: latestSummary.insightId }));
      if (result.type.endsWith("/fulfilled")) {
        setEmailSent(true);
      }
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (businessId) {
      setHasAttemptedGeneration(false); // Reset on business change
      dispatch(fetchBusinessById(businessId));
      dispatch(fetchLatestSummary(businessId));
      dispatch(fetchDashboard(businessId));
    }
  }, [dispatch, businessId, isAuthenticated, navigate]);

  if (businessLoading || analyticsLoading || aiLoading || !dashboard) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <BusinessSidebar
        business={selectedBusiness}
        businessId={businessId}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of your business performance</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 space-y-6">
          {/* AI Insight Summary */}
          <AIInsightCard
            insight={randomInsight}
            insightId={latestSummary?.insightId}
            onGenerate={handleGenerateInsights}
            onSendEmail={handleSendEmail}
            isGenerating={generating}
            isSendingEmail={sendingEmail}
            error={hasAttemptedGeneration ? aiError : null}
            emailSent={emailSent}
          />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              }
              title="Total Income"
              value={`Rp ${dashboard.summary.totalIncome?.toLocaleString() || 0}`}
              bgColor="bg-blue-100"
              iconColor="text-blue-600"
            />

            <StatCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              }
              title="Net Profit"
              value={`Rp ${dashboard.summary.netProfit?.toLocaleString() || 0}`}
              bgColor={dashboard.summary.netProfit >= 0 ? "bg-green-100" : "bg-red-100"}
              iconColor={dashboard.summary.netProfit >= 0 ? "text-green-600" : "text-red-600"}
            />

            <StatCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              }
              title="Total Transactions"
              value={dashboard.summary.totalTransactions || 0}
              bgColor="bg-purple-100"
              iconColor="text-purple-600"
            />

            <StatCard
              icon={
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              }
              title="Total Products"
              value={dashboard.summary.totalProducts || 0}
              bgColor="bg-orange-100"
              iconColor="text-orange-600"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions Chart */}
            {dashboard?.recentTransactions && dashboard.recentTransactions.length > 0 && (
              <ChartCard title="Income vs Expense Trend">
                <ResponsiveContainer width="100%" height={300}>
                  <ComposedChart
                    data={dashboard.recentTransactions
                      .slice(0, 10)
                      .reverse()
                      .map((txn) => ({
                        date: new Date(txn.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                        income: txn.type === "income" ? txn.totalAmount : 0,
                        expense: txn.type === "expense" ? -txn.totalAmount : 0,
                        netProfit: txn.type === "income" ? txn.totalAmount : -txn.totalAmount,
                      }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" style={{ fontSize: "12px" }} />
                    <YAxis style={{ fontSize: "12px" }} />
                    <Tooltip
                      contentStyle={{ fontSize: "12px" }}
                      formatter={(value) => {
                        return `Rp ${Math.abs(value).toLocaleString()}`;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="income" fill="#10B981" name="Income" />
                    <Bar dataKey="expense" fill="#EF4444" name="Expense" />
                    <Line type="monotone" dataKey="netProfit" stroke="#3B82F6" strokeWidth={2} name="Net Profit" />
                  </ComposedChart>
                </ResponsiveContainer>
              </ChartCard>
            )}

            {/* Top Products Chart */}
            {dashboard?.topProducts && dashboard.topProducts.length > 0 && (
              <ChartCard title="Top Selling Products">
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={dashboard.topProducts.map((item) => ({
                      name: item.Product.name,
                      totalSold: parseInt(item.totalQuantitySold),
                      revenue: item.totalRevenue,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" style={{ fontSize: "12px" }} />
                    <YAxis style={{ fontSize: "12px" }} />
                    <Tooltip contentStyle={{ fontSize: "12px" }} />
                    <Legend wrapperStyle={{ fontSize: "12px" }} />
                    <Bar dataKey="totalSold" fill="#3B82F6" name="Units Sold" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            )}
          </div>

          {/* Product Performance Pie Chart */}
          {dashboard?.topProducts && dashboard.topProducts.length > 0 && (
            <ChartCard title="Revenue by Product">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={dashboard.topProducts.map((item) => ({
                      name: item.Product.name,
                      totalRevenue: item.totalRevenue,
                    }))}
                    dataKey="totalRevenue"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => {
                      const total = dashboard.topProducts.reduce((sum, p) => sum + p.totalRevenue, 0);
                      return `${entry.name}: ${((entry.totalRevenue / total) * 100).toFixed(1)}%`;
                    }}
                  >
                    {dashboard.topProducts.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          )}
        </div>
      </main>
    </div>
  );
}
