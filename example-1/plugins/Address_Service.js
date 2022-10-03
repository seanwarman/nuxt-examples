export default function (ctx, inject) {
  const addressService = ctx.$axios.create();
  addressService.setBaseURL("https://api.addressian.co.uk/v2/autocomplete/");
  addressService.setHeader("x-api-key", ctx.$config.addressApiToken); // to do replace with config var from middleware
  ctx.addressService = addressService;
  inject("addressService", addressService);
}
