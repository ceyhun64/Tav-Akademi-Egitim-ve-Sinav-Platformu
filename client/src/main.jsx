import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* Redux store'u tüm uygulamaya erişilebilir hale getiriyoruz */}
      <App />
    </Provider>
  </StrictMode>
);
