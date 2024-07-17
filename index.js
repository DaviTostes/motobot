import express from "express";
import cron from "node-cron";
import dotenv from "dotenv";

import createOptions from "./createOpitons.js";

dotenv.config();

const app = express();
app.use(express.json());

cron.schedule("0 12 * * *", async () => {
  try {
    const options = createOptions({
      chat_id: process.env.GABRIEL_ID,
      question: "Vai hoje?",
      options: JSON.stringify([{ text: "Sim" }, { text: "Não" }]),
    });
    const sendMessage = await fetch(process.env.URL + "/sendPoll", options);
    const response = await sendMessage.json();
    console.log(`${new Date().toLocaleString()} - ok: ${response.ok}`);

    if (response.ok) {
      var confimationOptions = createOptions({
        chat_id: process.env.DAVI_ID,
        text: "Gabriel recebeu a enquete",
      });
      await fetch(process.env.URL + "/sendMessage", confimationOptions);
    }
  } catch (error) {
    console.log(error);
  }
});

app.post("/webhook", async (req, res) => {
  try {
    const { poll } = req.body;
    var answer = "";
    if (poll.options[0].voter_count > poll.options[1].voter_count) {
      answer = "Sim";
    } else {
      answer = "Não";
    }
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: process.env.DAVI_ID,
        text: `Gabriel respondeu: ${answer}`,
      }),
    };
    const sendMessage = await fetch(process.env.URL + "/sendMessage", options);
    const response = await sendMessage.json();
    res.status(200).send(response);
    return;
  } catch (error) {
    res.status(400);
    return;
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
