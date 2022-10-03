'use strict';

/**
 * dmrb-archive service.
 */

const { createCoreService } = require("@strapi/strapi").factories;
const qs = require('qs');

module.exports = createCoreService("api::dmrb-archive.dmrb-archive");
