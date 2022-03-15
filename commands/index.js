const Default = require("./default");
const Cancel = require("./cancel");

const Commands = [Cancel];
Default.children = Commands;

module.exports = Default;
