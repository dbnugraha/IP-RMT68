/* global google */
import React, { useEffect } from "react";
import http from "../helpers/http";

export default function LoginPage() {
  const handleCredentialResponse = async (response) => {
    try {
      console.log("logging in");

      const { data } = await http({
        method: "POST",
        url: "/auth/google-login",
        data: { credential: response.credential },
      });
      localStorage.setItem("token", data.access_token);
    } catch (error) {
      console.log("Error:", error.response?.data || error.message);
    }
  };
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(document.getElementById("buttonDiv"), { theme: "outline", size: "large" });
    google.accounts.id.prompt();
  }, []);

  return (
    <>
      <div>LoginPage</div>
      <div id="buttonDiv"></div>
    </>
  );
}
