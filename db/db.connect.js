const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB;

const initializeDatabase = async () => {
  await mongoose
    .connect(mongoUri)
    .then(() => console.log("Successfully Connected to Database."))
    .catch((error) => console.log("Error in connected to database."));
};

module.exports = { initializeDatabase };
