import React from 'react';
import { DoubleSide } from "three";

function makeStandard(color, flatflag=false, metalness=0.5, roughness=0.5) {
    return <meshStandardMaterial color={color} 
        metalness={metalness}
        roughness={roughness}
        side={DoubleSide}
        flatShading={flatflag}
    />;
}

function makeBasic(color) {
    return <meshBasicMaterial color={color} />;
}

function makePalette(matSet, position) {
    const size = 0.5;
    const gap  = 0.2;
    const keyList = Object.keys(matSet);
    const n = keyList.length;
    
    const xStart = (n / 2) * size + Math.floor(n / 2) * gap;
    const getX = (i) => -xStart + i * (size + gap);

    return (
        <group position={position}>
            {keyList.map((key, i) => (
                <mesh key={key} position={[getX(i), 0, 0]} castShadow>
                    <boxGeometry args={[size, size, size]} />
                    {matSet[key]}
                </mesh>
            ))}
        </group>
    );
}

// https://www.istockphoto.com/vector/
// tangram-puzzle-game-schemas-with-different-objects-gm1338542708-419094570
const PLANT_MAT = Object.freeze({
    TL0: makeStandard(0x003C40),
    TL1: makeStandard(0x695087),
    TM:  makeStandard(0x007470),
    TS0: makeStandard(0x015D5E),
    TS1: makeStandard(0x505e87),
    SQ:  makeStandard(0xA68968),
    PL:  makeStandard(0x96BFAA),
    WHITE: makeBasic(0xffffff),
});

const BASIC_MAT = Object.freeze({
    TL0: makeBasic(0x003C40),
    TL1: makeBasic(0x695087),
    TM:  makeBasic(0x007470),
    TS0: makeBasic(0x015D5E),
    TS1: makeBasic(0x505e87),
    SQ:  makeBasic(0xA68968),
    PL:  makeBasic(0x96BFAA),
    HOV: makeBasic(0xffffff),
    BLK: makeBasic(0x000000),
    AX:  makeBasic(0x999999),
    ORI: makeBasic(0xff6666),
});

const BASIC_2_MAT = Object.freeze({
    TL0: makeBasic(0x634063),
    TL1: makeBasic(0x324081),
    TM:  makeBasic(0x76D4Dc),
    TS0: makeBasic(0xFDFBFE),
    TS1: makeBasic(0xD1AEBA),
    SQ:  makeBasic(0xA17470),
    PL:  makeBasic(0xc9b8a3),
    HOV: makeBasic(0xffffff),
    BLK: makeBasic(0x000000),
    AX:  makeBasic(0x999999),
    ORI: makeBasic(0xff6666),
});


const POXI_MAT = Object.freeze({
    DARK:       makeStandard(0x3A253A),
    DARK_BLUE:  makeStandard(0x324081),
    LIGHT_BLUE: makeStandard(0x76D4Dc),
    WHITE:      makeStandard(0xFDFBFE),
    PINK:       makeStandard(0xD1AEBA),
    RED:        makeStandard(0xA17470),
    YELLOW:     makeStandard(0xc9b8a3),
    ORANGE:     makeStandard(0xf54e38),
});

export { PLANT_MAT, BASIC_MAT, BASIC_2_MAT, POXI_MAT, makePalette };
