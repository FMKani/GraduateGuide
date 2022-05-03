import { NextApiRequest } from "next";
import formidable from "formidable";

interface ParseFormResult {
  fields: formidable.Fields;
  files: formidable.File[];
}

export const parseForm = (request: NextApiRequest) => {
  return new Promise<ParseFormResult>((resolve, reject) => {
    formidable().parse(request, (err, fields, files) => {
      if (err) {
        reject(err);
        return;
      }
      resolve({ fields, files: Object.values(files) as formidable.File[] });
    });
  });
};
