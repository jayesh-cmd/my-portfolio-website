export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({ error: "POST only" });
  }

  const body = JSON.parse(req.body);

  try {
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: body.messages,
        temperature: 0.7
      })
    });

    const data = await groqRes.json();
    return res.status(200).json(data);

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
