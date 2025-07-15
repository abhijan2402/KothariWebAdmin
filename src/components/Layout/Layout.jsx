import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import Topbar from "../Topbar/Topbar";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);

  const sidebarWidth = collapsed ? 50 : 210;

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <div style={{ width: sidebarWidth, transition: "width 0.3s" }}>
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          openMenu={openMenu}
          setOpenMenu={setOpenMenu}
        />
      </div>

      {/* Main Content Area */}
      <div
        style={{
          width: `calc(100% - ${sidebarWidth}px)`,
          transition: "width 0.3s",
          display: "flex",
          flexDirection: "column",
          // overflow: "hidden",
        }}
      >
        <Topbar collapsed={collapsed} />
        <main className="main-outlet" style={{ flexGrow: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
