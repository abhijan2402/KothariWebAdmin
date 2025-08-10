import React, { useState } from "react";
import { Modal, Input, Button, Form as AntForm, Switch } from "antd";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../firebase";

const EditProductModal = ({
  editModalVisible,
  editRecord,
  setEditModalVisible,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const uploadImagesToFirebase = async (images) => {
    const uploadPromises = images.map((image) => {
      const storageRef = ref(storage, `products/${Date.now()}-${image.name}`);
      return uploadBytes(storageRef, image).then(() =>
        getDownloadURL(storageRef)
      );
    });
    return Promise.all(uploadPromises);
  };

  const handleUpdate = async (values) => {
    setIsSubmitting(true);
    try {
      let uploadedImageURLs = editRecord.images || [];

      if (values.images.length > 0) {
        const newImageURLs = await uploadImagesToFirebase(values.images);
        uploadedImageURLs = [...uploadedImageURLs, ...newImageURLs].slice(0, 5);
      }

      const updatedData = {
        title: values.title,
        description: values.description,
        origin: values.origin,
        price: Number(values.price),
        images: uploadedImageURLs,
      };

      const productRef = doc(db, "products", editRecord.id);
      await updateDoc(productRef, updatedData);

      toast.success("Product updated successfully");
      setEditModalVisible(false);
    } catch (error) {
      console.error("Error updating product:", error);
      toast.error("Failed to update product");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      open={editModalVisible}
      title="Edit Product"
      onCancel={() => setEditModalVisible(false)}
      footer={null}
    >
      {editRecord && (
        <Formik
          initialValues={{
            title: editRecord?.title || "",
            description: editRecord?.description || "",
            origin: editRecord?.origin || "",
            price: editRecord?.price || "",
            images: [],
            isFeatured: editRecord?.isFeatured ?? false,
          }}
          validationSchema={Yup.object({
            title: Yup.string().required("Title is required"),
            description: Yup.string().required("Description is required"),
            origin: Yup.string().required("Origin is required"),
            price: Yup.number().required("Price is required"),
          })}
          onSubmit={handleUpdate}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <Form>
              <AntForm.Item label="Title">
                <Field name="title" as={Input} />
                {touched.title && errors.title && (
                  <div style={{ color: "red" }}>{errors.title}</div>
                )}
              </AntForm.Item>

              <AntForm.Item label="Description">
                <Field name="description" as={Input.TextArea} rows={3} />
                {touched.description && errors.description && (
                  <div style={{ color: "red" }}>{errors.description}</div>
                )}
              </AntForm.Item>

              <AntForm.Item label="Origin">
                <Field name="origin" as={Input} />
                {touched.origin && errors.origin && (
                  <div style={{ color: "red" }}>{errors.origin}</div>
                )}
              </AntForm.Item>

              <AntForm.Item label="Price">
                <Field name="price" as={Input} />
                {touched.price && errors.price && (
                  <div style={{ color: "red" }}>{errors.price}</div>
                )}
              </AntForm.Item>

              <AntForm.Item label="Featured">
                <Switch
                  checked={values.isFeatured}
                  onChange={(checked) => setFieldValue("isFeatured", checked)}
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                />
              </AntForm.Item>

              <AntForm.Item label="Upload Images (Max: 5)">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setFieldValue("images", Array.from(e.target.files))
                  }
                />
              </AntForm.Item>

              <Button
                type="primary"
                htmlType="submit"
                block
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Update Product"}
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Modal>
  );
};

export default EditProductModal;
