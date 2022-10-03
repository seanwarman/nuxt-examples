export default function (ctx, inject) {
  const investmentApplicationCreateService = ctx.$axios.create();
  investmentApplicationCreateService.setBaseURL(
    ctx.$config.investmentApplicationCreateServiceUri
  );
  investmentApplicationCreateService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.investmentApplicationCreateService = investmentApplicationCreateService;
  inject(
    "investmentApplicationCreateService",
    investmentApplicationCreateService
  );
}
