"use client";

import "../styles/Home.css";

import axios from "axios";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [nameValue, setNameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [button, setButton] = useState("Already have an account? Log in");
  const [login, setLogin] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const handleButtonChange = () => {
    setLogin(!login);
    setErrorMessage("");

    if (!login) {
      setButton("Don't have an account? Sign up");
    } else {
      setButton("Already have an account? Log in");
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/signup",
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
      setErrorMessage(e.response.data.message);
    }
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();

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
      setErrorMessage(e.response.data.message);
    }
  };

  const signupForm = (
    <form onSubmit={handleSignupSubmit} className="Home-Form">
      <input
        value={nameValue}
        onChange={handleNameChange}
        placeholder="Name"
        className="Home-Input"
      />
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
        Sign up
      </button>
    </form>
  );

  const loginForm = (
    <form onSubmit={handleLoginSubmit} autoComplete="off" className="Home-Form">
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
        Log in
      </button>
    </form>
  );

  return (
    <div className="Home-container">
      {login ? loginForm : signupForm}
      <button onClick={handleButtonChange} className="Home-Button">
        {button}
      </button>
    </div>
  );
}
