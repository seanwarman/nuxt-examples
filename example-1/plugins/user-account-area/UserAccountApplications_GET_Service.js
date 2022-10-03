export default function (ctx, inject) {
  const userAccountApplicationsGetService = ctx.$axios.create();
  userAccountApplicationsGetService.setBaseURL(
    ctx.$config.userAccountApplicationsDataUri
  );
  userAccountApplicationsGetService.setHeader(
    "Ocp-Apim-Subscription-Key",
    "c5511a6b5336408d8352aa7f9b327ef9"
  ); // to do replace with config var from middleware
  ctx.userAccountApplicationsGetService = userAccountApplicationsGetService;
  inject(
    "userAccountApplicationsGetService",
    userAccountApplicationsGetService
  );
}
