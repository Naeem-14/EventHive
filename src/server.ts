import app from "./app";
import config from "./config/env";
import { initDb } from "./config/db";

function main() {
  initDb();

  app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`);
  });
}

main();
