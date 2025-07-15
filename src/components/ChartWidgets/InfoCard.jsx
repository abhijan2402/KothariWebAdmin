// src/components/ChartWidgets/InfoCard.js
import React from "react";
import { Card } from "antd";
import "../../Styles/ChartWidgets.css";

export default function InfoCard({ title, value, icon, color }) {
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
