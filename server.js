import app from "./src/app.js";
import "dotenv/config";

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit"));
});
