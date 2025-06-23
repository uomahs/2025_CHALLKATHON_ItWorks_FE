import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Find from "../components/Find";

function Main() {
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Find />
      </div>
    </div>
  );
}

export default Main;
