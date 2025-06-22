import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPage from "../src/pages/MainPage";
import Login from "../src/pages/Login";
import Home from "../src/pages/Home";

import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}

export default App;
