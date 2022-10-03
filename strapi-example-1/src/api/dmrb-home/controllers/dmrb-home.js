'use strict';

/**
 * A set of functions called "actions" for `dmrb-home`
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::dmrb-home.dmrb-home", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::dmrb-home.dmrb-home', {
        ...query,
        populate: '*'
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
