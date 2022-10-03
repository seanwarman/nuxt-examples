'use strict';
require("dotenv").config({ path: "../../.env" });

async function createAdministrator() {
  console.log(`Creating Administrator...`);
  const ADMIN_USERNAME = process.env.ADMIN_USERNAME;
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
  const ADMIN_FIRSTNAME = process.env.ADMIN_FIRSTNAME;
  const ADMIN_SURNAME = process.env.ADMIN_SURNAME;

  const isEmpty = (string) => string === "" || string == undefined || string == null;

  const hasAdmin = await strapi.service('admin::user').exists();

  if (hasAdmin) {
    console.log('Already has admin user - stopping');
    return;
  }

  const superAdminRole = await strapi.service('admin::role').getSuperAdmin();

  if (!superAdminRole) {
    return;
  }

  if ([ADMIN_USERNAME, ADMIN_PASSWORD, ADMIN_EMAIL].some(isEmpty)) {
    console.log(`Empty env var found, skipping`);
    return;
  }

  await strapi.service('admin::user').create({
    email: ADMIN_EMAIL,
    firstname: ADMIN_FIRSTNAME,
    lastname: ADMIN_SURNAME,
    password: ADMIN_PASSWORD,
    registrationToken: null,
    isActive: true,
    roles: superAdminRole ? [superAdminRole.id] : [],
  });

  console.log(`Created New Admin User: ${ADMIN_EMAIL}`);
}

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap(/*{ strapi }*/) {
    await createAdministrator();
  },
};
