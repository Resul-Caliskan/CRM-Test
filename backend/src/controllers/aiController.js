const { GoogleGenerativeAI } = require("@google/generative-ai");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCIblzf8ckzH52eblzPtSgh8l5PGUJIolc");

async function run(prompt) {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}
async function askAi(req, res) {
  try {
    const parameters = req.body.parameters;
    response = await run(
      parameters +
        " bu parametrelere göre bir job description tanımla ve içerisinde job'a göre uygun skilleri Teknik Beceriler başlığı altında de listele, yanıt türkçe olsun, teşekkürler"
    );
    res.status(200).json({ message: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}

async function fakeAskAi(req, res) {
  try {
    const cevap = req.body.parameters;
    res.status(200).json({ message: cevap });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
}
module.exports = { askAi, fakeAskAi };