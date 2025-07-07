import { BaseApiClient } from "./base";
import { CheckoutEndpoints } from "../endpoints/checkout";
import { OrderEndpoints } from "../endpoints/orders";
import { ProductEndpoints } from "../endpoints/products";

export class CommercifyApiClient extends BaseApiClient {
  public checkout: CheckoutEndpoints;
  public products: ProductEndpoints;
  public orders: OrderEndpoints;

  constructor(baseURL: string) {
    super(baseURL);
    this.checkout = new CheckoutEndpoints(this);
    this.products = new ProductEndpoints(this);
    this.orders = new OrderEndpoints(this);
  }
}
