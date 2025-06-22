import React from "react";
import { useNavigate } from "react-router-dom";

const styles = {
  main: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    width: "100%",
    backgroundColor: "#fff0f6",
    color: "#9d174d",
    padding: "0 16px",
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  title: {
    fontSize: "50px",
    fontWeight: "900",
    marginTop: "40px",
    marginBottom: "-20px",
    color: "#db2777",
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    cursor: "pointer",
  },
  logo: {
    width: "300px",
    height: "auto",
    display: "block",
  },
};

const Home = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/main");
  };

  return (
    <main style={styles.main}>
      <h1 style={styles.title}>Reletter</h1>
      <div style={styles.logoWrapper} onClick={handleLogoClick}>
        <img src="/close.png" alt="로고" style={styles.logo} />
      </div>
    </main>
  );
};

export default Home;
