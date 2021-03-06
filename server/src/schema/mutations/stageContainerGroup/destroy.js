const path = require('path');

module.exports = (injections) => {
  const destroyStageContainer = require('../stageContainer/destroy')(injections);
  const {
    config: { MODEL_DB, PROJECTS_DIR },
    ioHelpers: { configRemove, directoryRemove, configDocumentReader, configResolver },
  } = injections;

  async function destroyStageContainers(stageContainerGroup) {
    const stageContainers = (await configDocumentReader(MODEL_DB.STAGE_CONTAINERS)).filter(x => x.stageContainerGroupId === stageContainerGroup.id);
    for(let i = 0; i < stageContainers.length; i++) {
      await destroyStageContainer(stageContainers[i].id);
    }
  }

  async function destroyStageContainerGroup(id) {
    const stageContainerGroup = await configResolver(MODEL_DB.STAGE_CONTAINER_GROUPS, id);
    await destroyStageContainers(stageContainerGroup);
    await configRemove(MODEL_DB.STAGE_CONTAINER_GROUPS, id);
    await directoryRemove(path.join(PROJECTS_DIR, stageContainerGroup.title));
    return id;
  }

  return destroyStageContainerGroup;
}
