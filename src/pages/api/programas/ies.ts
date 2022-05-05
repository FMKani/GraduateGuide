import { NextApiHandler } from "next";
import prisma from "@common/libs/prisma";

const get: NextApiHandler = async (request, response) => {
  const {
    course_category,
    course_type,
    min_rate,
    max_rate,
    limit,
    page,
    has_bolsas
  } = request.query;

  const programasWhere = {
    cd_conceito_programa: { gte: +min_rate || 0, lte: +max_rate || 7 },

    nm_area_basica: course_category?.toString(),

    nm_modalidade_programa: course_type?.toLocaleString(),

    ...(has_bolsas === "true" ? { bolsas: { some: {} } } : {})
  } as any;

  const count = await prisma.ies.count({
    where: { programas: { every: {}, some: programasWhere } }
  });

  const iess = await prisma.ies.findMany({
    ...(+limit ? { take: +limit } : {}),
    ...(+limit * +page ? { skip: +limit * +page } : {}),

    include: {
      programas: {
        where: programasWhere
      }
    },

    where: { programas: { every: {}, some: programasWhere } }
  });

  response.json({
    data: iess,
    count: count,
    courseCount: iess.reduce(
      (a, { programas }) => a + programas?.length ?? 0,
      0
    ),
    page: iess.length === +limit ? +page + 1 : undefined
  });
};

const methods = { get };

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
