import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";

const styles = {
  Background: {
    backgroundColor: "#fff0f6",
    height: "100%",
    marginBottom: "0px",
  },
  SignLogTitle: {
    textAlign: "center",
    color: "#9d174d",
    fontSize: "30px",
    width: "100%",
    fontWeight: "700",
    paddingTop: "200px",
  },
  formContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "300px",
    height: "600px",
    margin: "40px auto 0 auto",
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
  returnButton: {
    justifyContent: "center",
    width: "150px",
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    backgroundColor: "white",
    color: "#ec4899",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "70px",
  },
};

const schema = yup.object().shape({
  name: yup.string().required("이름은 필수 항목입니다."),
  email: yup
    .string()
    .email("유효한 이메일 형식이 아닙니다.")
    .required("이메일은 필수 항목입니다."),
  password: yup
    .string()
    .min(8, "비밀번호는 최소 8자 이상이어야 합니다.")
    .max(16, "비밀번호는 최대 16자 이하이어야 합니다.")
    .required("비밀번호는 필수 항목입니다."),
  passwordCheck: yup
    .string()
    .oneOf([yup.ref("password"), null], "비밀번호가 일치하지 않습니다.")
    .required("비밀번호 확인은 필수 항목입니다."),
});

const Signup = () => {
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
    console.log("💡 fetch 요청 데이터:", data);
    try {
      const response = await fetch("http://localhost:4000/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          name: data.name,
          password: data.password,
        }),
      });

      console.log("💡 fetch 응답 상태:", response.status);

      const result = await response.json();

      if (response.status === 409) {
        alert("이미 존재하는 이메일입니다.");
        return;
      }

      if (response.status === 201) {
        alert("회원가입 성공!");
        navigate("/login");
        return;
      }

      alert(`회원가입 실패: ${result.message}`);
    } catch (error) {
      console.error("❌ 에러 발생:", error);
      alert("서버 오류로 회원가입 실패");
    }
  };

  const handleReturnClick = () => {
    navigate("/main");
  };

  return (
    <div style={styles.Background}>
      <div style={styles.SignLogTitle}>회원가입</div>

      <form style={styles.formContainer} onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          placeholder="이름을 입력해주세요!"
          {...register("name")}
          style={styles.inputField}
        />
        {errors.name && (
          <div style={styles.errorMessage}>{errors.name.message}</div>
        )}

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

        <input
          type="password"
          placeholder="비밀번호를 다시 입력해주세요!"
          {...register("passwordCheck")}
          style={styles.inputField}
        />
        {errors.passwordCheck && (
          <div style={styles.errorMessage}>{errors.passwordCheck.message}</div>
        )}

        <button type="submit" style={styles.submitButton} disabled={!isValid}>
          회원가입
        </button>

        <button
          type="button"
          style={styles.returnButton}
          onClick={handleReturnClick}
        >
          이전 화면으로
        </button>
      </form>
    </div>
  );
};

export default Signup;
