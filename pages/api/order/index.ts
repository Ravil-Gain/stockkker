import type { NextApiRequest, NextApiResponse } from "next";

// maintain Orders adding and deleting when fulfilled
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const requestMethod = req.method;
  switch (requestMethod) {
    // When Order added from WooCommerce, reserve order goods and consumables for it
    case "POST":
      res.status(200).json([]);

    // When Order is complete, decrese amount of used goods and consumables
    case "DELETE":
      res.status(200).json([]);

    // handle other HTTP methods
    default:
      res.status(501).statusMessage ='not implimented';
  }
}
