export function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[char]));
}

export function parseFraction(val) {
    if (val === undefined || val === null) return NaN;
    let str = val.toString().trim();
    if (!str) return NaN;
    if (/^\d+(\.\d+)?$/.test(str)) return parseFloat(str);

    str = str.replace(/-/g, ' ').replace(/\s+/g, ' ');
    const parts = str.split(' ');

    if (parts.length === 2) {
        const whole = parseFloat(parts[0]);
        const fracParts = parts[1].split('/');
        if (fracParts.length === 2) {
            const num = parseFloat(fracParts[0]);
            const den = parseFloat(fracParts[1]);
            if (den !== 0 && !isNaN(whole) && !isNaN(num) && !isNaN(den)) return whole + (num / den);
        }
    } else if (parts.length === 1 && parts[0].includes('/')) {
        const fracParts = parts[0].split('/');
        if (fracParts.length === 2) {
            const num = parseFloat(fracParts[0]);
            const den = parseFloat(fracParts[1]);
            if (den !== 0 && !isNaN(num) && !isNaN(den)) return num / den;
        }
    }
    return parseFloat(str);
}

export function fmt(num) {
    if (num === undefined || num === null || isNaN(num)) return 'ERROR';
    return parseFloat(parseFloat(num).toFixed(3)).toString();
}
