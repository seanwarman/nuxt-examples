'use strict';

/**
 * A set of functions called "actions" for `dmrb-search-results`
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::dmrb-search-results.dmrb-search-results", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::dmrb-search-results.dmrb-search-results', {
        ...query,
        populate: {
          sidebar_panel_snippets: {
            populate: '*'
          }
        }
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
