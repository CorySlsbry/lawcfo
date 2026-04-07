"use client";

import { useState, useEffect } from "react";
import {
  AreaChart,
  BarChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  RefreshCw,
  DollarSign,
  TrendingUp,
  Clock,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  ChevronRight,
  Calendar,
  Briefcase,
  Scale
} from "lucide-react";

interface DashboardProps {
  dashboardData?: any;
  isLoading: boolean;
  onSync: () => void;
}

const monthlyRevenue = [
  { month: "Jan", revenue: 485000, billed: 520000, collected: 465000 },
  { month: "Feb", revenue: 510000, billed: 540000, collected: 495000 },
  { month: "Mar", revenue: 535000, billed: 560000, collected: 515000 },
  { month: "Apr", revenue: 525000, billed: 550000, collected: 510000 },
  { month: "May", revenue: 545000, billed: 575000, collected: 525000 },
  { month: "Jun", revenue: 565000, billed: 590000, collected: 545000 }
];

const utilizationData = [
  { name: "Senior Partners", utilization: 72, target: 75 },
  { name: "Associates", utilization: 78, target: 80 },
  { name: "Paralegals", utilization: 85, target: 85 },
  { name: "Jr Associates", utilization: 68, target: 70 }
];

const practiceAreaRevenue = [
  { area: "Corporate", revenue: 1250000, matters: 45 },
  { area: "Litigation", revenue: 980000, matters: 62 },
  { area: "Real Estate", revenue: 745000, matters: 38 },
  { area: "Tax", revenue: 520000, matters: 28 },
  { area: "Employment", revenue: 435000, matters: 51 }
];

const recentInvoices = [
  { id: "INV-2024-0145", client: "Tech Innovations Inc.", amount: 28500, dueDate: "2024-02-15", status: "paid", daysOutstanding: 0 },
  { id: "INV-2024-0144", client: "Global Manufacturing Co.", amount: 45200, dueDate: "2024-02-10", status: "overdue", daysOutstanding: 5 },
  { id: "INV-2024-0143", client: "Retail Solutions LLC", amount: 18750, dueDate: "2024-02-20", status: "sent", daysOutstanding: 0 },
  { id: "INV-2024-0142", client: "Healthcare Partners", amount: 62300, dueDate: "2024-02-08", status: "overdue", daysOutstanding: 7 },
  { id: "INV-2024-0141", client: "Financial Services Group", amount: 35600, dueDate: "2024-02-25", status: "draft", daysOutstanding: 0 }
];

const wipByAttorney = [
  { attorney: "Sarah Johnson", wipHours: 145, wipValue: 72500, avgAge: 28 },
  { attorney: "Michael Chen", wipHours: 112, wipValue: 67200, avgAge: 35 },
  { attorney: "Emily Davis", wipHours: 98, wipValue: 49000, avgAge: 22 },
  { attorney: "Robert Martinez", wipHours: 167, wipValue: 100200, avgAge: 45 },
  { attorney: "Jessica Brown", wipHours: 89, wipValue: 53400, avgAge: 18 }
];

const cashflowForecast = [
  { week: "Week 1", inflow: 285000, outflow: 195000, balance: 890000 },
  { week: "Week 2", inflow: 325000, outflow: 210000, balance: 1005000 },
  { week: "Week 3", inflow: 295000, outflow: 225000, balance: 1075000 },
  { week: "Week 4", inflow: 310000, outflow: 205000, balance: 1180000 }
];

const matterProfitability = [
  { matter: "ABC Corp Acquisition", revenue: 125000, costs: 78000, profit: 47000, margin: 37.6 },
  { matter: "XYZ Litigation Defense", revenue: 98000, costs: 72000, profit: 26000, margin: 26.5 },
  { matter: "Estate Planning - Smith", revenue: 45000, costs: 28000, profit: 17000, margin: 37.8 },
  { matter: "Commercial Lease Review", revenue: 32000, costs: 18000, profit: 14000, margin: 43.8 },
  { matter: "Employment Dispute Resolution", revenue: 67000, costs: 48000, profit: 19000, margin: 28.4 }
];

const COLORS = ["#0F4C81", "#1E5A8E", "#3D6FA5", "#5C84BB", "#7B99D1"];

