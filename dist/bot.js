"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const grammy_1 = require("grammy");
const start_1 = __importDefault(require("./commands/start"));
const announcements_1 = __importDefault(require("./handlers/announcements"));
const participate_1 = __importDefault(require("./handlers/participate"));
const watchVideo_1 = __importDefault(require("./handlers/watchVideo"));
const token = process.env.BOT_TOKEN;
if (!token) {
    console.error("BOT_TOKEN missing in .env");
    process.exit(1);
}
const bot = new grammy_1.Bot(token);
// Register modules  
(0, start_1.default)(bot);
(0, announcements_1.default)(bot);
(0, participate_1.default)(bot);
(0, watchVideo_1.default)(bot);
// Fallback
bot.on("message:text", async (ctx) => {
    const t = ctx.message.text.toLowerCase();
    if (t.includes("hi") || t.includes("hello")) {
        return ctx.reply("Hey! Send /start to see the main menu.");
    }
});
bot.start();
