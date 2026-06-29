import { getQueue, STORAGE_KEY, setQueue } from './state.js';
import { generateSVG } from './svg.js';
import { buildPrintHeaderHtml, buildPrintInstructionTag, buildScreenQueueRowHtml } from './labels.js';
import { updateQueueChrome, showToast } from './ui.js';

export function loadQueueFromStorage() {
    try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) setQueue(JSON.parse(cached));
    } catch (e) {
        console.error('Could not load cached production queue', e);
        setQueue([]);
    }
}

export function saveQueueToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(getQueue()));
    } catch (e) {
        console.error('Could not preserve production entries to local storage', e);
    }
}

export function renderQueue() {
    const list = document.getElementById('queue-list');
    const printList = document.getElementById('print-items');
    if (!list || !printList) return;

    list.innerHTML = '';
    printList.innerHTML = '';

    getQueue().forEach((item, index) => {
        const row = document.createElement('div');
        row.className = 'queue-row flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-white rounded-xl border border-slate-200 text-sm';
        row.innerHTML = buildScreenQueueRowHtml(item, index);
        list.appendChild(row);

        const container = document.createElement('div');
        container.className = 'item-container';
        container.innerHTML = `
            ${buildPrintHeaderHtml(item, index)}
            ${buildPrintInstructionTag(item)}
            <svg id="svg-p-${item.id}" viewBox="0 0 500 400"></svg>`;
        printList.appendChild(container);
        generateSVG(item, `svg-p-${item.id}`, false, item.mode, true);
    });

    list.querySelectorAll('.queue-del-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            removeItem(e.currentTarget.getAttribute('data-id'));
        });
    });

    list.querySelectorAll('.queue-dup-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            duplicateItem(e.currentTarget.getAttribute('data-id'));
        });
    });

    updateQueueChrome(getQueue().length);
}

export function addItem(item) {
    getQueue().push(item);
    saveQueueToStorage();
    renderQueue();
}

export function removeItem(id) {
    setQueue(getQueue().filter(i => i.id !== id));
    saveQueueToStorage();
    renderQueue();
}

export function duplicateItem(id) {
    const original = getQueue().find(i => i.id === id);
    if (!original) return;
    const copy = {
        ...original,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        label: original.label.length <= 8 ? `${original.label}-2` : original.label
    };
    addItem(copy);
    showToast('Item duplicated');
}

export function clearQueue() {
    if (!confirm('Clear order?')) return;
    setQueue([]);
    saveQueueToStorage();
    renderQueue();
}

export function exportQueueJson() {
    if (getQueue().length === 0) {
        showToast('Queue is empty');
        return;
    }
    const blob = new Blob([JSON.stringify(getQueue(), null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dbs-u-shape-queue-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Queue exported');
}

export function importQueueJson(file) {
    const reader = new FileReader();
    reader.onload = () => {
        try {
            const imported = JSON.parse(reader.result);
            if (!Array.isArray(imported)) throw new Error('Invalid format');
            setQueue(imported);
            saveQueueToStorage();
            renderQueue();
            showToast(`Imported ${imported.length} item(s)`);
        } catch (e) {
            showToast('Import failed — invalid JSON');
            console.error(e);
        }
    };
    reader.readAsText(file);
}
