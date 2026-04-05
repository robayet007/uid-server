import express from "express";
import cors from "cors";

const app = express();

// ✅ allow your frontend domain (or use "*" for testing)
app.use(cors({
  origin: "*"
}));

app.use(express.json());

// 🔥 API route
app.get("/api/player", async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ error: "UID is required" });
    }

    const apiUrl = `https://madara-like.vercel.app/like?uid=${uid}&server_name=bd`;

    const response = await fetch(apiUrl);
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ error: "Invalid API response" });
    }

    // ✅ send clean response
    res.json({
      success: true,
      nickname: data?.PlayerNickname || null,
      raw: data
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server failed to fetch player" });
  }
});

// test route
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});