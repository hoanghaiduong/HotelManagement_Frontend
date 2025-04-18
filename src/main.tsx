import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import './App.css'
import "swiper/swiper-bundle.css";
import "flatpickr/dist/flatpickr.css";
import App from "./App.tsx";
import { AppWrapper } from "./components/common/PageMeta.tsx";
import { ThemeProvider } from "./context/ThemeContext.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store.ts";
import { PersistGate } from "redux-persist/integration/react";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
    <ThemeProvider>
      <AppWrapper>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </AppWrapper>
    </ThemeProvider>
  // </StrictMode>
);
