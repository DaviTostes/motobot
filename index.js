import cron from "node-cron";
import dotenv from "dotenv";

import createOptions from "./createOpitons.js";

dotenv.config();

let newestMessage = "";

cron.schedule("0 10 * * *", async () => {
  try {
    const options = createOptions({
      chat_id: process.env.GABRIEL_ID,
      question: "Vai hoje?",
      options: JSON.stringify([{ text: "Sim" }, { text: "Não" }]),
    });
    const sendMessage = await fetch(process.env.URL + "/sendPoll", options);
    const response = await sendMessage.json();
    newestMessage = response.result.message_id;

    if (response.ok) {
      await fetch(
        process.env.URL + "/pinChatMessage",
        createOptions({
          chat_id: process.env.GABRIEL_ID,
          message_id: newestMessage,
        }),
      );
      await fetch(
        process.env.URL + "/sendMessage",
        createOptions({
          chat_id: process.env.DAVI_ID,
          text: "Gabriel recebeu a enquete",
        }),
      );
    }
  } catch (error) {
    console.log(error);
  }
});

cron.schedule("0 * * * *", async () => {
  try {
    if (!newestMessage) return;

    let getChat = await fetch(
      process.env.URL + "/getChat?chat_id=" + process.env.GABRIEL_ID,
    );
    let response = await getChat.json();

    let poll = response.result.pinned_message.poll;
    if (poll.total_voter_count <= 0) return;

    let answer = "Não";
    if (poll.options[0].voter_count > poll.options[1].voter_count) {
      answer = "Sim";
    }

    await fetch(
      process.env.URL + "/sendMessage",
      createOptions({
        chat_id: process.env.DAVI_ID,
        text: `Gabriel respondeu: ${answer}`,
      }),
    );

    newestMessage = "";
  } catch (error) {
    console.log(error);
  }
});
