export default function (ctx, inject) {
  const investmentApplicationsGetService = ctx.$axios.create();
  investmentApplicationsGetService.setBaseURL(
    ctx.$config.investmentApplicationsGetServiceUri
  );
  investmentApplicationsGetService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.investmentApplicationsGetService = investmentApplicationsGetService;
  inject("investmentApplicationsGetService", investmentApplicationsGetService);
}
