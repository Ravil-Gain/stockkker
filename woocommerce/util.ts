import { changeConsumableAmounts } from "@/firebase/functions/consumables";
import { createLog } from "@/firebase/functions/log";
import { createOrder, getOrder, deleteOrder } from "@/firebase/functions/orders";
import { changeShelfProductAmounts, getProducts } from "@/firebase/functions/product";
import { v4 } from "uuid";

export const arrayReducer = (
  acc: { [x: string]: any },
  value: string | number
) => ({
  ...acc,
  [value]: (acc[value] || 0) + 1,
});


export async function addOrder(data: any) {
  const orderProducts: Array<string> = [];
  const orderConsumables: Array<string> = [];
  try {
    // get products to handle consumables
    const products = await getProducts();

    // iterate every order item (item/bundle)
    data.line_items.map((item: any) => {
      const product = products.find((p) => p.wooId === item.product_id);
      if (!product) {
        orderProducts.push(`${item.product_id}, not found`);
        return;
      } else {
        for (let i = 0; i < item.quantity; i++) {
          if (!product.isBundle) {
            product.consumables.map((consum: any) => {
              for (let ci = 0; ci < consum.amount; ci++) {
                orderConsumables.push(consum.id);
              }
            });
            orderProducts.push(product.id);
          } else {
            console.log("cannot handle bundle yet");
          }
        }
      }
    });
    await createOrder("webHook", {
      products: orderProducts,
      consumables: orderConsumables,
      id: data.id.toString(),
    });
    console.log("order done ");
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

export async function completeOrder(data: any) {
  try {
    const order = await getOrder(data.id.toString());
    if (!order) throw new Error("No Order");
    const orderProducts = order.products;
    const orderConsumables = order.consumables;

    // handle Products reduction
    if (orderProducts?.length) {
      const pCounts = orderProducts.reduce(arrayReducer, {});
      const prodPromises = [];
      for (const k in pCounts) {
        const amount: number = pCounts[k] * -1;
        if (!k.includes("not found")) {
          prodPromises.push(changeShelfProductAmounts(k, amount, "webhook"));
        }
      }
      await Promise.all(prodPromises);
    }

    // handle Consumables reduction
    if (orderConsumables?.length) {
      const cCounts = orderConsumables.reduce(arrayReducer, {});
      const consumPromises = [];
      for (const k in cCounts) {
        const amount: number = cCounts[k] * -1;
        if (!k.includes("not found")) {
          consumPromises.push(changeConsumableAmounts(k, amount, "webhook"));
        }
      }
      await Promise.all(consumPromises);
    }
    console.log('products and consumables reduced');
    await deleteOrder("webhook", order.id);
  } catch (error) {
    createLog({
      id: v4(),
      type: "error",
      desc: `Error deleting Order`,
      userUid: "webhook",
      orders: [data.id.toString() || "noId"],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
    });
    return false;
  }
}

export async function cancelOrder(data: any) {
  try {
    await deleteOrder("webhook", data.id.toString());
  } catch (error) {
    createLog({
      id: v4(),
      type: "error",
      desc: `Error deleting Order`,
      userUid: "webhook",
      orders: [data.id.toString() || "noId"],
      timeStamp: new Date(),
      relatedConsumables: [],
      relatedProducts: [],
    });
    return false;
  }
}