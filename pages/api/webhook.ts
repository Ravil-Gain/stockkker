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

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const rawBody = await getRawBody(req);
    // console.log('raw body for this request is:', rawBody);
    const data = JSON.parse(Buffer.from(rawBody).toString("utf8"));
    // console.log('json data for this request is:', data);
    if ((data.status = "pending")) {
      const orderProducts: Array<string> = data.line_items.map(
        (item: any) => item.id
      );
      await createOrder("webHook", {
        products: orderProducts,
        consumables: [],
        id: v4(),
      });

      //   await createLog({
      //     id: v4(),
      //     type: "error",
      //     desc: `${data.line_items.map((i:any)=>i.id)}`,
      //     userUid: "webhook",
      //     orders: [data.id],
      //     timeStamp: new Date(),
      //     relatedConsumables: [],
      //     relatedProducts: [],
      //   });
    }

    // Handle Orders
    // if ((data.status = "pending")) {
    //   try {
    //     const products = await getProducts();
    //     const orderConsumables: string[] = [];
    //     const orderProducts: string[] = [];

    //     data.line_items.map(async (item: any) => {
    //       const findProduct = products.find((p) => p.wooId === item.product_id);
    //       if (findProduct) {
    //         for (let i = 0; i < item.quantity; i++) {
    //           orderProducts.push(findProduct.id);
    //           findProduct.consumables.map((c) => {
    //             orderConsumables.push(c.id);
    //           });
    //         }
    //       } else {
    //         console.log("Unregistered WooId product");
    //         await createLog({
    //           id: v4(),
    //           type: "error",
    //           desc: "Unregistered WooId product",
    //           userUid: "system",
    //           orders: [data.id],
    //           timeStamp: new Date(),
    //           relatedConsumables: [],
    //           relatedProducts: [item.product_id],
    //         });
    //       }
    //     });

    //     const order: IOrder = {
    //       id: data.id,
    //       consumables: orderConsumables,
    //       products: orderProducts,
    //     };
    //     await createOrder("system", order);
    //   } catch (error) {
    //     await createLog({
    //         id: v4(),
    //         type: "error",
    //         desc: "Error Creating order",
    //         userUid: "system",
    //         orders: data.line_items,
    //         timeStamp: new Date(),
    //         relatedConsumables: [],
    //         relatedProducts: [],
    //       });
    //   }
    // }
  }
  res.status(200).json({ name: "John Doe" });
  res.end();
};

export const config = {
  api: {
    bodyParser: false,
  },
};
