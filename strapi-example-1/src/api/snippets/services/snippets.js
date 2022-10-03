'use strict';

/**
 * snippets service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService('api::notices.notices');
