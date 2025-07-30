// backend/services/permissionService.js
const AccessRole = require('../models/AccessRole');

let permissionsMap = {};

/**
 * Load all accessRoles from Mongo into an object:
 *   { roleName: [actions], ... }
 */
async function loadPermissions() {
  const roles = await AccessRole.find().lean();
  permissionsMap = roles.reduce((acc, role) => {
    acc[role.name] = role.permission || [];
    return acc;
  }, {});
  console.log('Loaded permissions for roles:', Object.keys(permissionsMap));
}

/**
 * Check if a given roleName is allowed a specific action
 * @param {string} roleName 
 * @param {string} action 
 */
function can(roleName, action) {
  const perms = permissionsMap[roleName] || [];
  return perms.includes(action);
}

module.exports = { loadPermissions, can };
