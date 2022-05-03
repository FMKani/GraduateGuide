import { Ies } from "@prisma/client";
import papaparse from "papaparse";
import fs from "fs";

export const parseIesCsv = (filepath: string) => {
  const strdata = fs.readFileSync(filepath).toString();
  const parsed = papaparse.parse(strdata, {
    skipEmptyLines: true,
    delimiter: ";"
  });

  const headers = parsed.data[0] as string[];
  const rows = parsed.data.slice(1) as string[][];
  const iess: Ies[] = [];

  for (const row of rows) {
    const ies = {} as Ies;
    const firstHeaders = row.slice(0, 16);
    const lastHeaders = row.slice(-4);
    const phones = [];
    const emails = [];

    row.slice(16, row.length - 4).forEach((v) => {
      if (v.includes("@")) emails.push(v);
      if (/^\(\d{2}\)\d{4,5}-\d{4}$/.test(v)) phones.push(v);
    });

    ies.telefones = phones.join(",") || null;
    ies.emails = emails.join(",") || null;

    headers.slice(0, 16).forEach((h, i) => {
      ies[h] = firstHeaders[i] || null;
    });

    headers.slice(-4).forEach((h, i) => {
      ies[h] = lastHeaders[i] || null;
    });

    iess.push(ies);
  }

  return iess;
};

export const defaultParse = <T>(filepath: string) => {
  const strdata = fs.readFileSync(filepath).toString("latin1");
  const parsed = papaparse.parse<string[]>(strdata, {
    skipEmptyLines: true,
    delimiter: ";"
  });

  const headers = parsed.data[0].map((v) => v.toLowerCase());
  const rows = parsed.data.slice(1);
  const entries: T[] = [];

  for (const row of rows) {
    const entry = {} as T;
    headers.forEach(
      (h, i) =>
        (entry[h] = ["não informada", "na", "não se aplica"].includes(
          row[i].toString().toLowerCase()
        )
          ? null
          : row[i])
    );
    entries.push(entry);
  }

  return entries;
};

// export const parseProgramasCsv = (filepath: string) => {
//   const strdata = fs.readFileSync(filepath).toString("latin1");
//   const parsed = papaparse.parse<string[]>(strdata, {
//     fastMode: true,
//     skipEmptyLines: true,
//     dynamicTyping: true
//   });

//   const headers = parsed.data[0].map((v) => v.toLowerCase());
//   const rows = parsed.data.slice(1) as string[][];
//   console.log(headers);
//   // const bolsas: Bolsa[] = [];
// };
