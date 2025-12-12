import 'dotenv/config';
import { Bot } from "grammy";

import registerStartCommand from "./commands/start";
import registerAnnouncementHandlers from "./handlers/announcements";
import registerParticipateHandlers from "./handlers/participate";  
import registerWatchVideo from "./handlers/watchVideo";


const token = process.env.BOT_TOKEN;

if (!token) {
  console.error("BOT_TOKEN missing in .env");
  process.exit(1);
}

const bot = new Bot(token);

// Register modules  
registerStartCommand(bot);
registerAnnouncementHandlers(bot);
registerParticipateHandlers(bot);
registerWatchVideo(bot);


// Fallback
bot.on("message:text", async (ctx) => {
  const t = ctx.message.text.toLowerCase();
  if (t.includes("hi") || t.includes("hello")) {
    return ctx.reply("Hey! Send /start to see the main menu.");
  }
});

bot.start();
