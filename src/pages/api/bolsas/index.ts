import { NextApiHandler } from "next";
import { defaultParse } from "@common/utils/csv";
import { parseForm } from "@common/utils/formidable";
import { Bolsa } from "@prisma/client";
import prisma from "@common/libs/prisma";

const post: NextApiHandler = async (request, response) => {
  try {
    const { files } = await parseForm(request);

    const programas = await prisma.programa.groupBy({
      by: ["id", "cd_programa_ies"]
    });

    const lookupTable: Record<string, string> = {};

    programas.forEach(
      ({ cd_programa_ies, id }) => (lookupTable[cd_programa_ies] = id)
    );

    const bolsas = defaultParse<Bolsa>(files[0].filepath).map((b) => ({
      ...b,
      qt_bolsas_concedidas: +b.qt_bolsas_concedidas || 0,
      programaId: lookupTable[b.cd_programa] || null
    }));

    await prisma.bolsa
      .createMany({ data: bolsas, skipDuplicates: true })
      .then(() => response.json({ code: "success" }));
  } catch (err) {
    console.error(err);
    response.status(err.status || 500).json({ code: err.code, detail: err });
  }
};

const get: NextApiHandler = async (request, response) => {
  response.send("GET");
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
