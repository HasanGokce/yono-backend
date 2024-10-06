export function areValuesSame(map) {
    const values = [...map.values()];
    return values.every((val, i, arr) => val === arr[0]);
}