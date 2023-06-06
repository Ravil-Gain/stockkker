import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import { addOrder, cancelOrder, completeOrder } from "@/woocommerce/util";

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const rawBody = await getRawBody(req);
    const data = JSON.parse(Buffer.from(rawBody).toString("utf8"));
    console.log(data.status);

    switch (data.status) {
      case "processing":
        await addOrder(data);
        break;

      case "completed":
        await completeOrder(data);
        break;

      case "cancelled":
        await cancelOrder(data);
        break;

      default:
        break;
    }
  }
  res.status(200);
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};
