import React, { useEffect } from "react";

export default function LoginPage() {
  const handleCredentialResponse = (response) => {
    // console.log("Encoded JWT ID token: " + response.credential);
    console.log(response.credential);
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
