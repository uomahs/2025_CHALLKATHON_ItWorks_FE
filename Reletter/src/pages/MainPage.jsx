import React from "react";

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
    fontSize: "3rem",
    marginTop: "-40px",
    color: "#db2777",
    marginBottom: "-5px",
  },
  subtitle: {
    fontSize: "1.125rem",
    marginTop: "16px",
    color: "#be185d",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "-10px",
  },
  buttonContainer: {
    marginTop: "40px",
    display: "flex",
    gap: "16px",
    justifyContent: "center",
  },
  buttonPrimary: {
    backgroundColor: "#f472b6",
    color: "white",
    fontWeight: "700",
    padding: "12px 32px",
    borderRadius: "24px",
    boxShadow: "0 4px 6px rgba(219, 39, 119, 0.5)",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  buttonPrimaryHover: {
    backgroundColor: "#ec4899",
  },
  buttonSecondary: {
    backgroundColor: "white",
    color: "#db2777",
    fontWeight: "700",
    padding: "12px 32px",
    borderRadius: "24px",
    border: "2px solid #f9a8d4",
    boxShadow: "0 2px 4px rgba(249, 168, 212, 0.5)",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  },
  buttonSecondaryHover: {
    backgroundColor: "#fce7f3",
  },
  logoWrapper: {
    display: "flex",
    justifyContent: "center",
    marginTop: "64px",
  },
  logo: {
    marginTop: "-40px",
    width: "400px",
    height: "auto",
    display: "block",
  },
};

const MainPage = () => {
  const [primaryHover, setPrimaryHover] = React.useState(false);
  const [secondaryHover, setSecondaryHover] = React.useState(false);

  return (
    <div>
      <main style={styles.main}>
        <h1 style={styles.title}>함께 흘러가는 시간</h1>
        <p style={styles.subtitle}>함께하는 교환일기, 지금 시작해보세요</p>

        <div style={styles.buttonContainer}>
          <button
            style={{
              ...styles.buttonPrimary,
              ...(primaryHover ? styles.buttonPrimaryHover : {}),
            }}
            onMouseEnter={() => setPrimaryHover(true)}
            onMouseLeave={() => setPrimaryHover(false)}
          >
            시작하기
          </button>
          <button
            style={{
              ...styles.buttonSecondary,
              ...(secondaryHover ? styles.buttonSecondaryHover : {}),
            }}
            onMouseEnter={() => setSecondaryHover(true)}
            onMouseLeave={() => setSecondaryHover(false)}
          >
            둘러보기
          </button>
        </div>

        <div style={styles.logoWrapper}>
          <img src="/reletter_logo.png" alt="로고" style={styles.logo} />
        </div>
      </main>
    </div>
  );
};

export default MainPage;
