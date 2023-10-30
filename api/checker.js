import express from "express";
import cors from "cors";
import axios from "axios";
import {
  checkAvailability,
  sendClassAvailableEmail,
  sendErrorEmail,
  isAfterClassTime,
} from "./utils.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "Backend service is running!" });
});

app.post("/start-cron", async (req, res) => {
  const { email, classTime, classTitle } = req.body;

  // Replace with your actual cron-job.org credentials
  const AUTH_TOKEN = "LdserNh2sW8qv68dNGLC5RPempq6YMuWrdsa3Ve+Scw=";

  try {
    const detailedJob = {
      title: "Check Availability",
      address: "https://vital-backend.vercel.app/api/check",
      httpMethod: "POST",
      body: JSON.stringify({ email, classTime, classTitle }),
      schedule: {
        minute: ["0-59"],
      },
    };

    const response = await axios.post(
      "https://www.cron-job.org/api/jobs",
      detailedJob,
      {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
      }
    );

    res.json({ message: "Cron job started!", data: response.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to start cron job." });
  }
});

app.post("/check", async (req, res) => {
  const { email, classTime, classTitle } = req.body;

  try {
    if (isAfterClassTime(classTime)) {
      // Ideally, you'd remove the cron job here to stop it from further running
      return res.json({ stopCron: true });
    }

    const isAvailable = await checkAvailability(classTime, classTitle);

    if (isAvailable) {
      await sendClassAvailableEmail(email);
      return res.json({ stopCron: true });
    }

    res.json({ stopCron: false });
  } catch (error) {
    console.error(error);
    await sendErrorEmail(email);
    res.json({ stopCron: true });
  }
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
