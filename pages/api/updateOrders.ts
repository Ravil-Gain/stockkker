import { NextApiRequest, NextApiResponse } from "next";
import { updateOrders } from "@/woocommerce/util";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    await updateOrders();
  }
  res.status(200);
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};
