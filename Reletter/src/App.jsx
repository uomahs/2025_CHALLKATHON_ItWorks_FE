import { Routes, Route } from "react-router-dom";
import Home from "../src/pages/Home";
import Login from "../src/pages/Login";
import Start from "../src/pages/Start";
import Signup from "../src/pages/Signup";
import Main from "../src/pages/Main";
import DiaryWrite from "../src/pages/DiaryWrite";
import Group from "../src/pages/Group";
import FindFriend from "./pages/FindFriend";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Start />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/main" element={<Main />} />
      <Route path="/newdiary" element={<DiaryWrite />} />
      <Route path="/findfriend" element={<FindFriend />} />
      <Route path="/group" element={<Group />} />
    </Routes>
  );
}

export default App;
