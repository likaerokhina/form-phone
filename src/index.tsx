import * as React from "react";
import { createRoot } from "react-dom/client";

import PhoneInput from "./components/phone-input";

import "./index.css";

const masks = [
  {
    key: "ru",
    name: "Россия",
    emoji: "🇷🇺",
    prefix: "+7",
    mask: "(***) - *** - ** - **",
  },
  {
    key: "us",
    name: "США",
    emoji: "🇺🇸",
    prefix: "+1",
    mask: "(***) *** - ****",
  },
  {
    key: "uk",
    name: "Великобритания",
    emoji: "🇬🇧",
    prefix: "+44",
    mask: "**** **** ****",
  },
];

function App() {
  const [value, setValue] = React.useState("+71234567890");

  return (
    <div style={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
      <h1>Phone Input Component</h1>
      <PhoneInput masks={masks} value={value} onChange={setValue} />
      <div style={{ marginTop: "20px", padding: "12px", background: "#f3f4f6", borderRadius: "6px" }}>
        <strong>Value:</strong> {value}
      </div>
    </div>
  );
}

const container = document.getElementById("root");

if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

