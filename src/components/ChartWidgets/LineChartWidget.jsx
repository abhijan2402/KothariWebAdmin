// src/components/ChartWidgets.js
import React from "react";
import { Card } from "antd";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import "../../Styles/ChartWidgets.css";

/** Info Card Widget **/
export function InfoCard({ title, value, icon, color }) {
  return (
    <Card className="info-card" style={{ backgroundColor: color }}>
      <div className="info-card-body">
        <div className="info-card-icon">{icon}</div>
        <div>
          <h4 className="info-card-title">{title}</h4>
          <p className="info-card-value">{value}</p>
        </div>
      </div>
    </Card>
  );
}

/** Line Chart Widget **/
export function LineChartWidget({ title, data, dataKey }) {
  return (
    <Card className="chart-widget">
      <h4 className="chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#1890ff"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </Card>
  );
}

/** Pie Chart Widget **/
export function PieChartWidget({ title, data, dataKey, nameKey, colors = [] }) {
  return (
    <Card className="chart-widget">
      <h4 className="chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={nameKey}
            cx="50%"
            cy="50%"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={colors[index % colors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </Card>
  );
}

/** Bar Chart Widget **/
export function BarChartWidget({
  title,
  data,
  dataKey,
  labelKey,
  barColor = "#722ed1",
}) {
  return (
    <Card className="chart-widget">
      <h4 className="chart-title">{title}</h4>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={labelKey} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={dataKey} fill={barColor} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
