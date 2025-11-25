import { db } from "../database/databaseInit.ts";

export interface DataMedicine {
  id: number;
  name: string;
  price: number;
  stock: number;
}

export const findDrug = (query: string): DataMedicine | undefined => {
  const selectData = db.prepare(`
    SELECT * FROM medicines
    WHERE lower(description) LIKE lower(?)
    LIMIT 1
  `);

  const result = selectData.get(`%${query}%`);

  return result as DataMedicine | undefined;
};
