import type { NextApiRequest, NextApiResponse } from "next";

// this maintains a small pakages of goods

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const requestMethod = req.method;
  // const body = JSON.parse(req.body);
  switch (requestMethod) {
    // Get consumables amout
    case "GET":
      // return res.json({first:"da"});
    // change consumables amounts
    case "PATCH":
      return res.status(200).json([]);
  }
}
