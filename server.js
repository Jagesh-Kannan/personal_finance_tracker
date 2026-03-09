const express = require("express");
const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
const { connection_error } = require("./errorHandler/dbError");
const errorhandler = require("./controller/error.controller");
const expense_route = require("./router/expense.route");

dotenv.config({ path: "./config.env" });

const app = express();
const port = process.env.PORT;
const db_url = process.env.DB_URL;
const db_name = process.env.DB_NAME;

app.use(express.json());

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`);
});

app.use('/api/v1/expense', expense_route);

// Error handling middleware (must be last)
app.use(errorhandler.handle_error);

mongoose
  .connect(db_url, {
    dbName: db_name,
  })
  .then(() => {
    console.log("Successfully connected to DB.");
  })
  .catch(connection_error);
