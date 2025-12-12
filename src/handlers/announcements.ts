import { InlineKeyboard, Context, Bot } from "grammy";

export default function registerAnnouncementHandlers(bot: Bot) {

  bot.on("callback_query:data", async (ctx: Context) => {
    if (!ctx.callbackQuery?.data) return;
    const data = ctx.callbackQuery.data;

    if (data === "action:announcements") {
      await ctx.answerCallbackQuery({
        text:
          "View the latest Trust Wallet Announcement\n\n" +
          "Click OPEN below after closing this message.",
        show_alert: true,
      });

      const kb = new InlineKeyboard()
        .url(
          "OPEN",
          "https://trustwallet.com/blog/announcements/introducing-trust-premium"
        )
        .row()
        .text("CANCEL", "close_announcement");

      const msg = await ctx.reply(
        "Trust Wallet Premium Announcement\n\nClick OPEN to visit the announcement page.",
        { reply_markup: kb }
      );

      // Auto delete after 10s
      setTimeout(async () => {
        try { 
          if (!ctx.chat) return; // Guard clause if chat is undefined
          await ctx.api.deleteMessage(ctx.chat.id, msg.message_id); 
        } catch {}
      }, 10000);
    }

    // Handle CANCEL
    else if (data === "close_announcement") {
      await ctx.deleteMessage();
      await ctx.answerCallbackQuery({ text: "Closed." });
    }
  });
}
