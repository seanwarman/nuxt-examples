export default function (ctx, inject) {
  const detailedApplicationGetService = ctx.$axios.create();
  detailedApplicationGetService.setBaseURL(ctx.$config.detailedDataUri);
  detailedApplicationGetService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.detailedApplicationGetService = detailedApplicationGetService;
  inject("detailedApplicationGetService", detailedApplicationGetService);
}
