import { changeConsumableAmounts } from "@/firebase/functions/consumables";
import {
  createOrder,
  getOrder,
  deleteOrder,
} from "@/firebase/functions/orders";
import {
  changeShelfProductAmounts,
  getProducts,
} from "@/firebase/functions/product";
import { v4 } from "uuid";
import wooCommerce from "./woocommerce";

export const orderReducer = (
  acc: { [x: string]: any },
  value: string | number
) => ({
  ...acc,
  [value]: (acc[value] || 0) + 1,
});

export async function addOrder(data: any) {
  const orderDate = new Date(data.date_created || null);
  const orderProducts: Array<string> = [];
  const orderConsumables: Array<string> = [];
  try {
    // lets get a locale to fetch proper products
    const locale = data.meta_data.find(
      (meta: { key: string }) => meta.key === "wpml_language"
    ).value;

    // get products to handle consumables
    const products = await getProducts();

    for (const item of data.line_items) {
      let product;
      if (locale !== "et") {
        // very sad situation better to stick with one approach
        const original_id = await wooCommerce
          .get("products", { id: item.product_id })
          .then(
            (data) =>
              data.data.meta_data.find(
                (meta: { key: string }) => meta.key === "original_id"
              )?.value || data.data.translations["et"]
          );
        // remove when all wooIds changed to string
        const newId = Number(original_id);
        // @ts-ignore
        product = products.find((p) => p.wooId === newId.toString());
      } else {
        product = products.find((p) => p.wooId === item.product_id.toString());
      }

      // if we don't have such product
      if (!product) {
        console.log("not found", item);
        orderProducts.push(`${item.product_id}, not found`);
        // return "";
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
            // product is bundle
            product.products.map((bp) => {
              const bundleProduct = products.find((p) => p.wooId === bp);
              if (bundleProduct) {
                orderProducts.push(bundleProduct.id);
                for (let ci = 0; ci < bundleProduct.consumables.length; ci++) {
                  orderConsumables.push(bundleProduct.consumables[ci].id);
                }
              }
            });
          }
        }
      }
    }
    console.log("orderProducts", orderProducts);

    const orderCreation = await createOrder("webHook", {
      products: orderProducts,
      date: orderDate,
      consumables: orderConsumables,
      id: data.id.toString(),
    });
    return orderCreation;
  } catch (error: any) {
    return `Error adding Order, ${error.message.toString() || ""}`;
  }
}

export async function completeOrder(data: any) {
  try {
    const order = await getOrder(data.id.toString());
    if (!order) throw new Error("No such Order");
    const orderProducts = order.products;
    const orderConsumables = order.consumables;

    // handle Products reduction
    if (orderProducts?.length) {
      const pCounts = orderProducts.reduce(orderReducer, {});
      const prodPromises = [];
      for (const k in pCounts) {
        const amount: number = pCounts[k] * -1;
        if (!k.includes("not found"))
          prodPromises.push(changeShelfProductAmounts(k, amount, "webhook"));
      }
      await Promise.all(prodPromises)
        .then((val) => {})
        .catch((error) => {
          throw new Error("Error changeShelfProductAmounts");
        });
    }

    // handle Consumables reduction
    if (orderConsumables?.length) {
      const cCounts = orderConsumables.reduce(orderReducer, {});
      const consumPromises = [];
      for (const k in cCounts) {
        const amount: number = cCounts[k] * -1;
        if (!k.includes("not found")) {
          consumPromises.push(changeConsumableAmounts(k, amount, "webhook"));
        }
      }
      await Promise.all(consumPromises)
        .then((val) => {})
        .catch((error) => {
          throw new Error("Error changeConsumableAmounts");
        });
    }
    console.log("products and consumables reduced");
    await deleteOrder("webhook", order.id);
    return true;
  } catch (error: any) {
    return `Error completing Order, ${error.message.toString() || ""}`;
  }
}

export async function cancelOrder(data: any) {
  return deleteOrder("webhook", data.id.toString());
}

export async function updateOrders() {
  try {
    const orders = await wooCommerce.get("orders", { status: "processing" });
    const orderPromises: Array<any> = [];

    for (const order of orders.data) {
      const orderPromise = addOrder(order);
      orderPromises.push(orderPromise);
    }

    await Promise.all(orderPromises)
      .then((val) => {})
      .catch((error) => {
        throw new Error("Error updating Orders");
      });
  } catch (error) {}
  return "success";
}
