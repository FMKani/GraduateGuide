import { Bolsa, Programa } from "@prisma/client";

export type Course = Programa & {
  _count: { producoes: number };
  bolsas: Bolsa[];
};
