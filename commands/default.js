const { Command, Constants } = require("wolf.js");
const { api } = require("../bot");
const { create } = require("../ctrl");

const COMMAND_TRIGER = `${api.config.keyword}_default_command`;

Default = async (api, command) => {
  /* let okay = await api
    .utility()
    .subscriber()
    .privilege()
    .has(command.sourceSubscriberId, Constants.Privilege.STAFF, false); */
  let okay = await api
    .utility()
    .group()
    .member()
    .hasCapability(
      command.targetGroupId,
      command.sourceSubscriberId,
      Constants.Capability.ADMIN,
      true
    );
  if (okay) {
    await create(command);
  }
};

module.exports = new Command(COMMAND_TRIGER, {
  group: (command) => Default(api, command),
});
