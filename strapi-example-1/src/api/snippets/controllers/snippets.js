'use strict';

/**
 * A set of functions called "actions" for `snippets`
 */

 const { createCoreController } = require("@strapi/strapi").factories;

 module.exports = createCoreController('api::snippets.snippets', ({}) => ({
   count(ctx) {
     var { query } = ctx.request
     return strapi.query('api::snippets.snippets').count({ where: query });
   },
   async find(ctx) {
    const { query } = ctx;

    const entity = await strapi.entityService.findMany('api::snippets.snippets', {
        ...query,
        populate: '*',
    });
    const sanitizedEntity = await this.sanitizeOutput(entity, ctx);

    return this.transformResponse(sanitizedEntity);
  }
 }));
