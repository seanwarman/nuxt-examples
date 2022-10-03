export default function (ctx, inject) {
  const plotApplicationGetService = ctx.$axios.create();
  plotApplicationGetService.setBaseURL(ctx.$config.plotDataUri);
  plotApplicationGetService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.plotApplicationGetService = plotApplicationGetService;
  inject("plotApplicationGetService", plotApplicationGetService);
}
