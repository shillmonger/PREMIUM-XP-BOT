import { Bot, InlineKeyboard, Keyboard } from "grammy";

export default function registerStartCommand(bot: Bot) {
  bot.command("start", async (ctx) => {
    // Inline button (top image buttons)
    const inline = new InlineKeyboard().text(
      "ANNOUNCEMENTS",
      "action:announcements"
    );

    // Reply keyboard buttons (bottom big buttons)
    const replyKb = new Keyboard()
      .text("CLICK HERE TO PARTICIPATE")
      .row()
      .text("WATCH VIDEO TUTORIAL") 
      .row()
      .text("CANCEL")
      .resized();

    const messageText = `
<b>How to Join Trust Premium</b>

<b>There are multiple entry points into Trust Premium, including from the app home screen. Below we’ll show you how you can access the feature from the Discover page.</b>

<b>Update Trust Wallet to the latest version.</b>

<b>Open the app, select “Discover”, then select the Premium option. Once inside, you’ll see your starting tier, current XP and progress, and available tasks.</b>

<b>Complete actions, like swap, daily check-in and deposit from Binance, and watch your progress grow.</b>

<b>Lock TWT to amplify your benefits and unlock exclusive perks.</b>
    `;

    await ctx.replyWithPhoto(
      "https://i.postimg.cc/WbZwSZTn/trust-wallet-start.jpg",
      {
        caption: messageText,
        parse_mode: "HTML",
        reply_markup: inline,
      }
    );

    await ctx.reply("Choose an action below:", {
      reply_markup: replyKb,
    });
  });
}
