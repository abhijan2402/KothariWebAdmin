// src/pages/ForgotPassword.jsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button, Typography, Card } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../Styles/auth.css";

const { Title } = Typography;

const ForgotSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <Card className="auth-card" bordered={false}>
        <Title level={2} style={{ textAlign: "center" }}>
          Forgot Password
        </Title>
        <p className="tagline">We’ll send you a reset link</p>
        <Formik
          initialValues={{ email: "" }}
          validationSchema={ForgotSchema}
          onSubmit={(values) => {
            console.log("Reset request:", values);
            navigate("/login");
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <div className="form-item">
                <Input
                  name="email"
                  placeholder="Email"
                  prefix={<MailOutlined />}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.email && errors.email && (
                  <div className="error">{errors.email}</div>
                )}
              </div>

              <Button type="primary" htmlType="submit" block>
                Send Reset Link
              </Button>

              <Button type="link" block onClick={() => navigate("/login")}>
                Back to Login
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
