// src/pages/Category.jsx
import React, { useEffect, useState } from "react";
import {
  Tabs,
  Table,
  Button,
  Modal,
  Input,
  Space,
  Typography,
  Popconfirm,
  Spin,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { db } from "../firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";

const Category = () => {
  /* ───────────────────────────────
     CATEGORY STATE
  ─────────────────────────────── */
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  /* ───────────────────────────────
     SUB‑CATEGORY STATE
  ─────────────────────────────── */
  const [subCategories, setSubCategories] = useState([]);
  const [isLoadingSub, setIsLoadingSub] = useState(false);

  /* ───────────────────────────────
     MODALS & FORM STATE
  ─────────────────────────────── */
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(false);

  const [subModalOpen, setSubModalOpen] = useState(false);
  const [editingSubCategory, setEditingSubCategory] = useState(null);
  const [subCategoryName, setSubCategoryName] = useState("");
  const [categoryLabels, setCategoryLabels] = useState("");
  const [subLoading, setSubLoading] = useState(false);

  /* ───────────────────────────────
     FIRESTORE LISTENERS
  ─────────────────────────────── */
  useEffect(() => {
    // main categories
    const unsub = onSnapshot(collection(db, "categories"), (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setCategories(data);
      // select first category automatically
      if (!selectedCategoryId && data.length) {
        setSelectedCategoryId(data[0].id);
      }
    });
    return unsub;
  }, [selectedCategoryId]);

  useEffect(() => {
    if (!selectedCategoryId) return;
    setIsLoadingSub(true);
    const unsub = onSnapshot(
      collection(db, "categories", selectedCategoryId, "subcategories"),
      (snap) => {
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setSubCategories(data);
        setIsLoadingSub(false);
      }
    );
    return unsub;
  }, [selectedCategoryId]);

  /* ───────────────────────────────
     CATEGORY CRUD
  ─────────────────────────────── */
  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryName("");
    setModalOpen(true);
  };

  const handleEditCategory = (record) => {
    setEditingCategory(record);
    setCategoryName(record.name);
    setModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteDoc(doc(db, "categories", id));
      toast.success("Category deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmitCategory = async () => {
    if (!categoryName.trim()) return toast.warning("Name is required");
    setLoading(true);
    try {
      if (editingCategory) {
        await updateDoc(doc(db, "categories", editingCategory.id), {
          name: categoryName,
        });
        toast.success("Category updated");
      } else {
        await addDoc(collection(db, "categories"), { name: categoryName });
        toast.success("Category created");
      }
      setModalOpen(false);
    } catch {
      toast.error("Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ───────────────────────────────
     SUB‑CATEGORY CRUD
  ─────────────────────────────── */
  const handleAddSubCategory = () => {
    setEditingSubCategory(null);
    setSubCategoryName("");
    setCategoryLabels("");
    setSubModalOpen(true);
  };

  const handleEditSubCategory = (record) => {
    setEditingSubCategory(record);
    setSubCategoryName(record.name);
    setCategoryLabels((record.labels || []).join(", "));
    setSubModalOpen(true);
  };

  const handleDeleteSubCategory = async (subId) => {
    try {
      await deleteDoc(
        doc(db, "categories", selectedCategoryId, "subcategories", subId)
      );
      toast.success("Sub‑category deleted");
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleSubmitSubCategory = async () => {
    if (!subCategoryName.trim())
      return toast.warning("Sub‑category name is required");

    setSubLoading(true);
    try {
      if (editingSubCategory) {
        await updateDoc(
          doc(
            db,
            "categories",
            selectedCategoryId,
            "subcategories",
            editingSubCategory.id
          ),
          { name: subCategoryName }
        );
        toast.success("Sub‑category updated");
      } else {
        await addDoc(
          collection(db, "categories", selectedCategoryId, "subcategories"),
          { name: subCategoryName }
        );
        toast.success("Sub‑category created");
      }
      setSubModalOpen(false);
    } catch {
      toast.error("Save failed");
    } finally {
      setSubLoading(false);
    }
  };

  /* ───────────────────────────────
     TABLE COLUMNS
  ─────────────────────────────── */
  const subCategoryColumns = [
    { title: "Sub‑category", dataIndex: "name", key: "name" },
    {
      title: "Actions",
      render: (_, record) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEditSubCategory(record)}
          />
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDeleteSubCategory(record.id)}
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ───────────────────────────────
     RENDER
  ─────────────────────────────── */
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Typography.Title level={3}>Category Management</Typography.Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddCategory}
        >
          Add Category
        </Button>
      </div>

      <Tabs
        type="card"
        activeKey={selectedCategoryId || undefined}
        onChange={setSelectedCategoryId}
      >
        {categories.map((cat) => (
          <Tabs.TabPane
            key={cat.id}
            tab={
              <span>
                {cat.name}
                <Space style={{ marginLeft: 8 }}>
                  <EditOutlined onClick={() => handleEditCategory(cat)} />
                  <Popconfirm
                    title="Delete category?"
                    onConfirm={() => handleDeleteCategory(cat.id)}
                  >
                    <DeleteOutlined style={{ color: "red" }} />
                  </Popconfirm>
                </Space>
              </span>
            }
          >
            <Button
              icon={<PlusOutlined />}
              onClick={handleAddSubCategory}
              style={{ marginBottom: 16 }}
            >
              Add Sub‑category
            </Button>

            {isLoadingSub ? (
              <div
                style={{
                  height: 200,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Spin tip="Loading…" size="large" />
              </div>
            ) : (
              <Table
                rowKey="id"
                dataSource={subCategories}
                columns={subCategoryColumns}
                size="small"
                bordered
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>

      {/* Category modal */}
      <Modal
        title={editingCategory ? "Edit Category" : "Add Category"}
        open={modalOpen}
        confirmLoading={loading}
        onOk={handleSubmitCategory}
        onCancel={() => setModalOpen(false)}
        okText={editingCategory ? "Update" : "Create"}
      >
        <Input
          placeholder="Category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
        />
      </Modal>

      {/* Sub‑category modal */}
      <Modal
        title={editingSubCategory ? "Edit Sub‑category" : "Add Sub‑category"}
        open={subModalOpen}
        confirmLoading={subLoading}
        onOk={handleSubmitSubCategory}
        onCancel={() => setSubModalOpen(false)}
        okText={editingSubCategory ? "Update" : "Create"}
      >
        <label>Sub‑category name</label>
        <Input
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          style={{ marginBottom: 10 }}
        />

        {/* <label>Labels (comma‑separated)</label>
        <Input
          value={categoryLabels}
          onChange={(e) => setCategoryLabels(e.target.value)}
        /> */}
      </Modal>
    </div>
  );
};

export default Category;
