export default function (ctx, inject) {
  const dipGetService = ctx.$axios.create();
  dipGetService.setBaseURL(ctx.$config.dipDataUri);
  dipGetService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.dipGetService = dipGetService;
  inject("dipGetService", dipGetService);
}
