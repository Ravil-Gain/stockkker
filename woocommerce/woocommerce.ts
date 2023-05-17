import WooCommerceRestApi, { WooRestApiOptions } from "woocommerce-rest-ts-api";
const opt: WooRestApiOptions = {
  url: "https://naturka.ee",
  consumerKey: "ck_247cdce43ea2c58e1995785d52a048633155d993",
  consumerSecret: "cs_881ea4aa30ba8aa3b4447733828e803137d5beb7",
  version: "wc/v3",
  queryStringAuth: false, // Force Basic Authentication as query string true and using under
};
const api = new WooCommerceRestApi(opt);

export default api;