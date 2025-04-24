const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth.Route");
const sequelize = require("./config/db"); 
const userProfileRouter = require("./routes/userProfile.route");
const postrouter = require("./routes/post.router");
const db = require("./models");  // Adjust path if necessary
const friendRequestRouter = require("./routes/friendRequest.route");

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);
app.use('/api/userProfile', userProfileRouter);
app.use('/api/post', postrouter);
app.use("/api/friends", friendRequestRouter);





db.sequelize.sync({ alter: true })  // Use `alter` to create missing tables
  .then(() => {
    console.log("Database synced successfully");
    app.listen(5000, () => console.log("Server running on http://localhost:5000"));
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

const port = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully.");
    
    app.listen(port, () => {
      console.log(` Server running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error(" Unable to connect to the database:", error);
  }
};

startServer();
