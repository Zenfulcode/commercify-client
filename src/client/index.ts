import { BaseApiClient } from "./base";
import { CheckoutEndpoints } from "../endpoints/checkout";
import { OrderEndpoints } from "../endpoints/orders";
import { ProductEndpoints } from "../endpoints/products";
import { CategoryEndpoints } from "../endpoints/categories";
import { CurrencyEndpoints } from "../endpoints/currencies";
import { DiscountEndpoints } from "../endpoints/discounts";
import { ShippingEndpoints } from "../endpoints/shipping";
import { AuthEndpoints } from "../endpoints/auth";
import { UserEndpoints } from "../endpoints/users";
import { PaymentProviderEndpoints } from "../endpoints/payment-providers";
import { AdminEndpoints } from "../endpoints/admin";
import { HealthEndpoints } from "../endpoints/health";
import { WebhookEndpoints } from "../endpoints/webhooks";

export class CommercifyApiClient extends BaseApiClient {
  public checkout: CheckoutEndpoints;
  public products: ProductEndpoints;
  public orders: OrderEndpoints;
  public categories: CategoryEndpoints;
  public currencies: CurrencyEndpoints;
  public discounts: DiscountEndpoints;
  public shipping: ShippingEndpoints;
  public auth: AuthEndpoints;
  public users: UserEndpoints;
  public paymentProviders: PaymentProviderEndpoints;
  public admin: AdminEndpoints;
  public health: HealthEndpoints;
  public webhooks: WebhookEndpoints;

  constructor(baseURL: string) {
    super(baseURL);
    this.checkout = new CheckoutEndpoints(this);
    this.products = new ProductEndpoints(this);
    this.orders = new OrderEndpoints(this);
    this.categories = new CategoryEndpoints(this);
    this.currencies = new CurrencyEndpoints(this);
    this.discounts = new DiscountEndpoints(this);
    this.shipping = new ShippingEndpoints(this);
    this.auth = new AuthEndpoints(this);
    this.users = new UserEndpoints(this);
    this.paymentProviders = new PaymentProviderEndpoints(this);
    this.admin = new AdminEndpoints(this);
    this.health = new HealthEndpoints(this);
    this.webhooks = new WebhookEndpoints(this);
  }
}
