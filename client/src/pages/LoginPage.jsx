import React, { useEffect } from "react";

export default function LoginPage() {
  useEffect(() => {
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse,
    });
    google.accounts.id.renderButton(
      document.getElementById("buttonDiv"),
      { theme: "outline", size: "large" }, // customization attributes
    );
    google.accounts.id.prompt(); // also display the One Tap dialog
  }, []);

  return (
    <>
      <div>LoginPage</div>
      <div id="buttonDiv"></div>
    </>
  );
}
