import express from "express";
import cors from "cors";
import {
  checkAvailability,
  sendClassAvailableEmail,
  sendErrorEmail,
  isAfterClassTime,
} from "./utils.js";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "Backend service is running!" });
});

app.post("/check", async (req, res) => {
  const { email, classTime, classTitle } = req.body;

  const checkInterval = setInterval(async () => {
    try {
      if (isAfterClassTime(classTime)) {
        clearInterval(checkInterval);
        return;
      }

      const isAvailable = await checkAvailability(classTime, classTitle);

      if (isAvailable) {
        await sendClassAvailableEmail(email);
        clearInterval(checkInterval);
      }
    } catch (error) {
      console.error(error);
      await sendErrorEmail(email);
      clearInterval(checkInterval);
    }
  }, 60000);

  res.json({ message: "Checker started" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
