"use client";

import "../../styles/Home.css";

import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signin() {
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPasswordValue(event.target.value);
  };

  const handleSigninSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/login",
        {
          email: emailValue,
          password: passwordValue,
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const { id } = res.data.user;

      localStorage.setItem("name", res.data.user.name);
      localStorage.setItem("email", res.data.user.email);

      router.push(`/user/${id}`);
    } catch (e) {
      setIsLoading(false);
      setErrorMessage(e.response.data.message);
    }
  };

  return (
    <div className="Home-Container">
      <form
        onSubmit={handleSigninSubmit}
        autoComplete="off"
        className="Home-Form"
      >
        <input
          value={emailValue}
          onChange={handleEmailChange}
          placeholder="Email"
          className="Home-Input"
        />
        <input
          value={passwordValue}
          type="password"
          onChange={handlePasswordChange}
          placeholder="Password"
          className="Home-Input"
        />
        {errorMessage !== "" ? (
          <label className="Home-Label">{errorMessage}</label>
        ) : (
          ""
        )}
        <button type="submit" className="Home-SubmitButton">
          {isLoading ? <div class="Home-Loader"></div> : "Sign in"}
        </button>
      </form>
      <button
        onClick={() => {
          router.push("/signup");
        }}
        className="Home-Button"
      >
        Don't have an account? Sign up
      </button>
    </div>
  );
}
