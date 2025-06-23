import { Routes, Route } from "react-router-dom";
import MainPage from "../src/pages/MainPage";
import Login from "../src/pages/Login";
import Start from "../src/pages/Start";
import Signup from "../src/pages/Signup";
import Home from "../src/pages/Home";
import MainHome from "../src/pages/MainHome";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
      <Route path="/mainhome" element={<MainHome />} />
    </Routes>
  );
}

export default App;