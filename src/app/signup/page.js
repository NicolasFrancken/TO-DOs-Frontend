"use client";

import "../../styles/Sign.css";

import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleNameChange = (event) => {
    setNameValue(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmailValue(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPasswordValue(event.target.value);
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const res = await axios.post(
        "https://to-dos-backend.onrender.com/api/users/signup",
        {
          name: nameValue,
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
      console.log(e);
      // setErrorMessage(e.response.data.message);
    }
  };

  return (
    <div className="Sign-Container">
      <form onSubmit={handleSignupSubmit} className="Sign-Form">
        <input
          value={nameValue}
          onChange={handleNameChange}
          placeholder="Name"
          className="Sign-Input"
        />
        <input
          value={emailValue}
          onChange={handleEmailChange}
          placeholder="Email"
          className="Sign-Input"
        />
        <input
          value={passwordValue}
          type="password"
          onChange={handlePasswordChange}
          placeholder="Password"
          className="Sign-Input"
        />
        {errorMessage !== "" ? (
          <label className="Sign-Label">{errorMessage}</label>
        ) : (
          ""
        )}
        <button type="submit" className="Sign-SubmitButton">
          {isLoading ? <div className="Sign-Loader"></div> : "Sign up"}
        </button>
      </form>
      <button
        className="Sign-Button"
        onClick={() => {
          router.push("/signin");
        }}
      >
        Already have an account? Sign in
      </button>
    </div>
  );
}
