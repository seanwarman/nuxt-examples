'use strict';

/**
 * notices service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService('api::notices.notices');
