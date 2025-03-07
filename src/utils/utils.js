export { getTimeStampString, toStdDeg, degToRad };

function getTimeStampString() {
    const now = new Date();
    const hh = now.getHours().toString().padStart(2, "0");   // Hours (00-23)
    const mm = now.getMinutes().toString().padStart(2, "0"); // Minutes (00-59)
    const ss = now.getSeconds().toString().padStart(2, "0"); // Seconds (00-59)
    return `${hh}:${mm}:${ss}`;
}

function toStdDeg(rad) {
    let deg = Number((rad * 180 / Math.PI).toFixed(0));
    while (deg > 180) {
        deg -= 360;
    }
    while (deg <= -180) {
        deg += 360;
    }
    return deg;
}

function degToRad(deg) {
    return deg * Math.PI / 180;
}
