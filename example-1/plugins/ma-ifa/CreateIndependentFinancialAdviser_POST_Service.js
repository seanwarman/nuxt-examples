export default function (ctx, inject) {
  const createIFAService = ctx.$axios.create();
  createIFAService.setBaseURL(ctx.$config.createIFACompanyPostUri);
  createIFAService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.createIFAService = createIFAService;
  inject("createIFAService", createIFAService);
}
