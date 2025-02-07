import { box_mesh, extrude_mesh } from './meshes';
import * as THREE from 'three';

// Hyper Geometry Parameters
export const THICKNESS = 0.2;
export const unit  = 1;
export const sqrt2 = unit * Math.SQRT2;

const pos = (z) => [0, 0, -THICKNESS / 2 + z];
const options = {
    steps: 1,
    depth: THICKNESS,
    bevelEnabled: false,
};

// Geometric parameters for Parallelogram
function makeParaShape() {
    const shape = new THREE.Shape();
    shape.moveTo(-0.5 * unit, +0.5 * unit);
    shape.lineTo(-1.5 * unit, -0.5 * unit);
    shape.lineTo(+0.5 * unit, -0.5 * unit);
    shape.lineTo(+1.5 * unit, +0.5 * unit);
    shape.lineTo(-0.5 * unit, +0.5 * unit);
    return shape;
}
const shapePL = makeParaShape();

// Geometric parameters for Triangles
function makeTri(longHalfSide) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(+longHalfSide, 0);
    shape.lineTo(0, +longHalfSide);
    shape.lineTo(-longHalfSide, 0);
    shape.lineTo(0, 0);
    return shape;
}

function makeTMShape(halfSide) {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(-halfSide, -halfSide);
    shape.lineTo(+halfSide, -halfSide);
    shape.lineTo(+halfSide, +halfSide);
    shape.lineTo(0, 0);
    return shape;
}
const shapeTL = makeTri(unit * 2);
const shapeTM = makeTMShape(unit);
const shapeTS = makeTri(unit);

// Make the mesh for each piece in a set of Tangram puzzle
export const TANGRAM_SHAPES = Object.freeze({
    TL0: (mat, z) => extrude_mesh(mat, shapeTL, options, pos(z)),
    TL1: (mat, z) => extrude_mesh(mat, shapeTL, options, pos(z)),
    TM:  (mat, z) => extrude_mesh(mat, shapeTM, options, pos(z)),
    TS0: (mat, z) => extrude_mesh(mat, shapeTS, options, pos(z)),
    TS1: (mat, z) => extrude_mesh(mat, shapeTS, options, pos(z)),
    SQ:  (mat, z) => box_mesh(mat, [sqrt2, sqrt2, THICKNESS + z]),
    PL:  (mat, z) => extrude_mesh(mat, shapePL, options, pos(z)),
});
