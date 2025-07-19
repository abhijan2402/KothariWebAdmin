import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout/Layout";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute";
import ProductList from "./pages/Product/ProductList";
import CreateProduct from "./pages/Product/CreateProduct";
import CMSPrivacyEditor from "./components/Editor/Editor";
import Category from "./pages/Category";

export default function App() {
  return (
    // <Router>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route
          path="/"
          element={
            <Layout />
            // <ProtectedRoute>
            // </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="category" element={<Category />} />

          <Route path="products/list" element={<ProductList />} />
          <Route path="products/create" element={<CreateProduct />} />

          <Route
            path="/settings/privacypolicy"
            element={<CMSPrivacyEditor />}
          />
          <Route path="*" element={<Dashboard />} />
        </Route>
      </Routes>
    </Router>
  );
}
