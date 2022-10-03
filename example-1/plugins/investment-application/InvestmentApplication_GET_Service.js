export default function (ctx, inject) {
  const investmentApplicationGetService = ctx.$axios.create();
  investmentApplicationGetService.setBaseURL(
    ctx.$config.investmentApplicationGetServiceUri
  );
  investmentApplicationGetService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.investmentApplicationGetService = investmentApplicationGetService;
  inject("investmentApplicationGetService", investmentApplicationGetService);
}
