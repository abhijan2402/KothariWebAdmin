import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaBoxOpen,
  FaLifeRing,
  FaShoppingCart,
  FaCog,
  FaUserTie,
  FaUserAlt,
  FaTruck,
  FaPlus,
  FaList,
} from "react-icons/fa";
import { IoMdArrowDropdown, IoMdArrowDropright } from "react-icons/io";
import "./Sidebar.css";
import { BiSolidCategory } from "react-icons/bi";

const menuItems = [
  {
    name: "Dashboard",
    icon: <FaTachometerAlt />,
    path: "/",
  },
  {
    name: "Category",
    icon: <BiSolidCategory />,
    path: "category",
  },

  {
    name: "Products",
    icon: <FaBoxOpen />,
    children: [
      { name: "Create Product", icon: <FaPlus />, path: "/products/create" },
      { name: "Product List", icon: <FaList />, path: "/products/list" },
    ],
  },

  {
    name: "Settings",
    icon: <FaCog />,
    children: [
      {
        name: "Privacy Policy Editor",
        icon: <FaPlus />,
        path: "/settings/privacypolicy",
      },
    ],
  },
];

export default function Sidebar({ setCollapsed, collapsed }) {
  const location = useLocation();
  // const [collapsed, setCollapsed] = useState(false);
  const [openMenu, setOpenMenu] = useState("Dashboard");

  // Automatically open parent if a child is active
  useEffect(() => {
    let matched = false;
    menuItems.forEach((item) => {
      if (item.children) {
        const activeChild = item.children.find((child) =>
          location.pathname.startsWith(child.path)
        );
        if (activeChild) {
          setOpenMenu(item.name);
          matched = true;
        }
      } else if (location.pathname === item.path) {
        setOpenMenu(item.name);
        matched = true;
      }
    });

    // Default to Dashboard if nothing else matched
    if (!matched) {
      setOpenMenu("Dashboard");
    }
  }, [location.pathname]);

  const toggleCollapse = () => setCollapsed(!collapsed);

  const handleDropdown = (name) => {
    setOpenMenu((prev) => (prev === name ? null : name));
  };

  const isChildActive = (children) => {
    return children.some((child) => location.pathname.startsWith(child.path));
  };

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="toggle-btn" onClick={toggleCollapse}>
        <span>&#9776;</span>
      </div>
      <nav>
        {menuItems.map((item, index) => {
          const hasChildren = !!item.children;
          const isOpen = openMenu === item.name;
          const isActiveParent =
            location.pathname === item.path ||
            (hasChildren && isChildActive(item.children));

          return (
            <div key={index}>
              {hasChildren ? (
                <>
                  <div
                    className={`menu-item ${isOpen ? "open" : ""} ${
                      isActiveParent ? "active" : ""
                    }`}
                    onClick={() => handleDropdown(item.name)}
                  >
                    <span
                      className="icon"
                      onClick={() => {
                        if (!isOpen) setOpenMenu(item.name);
                        toggleCollapse();
                      }}
                    >
                      {item.icon}
                    </span>
                    {!collapsed && <span>{item.name}</span>}
                    {!collapsed &&
                      (isOpen ? (
                        <IoMdArrowDropdown className="dropdown-icon" />
                      ) : (
                        <IoMdArrowDropright className="dropdown-icon" />
                      ))}
                  </div>
                  {isOpen &&
                    !collapsed &&
                    item.children.map((child, i) => (
                      <Link
                        key={i}
                        to={child.path}
                        className={`submenu-item ${
                          location.pathname === child.path ? "active" : ""
                        }`}
                        // onClick={() => setCollapsed(true)}
                      >
                        <span className="icon">{child.icon}</span>
                        <span>{child.name}</span>
                      </Link>
                    ))}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`menu-item ${isActiveParent ? "active" : ""}`}
                  // onClick={() => setCollapsed(true)}
                >
                  <span className="icon">{item.icon}</span>
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )}
            </div>
          );
        })}
      </nav>
    </div>
  );
}
