module.exports = (role, body) => {

    const rolePart = role
        .toLowerCase()
        .replace(/_([a-z])]/g, (matched, firsChar) => firsChar.toUpperCase());

    const bodyElementsCounter = new Map();

    body.forEach((bodyElement) => {
        const prevCount = bodyElementsCounter.get(bodyElement);
        const nextCount = prevCount ? prevCount + 1 : 1;
        bodyElementsCounter.set(bodyElement, nextCount);
    });

    const bodyPart = [ ...bodyElementsCounter ]
        .map(mapEntry => mapEntry[ 1 ] + mapEntry[ 0 ])
        .join("");

    const epochInSeconds = new Date().valueOf() / 1000;

    return [ rolePart, bodyPart, epochInSeconds ].join("_");
};