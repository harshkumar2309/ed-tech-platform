import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectWithDB } from "./src/config/database.js";

const PORT = process.env.PORT || 4000;

// Connect to database
connectWithDB();

// Start server
app.listen(PORT, () => {
  console.log(`App is running at http://localhost:${PORT}`);
});
