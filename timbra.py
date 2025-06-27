# -*- coding: utf-8 -*-
import telebot
from datetime import datetime
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, BotCommand

TOKEN = '7537361429:AAHlXh08NZYkgG2VXgwStcnNuxXF2l8P4Wo'  #  «” »œ‰ » Ë„Ê »Ë „
ADMIN_ID = 1788282639      #  «” »œ‰Á »ÂŸ—·„
WEBAPP_URL = 'https://7208833f-44c8-4214-b69b-607fa24dad01-00-3u5w966uv3mbv.kirk.replit.dev/'  #  —«»◊ WebApp «‰Œ«’ »„

bot = telebot.TeleBot(TOKEN)
SECRET_WORD = None

#   ÕÂÍ‰ «‰Â” ŒœÂÍÊ
def load_users():
    users = {}
    try:
        with open("wallets.txt", "r") as f:
            for line in f:
                parts = [p.strip() for p in line.strip().split("|")]
                if len(parts) == 7:
                    uid, wallet, ts, pts, refs, secret, last = parts
                    users[int(uid)] = {
                        "wallet": wallet,
                        "timestamp": ts,
                        "points": int(pts),
                        "referrals": int(refs),
                        "secret_claimed": secret == "1",
                        "last_daily": last
                    }
    except:
        pass
    return users

#  Õ·ÿ «‰»Í«Ê« 
def save_users(users):
    with open("wallets.txt", "w") as f:
        for uid, data in users.items():
            line = f"{uid} | {data['wallet']} | {data['timestamp']} | {data['points']} | {data['referrals']} | {'1' if data['secret_claimed'] else '0'} | {data['last_daily']}\n"
            f.write(line)

#  «‰‚«∆Â… «‰—∆Í”Í…
def main_menu():
    markup = InlineKeyboardMarkup()
    markup.row(
        InlineKeyboardButton(" Countdown", callback_data="countdown"),
        InlineKeyboardButton(" Stats", callback_data="stats"),
        InlineKeyboardButton(" Register", callback_data="register")
    )
    markup.row(
        InlineKeyboardButton(" WWIII Channel", url="https://t.me/+HdbouLeDKXUyNjVk"),
        InlineKeyboardButton(" Army Group", url="https://t.me/+HdbouLeDKXUyNjVk")
    )
    markup.row(
        InlineKeyboardButton(" Visit Website", url="https://wwiii.army"),
        InlineKeyboardButton(" Follow on X", url="https://x.com/worldwariiicoin")
    )
    markup.add(
        InlineKeyboardButton(" Join Contest (Free Airdrops)", web_app=WebAppInfo(url=WEBAPP_URL))
    )
    return markup

#  /start
@bot.message_handler(commands=['start'])
def start(msg):
    bot.send_message(
        msg.chat.id,
        " *Official Links:*\n"
        " [WWIII Official Channel](https://t.me/+HdbouLeDKXUyNjVk)\n"
        " [WWIII Official Group](https://t.me/+HdbouLeDKXUyNjVk)\n\n"
        " *Welcome to $WWIII Airdrop Army!*\n"
        "Register your Solana wallet and earn 10 daily points automatically.\n\n"
        "Join the meme war and prepare for glory ",
        parse_mode="Markdown",
        reply_markup=main_menu()
    )

#  /setsecret (admin only)
@bot.message_handler(commands=['setsecret'])
def set_secret(msg):
    global SECRET_WORD
    if msg.from_user.id != ADMIN_ID:
        return
    parts = msg.text.strip().split(" ", 1)
    if len(parts) < 2:
        bot.reply_to(msg, "Usage: /setsecret yourword")
        return
    SECRET_WORD = parts[1].lower().strip()
    bot.reply_to(msg, f" Secret word set to: `{SECRET_WORD}`", parse_mode="Markdown")

#  «‰ÂÕ·ÿ… √Ë «‰„‰Â… «‰”—Í…
@bot.message_handler(func=lambda m: m.text and not m.text.startswith("/"))
def handle_wallet_or_secret(msg):
    global SECRET_WORD
    text = msg.text.strip()
    users = load_users()
    now = datetime.now().strftime("%Y-%m-%d")

    if msg.chat.id in users:
        user = users[msg.chat.id]
        if SECRET_WORD and text.lower() == SECRET_WORD and not user["secret_claimed"]:
            user["points"] += 30
            user["secret_claimed"] = True
            bot.reply_to(msg, " Secret word accepted! +30 points.")
        elif user["last_daily"] != now:
            user["points"] += 10
            user["last_daily"] = now
            bot.reply_to(msg, " You received your daily 10 points!")
        save_users(users)
        return

    if len(text) < 25:
        bot.reply_to(msg, " Invalid Solana address.")
        return
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    users[msg.chat.id] = {
        "wallet": text,
        "timestamp": timestamp,
        "points": 10,
        "referrals": 0,
        "secret_claimed": False,
        "last_daily": now
    }
    save_users(users)
    bot.reply_to(msg, " Wallet registered. You earned 10 welcome points!")

#  √Ë«Â— «‰»Ë 
bot.set_my_commands([
    BotCommand("start", "Start / Main Menu"),
    BotCommand("setsecret", "Set secret (admin only)")
])

print(" WWIII Bot is Live.")
bot.infinity_polling()