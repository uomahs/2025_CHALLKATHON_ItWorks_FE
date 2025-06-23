import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import Calendar from "../components/Calendar";
import Write from "../components/Write";

function Main() {
  console.log("✅ MainHome loaded");
  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>
      <Header />
      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <Calendar />
        <Write />
      </div>
    </div>
  );
}

export default Main;
