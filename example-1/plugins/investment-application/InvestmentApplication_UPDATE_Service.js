export default function (ctx, inject) {
  const investmentApplicationUpdateService = ctx.$axios.create();
  investmentApplicationUpdateService.setBaseURL(
    ctx.$config.investmentApplicationUpdateServiceUri
  );
  investmentApplicationUpdateService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.investmentApplicationUpdateService = investmentApplicationUpdateService;
  inject(
    "investmentApplicationUpdateService",
    investmentApplicationUpdateService
  );
}
