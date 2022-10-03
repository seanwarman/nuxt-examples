export default function (ctx, inject) {
  const getIFAService = ctx.$axios.create();
  getIFAService.setBaseURL(ctx.$config.ifaGetUri);
  getIFAService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.getIFAService = getIFAService;
  inject("getIFAService", getIFAService);
}
