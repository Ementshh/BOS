import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface FundAllocationChartProps {
  data: {
    name: string;
    allocated: number;
    used: number;
    remaining: number;
  }[];
}

const FundAllocationChart: React.FC<FundAllocationChartProps> = ({ data }) => {
  // Function to format large numbers with K, M, B suffixes
  const formatYAxisTick = (value: number) => {
    if (value >= 1000000000) {
      return `${(value / 1000000000).toFixed(1)}B`;
    }
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-72">
      <h3 className="text-lg font-semibold mb-4">BOS Fund Allocation</h3>
      <ResponsiveContainer width="100%" height="85%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            tickFormatter={formatYAxisTick}
            tick={{ fontSize: 12 }} // Reduced font size
            width={60} // Set a fixed width for the Y-axis
          />
          <Tooltip
            formatter={(value: number) =>
              new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(value)
            }
          />
          <Legend />
          <Bar dataKey="allocated" fill="#0052CC" name="Allocated" />
          <Bar dataKey="used" fill="#00B8D9" name="Used" />
          <Bar dataKey="remaining" fill="#36B37E" name="Remaining" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FundAllocationChart;
