import React, { useState } from "react";

function App() {
  const [email, setEmail] = useState("dastrauss83@gmail.com");
  const [classTime, setClassTime] = useState("12:00 PM");
  const [classTitle, setClassTitle] = useState("cycle");
  const [responseMessage, setResponseMessage] = useState("");

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${backendURL}/check`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          classTime,
          classTitle,
        }),
      });

      const data = await response.json();
      setResponseMessage(data.message);
    } catch (error) {
      setResponseMessage("Error occurred while sending the request.");
      console.error("Failed to send request:", error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <h2>Class Notifier</h2>

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label style={{ marginBottom: 5 }}>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label style={{ marginBottom: 5 }}>Class Time:</label>
        <input
          type="text"
          value={classTime}
          onChange={(e) => setClassTime(e.target.value)}
        />
      </div>

      <div
        style={{
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <label style={{ marginBottom: 5 }}>Class Title:</label>
        <input
          type="text"
          value={classTitle}
          onChange={(e) => setClassTitle(e.target.value)}
        />
      </div>

      <button style={{ marginBottom: 20 }} onClick={handleSubmit}>
        Submit
      </button>

      <div>{responseMessage}</div>
    </div>
  );
}

export default App;
