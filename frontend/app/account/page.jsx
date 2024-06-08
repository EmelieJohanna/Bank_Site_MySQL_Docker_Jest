"use client";

import { useState, useEffect } from "react";
import Button from "../components/Button";

export default function Account() {
  const [accountInfo, setAccountInfo] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/me/accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setAccountInfo(data);
        })
        .catch((err) => console.error("Error:", err));
    }
  }, []);

  const handleTransaction = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/me/accounts/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ amount: Number(amount) }),
        }
      );
      if (response.ok) {
        const data = await response.json();
        setAccountInfo(data);
        alert("Transaction successful!");
      } else {
        alert("Transaction failed");
      }
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed");
    }
  };

  return (
    <div className="text-text flex flex-col">
      <h1>Account Details</h1>
      {accountInfo ? (
        <div>
          <p>Balance: ${parseFloat(accountInfo.amount).toFixed(2)}</p>
        </div>
      ) : (
        <p>Loading account details...</p>
      )}

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Enter amount"
        className="border text-slate-900"
      />
      <Button onClick={handleTransaction}>Submit Transaction</Button>
    </div>
  );
}
