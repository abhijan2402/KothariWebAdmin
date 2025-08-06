// src/pages/Product/ProductList.jsx
import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Button,
  Modal,
  Image,
  Tag,
  Popconfirm,
  Space,
  Row,
  Col,
  Input,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  StopOutlined,
  CheckCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";
import { db } from "../../firebase";
import EditProductModal from "../../components/ProductFrom/EditProductModal";

export default function ProductList() {
  /* ─────────────────────────────  state  ───────────────────────────── */
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  /* ────────────────────────  firestore listener  ───────────────────── */
  useEffect(() => {
    if (!searchTerm.trim()) {
      const q = query(
        collection(db, "products"),
        orderBy("created_at", "desc")
      );
      return onSnapshot(q, (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    } else {
      const q = query(
        collection(db, "products"),
        orderBy("title"),
        startAt(searchTerm),
        endAt(searchTerm + "\uf8ff")
      );
      return onSnapshot(q, (snap) => {
        setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      });
    }
  }, [searchTerm]);

  /* ─────────────────────────  derived list  ────────────────────────── */
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return products;
    const term = searchTerm.toLowerCase();
    return products.filter(
      (p) =>
        p.title?.toLowerCase().includes(term) ||
        p.description?.toLowerCase().includes(term) ||
        p.origin?.toLowerCase().includes(term)
    );
  }, [products, searchTerm]);

  /* ────────────────────────  handlers  ─────────────────────────────── */
  const handleImageClick = (imgs) => {
    setModalImages(imgs);
    setIsModalVisible(true);
  };

  // const handleStatusToggle = async (prod) => {
  //   const next = prod.status === "active" ? "block" : "active";
  //   try {
  //     await updateDoc(doc(db, "products", prod.id), { status: next });
  //     message.success("Status updated");
  //   } catch {
  //     message.error("Failed to update status");
  //   }
  // };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      message.success("Deleted");
    } catch {
      message.error("Delete failed");
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setEditModalVisible(true);
  };

  console.log(products)

  /* ───────────────────────────  columns  ───────────────────────────── */
  const columns = [
    {
      title: "Image",
      dataIndex: "images",
      render: (imgs) =>
        imgs?.[0] ? (
          <Image
            src={imgs[0]}
            width={80}
            height={60}
            preview={false}
            style={{ cursor: "pointer", borderRadius: 4 }}
            onClick={() => handleImageClick(imgs)}
          />
        ) : (
          "—"
        ),
      width: 120,
    },
    { title: "Title", dataIndex: "title", width: 180 },
    {
      title: "Price (₹)",
      dataIndex: "price",
      render: (v) => v?.toLocaleString("en-IN") ?? "0",
      width: 140,
    },
    { title: "Origin", dataIndex: "origin", width: 120 },
    {
      title: "Description",
      dataIndex: "description",
      ellipsis: true,
      width: 280,
    },
    {
      title: "Category",
      dataIndex: "categoryName",
      ellipsis: true,
      width: 280,
      render: (value) => <div>{value || "--"}</div>,
    },
    {
      title: "Sub-Category",
      dataIndex: "subcategoryName",
      ellipsis: true,
      width: 280,
      render: (value) => <div>{value || "--"}</div>,
    },
    {
      title: "Actions",
      render: (_, rec) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(rec)}
            type="primary"
          />
          {/* <Button
            icon={
              rec.status === "active" ? (
                <StopOutlined />
              ) : (
                <CheckCircleOutlined />
              )
            }
            style={{
              background: rec.status === "active" ? "#ff4d4f" : "#2dba4e",
              borderColor: rec.status === "active" ? "#ff4d4f" : "#2dba4e",
              color: "#fff",
            }}
            onClick={() => handleStatusToggle(rec)}
          /> */}
          <Popconfirm
            title="Delete this product?"
            onConfirm={() => handleDelete(rec.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ───────────────────────────  render  ────────────────────────────── */
  return (
    <div style={{ padding: 20 }}>
      <Row justify="space-between" style={{ marginBottom: 20 }}>
        <Col>
          <h2>Product List</h2>
        </Col>
        <Col>
          <Input.Search
            placeholder="Search…"
            value={searchTerm}
            allowClear
            enterButton={<SearchOutlined />}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
      </Row>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={filtered}
        pagination={{ pageSize: 10 }}
        scroll={{ x: 1000 }}
      />

      {/* Image lightbox */}
      <Modal
        open={isModalVisible}
        footer={null}
        onCancel={() => setIsModalVisible(false)}
        width={800}
        centered
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))",
            gap: 12,
          }}
        >
          {(modalImages || []).slice(0, 5).map((img, i) => (
            <img
              key={i}
              src={img}
              alt="product"
              style={{ width: "100%", borderRadius: 6, objectFit: "cover" }}
            />
          ))}
        </div>
      </Modal>

      <EditProductModal
        editModalVisible={editModalVisible}
        editRecord={editRecord}
        setEditModalVisible={setEditModalVisible}
      />
    </div>
  );
}
