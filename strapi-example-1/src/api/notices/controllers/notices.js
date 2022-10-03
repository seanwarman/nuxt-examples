'use strict';

/**
 * A set of functions called "actions" for `notices`
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController('api::notices.notices', ({ strapi }) => ({
  count(ctx) {
    var { query } = ctx.request
    return strapi.query('api::notices.notices').count({ where: query });
  },
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::notices.notices', {
        ...query,
        populate: '*'
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
