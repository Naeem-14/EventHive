import app from "./app";
import config from "./config";
import { initDb } from "./db";

function main() {
  initDb();

  app.listen(config.port, () => {
    console.log(`App running on port ${config.port}`);
  });
}

main();
