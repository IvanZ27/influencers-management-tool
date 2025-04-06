require("dotenv").config();
const express = require("express");
const pool = require("./db");
const cors = require("cors");
const corsOptions = {
	origin: [process.env.CLIENT_ORIGIN],
};
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 1337;

app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get("/influencers", (req, res) => {
	res.json({ influensers: ["Biba", "Boba", "Knjopa", "Hljupa"] });
});

app.listen(PORT, () => {
	console.log(`Server has started on Port: ${PORT}`);
});
