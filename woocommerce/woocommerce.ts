import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";
const opt: WooRestApiOptions = {
  url: "https://naturka.ee",
  consumerKey: process.env.NEXT_PUBLIC_CUSTOMER_KEY || "",
  consumerSecret: process.env.NEXT_PUBLIC_CUSTOMER_SECRET || "",
  version: "wc/v3",
  queryStringAuth: false, // Force Basic Authentication as query string true and using under
};
const wooCommerce = new WooCommerceRestApi(opt);

export default wooCommerce;
