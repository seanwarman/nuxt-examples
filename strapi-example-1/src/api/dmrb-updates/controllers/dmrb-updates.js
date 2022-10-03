'use strict';

/**
 * A set of functions called "actions" for `dmrb-updates`
 */


const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::dmrb-updates.dmrb-updates", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::dmrb-updates.dmrb-updates', {
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
