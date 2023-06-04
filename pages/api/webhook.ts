import { IOrder } from "@/firebase/firestore/order";
import { createOrder } from "@/firebase/functions/orders";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import { getProducts } from "@/firebase/functions/product";
import { createLog } from "@/firebase/functions/log";
import { v4 } from "uuid";

async function getRawBody(readable: Readable): Promise<Buffer> {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

async function addOrder(data: any) {
  const orderProducts: Array<string> = [];
  const orderConsumables: Array<string> = [];
  try {
    // get products to handle consumables
    const products = await getProducts();

    // iterate every order item (item/bundle)
    data.line_items.map((item: any) => {
      const product = products.find((p) => p.id === item.product_id);
      for (let i = 0; i < item.quantity; i++) {
        if (!product) continue;
        if (!product.isBundle) {
          product.consumables.map((consum: any) => {
            for (let ci = 0; ci < consum.amount; ci++) {
              orderConsumables.push(consum.id);
            }
          });
          orderProducts.push(item.product_id);
        } else {
          console.log("cannot handle bundle yet");
        }
      }
    });
    await createOrder("webHook", {
      products: orderProducts,
      consumables: orderConsumables,
      id: data.id,
    });
  } catch (error) {
    createLog({
      id: v4(),
      type: "error",
      desc: `Error addingOrder, ${error}`,
      userUid: "webhook",
      orders: [],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
    });
  }
}

async function removeOrder(data: any) {
  try {
  } catch (error) {
    return false;
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const rawBody = await getRawBody(req);
    const data = JSON.parse(Buffer.from(rawBody).toString("utf8"));

    // adding Order
    if ((data.status = "processing")) await addOrder(data);

    // if ((data.status = "complete")) await removeOrder(data);
  }
  res.status(200);
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};
