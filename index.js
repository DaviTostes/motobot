import express from "express";
import cron from "node-cron";

const app = express();
const telegramUrl =
  "https://api.telegram.org/bot7111361179:AAFcmLGxQev4DKmLqx48KdfYdyWmvSIiV2Q";

cron.schedule("0 9 * * *", async () => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: "814362576",
        question: "Vai hoje?",
        options: JSON.stringify([{ text: "Sim" }, { text: "Não" }]),
      }),
    };
    const sendMessage = await fetch(telegramUrl + "/sendPoll", options);
    const response = await sendMessage.json();
    console.log(`${new Date().toLocaleDateString()} - ok: ${response.ok}`);
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
        chat_id: "5060020513",
        text: `Gabriel respondeu: ${answer}`,
      }),
    };
    const sendMessage = await fetch(telegramUrl + "/sendMessage", options);
    const response = await sendMessage.json();
    res.status(200).send(response);
  } catch (error) {
    res.status(400);
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
