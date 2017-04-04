const statusBarWidth = 1;
const statusBarHeight = 0.25;


module.exports = class {

    renderFor(creep, room) {

        const centerX = creep.pos.x;
        const centerY = creep.pos.y;
        const creepRole = creep.role;
        const currentHp = creep.hits;
        const maxHp = creep.hitsMax;
        const currentTtl = creep.ticksToLive;
        const maxTtl = 1500;
        const ttlCirclesNumber = 5;
        const ttlCircleSize = statusBarWidth / ttlCirclesNumber;

        const hpRatio = 1 - ((maxHp - currentHp) / maxHp);
        const ttlRatio = 1 - ((maxTtl - currentTtl) / maxTtl);

        for (let i = 0; i < ttlCirclesNumber; i++) {
            const filled = 1 - ((ttlCirclesNumber - i) / ttlCirclesNumber) <= ttlRatio;
            room.drawCircle(
                centerX - (statusBarWidth / 2) + (ttlCircleSize / 2) + (i * ttlCircleSize),
                centerY - (4 * statusBarHeight),
                {
                    stroke: filled ? "#ffffff" : "#aaaaaa",
                    fill: filled ? "#ffffff" : "transparent",
                    radius: ttlCircleSize / 2.5
                }
            );
        }

        room.drawRectangle(
            centerX - (statusBarWidth / 2),
            centerY - (3 * statusBarHeight),
            (1 - hpRatio) * statusBarWidth,
            statusBarHeight,
            {fill: "#ff0000"}
        );

        room.drawRectangle(
            centerX - (statusBarWidth / 2) + ((1 - hpRatio) * statusBarWidth),
            centerY - (3 * statusBarHeight),
            statusBarWidth * hpRatio,
            statusBarHeight,
            {fill: "#00ff00"}
        );

        const status = `${creepRole.charAt(0)} ${hpRatio * 100}%`;

        room.drawText(
            centerX,
            centerY - (2 * statusBarHeight),
            {font: statusBarHeight},
            status
        );
    }
};

