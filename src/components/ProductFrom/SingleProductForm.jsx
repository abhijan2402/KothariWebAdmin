import React, { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Button, message, Select, Spin, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase";
import {
  addDoc,
  collection,
  getDocs,
  doc,
  getDoc,
  query,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { TextArea } = Input;
const { Option } = Select;

/* ─────────────────────────  validation  ───────────────────────── */
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().typeError("Must be a number").required("Price required"),
  origin: Yup.string().required("Origin is required"),
  categoryId: Yup.string().required("Category is required"),
  subcategoryId: Yup.string().required("Subcategory is required"),
  images: Yup.array().min(1, "At least one image").max(5, "Max 5 images"),
});

export default function SingleProductForm() {
  const [preview, setPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loadingSubcats, setLoadingSubcats] = useState(false);

  /* 🔁 Load categories on mount */
  useEffect(() => {
    const fetchCategories = async () => {
      const catSnap = await getDocs(collection(db, "categories"));
      const catList = catSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(catList);
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = async (categoryId, setFieldValue) => {
    setFieldValue("categoryId", categoryId);
    setFieldValue("subcategoryId", null); // reset subcategory
    setLoadingSubcats(true);
    try {
      const subSnap = await getDocs(
        collection(db, "categories", categoryId, "subcategories")
      );
      const subList = subSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setSubcategories(subList);
    } catch (err) {
      toast.error("Failed to load subcategories");
    } finally {
      setLoadingSubcats(false);
    }
  };

  const handleImageChange = (e, setFieldValue, values) => {
    const files = Array.from(e.target.files);
    const total = files.length + values.images.length;
    if (total > 5) {
      message.error("You can only upload up to 5 images.");
      return;
    }
    setFieldValue("images", [...values.images, ...files]);
    setPreview([...preview, ...files.map((f) => URL.createObjectURL(f))]);
  };

  const removeImage = (idx, setFieldValue, values) => {
    const newFiles = [...values.images];
    const newPreview = [...preview];
    newFiles.splice(idx, 1);
    newPreview.splice(idx, 1);
    setFieldValue("images", newFiles);
    setPreview(newPreview);
  };

  const handleSubmit = async (vals, { resetForm }) => {
    setSubmitting(true);
    try {
      // 🔍 Get category name
      const categoryRef = doc(db, "categories", vals.categoryId);
      const categorySnap = await getDoc(categoryRef);
      const categoryName = categorySnap.exists()
        ? categorySnap.data().name
        : "";

      // 🔍 Get subcategory name
      const subcategoryRef = doc(
        db,
        "categories",
        vals.categoryId,
        "subcategories",
        vals.subcategoryId
      );
      const subcategorySnap = await getDoc(subcategoryRef);
      const subcategoryName = subcategorySnap.exists()
        ? subcategorySnap.data().name
        : "";

      // Upload images
      const urls = await Promise.all(
        vals.images.map(async (file) => {
          const imgRef = ref(storage, `products/${Date.now()}-${file.name}`);
          await uploadBytes(imgRef, file);
          return await getDownloadURL(imgRef);
        })
      );

      // Add product
      await addDoc(collection(db, "products"), {
        title: vals.title,
        description: vals.description,
        price: Number(vals.price),
        origin: vals.origin,
        images: urls,
        categoryId: vals.categoryId,
        categoryName: categoryName,
        subcategoryId: vals.subcategoryId,
        subcategoryName: subcategoryName,
        isFeatured: vals.isFeatured,
        created_at: Date.now(),
      });

      toast.success("Product created!");
      resetForm();
      setPreview([]);
      setSubcategories([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        price: "",
        origin: "",
        images: [],
        categoryId: null,
        subcategoryId: null,
        isFeatured: false,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, errors, touched }) => (
        <Form>
          {/* Title */}
          <div style={{ marginBottom: 16 }}>
            <label>Title</label>
            <Field name="title" as={Input} placeholder="Natural Ruby" />
            {touched.title && errors.title && (
              <div style={{ color: "red" }}>{errors.title}</div>
            )}
          </div>

          {/* Description */}
          <div style={{ marginBottom: 16 }}>
            <label>Description</label>
            <Field
              name="description"
              as={TextArea}
              rows={3}
              placeholder="Deep red ruby known for elegance & energy."
            />
            {touched.description && errors.description && (
              <div style={{ color: "red" }}>{errors.description}</div>
            )}
          </div>

          {/* Price */}
          <div style={{ marginBottom: 16 }}>
            <label>Price (₹)</label>
            <Field name="price" as={Input} placeholder="25000" />
            {touched.price && errors.price && (
              <div style={{ color: "red" }}>{errors.price}</div>
            )}
          </div>

          {/* Origin */}
          <div style={{ marginBottom: 16 }}>
            <label>Origin</label>
            <Field name="origin" as={Input} placeholder="Burma" />
            {touched.origin && errors.origin && (
              <div style={{ color: "red" }}>{errors.origin}</div>
            )}
          </div>

          {/* Category Dropdown */}
          <div style={{ marginBottom: 16 }}>
            <label>Category</label>
            <Select
              value={values.categoryId}
              onChange={(value) => handleCategoryChange(value, setFieldValue)}
              style={{ width: "100%" }}
              placeholder="Select Category"
            >
              {categories.map((cat) => (
                <Option key={cat.id} value={cat.id}>
                  {cat.name}
                </Option>
              ))}
            </Select>
            {touched.categoryId && errors.categoryId && (
              <div style={{ color: "red" }}>{errors.categoryId}</div>
            )}
          </div>

          {/* Subcategory Dropdown */}
          <div style={{ marginBottom: 16 }}>
            <label>Subcategory</label>
            <Select
              value={values.subcategoryId}
              onChange={(value) => setFieldValue("subcategoryId", value)}
              style={{ width: "100%" }}
              placeholder="Select Subcategory"
              disabled={!values.categoryId}
              loading={loadingSubcats}
            >
              {subcategories.map((sub) => (
                <Option key={sub.id} value={sub.id}>
                  {sub.name}
                </Option>
              ))}
            </Select>
            {touched.subcategoryId && errors.subcategoryId && (
              <div style={{ color: "red" }}>{errors.subcategoryId}</div>
            )}
          </div>

          {/* Images */}
          <div style={{ marginBottom: 16 }}>
            <label>Images (1–5)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleImageChange(e, setFieldValue, values)}
            />
            {touched.images && errors.images && (
              <div style={{ color: "red" }}>{errors.images}</div>
            )}

            <div style={{ display: "flex", marginTop: 12, flexWrap: "wrap" }}>
              {preview.map((src, i) => (
                <div key={i} style={{ marginRight: 8, position: "relative" }}>
                  <img
                    src={src}
                    alt={`preview-${i}`}
                    style={{ width: 80, height: 80, objectFit: "cover" }}
                  />
                  <Button
                    type="text"
                    danger
                    size="small"
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      background: "rgba(255,255,255,.7)",
                      border: "1px solid red",
                    }}
                    onClick={() => removeImage(i, setFieldValue, values)}
                  >
                    ×
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Is Featured Toggle */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", marginBottom: 4 }}>
              Featured Product (optional)
            </label>
            <Switch
              checked={values.isFeatured}
              onChange={(checked) => setFieldValue("isFeatured", checked)}
            />
          </div>

          {/* Submit */}
          <Button
            type="primary"
            htmlType="submit"
            icon={<PlusOutlined />}
            style={{ width: "100%" }}
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Create Product"}
          </Button>
        </Form>
      )}
    </Formik>
  );
}
