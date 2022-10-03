export default function (ctx, inject) {
  const middlewareService = ctx.$axios.create();
  middlewareService.setBaseURL(`${ctx.$config.baseUrl}`);
  ctx.middlewareService = middlewareService;
  inject("middlewareService", middlewareService);
}
