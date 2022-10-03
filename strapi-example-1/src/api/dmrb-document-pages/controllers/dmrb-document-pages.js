'use strict';

/**
 * A set of functions called "actions" for `dmrb-document-page`
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::dmrb-document-pages.dmrb-document-pages", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::dmrb-document-pages.dmrb-document-pages', {
        ...query,
        populate: '*'
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
