import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const styles = {
  SignLogTitle: {
    textAlign: "center",
    marginTop: "100px",
    color: "#9d174d",
    fontSize: "30px",
    width: "700px",
    fontWeight: "bold",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
    height: "100vh",
    margin: "40px auto",
  },
  inputField: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  errorMessage: {
    color: "#e11d48",
    fontSize: "0.875rem",
  },
  submitButton: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "#ec4899",
    color: "white",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

const schema = yup.object().shape({
  email: yup
    .string()
    .email("유효한 이메일 형식이 아닙니다.")
    .required("이메일은 필수 항목입니다."),
  password: yup.string().required("비밀번호는 필수 항목입니다."),
});

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();
      alert("로그인 성공!");
      localStorage.setItem("accessToken", result.accessToken);
      localStorage.setItem("refreshToken", result.refreshToken);
      navigate("/mainpage");
    } catch (error) {
      console.error("에러 발생:", error);
      alert("서버 오류로 로그인 실패");
    }
  };

  return (
    <div>
      <div style={styles.SignLogTitle}>로그인</div>

      <form style={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="email"
          placeholder="이메일을 입력해주세요!"
          {...register("email")}
          style={styles.inputField}
        />
        {errors.email && (
          <div style={styles.errorMessage}>{errors.email.message}</div>
        )}

        <input
          type="password"
          placeholder="비밀번호를 입력해주세요!"
          {...register("password")}
          style={styles.inputField}
        />
        {errors.password && (
          <div style={styles.errorMessage}>{errors.password.message}</div>
        )}

        <button type="submit" style={styles.submitButton} disabled={!isValid}>
          로그인
        </button>
      </form>
    </div>
  );
};

export default Login;
