const express = require("express");
const dotenv = require("dotenv");
const authRouter = require("./routes/auth.Route");
const sequelize = require("./config/db"); 

dotenv.config();
const app = express();

app.use(express.json());
app.use('/api/auth', authRouter);

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
