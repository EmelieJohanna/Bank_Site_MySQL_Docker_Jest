"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, password }),
        }
      );
      if (response.ok) {
        const { token } = await response.json();
        localStorage.setItem("token", token);
        router.push("/account");
      } else {
        alert("Failed to login");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div className="text-text">
      <h1 className="flex justify-center">Log in</h1>
      <form
        onSubmit={handleLogin}
        className="flex flex-col space-y-2 md:max-w-lg"
      >
        <label htmlFor="username" className="block">
          Username
        </label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="border p-2 text-black"
          required
        />
        <label htmlFor="password">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="border p-2 text-black "
          required
        />
        <button
          type="submit"
          className="bg-accent opacity-80 p-2 border rounded-2xl text-slate-50"
        >
          Log in
        </button>
      </form>
    </div>
  );
}
