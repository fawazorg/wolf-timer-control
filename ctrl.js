const { Validator } = require("wolf.js");
const { api } = require("./bot");

const GROUPS = new Map();

const ROUND_START = "";
const GET_READY = "";
const DONE_CANCLE = "";
const ERROR_NUMPER = "";
const ERROR_EXISTE = "";
const ERRPR_NOTFOUND = "";
/**
 *
 * @param {import("wolf.js").CommandObject} command
 */
const create = async (command) => {
  if (GROUPS.has(command.targetGroupId)) {
    return await api.messaging().sendMessage(command, "(n) توجد كنترة حالياً.");
  }
  let [count, time] = parseArgument(command.argument);
  if (!(count !== undefined && time !== undefined)) {
    return await api
      .messaging()
      .sendMessage(
        command,
        "مساعدة الكنترة:\n!كنتر <عدد الجولات> <الوقت>\n!كنتر الغاء - يلغي الكنترول"
      );
  }
  if (!(checkNumpers(count) && checkNumpers(time))) {
    return await api
      .messaging()
      .sendMessage(command, "(n) قم بإدخال عدد الجولات و الوقت بشكل صحيح");
  }
  count = parseInt(api.utility().number().toEnglishNumbers(count));
  time = parseInt(api.utility().number().toEnglishNumbers(time));

  GROUPS.set(command.targetGroupId, "OK");
  await loop(command, count, time);
};
/**
 *
 * @param {import("wolf.js").CommandObject} command
 */
const cancel = async (command) => {
  if (!GROUPS.has(command.targetGroupId)) {
    return await api
      .messaging()
      .sendMessage(command, "(n) لا توجد كنترة في الغرفة.");
  }
  GROUPS.delete(command.targetGroupId);
  return await api
    .messaging()
    .sendMessage(command, "(y) تم الغاء الكنترة في هذه الغرفة");
};
/**
 * @param {import("wolf.js").CommandObject} command
 * @param {Number} count
 * @param {Number} time
 */
const loop = async (command, count, time) => {
  for (let i = 0; i < count; i++) {
    // check group ? brake : loop
    if (!GROUPS.has(command.targetGroupId)) {
      break;
    }
    // count 3
    await countTo3(command);
    // Time!
    await api.messaging().sendMessage(command, "!وقت");
    // sleep time
    let msg = await api
      .messaging()
      .subscribe()
      .nextMessage((message) => parseMessage(command, message), 50000);
    if (msg) {
      await api.utility().delay(time * 1000);
    } else {
      break;
    }
  }
  GROUPS.delete(command.targetGroupId);
};
/**
 *
 * @param {import("wolf.js").CommandObject} command
 */
const countTo3 = async (command) => {
  for (let ii = 0; ii < 3; ii++) {
    // send get ready +i
    await api.messaging().sendMessage(command, `${ii + 1}`);
    await api.utility().delay(500);
  }
};
/**
 *
 * @param {Number} number
 */
const checkNumpers = (number) => {
  let n = api.utility().number().toEnglishNumbers(number);
  if (!Validator.isValidNumber(n)) {
    return false;
  }
  n = parseInt(n);
  if (Validator.isLessThanOrEqualZero(n)) {
    return false;
  }
  return true;
};
/**
 *
 * @param {String} argument
 */
const parseArgument = (argument) => {
  const args = argument.split(" ");
  const newArgs = args.filter((x) => x !== "" && x !== "\n");
  return newArgs;
};
/**
 * @param {import("wolf.js").CommandObject} command
 * @param {import("wolf.js").MessageObject} message
 */
const parseMessage = (command, message) => {
  if (
    message.sourceSubscriberId === 26494626 &&
    message.targetGroupId === command.targetGroupId &&
    message.body.split(" ")[0] === "الفائز"
  ) {
    return true;
  }
  return false;
};

module.exports = { create, cancel };
