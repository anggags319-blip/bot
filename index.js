const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const { getCalorieInfo } = require("./calorieService");
const { setupReminders } = require("./reminderService");
require("dotenv").config();

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process', // <- this one helps in low memory environments
            '--disable-gpu'
        ],
    }
});

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
    console.log("Scan QR Code di atas untuk login ke WhatsApp.");
});

client.on("ready", () => {
    console.log("Bot WhatsApp Siap!");

    const partnerNumber = process.env.PARTNER_NUMBER + "@c.us";
    setupReminders(client, partnerNumber);
});

client.on("message", async (msg) => {
    // Hanya respon jika pengirim adalah pacar atau jika ingin fitur umum
    // Di sini kita aktifkan untuk semua chat masuk tapi bisa difilter
    if (msg.body) {
        console.log(`Pesan masuk: ${msg.body}`);

        // Cek apakah pesan berisi makanan dan hitung kalorinya
        const calorieRes = await getCalorieInfo(msg.body);

        if (calorieRes) {
            msg.reply(calorieRes);
        }
    }
});

client.initialize();
