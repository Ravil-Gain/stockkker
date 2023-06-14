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

export default (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    let description: string;
    let type: "log" | "error" = "log";
    let orderId: string = "not_figured";
    getRawBody(req)
      .then((rawBody) => {
        const data = JSON.parse(Buffer.from(rawBody).toString("utf8"));
        orderId = data.id.toString();
        switch (data.status) {
          case "processing":
            // handle creating and prepare Log
            addOrder(data).then((result: boolean | string) =>
              typeof result === "string"
                ? ((description = result), (type = "error"))
                : (description = "Order Deleted")
            );
            break;
          case "completed":
            // handle completing and prepare Log
            completeOrder(data).then((result: boolean | string) =>
              typeof result === "string"
                ? ((description = result), (type = "error"))
                : (description = "Order Deleted")
            );
            break;
          case "cancelled":
            // handle deleting and prepare Log
            cancelOrder(data).then((result: boolean | string) =>
              typeof result === "string"
                ? ((description = result), (type = "error"))
                : (description = "Order Deleted")
            );
            break;
          default:
            break;
        }
        description = "success";
      })
      .catch((error) => {
        description = `error, ${error.message || ""}`;
        type = "error";
      })
      .finally(() =>
        createLog({
          id: v4(),
          type: type,
          desc: description,
          userUid: "webHook",
          orders: [orderId],
          timeStamp: new Date(),
        })
      );
  }
  res.status(200);
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};
