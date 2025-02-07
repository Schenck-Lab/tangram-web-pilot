import { PUZZLE_SETS } from '../puzzles/puzzleLib';

export const STATUS = Object.freeze({
    INIT: 'INIT',
    SOLVING: 'SOLVING',
    TIMEOUT: 'TIMEMOUT',
    SOLVED: 'SOLVED',
    FINISHED: 'FINISHED',
});

export const TASK_LIST = PUZZLE_SETS.PILOT_STUDY_2025_SPRING;
export const DURATION_8_MIN = 480;  // 8 mins is 480 secs

//export const TASK_LIST = PUZZLE_SETS.TINY_TEST;