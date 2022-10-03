export default function (ctx, inject) {
  const aacPostService = ctx.$axios.create();
  aacPostService.setBaseURL(ctx.$config.dipPostUri);
  aacPostService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.aacGetService = aacPostService;
  inject("aacPostService", aacPostService);
}
