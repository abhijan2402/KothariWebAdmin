import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input, Button, Select, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

import { toast } from "react-toastify";

const { TextArea } = Input;
const { Option } = Select;

const validationSchema = Yup.object().shape({
  products: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Product name is required"),
      description: Yup.string().required("Description is required"),
      price: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required"),
      quantity: Yup.number()
        .typeError("Price must be a number")
        .required("Price is required"),
      category: Yup.string().required("Category is required"),
      images: Yup.array()
        .min(1, "At least one image is required")
        .max(5, "You can only upload up to 5 images"),
    })
  ),
});

const BulkProductForm = () => {
  const [previewImages, setPreviewImages] = useState([[]]); // for each product row

  const handleImageChange = (e, setFieldValue, values, index) => {
    const files = Array.from(e.target.files);
    const totalSelected = values.products[index].images.length + files.length;

    if (totalSelected > 5) {
      message.error("You can only upload up to 5 images.");
      return;
    }

    const updatedFiles = [...values.products[index].images, ...files];
    const updatedPreviews = [
      ...(previewImages[index] || []),
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    const newProducts = [...values.products];
    newProducts[index].images = updatedFiles;
    setFieldValue("products", newProducts);

    const newPreviews = [...previewImages];
    newPreviews[index] = updatedPreviews;
    setPreviewImages(newPreviews);
  };

  const removeImage = (pIndex, imgIndex, setFieldValue, values) => {
    const updatedFiles = [...values.products[pIndex].images];
    const updatedPreviews = [...previewImages[pIndex]];

    updatedFiles.splice(imgIndex, 1);
    updatedPreviews.splice(imgIndex, 1);

    const newProducts = [...values.products];
    newProducts[pIndex].images = updatedFiles;
    setFieldValue("products", newProducts);

    const newPreviews = [...previewImages];
    newPreviews[pIndex] = updatedPreviews;
    setPreviewImages(newPreviews);
  };

  const handleBulkProductSubmit = async (values, { resetForm }) => {
    try {
      const formData = new FormData();

      const productsPayload = values.products.map((product) => {
        const imageKeys = product.images.map((file) => file.name); // or unique ID if you rename on server

        return {
          name: product.name,
          description: product.description,
          price: product.price,
          quantity: product.quantity || "1",
          status: product.status || "active",
          category: product.category,
          image_keys: imageKeys,
        };
      });

      // Step 1: Append product array as JSON string
      formData.append("products", JSON.stringify(productsPayload));

      // Step 2: Append all images under the same key: "images"
      values.products.forEach((product) => {
        product.images.forEach((img) => {
          formData.append("images", img);
        });
      });

    
        toast.success("Bulk products submitted successfully!");
        resetForm();
        setPreviewImages([[]]);
      
    } catch (error) {
      console.error("Bulk submission error:", error);
      toast.error("Something went wrong while submitting products.");
    }
  };

  return (
    <Formik
      initialValues={{
        products: [
          {
            name: "",
            description: "",
            price: "",
            category: "",
            quantity: "",
            status: "active",
            images: [],
          },
        ],
      }}
      validationSchema={validationSchema}
      onSubmit={handleBulkProductSubmit}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <Form>
          {values.products.map((product, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: 16,
                marginBottom: 24,
                borderRadius: 6,
              }}
            >
              <h3>Product {index + 1}</h3>

              <div style={{ marginBottom: 12 }}>
                <label>Name</label>
                <Field name={`products[${index}].name`}>
                  {({ field }) => <Input {...field} placeholder="Name" />}
                </Field>
                {touched.products?.[index]?.name &&
                  errors.products?.[index]?.name && (
                    <div style={{ color: "red" }}>
                      {errors.products[index].name}
                    </div>
                  )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Description</label>
                <Field name={`products[${index}].description`}>
                  {({ field }) => (
                    <TextArea {...field} rows={3} placeholder="Description" />
                  )}
                </Field>
                {touched.products?.[index]?.description &&
                  errors.products?.[index]?.description && (
                    <div style={{ color: "red" }}>
                      {errors.products[index].description}
                    </div>
                  )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Price</label>
                <Field name={`products[${index}].price`}>
                  {({ field }) => <Input {...field} placeholder="Price" />}
                </Field>
                {touched.products?.[index]?.price &&
                  errors.products?.[index]?.price && (
                    <div style={{ color: "red" }}>
                      {errors.products[index].price}
                    </div>
                  )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Quantity</label>
                <Field name={`products[${index}].quantity`}>
                  {({ field }) => (
                    <Input {...field} placeholder="Enter quantity" />
                  )}
                </Field>
                {touched.products?.[index]?.quantity &&
                  errors.products?.[index]?.quantity && (
                    <div style={{ color: "red" }}>
                      {errors.products[index].quantity}
                    </div>
                  )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Category</label>
                <Select
                  placeholder="Select category"
                  style={{ width: "100%" }}
                  value={product.category}
                  onChange={(value) =>
                    setFieldValue(`products[${index}].category`, value)
                  }
                >
                  <Option value="electronics">Electronics</Option>
                  <Option value="fashion">Fashion</Option>
                  <Option value="grocery">Grocery</Option>
                </Select>
                {touched.products?.[index]?.category &&
                  errors.products?.[index]?.category && (
                    <div style={{ color: "red" }}>
                      {errors.products[index].category}
                    </div>
                  )}
              </div>

              <div style={{ marginBottom: 12 }}>
                <label>Images (1–5)</label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    handleImageChange(e, setFieldValue, values, index)
                  }
                />
                {touched.products?.[index]?.images &&
                  errors.products?.[index]?.images && (
                    <div style={{ color: "red" }}>
                      {errors.products[index].images}
                    </div>
                  )}
                <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                  {(previewImages[index] || []).map((src, imgIdx) => (
                    <div key={imgIdx} style={{ position: "relative" }}>
                      <img
                        src={src}
                        alt="preview"
                        style={{ width: 80, height: 80, objectFit: "cover" }}
                      />
                      <Button
                        type="text"
                        size="small"
                        danger
                        style={{
                          position: "absolute",
                          top: 0,
                          right: 0,
                          fontWeight: "bold",
                          background: "rgba(255,255,255,0.8)",
                          border: "1px solid red",
                        }}
                        onClick={() =>
                          removeImage(index, imgIdx, setFieldValue, values)
                        }
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <Button
            type="dashed"
            onClick={() => {
              setFieldValue("products", [
                ...values.products,
                {
                  name: "",
                  description: "",
                  price: "",
                  category: "",
                  images: [],
                },
              ]);
              setPreviewImages([...previewImages, []]);
            }}
            block
            icon={<UploadOutlined />}
            style={{ marginBottom: 16 }}
          >
            Add Another Product
          </Button>

          <Button type="primary" htmlType="submit" block>
            Submit Bulk Products
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default BulkProductForm;