export default function DashboardContent({ dashboardData, isLoading, onSync }: DashboardProps) {
  const [activeTab, setActiveTab] = useState("overview");
  const [syncing, setSyncing] = useState(false);

  const handleSync = async () => {
    setSyncing(true);
    await onSync();
    setSyncing(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(value);
  };

  const StatCard = ({ title, value, unit, change, icon: Icon, trend }: any) => (
    <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <Icon className="h-5 w-5 text-gray-600" />
      </div>
      <div className="flex items-baseline gap-2">
        <p className="text-2xl font-bold text-white">
          {unit === "currency" ? formatCurrency(value) : unit === "percent" ? `${value}%` : value}
        </p>
        {change !== undefined && (
          <span className={`flex items-center text-sm ${trend === "up" ? "text-green-500" : "text-red-500"}`}>
            {trend === "up" ? <ArrowUpIcon className="h-3 w-3 mr-1" /> : <ArrowDownIcon className="h-3 w-3 mr-1" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
    </div>
  );

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      paid: "bg-green-900 text-green-300 border-green-800",
      sent: "bg-blue-900 text-blue-300 border-blue-800",
      draft: "bg-gray-800 text-gray-400 border-gray-700",
      overdue: "bg-red-900 text-red-300 border-red-800"
    };

    const icons = {
      paid: <CheckCircle className="h-3 w-3 mr-1" />,
      sent: <Clock className="h-3 w-3 mr-1" />,
      draft: <FileText className="h-3 w-3 mr-1" />,
      overdue: <AlertCircle className="h-3 w-3 mr-1" />
    };

    return (
      <span className={`flex items-center px-2 py-1 rounded-full text-xs font-medium border ${styles[status as keyof typeof styles]}`}>
        {icons[status as keyof typeof icons]}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F4C81]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Financial Dashboard</h1>
            <p className="text-gray-400">Real-time insights for your law firm</p>
          </div>
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-2 px-4 py-2 bg-[#0F4C81] hover:bg-[#1E5A8E] rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
            {syncing ? "Syncing..." : "Sync Data"}
          </button>
        </div>

        <div className="flex gap-2 mb-8 border-b border-gray-800">
          {["overview", "invoices", "cashflow", "reports"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === tab
                  ? "text-[#0F4C81] border-b-2 border-[#0F4C81]"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {activeTab === "overview" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Realization Rate"
                value={92.5}
                unit="percent"
                change={2.3}
                trend="up"
                icon={TrendingUp}
              />
              <StatCard
                title="Collection Rate"
                value={94.8}
                unit="percent"
                change={-0.5}
                trend="down"
                icon={DollarSign}
              />
              <StatCard
                title="WIP Days"
                value={38}
                unit="days"
                change={5.6}
                trend="down"
                icon={Clock}
              />
              <StatCard
                title="AR Days"
                value={45}
                unit="days"
                change={3.2}
                trend="down"
                icon={Calendar}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={monthlyRevenue}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="month" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#9CA3AF" }}
                    />
                    <Area type="monotone" dataKey="collected" stackId="1" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.8} />
                    <Area type="monotone" dataKey="billed" stackId="2" stroke="#3D6FA5" fill="#3D6FA5" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Utilization by Role</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={utilizationData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="name" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${value}%`} />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#9CA3AF" }}
                    />
                    <Bar dataKey="utilization" fill="#0F4C81" />
                    <Bar dataKey="target" fill="#374151" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Revenue Per Lawyer"
                value={485000}
                unit="currency"
                change={8.5}
                trend="up"
                icon={Users}
              />
              <StatCard
                title="Profit Per Partner"
                value={625000}
                unit="currency"
                change={12.3}
                trend="up"
                icon={Briefcase}
              />
              <StatCard
                title="Operating Expense Ratio"
                value={38.5}
                unit="percent"
                change={2.1}
                trend="down"
                icon={TrendingUp}
              />
              <StatCard
                title="Avg Billing Rate"
                value={385}
                unit="currency"
                change={4.2}
                trend="up"
                icon={DollarSign}
              />
            </div>
          </div>
        )}

        {activeTab === "invoices" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <StatCard
                title="Outstanding Invoices"
                value={287500}
                unit="currency"
                icon={FileText}
              />
              <StatCard
                title="Overdue Amount"
                value={107500}
                unit="currency"
                icon={AlertCircle}
              />
              <StatCard
                title="Average Payment Time"
                value={42}
                unit="days"
                icon={Clock}
              />
            </div>

            <div className="bg-gray-900 rounded-lg border border-gray-800">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-lg font-semibold">Recent Invoices</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-800">
                      <th className="text-left p-4 font-medium text-gray-400">Invoice ID</th>
                      <th className="text-left p-4 font-medium text-gray-400">Client</th>
                      <th className="text-left p-4 font-medium text-gray-400">Amount</th>
                      <th className="text-left p-4 font-medium text-gray-400">Due Date</th>
                      <th className="text-left p-4 font-medium text-gray-400">Days Outstanding</th>
                      <th className="text-left p-4 font-medium text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentInvoices.map((invoice) => (
                      <tr key={invoice.id} className="border-b border-gray-800 hover:bg-gray-900/50">
                        <td className="p-4 font-mono text-sm">{invoice.id}</td>
                        <td className="p-4">{invoice.client}</td>
                        <td className="p-4 font-semibold">{formatCurrency(invoice.amount)}</td>
                        <td className="p-4 text-gray-400">{invoice.dueDate}</td>
                        <td className="p-4">
                          {invoice.daysOutstanding > 0 && (
                            <span className="text-red-400">{invoice.daysOutstanding} days</span>
                          )}
                        </td>
                        <td className="p-4">
                          <StatusBadge status={invoice.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Work in Progress by Attorney</h3>
              <div className="space-y-4">
                {wipByAttorney.map((attorney) => (
                  <div key={attorney.attorney} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div>
                      <p className="font-medium">{attorney.attorney}</p>
                      <p className="text-sm text-gray-400">{attorney.wipHours} unbilled hours • Avg age: {attorney.avgAge} days</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg">{formatCurrency(attorney.wipValue)}</p>
                      <p className="text-sm text-gray-400">WIP Value</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "cashflow" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                title="Current Cash Balance"
                value={1180000}
                unit="currency"
                icon={DollarSign}
              />
              <StatCard
                title="Trust Account Balance"
                value={845000}
                unit="currency"
                icon={Scale}
              />
              <StatCard
                title="30-Day Projected Cash"
                value={1425000}
                unit="currency"
                icon={TrendingUp}
              />
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">4-Week Cash Flow Forecast</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={cashflowForecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="week" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" tickFormatter={(value) => `$${value / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                    labelStyle={{ color: "#9CA3AF" }}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#0F4C81" fill="#0F4C81" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="inflow" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
                  <Area type="monotone" dataKey="outflow" stroke="#EF4444" fill="#EF4444" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Receivables Aging</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Current (0-30 days)</span>
                    <span className="font-semibold">{formatCurrency(125000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">31-60 days</span>
                    <span className="font-semibold text-yellow-500">{formatCurrency(55000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">61-90 days</span>
                    <span className="font-semibold text-orange-500">{formatCurrency(35000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Over 90 days</span>
                    <span className="font-semibold text-red-500">{formatCurrency(72500)}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-800 flex justify-between items-center">
                    <span className="font-medium">Total Outstanding</span>
                    <span className="font-bold text-lg">{formatCurrency(287500)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Payables Summary</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Vendor Payables</span>
                    <span className="font-semibold">{formatCurrency(85000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Salary & Benefits</span>
                    <span className="font-semibold">{formatCurrency(145000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Rent & Utilities</span>
                    <span className="font-semibold">{formatCurrency(32000)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Other Operating</span>
                    <span className="font-semibold">{formatCurrency(28000)}</span>
                  </div>
                  <div className="pt-3 mt-3 border-t border-gray-800 flex justify-between items-center">
                    <span className="font-medium">Total Payables</span>
                    <span className="font-bold text-lg">{formatCurrency(290000)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "reports" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Revenue by Practice Area</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={practiceAreaRevenue}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="revenue"
                      label={({ area, percent }) => `${area} ${(percent * 100).toFixed(0)}%`}
                    >
                      {practiceAreaRevenue.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151" }}
                      labelStyle={{ color: "#9CA3AF" }}
                      formatter={(value: any) => formatCurrency(value)}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
                <h3 className="text-lg font-semibold mb-4">Matter Profitability Analysis</h3>
                <div className="space-y-3">
                  {matterProfitability.map((matter) => (
                    <div key={matter.matter} className="p-3 bg-gray-800 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium text-sm">{matter.matter}</p>
                        <span className={`text-xs px-2 py-1 rounded ${
                          matter.margin >= 35 ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"
                        }`}>
                          {matter.margin.toFixed(1)}% margin
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div>
                          <p className="text-gray-400">Revenue</p>
                          <p className="font-semibold">{formatCurrency(matter.revenue)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Costs</p>
                          <p className="font-semibold">{formatCurrency(matter.costs)}</p>
                        </div>
                        <div>
                          <p className="text-gray-400">Profit</p>
                          <p className="font-semibold text-green-400">{formatCurrency(matter.profit)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 border border-gray-800">
              <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-800 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Leverage Ratio</span>
                    <span className="text-xs text-gray-500">Target: 3:1</span>
                  </div>
                  <p className="text-2xl font-bold">2.8:1</p>
                  <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0F4C81] rounded-full" style={{ width: "93%" }}></div>
                  </div>
                </div>
                <div className="p-4 bg-gray-800 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Trust Reconciliation</span>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold">$0</p>
                  <p className="text-xs text-green-400 mt-1">Fully reconciled</p>
                </div>
                <div className="p-4 bg-gray-800 rounded">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">YTD Growth</span>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <p className="text-2xl font-bold">18.5%</p>
                  <p className="text-xs text-gray-500 mt-1">vs. prior year</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-between">
                <span>P&L Statement</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-between">
                <span>Balance Sheet</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-between">
                <span>Cash Flow</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
              <button className="p-4 bg-gray-900 border border-gray-800 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-between">
                <span>Partner Report</span>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}