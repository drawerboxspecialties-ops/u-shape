import test from 'node:test';
import assert from 'node:assert/strict';
import { FORMULA_CONFIG } from '../formulas.js';

const basePayload = {
    width: 20,
    height: 6,
    lArm: 4,
    rArm: 4,
    uDepth: 12,
    lipLeft: 0.188,
    lipRight: 0.188,
    autoPocket: false
};

function approx(actual, expected, label) {
    assert.equal(Number(actual.toFixed(3)), Number(expected.toFixed(3)), label);
}

test('getDeduction returns known thickness values', () => {
    assert.equal(FORMULA_CONFIG.getDeduction(0.500), 0.374);
    assert.equal(FORMULA_CONFIG.getDeduction(0.591), 0.556);
    assert.equal(FORMULA_CONFIG.getDeduction(0.472), 0.318);
});

test('15mm dovetail D21 → side 20.444 (shop verified)', () => {
    const r = FORMULA_CONFIG.calculateValues('dovetail', {
        ...basePayload,
        t: 0.591,
        depth: 21
    });
    approx(r.sideLen, 20.444, 'side length');
});

test('dovetail back width equals outer width', () => {
    const r = FORMULA_CONFIG.calculateValues('dovetail', { ...basePayload, t: 0.500, depth: 18 });
    approx(r.backWidth, 20, 'back width');
});

test('dowel back width subtracts 2× thickness', () => {
    const r = FORMULA_CONFIG.calculateValues('dowel', { ...basePayload, t: 0.500, depth: 18 });
    approx(r.backWidth, 19, 'dowel back');
});

test('hybrid side uses half deduction', () => {
    const r = FORMULA_CONFIG.calculateValues('hybrid', { ...basePayload, t: 0.591, depth: 21 });
    approx(r.sideLen, 21 - 0.278, 'hybrid side');
});

test('auto-flush dovetail pocket depth formula', () => {
    const r = FORMULA_CONFIG.calculateValues('dovetail', {
        ...basePayload,
        t: 0.591,
        depth: 21,
        autoPocket: true,
        uDepth: 0
    });
    approx(r.udDisplay, 21 - 0.556 - 0.313, 'auto-flush u-depth');
});

test('dowel display arms subtract 2× thickness', () => {
    const r = FORMULA_CONFIG.calculateValues('dowel', { ...basePayload, t: 0.500, depth: 18 });
    approx(r.dLA, 3, 'left arm display');
    approx(r.dRA, 3, 'right arm display');
});
