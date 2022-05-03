import { apiMapQueryKeysToColumns } from "@common/utils/etc";
import { NextApiHandler } from "next";
import { parseIesCsv } from "@common/utils/csv";
import { parseForm } from "@common/utils/formidable";
import { Prisma } from "@prisma/client";
import prisma from "@common/libs/prisma";

const post: NextApiHandler = async (request, response) => {
  try {
    const { files } = await parseForm(request);
    const iess = parseIesCsv(files[0].filepath);

    await prisma.ies
      .createMany({ data: iess, skipDuplicates: true })
      .then(() => response.json({ code: "success" }));
  } catch (err) {
    response.status(err.status || 500).json({ code: err.code, detail: err });
  }
};

const get: NextApiHandler = async (request, response) => {
  const { limit, order_by, page, distinct, ies_name, ...query } = request.query;
  const search = apiMapQueryKeysToColumns(query, false);

  const iess = await prisma.ies.findMany({
    ...(+limit ? { take: +limit } : {}),
    ...(page ? { skip: +page * +limit } : {}),
    ...(order_by ? { orderBy: { [order_by.toString()]: "asc" } } : {}),
    ...(distinct
      ? {
          distinct:
            distinct.toString() as Prisma.Enumerable<Prisma.IesScalarFieldEnum>
        }
      : {}),
    where: {
      ...search,
      nome_ies: {
        mode: "insensitive",
        startsWith: ies_name?.toString()
      },
      estado: {
        mode: "insensitive",
        equals: search.estado
      },
      programas: { some: { NOT: { id: undefined } } }
    }
  });

  response.json({
    data: iess,
    page: +page + 1 || undefined
  });
};

const methods = { get, post };

const handler: NextApiHandler = (request, response) => {
  const method = request.method.toLowerCase();
  const methodHandler = methods[method];

  if (!methodHandler) {
    response.setHeader("Allow", "GET, POST");
    response.status(405).end();
    return;
  }

  return methodHandler(request, response);
};

export default handler;

export const config = {
  api: { bodyParser: false }
};
