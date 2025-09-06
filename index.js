
import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", "./views");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Home page
app.get("/", (req, res) => {
  res.render("index", { response: null });
});

// Handle form submission
app.post("/ask", async (req, res) => {
    const userMessage=req.body.question;
    try{
        const completion=await axios .post("https://api.openai.com/v1/chat/completions",{
          model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: userMessage },
        ],
        },
        {
        headers: {
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
  }
      );
      const reply = completion.data.choices[0].message.content;
    res.render("index", { response: reply });
    }
    catch (error) {
    let errorMsg = "Error occurred. Try again.";
    if (error.response) {
      errorMsg += `\nStatus: ${error.response.status}`;
      errorMsg += `\n${JSON.stringify(error.response.data)}`;
    } else {
      errorMsg += `\n${error.message}`;
    }
    console.error(errorMsg);
    res.render("index", { response: errorMsg });
  }
    });   

app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
});
