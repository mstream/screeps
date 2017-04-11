module.exports = (() => {

    const textStyle = {font: 0.5};

    return (ctx, creep) => {

        const {x, y} = creep.pos;

        const creepAction = ctx.memory.creeps[creep.name].action;
        const creepTask = ctx.memory.creeps[creep.name].task;

        if (creepAction) {

            creep.room.visual.text(
                creepAction.type, x, y - 1, textStyle
            );

        }

        if (creepTask) {

            const taskType = creepTask.type
                ? creepTask.type
                : "unassigned";

            creep.room.visual.text(
                `(${taskType})`, x, y - 0.5, textStyle
            );

        }

    };

})();
