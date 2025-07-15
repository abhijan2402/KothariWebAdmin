import React from "react";
import { useTheme } from "../../context/ThemeContext";
import { Switch } from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import "./Topbar.css";

export default function Topbar({ collapsed }) {
  const { darkMode, setDarkMode } = useTheme();

  const dynamicPadding = collapsed ? "0px 20px 0px 50px" : "0px 20px 0px 210px";

  return (
    <div className="topbar" style={{ padding: dynamicPadding }}>
      <h2 className="logo">Admin Panel</h2>

      <div className="topbar-controls">
        <div className="theme-toggle">
          <Switch
            checked={darkMode}
            onChange={(checked) => setDarkMode(checked)}
            checkedChildren={<MoonOutlined />}
            unCheckedChildren={<SunOutlined />}
          />
        </div>
      </div>
    </div>
  );
}
