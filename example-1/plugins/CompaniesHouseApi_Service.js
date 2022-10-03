export default function (ctx, inject) {
  const companiesHouseApiService = ctx.$axios.create();
  companiesHouseApiService.setBaseURL(
    "https://api.companieshouse.gov.uk/company/"
  );
  companiesHouseApiService.setHeader(
    "Authorization",
    `Basic ${Buffer.from(ctx.$config.companiesHouseApiToken, "binary").toString(
      "base64"
    )}`
  );
  ctx.companiesHouseApiService = companiesHouseApiService;
  inject("companiesHouseApiService", companiesHouseApiService);
}
