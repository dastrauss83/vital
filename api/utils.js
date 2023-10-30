import nodemailer from "nodemailer";
import puppeteer from "puppeteer";
import dayjs from "dayjs";

const sendEmail = (subject, text) => async (email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "vitalemailer@gmail.com",
      pass: "vitalemailer83!",
    },
  });

  const mailOptions = {
    from: "vitalemailer@gmail.com",
    to: email,
    subject,
    text,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendErrorEmail = sendEmail(
  "Error Occurred",
  "An error has occurred in the system."
);
export const sendClassAvailableEmail = sendEmail(
  "Class Available",
  "The class you were looking for is now available!"
);

export const checkAvailability = async (classTime, classTitle) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto("https://www.vitalclimbinggym.com/brooklyn-book-class", {
      timeout: 0,
    });

    await page.waitForSelector(".hc_starttime");

    const translatedTime = dayjs(
      `${dayjs().format("YYYY-MM-DD")} ${classTime}`,
      "YYYY-MM-DD h:mm A"
    ).format("YYYY-MM-DDTHH:mm");

    // Use XPath to select the desired session
    const sessionXPath = `//div[contains(@class, 'bw-session') and .//time[contains(@class, 'hc_starttime') and @datetime='${translatedTime}'] and .//div[contains(@class, 'bw-session__name') and contains(., "${classTitle.toUpperCase()}")]]`;

    // Await for the session element to appear
    await page.waitForXPath(sessionXPath);

    // Get the session element
    const sessionElement = await page.$x(sessionXPath);

    if (sessionElement.length === 0) {
      await browser.close();
      return false; // Session not found
    }

    const sessionInnerHTML = await sessionElement[0].evaluate(
      (el) => el.innerHTML
    );

    await browser.close();

    return sessionInnerHTML.includes("Book");
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const isAfterClassTime = (classTime) =>
  dayjs().isAfter(dayjs(classTime, "h:mm A"));
