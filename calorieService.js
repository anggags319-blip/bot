const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

/**
 * Analyzes message content for food and returns estimated calories
 * @param {string} text - The incoming message text
 * @returns {Promise<string|null>} - Calorie info or null if no food detected
 */
async function getCalorieInfo(text) {
    try {
        const prompt = `
            Anda adalah asisten nutrisi. Jika pesan berikut berisi makanan atau minuman, berikan estimasi jumlah kalorinya dalam bahasa Indonesia yang ramah dan singkat (untuk pacar).
            Katakan sesuatu seperti: "Itu sekitar [X] kalori sayang, sehat terus ya!" 
            Pastikan pesan diakhiri dengan kalimat: "aku asisten kalorimu".
            Jika pesan tidak berisi makanan, kembalikan teks "KOSONG".
            
            Pesan: "${text}"
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const resultText = response.text().trim();

        if (resultText === "KOSONG") return null;
        return resultText;
    } catch (error) {
        console.error("Error calorie service:", error);
        return "Aduh, maaf sayang aku lagi pusing buat ngitung kalorinya. Tapi dimakan aja ya! aku asisten kalorimu";
    }
}

/**
 * Generates a creative meal reminder using Gemini AI
 * @param {string} timeOfDay - "pagi", "siang", or "malam"
 * @returns {Promise<string>} - The generated reminder text
 */
async function generateReminder(timeOfDay) {
    try {
        const prompt = `
            Buatkan pesan pengingat makan ${timeOfDay} yang sangat romantis, manis, dan perhatian untuk pacar saya (panggil dia "sayangku" atau "cantikku").
            Gunakan bahasa Indonesia yang santai dan tulus. 
            Tujuannya agar dia semangat makan dan merasa diperhatikan.
            Pastikan pesan diakhiri dengan kalimat: "aku asisten kalorimu".
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error("Error generating reminder:", error);
        const fallbacks = {
            pagi: "Selamat pagi sayangku! Jangan lupa sarapan ya supaya bertenaga. aku asisten kalorimu",
            siang: "Siang cantikku! Waktunya makan siang nih, istirahat dulu ya. aku asisten kalorimu",
            malam: "Malam sayangku! Jangan telat makan malam ya biar tidurnya nyenyak. aku asisten kalorimu"
        };
        return fallbacks[timeOfDay];
    }
}

module.exports = { getCalorieInfo, generateReminder };
