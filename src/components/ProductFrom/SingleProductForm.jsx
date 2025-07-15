import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Button, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import { db, storage } from "../../firebase"; //  ← if you post to Firestore / Storage
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const { TextArea } = Input;

/* ─────────────────────────  validation  ───────────────────────── */
const validationSchema = Yup.object().shape({
  title: Yup.string().required("Title is required"),
  description: Yup.string().required("Description is required"),
  price: Yup.number().typeError("Must be a number").required("Price required"),
  origin: Yup.string().required("Origin is required"),
  images: Yup.array().min(1, "At least one image").max(5, "Max 5 images"),
});

/* ─────────────────────────  component  ───────────────────────── */
export default function SingleProductForm() {
  const [preview, setPreview] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  /* helper: add / replace images */
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

  /* handle submit — pushes images to Storage, then doc to Firestore */
  const handleSubmit = async (vals, { resetForm }) => {
    setSubmitting(true);
    try {
      // 1️⃣ upload each image and collect URLs
      const urls = await Promise.all(
        vals.images.map(async (file) => {
          const imgRef = ref(storage, `products/${Date.now()}-${file.name}`);
          await uploadBytes(imgRef, file);
          return await getDownloadURL(imgRef);
        })
      );

      // 2️⃣ save product document
      await addDoc(collection(db, "products"), {
        title: vals.title,
        description: vals.description,
        price: Number(vals.price),
        origin: vals.origin,
        images: urls,
        created_at: Date.now(),
      });

      toast.success("Product created!");
      resetForm();
      setPreview([]);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create product");
    } finally {
      setSubmitting(false);
    }
  };

  /* ─────────────────────────  render  ───────────────────────── */
  return (
    <Formik
      initialValues={{
        title: "",
        description: "",
        price: "",
        origin: "",
        images: [],
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

            {/* previews */}
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
