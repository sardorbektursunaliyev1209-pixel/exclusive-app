import "dotenv/config";
import express from "express";
import cors from "cors";
import { Bot, InlineKeyboard } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN);

// ---------- Bot buyruqlari ----------
bot.command("start", (ctx) => {
  const keyboard = new InlineKeyboard().webApp(
    "🛍 Do'konni ochish",
    process.env.WEB_APP_URL,
  );

  return ctx.reply("Xush kelibsiz! Do'konni ochish uchun tugmani bosing.", {
    reply_markup: keyboard,
  });
});

bot.command("id", (ctx) => ctx.reply(`Sizning ID: ${ctx.from.id}`));

bot.catch((err) => console.error("Bot xatosi:", err.message));

// ---------- Buyurtma serveri ----------
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Server ishlayapti"));

app.post("/order", async (req, res) => {
  try {
    const { items = [], name, phone, address, userId } = req.body;
    if (!items.length) return res.status(400).json({ ok: false });

    const total = items.reduce((s, i) => s + i.price * i.quantity, 0);
    const lines = items
      .map(
        (i) =>
          `• ${i.title} × ${i.quantity} = $${(i.price * i.quantity).toFixed(2)}`,
      )
      .join("\n");

    const text =
      `🛒 Yangi buyurtma\n\n` +
      `👤 ${name || "Ism yo'q"}\n` +
      `📞 ${phone || "Telefon yo'q"}\n` +
      `📍 ${address || "Manzil yo'q"}\n\n` +
      `${lines}\n\n💰 Jami: $${total.toFixed(2)}`;

    await bot.api.sendMessage(process.env.ADMIN_ID, text);

    if (userId) {
      bot.api
        .sendMessage(userId, "✅ Buyurtmangiz qabul qilindi. Tez orada bog'lanamiz.")
        .catch(() => {});
    }

    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ ok: false });
  }
});

app.listen(process.env.PORT || 3000, () =>
  console.log("Server 3000-portda ishlayapti"),
);

bot.start();
console.log("Bot ishga tushdi");