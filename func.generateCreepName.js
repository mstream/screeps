module.exports = (role, body) => {

    const rolePart = role
            .toLowerCase()
            .replace(
                    /_([a-z])]/g,
                    (matched, firsChar) => firsChar.toUpperCase()
            );

    const bodyElementsCounter = new Map();

    body.forEach((bodyElement) => {
        const prevCount = bodyElementsCounter.get(bodyElement);
        const nextCount = prevCount ? prevCount + 1 : 1;
        bodyElementsCounter.set(bodyElement, nextCount);
    });

    const bodyPart = [ ...bodyElementsCounter ]
            .map(mapEntry =>
                    mapEntry[ 1 ] + mapEntry[ 0 ].substr(0, 1).toLowerCase())
            .join("");

    const epochInSeconds = Math.round(new Date().valueOf() / 1000);

    return [ rolePart, bodyPart, epochInSeconds ].join("_");
};