require("dotenv").config();
const express = require("express");
const connectDB = require("./database/db");

const app = express();

/* DB CONNECT */
connectDB();

/* MIDDLEWARE */
app.use(express.json());
app.use("/uploads", express.static("uploads"));

/* ROUTES */
app.use("/auth", require("./routes/auth.routes"));
app.use("/reports", require("./routes/report.routes"));

/* SERVER */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on ${PORT} 🚀`);
});
