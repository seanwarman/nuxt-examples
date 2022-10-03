export default function (ctx, inject) {
  const dipPostService = ctx.$axios.create();
  dipPostService.setBaseURL(ctx.$config.dipPostUri);
  dipPostService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.dipGetService = dipPostService;
  inject("dipPostService", dipPostService);
}
