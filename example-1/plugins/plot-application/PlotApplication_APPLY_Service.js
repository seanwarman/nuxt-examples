export default function (ctx, inject) {
  const plotApplicationApplyService = ctx.$axios.create();
  plotApplicationApplyService.setBaseURL(ctx.$config.plotApplyUri);
  plotApplicationApplyService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.plotApplicationApplyService = plotApplicationApplyService;
  inject("plotApplicationApplyService", plotApplicationApplyService);
}
