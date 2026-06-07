import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { getTrafficDistribution, getTrafficTrendByTime } from "@/data/trafficData";
import { BarChart3 } from "lucide-react";

const COLORS = { HIGH: "#ef4444", MEDIUM: "#f59e0b", LOW: "#22c55e" };

export default function TrafficCharts() {
  const dist = getTrafficDistribution();
  const trend = getTrafficTrendByTime();
  const pieData = [
    { name: "High", value: dist.HIGH, fill: COLORS.HIGH },
    { name: "Medium", value: dist.MEDIUM, fill: COLORS.MEDIUM },
    { name: "Low", value: dist.LOW, fill: COLORS.LOW },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-2">
        <BarChart3 className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground">Charts & Visualization</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="glass rounded-xl p-5">
          <h4 className="text-sm font-bold text-foreground mb-4">Traffic Level Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={pieData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(222 44% 9%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "8px", color: "hsl(210 40% 92%)" }} />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart */}
        <div className="glass rounded-xl p-5">
          <h4 className="text-sm font-bold text-foreground mb-4">Traffic Composition</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} stroke="none" />)}
              </Pie>
              <Tooltip contentStyle={{ background: "hsl(222 44% 9%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "8px", color: "hsl(210 40% 92%)" }} />
              <Legend wrapperStyle={{ color: "hsl(210 40% 92%)", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart */}
        <div className="glass rounded-xl p-5 lg:col-span-2">
          <h4 className="text-sm font-bold text-foreground mb-4">Traffic Trends by Time Slot</h4>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 30% 18%)" />
              <XAxis dataKey="slot" stroke="hsl(215 20% 55%)" fontSize={11} />
              <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(222 44% 9%)", border: "1px solid hsl(222 30% 18%)", borderRadius: "8px", color: "hsl(210 40% 92%)" }} />
              <Legend wrapperStyle={{ color: "hsl(210 40% 92%)", fontSize: 12 }} />
              <Line type="monotone" dataKey="high" stroke={COLORS.HIGH} strokeWidth={2} dot={{ fill: COLORS.HIGH, r: 4 }} name="High" />
              <Line type="monotone" dataKey="medium" stroke={COLORS.MEDIUM} strokeWidth={2} dot={{ fill: COLORS.MEDIUM, r: 4 }} name="Medium" />
              <Line type="monotone" dataKey="low" stroke={COLORS.LOW} strokeWidth={2} dot={{ fill: COLORS.LOW, r: 4 }} name="Low" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
