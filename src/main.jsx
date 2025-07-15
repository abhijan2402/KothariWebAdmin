import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import App from "./App.jsx";
import "./i18n";
import { ThemeProvider } from "./context/ThemeContext.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
        <App />
        <ToastContainer
          position="bottom-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
    </ThemeProvider>
  </StrictMode>
);
