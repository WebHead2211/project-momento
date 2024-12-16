import "dotenv/config";
import connectDb from "./db/index.js";
import { app } from "./app.js";

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log("App error: ", error);
      throw error;
    });
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server is running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed! ", error);
  });
