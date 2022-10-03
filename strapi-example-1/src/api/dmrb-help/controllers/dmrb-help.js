'use strict';

/**
 * A set of functions called "actions" for `dmrb-help`
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::dmrb-help.dmrb-help", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::dmrb-help.dmrb-help', {
        ...query,
        populate: '*'
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
