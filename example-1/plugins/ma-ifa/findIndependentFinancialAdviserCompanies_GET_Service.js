export default function (ctx, inject) {
  const getIFAcompaniesService = ctx.$axios.create();
  getIFAcompaniesService.setBaseURL(ctx.$config.getIFACompaniesUri);
  getIFAcompaniesService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.getIFAcompaniesService = getIFAcompaniesService;
  inject("getIFAcompaniesService", getIFAcompaniesService);
}
