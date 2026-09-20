import "reflect-metadata";

import app from "./app.js";

import { env } from "./config/env.js";
import { AppDataSource } from "./config/database.js";

const startServer = async () => {
  try {
    await AppDataSource.initialize();

    console.log("Database connected successfully");

    app.listen(env.port, () => {
      console.log(
        `2FA Backend running on http://localhost:${env.port}`,
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);

    process.exit(1);
  }
};

startServer();