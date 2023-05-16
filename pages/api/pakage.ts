import type { NextApiRequest, NextApiResponse } from "next";

// this maintains a small pakages of goods

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  console.log(req, res);

  const requestMethod = req.method;
  const body = JSON.parse(req.body);
  switch (requestMethod) {
    // Get consumables amout
    case "GET":
      res.status(200).json([]);
    // change consumables amounts
    case "PATCH":
      res.status(200).json([]);

    // handle other HTTP methods
    default:
      res.status(501).statusMessage ='not implimented';
  }
}
