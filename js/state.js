export let currentMode = 'dovetail';
export let queue = [];

export const STORAGE_KEY = 'dbs_production_queue';

export function setCurrentMode(mode) {
    currentMode = mode;
}

export function getCurrentMode() {
    return currentMode;
}

export function setQueue(items) {
    queue = items;
}

export function getQueue() {
    return queue;
}
