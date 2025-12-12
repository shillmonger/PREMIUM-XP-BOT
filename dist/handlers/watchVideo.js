"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerWatchVideo;
const grammy_1 = require("grammy");
const path_1 = __importDefault(require("path"));
function registerWatchVideo(bot) {
    bot.hears("WATCH VIDEO TUTORIAL", async (ctx) => {
        const videoPath = path_1.default.resolve("public", "Tutoria-video.mp4");
        await ctx.replyWithVideo(new grammy_1.InputFile(videoPath), {
            caption: "Here is your tutorial video!",
            parse_mode: "HTML",
        });
    });
}
