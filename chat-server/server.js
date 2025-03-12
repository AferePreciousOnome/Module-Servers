process.env.PORT = process.env.PORT || 9090;
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { request } from "http";

const app = express();

app.use(cors());

app.use(express.json());

// Get __dirname in ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const messageFilePath = path.join(__dirname, "message.json");

const loadMessages = () => {
  try {
    const data = fs.readFileSync(messageFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
};

const saveMessages = (messages) => {
  fs.writeFileSync(messageFilePath, JSON.stringify(messages, null, 2), "utf-8");
};

//This array is our "data store".
//We will start with one message in the array.
let messages = loadMessages();

app.get("/", (request, response) => {
  response.sendFile(__dirname + "/index.html");
});

app.post("/messages", (request, response) => {
  const { from, text } = request.body;

  if (!text || !from) {
    return response.status(400).json({ msg: "Please include a text and from" });
  }

  const newMessage = {
    id: messages.length > 0 ? messages[messages.length - 1].id + 1 : 1,
    from,
    text,
  };
  messages.push(newMessage);
  saveMessages(messages);
  response.status(201).json(messages);
});

app.get("/messages", (request, response) => {
  response.status(200).json(messages);
});

app.get("/messages/:id", (req, res) => {
  const messageId = Number(req.params.id);
  const msg = messages.find((message) => message.id === messageId);

  if (!msg) {
    return res.status(400).json({ msg: "Message not found" });
  }
  res.status(200).json(msg);
});

app.put("/messages/:id", (req, res) => {
  const messageId = Number(req.params.id);
  const msg = messages.find((message) => message.id === messageId);

  if (!msg) {
    return res.status(400).json({ msg: "Message not found" });
  }
  msg.text = req.body.text;
  msg.from = req.body.from;
  saveMessages(messages);
  res.status(200).json(msg);
});

app.delete("/messages/:id", (req, res) => {
  const messageId = Number(req.params.id);
  const deleteMessage = messages.filter(
    (message) => message.id !== Number(messageId)
  );
  saveMessages(deleteMessage);
  res.status(200).send("Message has been deleted");
});

app.listen(process.env.PORT, () => {
  console.log(`listening on PORT ${process.env.PORT}...`);
});
