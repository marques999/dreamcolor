function hsv2rgb(hue, saturation, value) {

    const i = Math.floor(hue * 6);
    const f = hue * 6 - i;
    const p = value * (1 - saturation);
    const q = value * (1 - f * saturation);
    const t = value * (1 - (1 - f) * saturation);

    const rgb = [
        [value, t, p],
        [q, value, p],
        [p, value, t],
        [p, q, value],
        [t, p, value],
        [value, p, q],
    ];

    return rgb[Math.trunc(i % 6)].map(Math.ceil);
}

function partition(segments) {
	return Array.from({ length: segments + 1 }, (_, index) => index / segments);
}

module.exports = {
    generateRainbow: () => partition(360).map(hue => hsv2rgb(hue, 1.0, 255.0))
};