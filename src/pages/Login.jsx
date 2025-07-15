// src/pages/Login.jsx
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { Input, Button, Typography, Card } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../Styles/auth.css";

const { Title } = Typography;

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(4, "Too Short!").required("Required"),
});

export default function Login() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">
      <Card className="auth-card" bordered={false}>
        <Title level={2} style={{ textAlign: "center" }}>
          Sign In
        </Title>
        <p className="tagline">Unleash your control</p>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginSchema}
          onSubmit={(values) => {
            console.log("Login Values:", values);
            localStorage.setItem("adminToken", "mock_token");
            navigate("/dashboard");
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

              <div className="form-item">
                <Input.Password
                  name="password"
                  placeholder="Password"
                  prefix={<LockOutlined />}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                {touched.password && errors.password && (
                  <div className="error">{errors.password}</div>
                )}
              </div>

              <Button type="primary" htmlType="submit" block>
                Login
              </Button>

              <Button
                type="link"
                block
                onClick={() => navigate("/forgot-password")}
              >
                Forgot Password?
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
}
