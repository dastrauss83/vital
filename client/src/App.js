import React, { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [classTime, setClassTime] = useState("");
  const [classTitle, setClassTitle] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const backendURL = process.env.REACT_APP_BACKEND_URL;

  const handleSubmit = async () => {
    try {
      const response = await axios.post(`${backendURL}/start-cron`, {
        email,
        classTime,
        classTitle,
      });

      setResponseMessage(response.data.message);
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
