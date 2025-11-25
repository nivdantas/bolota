import Database from "better-sqlite3";
import fs from "fs";
import csv from "csv-parser";

interface DataMedicine {
  description: string;
  price: number;
  stock: number;
}

const db = new Database("medication.db", { verbose: console.log });

db.pragma("journal_mode = WAL");

export const initDatabase = async (csvPath: string) => {
  db.exec(`
		CREATE TABLE IF NOT EXISTS "medicines"(
		"id" INTEGER PRIMARY KEY AUTOINCREMENT,
		"description" TEXT NOT NULL UNIQUE,
		"price" REAL NOT NULL,
		"stock" INTEGER NOT NULL
		)STRICT;`);

  const count = db.prepare("SELECT count(*) as count FROM medicines").get() as {
    count: number;
  };

  if (count.count > 0) {
    console.log("DB já possui população.");
    return;
  }
  db.prepare(
    `INSERT INTO "sqlite_sequence" (name, seq) VALUES ('medicines', 1000)`,
  );
  const insertData = db.prepare(
    `INSERT INTO "medicines" ("description", "price", "stock") VALUES (@description, @price, @stock)`,
  );

  const insertAll = db.transaction((rows: DataMedicine[]) => {
    for (const row of rows) insertData.run(row);
  });

  const rows: DataMedicine[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on("data", (data) => {
        rows.push({
          description: data["descricao"],
          price: data["preco"],
          stock: data["estoque"],
        });
      })
      .on("end", () => {
        insertAll(rows);
        console.log(`${rows.length} medicamentos adicionados!`);
        resolve(true);
      })
      .on("error", reject);
  });
};

export { db };
