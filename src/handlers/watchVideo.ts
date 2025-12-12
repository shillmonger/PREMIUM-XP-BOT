import { Bot, InputFile } from "grammy";
import path from "path";
import * as fs from "fs";

export default function registerWatchVideo(bot: Bot) {
  bot.hears("WATCH VIDEO TUTORIAL", async (ctx) => {
  const videoPath = path.resolve("public", "Tutoria-video.mp4");

  await ctx.replyWithVideo(new InputFile(videoPath), {
    caption: "Here is your tutorial video!",
    parse_mode: "HTML",
  });
});

}
