import { PUZZLE_SETS } from '../puzzles/puzzleLib';

export const STATUS = Object.freeze({
    INIT: 'INIT',
    SOLVING: 'SOLVING',
    TIMEOUT: 'TIMEMOUT',
    SOLVED: 'SOLVED',
    FINISHED: 'FINISHED',
});


/** Key and Mask for each Tans Piece ::::::::::::::::::::::::::::::::::::::: */
export const TAN_KEYS = ['TL0', 'TL1', 'TM', 'TS0', 'TS1', 'SQ', 'PL'];
const masks = [1, 2, 4, 8, 16, 32, 64];

export const MASK_KEY_MAP = Object.freeze(
    Object.fromEntries(masks.map((mask, i) => [mask, TAN_KEYS[i]]))
);

export const KEY_MASK_MAP = Object.freeze(
    Object.fromEntries(TAN_KEYS.map((key, i) => [key, masks[i]]))
);


/** Experiment and Data Collection ::::::::::::::::::::::::::::::::::::::::: */
export const TASK_LIST = PUZZLE_SETS.PILOT_STUDY_2025_SPRING;
export const DURATION_8_MIN = 480;  // 8 mins is 480 secs
//export const TASK_LIST = PUZZLE_SETS.TINY_TEST;

export const CSV_HEADER = Object.freeze(
    Object.fromEntries([
        'PUZZLE_ID', 'TIMESTAMP', 'STEP', 'FOCUS_PIECE',
        'TL0_X', 'TL0_Y', 'TL0_R', 'TL1_X', 'TL1_Y', 'TL1_R',
        'TM_X',  'TM_Y',  'TM_R',  'TS0_X', 'TS0_Y', 'TS0_R',
        'TS1_X', 'TS1_Y', 'TS1_R', 'SQ_X',  'SQ_Y',  'SQ_R',
        'PL_X',  'PL_Y',  'PL_R',  'PL_F', 'PROGRESS', 'MAX_PROGRESS',
    ].map(colName => [colName, colName]))
);

// Column Name → Index Map
export const COL_NAME_INDICE = Object.freeze(
    Object.fromEntries(Object.keys(CSV_HEADER)
          .map((colName, index) => [colName, index]))
);

// Google App Script | Web app URL
const webAppKey = 'AKfycbxhSnJK69NycGVL5ktttLlkMwVcwZCk9sIwUcvsXDik_23k-ZWyL6-c2QlA43hn70AL';
export const GAS_URL = `https://script.google.com/macros/s/${webAppKey}/exec`;
export const ACTION = {
    loginVerification: 'loginVerification',
    completionVerification: 'completionVerification',
};
