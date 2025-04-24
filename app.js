import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/auth.Route.js";
import sequelize from "./config/db.js";
import userProfileRouter from "./routes/userProfile.route.js";
import db from "./models/index.js";
import friendRequestRouter from "./routes/friendRequest.route.js";
import commentRouter from "./routes/comments.route.js";
import postRouter from "./routes/post.route.js"

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/userProfile", userProfileRouter);
app.use("/api/post", postRouter);
app.use("/api/friends", friendRequestRouter);
app.use("/api/comments", commentRouter);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");

    await db.sequelize.sync({ alter: true });
    console.log(" Database synced successfully.");

    app.listen(port, () => {
      console.log(` Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
  }
};

startServer();
