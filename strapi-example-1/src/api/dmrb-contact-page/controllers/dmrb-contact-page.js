'use strict';

/**
 * A set of functions called "actions" for `dmrb-contact-page`
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::dmrb-contact-page.dmrb-contact-page", ({ strapi }) => ({
  async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::dmrb-contact-page.dmrb-contact-page', {
        ...query,
        populate: '*'
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
}));
