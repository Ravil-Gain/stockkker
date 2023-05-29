import type { NextApiRequest, NextApiResponse } from "next";

// this maintains a palletes of pakages

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  const requestMethod = req.method;
  switch (requestMethod) {
    // Get all products
    case "GET":
      // return res.json({first:"da"});
  }
}
