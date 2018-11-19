const { dbResolver, sanitizeFolderName } = require('../utils');
const { PROJECTS_DIR } = require('../../config');
const path = require('path');

const getBasePath = async (stage) => {
  const sc = await dbResolver(MODEL_DB.STAGE_CONTAINERS, stage.containerId);
  const scg = await dbResolver(MODEL_DB.STAGE_CONTAINER_GROUPS, sc.stageContainerGroupId);

  return path.join(PROJECTS_DIR,
    sanitizeFolderName(scg.title),
    sanitizeFolderName(sc.version),
    sanitizeFolderName(stage.title));
}

const stageLookup = async (props, field) => {
  return path.join(await getBasePath(props), field);
}

module.exports = stageLookup;