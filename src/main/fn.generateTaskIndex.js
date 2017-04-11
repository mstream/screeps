module.exports = (() => {

    const _ = require("lodash");

    const taskTypes = require("./const.taskTypes");

    const formatIndex = (action, sourceId, priority) =>
        `${action}_using_source_${sourceId}_with_priority_${priority}`;

    const formatBuildingIndex =
        _.curry(formatIndex)("building_structures", _, _);

    const formatCollectingIndex =
        _.curry(formatIndex)("collecting_energy", _, _);

    const formatUpgradingIndex =
        _.curry(formatIndex)("upgrading_controller", _, _);

    return (task) => {

        switch (task.type) {
        case taskTypes.BUILDING:
            return formatBuildingIndex(task.sourceId, task.priority);
        case taskTypes.COLLECTING:
            return formatCollectingIndex(task.sourceId, task.priority);
        case taskTypes.UPGRADING:
            return formatUpgradingIndex(task.sourceId, task.priority);
        default:
            throw new Error(`unknown task type: ${task.type}`);
        }

    };

})();
