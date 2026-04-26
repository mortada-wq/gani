import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import GaniBrandDefs from "./components/GaniBrandDefs.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <>
      <GaniBrandDefs />
      <App />
    </>
  </StrictMode>,
);
