import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import { addOrder, cancelOrder, completeOrder } from "@/woocommerce/util";
import { createLog } from "@/firebase/functions/log";
import { v4 } from "uuid";

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    let description: string = "";
    let type: "log" | "error" = "log";
    let orderId: string = "not_figured";
    let result, status;
    try {
      const rawBody = await getRawBody(req);
      const data = JSON.parse(Buffer.from(rawBody).toString("utf8"));
      orderId = data.id.toString();
      status = data.status;
      switch (data.status) {
        case "processing":
          // handle creating and prepare Log
          result = await addOrder(data);
          typeof result === "string"
            ? ((description = result), (type = "error"))
            : (description = "Order processing");

          break;
        case "completed":
          // handle completing and prepare Log
          result = await completeOrder(data);
          typeof result === "string"
            ? ((description = result), (type = "error"))
            : (description = "Order Completed");

          break;
        case "cancelled":
          // handle deleting and prepare Log
          result = await cancelOrder(data);
          typeof result === "string"
            ? ((description = result), (type = "error"))
            : (description = "Order cancelled");

          break;
        default:
          status = 'unhandled';
          break;
      }
    } catch (error: any) {
      description = `error, ${error.message || ""}`;
      type = "error";
    } finally {
      if (status === "unhandled") return; // to avoid writing extra logs
      createLog({
        id: v4(),
        type: type,
        desc: description,
        userUid: "webHook",
        orders: [orderId],
        timeStamp: new Date(),
      });
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
