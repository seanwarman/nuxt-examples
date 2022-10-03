export default function (ctx, inject) {
  const assignIFAService = ctx.$axios.create();
  assignIFAService.setBaseURL(ctx.$config.assignIFAToCaseUri);
  assignIFAService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.assignIFAService = assignIFAService;
  inject("assignIFAService", assignIFAService);
}
