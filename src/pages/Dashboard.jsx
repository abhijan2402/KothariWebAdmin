import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase"; // Make sure this path matches your setup

export default function Dashboard() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      setProductCount(snap.size);
    });
    return () => unsub();
  }, []);

  return (
    <div
      style={{
        padding: "40px 20px",
        background: "#f9f9f9",
        minHeight: "100vh",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: "36px", fontWeight: "bold", color: "#1a1a1a" }}>
          WELCOME TO <span style={{ color: "#b81b2c" }}>KOTHARI GEMS</span>
        </h1>
        <p
          style={{
            fontSize: "18px",
            maxWidth: 800,
            margin: "10px auto",
            color: "#555",
          }}
        >
          Discover timeless treasures and elegant natural stones crafted for
          royalty. We bring you authenticity, rarity, and refined luxury through
          our exquisite gem collection.
        </p>
      </div>

      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #fff0f6, #e6f7ff)",
              borderRadius: 16,
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "40px",
                color: "#722ed1",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <AppstoreOutlined />
              <div
                style={{ display: "flex", alignItems: "center", gap: "10px" }}
              >
                <h3 style={{ fontSize: "30px", color: "#333" }}>
                  Total Products
                </h3>
                <p
                  style={{
                    fontSize: "30px",
                    fontWeight: "bold",
                    color: "#2f54eb",
                    margin: 0,
                  }}
                >
                  {productCount}
                </p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
