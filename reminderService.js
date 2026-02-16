const cron = require("node-cron");
const { generateReminder } = require("./calorieService");

/**
 * Schedules reminders for eating
 * @param {object} client - The WhatsApp client instance
 * @param {string} partnerNumber - The partner's WhatsApp number (formatted)
 */
function setupReminders(client, partnerNumber) {
    // Makan Pagi: 08:00
    cron.schedule("0 8 * * *", async () => {
        try {
            const message = await generateReminder("pagi");
            await client.sendMessage(partnerNumber, message);
        } catch (error) {
            console.error("Gagal kirim pengingat pagi:", error);
        }
    });

    // Makan Siang: 12:30
    cron.schedule("30 12 * * *", async () => {
        try {
            const message = await generateReminder("siang");
            await client.sendMessage(partnerNumber, message);
        } catch (error) {
            console.error("Gagal kirim pengingat siang:", error);
        }
    });

    // Makan Malam: 19:00
    cron.schedule("0 19 * * *", async () => {
        try {
            const message = await generateReminder("malam");
            await client.sendMessage(partnerNumber, message);
        } catch (error) {
            console.error("Gagal kirim pengingat malam:", error);
        }
    });

    console.log("Generative reminders scheduled successfully!");
}

module.exports = { setupReminders };
