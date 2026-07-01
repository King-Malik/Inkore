import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Inkore from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Inkore />
  </StrictMode>
);
