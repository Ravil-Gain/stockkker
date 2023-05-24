import type { NextApiRequest, NextApiResponse } from "next";

// this maintains consumables

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  console.log(req, res);

  const requestMethod = req.method;
  const body = JSON.parse(req.body);
  switch (requestMethod) {
    // create new consumable with amount
    case "POST":
      res.status(200).json([]);
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
