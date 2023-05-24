import type { NextApiRequest, NextApiResponse } from "next";

// this single product

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const requestMethod = req.method;
  switch (requestMethod) {
    // Get product by id
    case "GET":
        return res.json({first:"da"});

    // // Create product
    // case "POST":
    //   res.status(200).json([]);
    //   break;

    // // change product
    // case "PATCH":
    //   res.status(200).json([]);
    //   break;

    // // delete product
    // case "DELETE":
    //   res.status(200).json([]);
    //   break;
  }
}
