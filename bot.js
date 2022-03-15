const { WOLFBot } = require("wolf.js");
const api = new WOLFBot();
require("dotenv").config();

module.exports = { api };

api.on("ready", async () => {
  console.log("[*] - dice start.");
});

api.login(process.env.EMAIL, process.env.PASSWORD);
