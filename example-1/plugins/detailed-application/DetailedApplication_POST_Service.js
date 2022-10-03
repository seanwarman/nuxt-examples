export default function (ctx, inject) {
  const detailedApplicationPostService = ctx.$axios.create();
  detailedApplicationPostService.setBaseURL(ctx.$config.detailedPostUri);
  detailedApplicationPostService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.detailedApplicationPostService = detailedApplicationPostService;
  inject("detailedApplicationPostService", detailedApplicationPostService);
}
