import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";

function Main() {
  console.log("✅ MainHome loaded");
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Calendar />
      </div>
    </div>
  );
}

export default Main;
