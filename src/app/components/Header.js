"use client";

import "../styles/Header.css";

import axios from "axios";

import { IoIosPerson } from "react-icons/io";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isActive, setIsActive] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const router = useRouter();

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));
  }, []);

  const toggleDropdown = () => {
    setIsActive(!isActive);
  };

  const handleLogoutClick = async () => {
    try {
      await axios.post(
        "http://localhost:5000/api/users/logout",
        {},
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
    } catch (e) {
      throw e;
    }

    router.push(`/users`);
  };

  return (
    <>
      <header className="Header-Container">
        <h1 className="Header-Title">TO-DOs</h1>
        <button className="Header-Button" onClick={toggleDropdown}>
          <IoIosPerson className="Header-Icon" />
        </button>
      </header>
      <div className={`Header-Dropdown ${isActive ? "active" : ""}`}>
        <h2 className="Header-Name">Hi {name}!</h2>
        <p className="Header-Email">{email}</p>
        <button className="Header-LogoutButton" onClick={handleLogoutClick}>
          Log out
        </button>
      </div>
    </>
  );
}
