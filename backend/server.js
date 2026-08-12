
require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./config/db");

const PORT = process.env.PORT || 5050;

connectDB();

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});