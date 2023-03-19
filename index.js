const { Client, RemoteAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const express = require("express");
const cors = require("cors");
const app = express();
app.use(cors());
const { MongoStore } = require("wwebjs-mongo");
const mongoose = require("mongoose");
const genrateImageBasedOnUserPromt = require("./controlers/genrateImage");

require('dotenv').config();

mongoose.connect(process.env.MONGO_URL).then(() => {
  const store = new MongoStore({ mongoose: mongoose });
  const client = new Client({
    authStrategy: new RemoteAuth({
      store: store,
      backupSyncIntervalMs: 300000,
    }),
  });
  client.on("ready", () => {
    console.log("Client is ready!");
  });

  client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
  });

  client.on("message", (message) => {
    const prefix = "I need image for";
    if (message.body.toLowerCase().startsWith(prefix.toLowerCase())) {
      genrateImageBasedOnUserPromt(message);
    }
  });

  // Save session values to the file upon successful auth
  client.on("authenticated", (session) => {
    console.log("WHATSAPP WEB => Authenticated", session);
  });

  client.initialize();
});
