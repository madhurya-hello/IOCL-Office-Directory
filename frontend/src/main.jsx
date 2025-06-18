import ReactDom from "react-dom/client"; // React DOM for rendering
import { StrictMode } from "react"; // Enables strict mode for development checks
import { HelmetProvider } from "react-helmet-async"; // Manages document head
import { CssBaseline } from "@mui/material"; // Material-UI baseline styles
import { Provider } from "react-redux"; // Redux provider for state management
import { store } from "./store/store.js"; // Redux store
import App from "./App.jsx"; // Main app component
import "./index.css"; // Global styles

// Render the application
ReactDom.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <HelmetProvider>
      <CssBaseline />
      <App />
    </HelmetProvider>
  </Provider>
);
