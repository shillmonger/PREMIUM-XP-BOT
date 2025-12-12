"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = registerParticipateHandlers;
const grammy_1 = require("grammy");
function registerParticipateHandlers(bot) {
    // Triggered when user presses reply keyboard button
    bot.hears("CLICK HERE TO PARTICIPATE", async (ctx) => {
        const kb = new grammy_1.InlineKeyboard()
            .text("CANCEL", "action:participate_cancel");
        await ctx.replyWithPhoto("https://i.postimg.cc/zXSS9RPV/Run-in-mini-app.jpg", {
            caption: "<b>⚠️ IMPORTANT NOTICE</b>\n\n" +
                "<b>MAKE SURE YOU HAVE UPDATED YOUR TRUST WALLET TO THE LATEST VERSION.</b>\n\n" +
                "Click the <b>Open Premium XP</b> button to start earning.",
            parse_mode: "HTML",
            reply_markup: kb,
        });
    });
    // Participate button clicked
    bot.on("callback_query:data", async (ctx) => {
        const data = ctx.callbackQuery.data;
        if (data === "action:participate_go") {
            await ctx.answerCallbackQuery({
                text: "Web app is in progress...",
                show_alert: true,
            });
            // delete the preview message after 10 seconds
            setTimeout(() => {
                ctx.deleteMessage().catch(() => { });
            }, 10000);
        }
        if (data === "action:participate_cancel") {
            await ctx.deleteMessage().catch(() => { });
            await ctx.answerCallbackQuery({ text: "Cancelled." });
        }
    });
}
