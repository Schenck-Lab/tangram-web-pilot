import { Puzzle } from './Puzzle';


export const PUZZLE_LIST = Object.freeze({
    'InitPine': new Puzzle('InitPine', 
        {
            'TL0': {px: -7.0, py: -1.0, rz: 0},
            'TL1': {px: -7.0, py: 0.0, rz: 0},
            'TM': {px: -7.0, py: 0.9, rz: 135},
            'TS0': {px: -7.0, py: 1.7, rz: 0},
            'TS1': {px: -7.0, py: 2.2, rz: 0},
            'SQ': {px: -7.0, py: -1.7, rz: 90},
            'PL': {px: -7.5, py: -3.1, rz: 0, ry: 0},
        }
    ),

    'Square': new Puzzle('Square', 
        {
            'TL0': {px: 0.0, py: 0.0, rz: 90},
            'TL1': {px: -2.0, py: -2.0, rz: 0},
            'TM': {px: -3.0, py: 1.0, rz: 180},
            'TS0': {px: -4.0, py: -1.0, rz: -90},
            'TS1': {px: -2.0, py: 1.0, rz: 180},
            'SQ': {px: -3.0, py: 0.0, rz: 135},
            'PL': {px: -1.5, py: 1.5, rz: 0, ry: 0},
        }, 
        {px: 0, py: -2, rz: 0}
    ),

    'Bear': new Puzzle('Bear', 
        {
            'TL0': {px: -2.6, py: 1.6, rz: 45},
            'TL1': {px: -4.0, py: 1.0, rz: 90},
            'TM': {px: -2.2, py: 2.0, rz: 0},
            'TS0': {px: -3.3, py: -0.5, rz: 135},
            'TS1': {px: 0.9, py: 2.3, rz: 135},
            'SQ': {px: -0.5, py: 2.3, rz: 90},
            'PL': {px: -1.2, py: 0.3, rz: -45, ry: 0},
        }, 
        {px: -4, py: 3, rz: Math.PI * -0.75}
    ),

    'Fox': new Puzzle('Fox', 
        {
            'TL0': {px: -2.0, py: 0.0, rz: -90},
            'TL1': {px: -1.4, py: -1.4, rz: -135},
            'TM': {px: -2.0, py: 0.6, rz: -135},
            'TS0': {px: -2.0, py: 3.0, rz: 90},
            'TS1': {px: -4.0, py: 3.0, rz: -90},
            'SQ': {px: -3.0, py: 2.0, rz: 45},
            'PL': {px: 1.5, py: -2.3, rz: 0, ry: 0},
        }
    , {px: 0, py: 0, rz: Math.PI * 0.5}),

    'Candle': new Puzzle('Candle', 
        {
            'TL0': {px: -2.0, py: -3.5, rz: 0},
            'TL1': {px: -1.0, py: -0.5, rz: 90},
            'TM': {px: -2.0, py: 0.5, rz: 180},
            'TS0': {px: -3.0, py: -1.5, rz: -90},
            'TS1': {px: -1.0, py: 2.5, rz: 180},
            'SQ': {px: -2.0, py: 3.5, rz: 45},
            'PL': {px: -2.5, py: 2.0, rz: 0, ry: 180},
        }, 
        {px: -2, py: 2.5, rz: 0}
    ),
  
    'NinjaStar': new Puzzle('Ninja Star', 
        {
            'TL0': {px: -3.0, py: -2.0, rz: 0},
            'TL1': {px: -4.0, py: 1.0, rz: -90},
            'TM': {px: -1.0, py: 0.0, rz: 90},
            'TS0': {px: -2.0, py: 2.0, rz: 180},
            'TS1': {px: 0.0, py: -2.0, rz: 90},
            'SQ': {px: -1.0, py: -1.0, rz: 45},
            'PL': {px: -0.5, py: 1.5, rz: 0, ry: 0},
        }, 
        {px: -4, py: 3, rz: 0}
    ),

    'Mountain': new Puzzle('Mountain', 
        {
            'TL0': {px: -4.8, py: 0.0, rz: -135},
            'TL1': {px: 0.8, py: 0.0, rz: 135},
            'TM': {px: -3.4, py: 0.0, rz: 45},
            'TS0': {px: -2.7, py: -0.7, rz: -135},
            'TS1': {px: -1.3, py: -0.7, rz: -135},
            'SQ': {px: -2.0, py: 1.0, rz: 135},
            'PL': {px: -1.3, py: 0.0, rz: 45, ry: 0},
        }, 
        {px: -2, py: 2, rz: 0}
    ),

    'Sailboat': new Puzzle('Sailboat',
        {
            'TL0': {px: -3.0, py: 1.4, rz: -90},
            'TL1': {px: -1.0, py: -0.6, rz: 0},
            'TM': {px: -3.0, py: -0.6, rz: -135},
            'TS0': {px: -0.9, py: -1.3, rz: 45},
            'TS1': {px: -5.1, py: 0.1, rz: -135},
            'SQ': {px: -2.3, py: -1.3, rz: -90},
            'PL': {px: -3.7, py: 0.8, rz: 45, ry: 0},
        }, 
        {px: -3, py: -2, rz: 0}
    ),

    'BowTie': new Puzzle('Bow Tie', 
        {
            'TL0': {px: -1.0, py: 1.0, rz: 90},
            'TL1': {px: -5.0, py: 1.0, rz: -90},
            'TM':  {px: -4.0, py: -2.0, rz: 180},
            'TS0': {px: -2.0, py: -1.0, rz: 90},
            'TS1': {px: -4.0, py: -1.0, rz: 0},
            'SQ':  {px: -3.0, py: 0.0, rz: -45},
            'PL':  {px: -1.5, py: -1.5, rz: -90, ry: 0},
        }, 
        {px: -1, py: 3, rz: 0}
    ),

    'Cup': new Puzzle('Cup', 
        {
            'TL0': {px: -2.2, py: -1.0, rz: 0},
            'TL1': {px: -2.2, py: 1.0, rz: -45},
            'TM': {px: -3.6, py: 1.0, rz: -45},
            'TS0': {px: -0.1, py: 0.3, rz: 45},
            'TS1': {px: -4.3, py: 1.7, rz: 135},
            'SQ': {px: -0.1, py: 1.7, rz: 90},
            'PL': {px: -3.6, py: 1.7, rz: -45, ry: 0},
        }, 
        { px: -5, py: 1, rz: Math.PI * -0.5 }
    ),

    'Heart': new Puzzle('Heart', 
        {
            'TL0': {px: -3.0, py: 1.0, rz: 0},
            'TL1': {px: -2.0, py: 0.0, rz: 180},
            'TM': {px: -1.0, py: 1.0, rz: 0},
            'TS0': {px: -2.0, py: 1.0, rz: 180},
            'TS1': {px: 0.0, py: 1.0, rz: -90},
            'SQ': {px: -1.0, py: 2.0, rz: 45},
            'PL': {px: -3.5, py: 0.5, rz: 0, ry: 180},
        }, 
        { px: -5, py: 1, rz: Math.PI * +0.25 }
    ),

    'House': new Puzzle('House', 
        {
            'TL0': {px: -2.4, py: -1.8, rz: 45},
            'TL1': {px: -2.4, py: -1.8, rz: -135},
            'TM': {px: -2.4, py: 1.0, rz: 135},
            'TS0': {px: -1.7, py: 0.3, rz: 45},
            'TS1': {px: -1.7, py: 0.3, rz: -135},
            'SQ': {px: -3.1, py: 0.3, rz: 90},
            'PL': {px: -1.5, py: 2.5, rz: -90, ry: 0},
        }, 
        { px: -1, py: 3, rz: 0 }
    ),

    'AbstractZero': new Puzzle('Abstract Zero', 
        {
            'TL0': {px: -2.5, py: 0.3, rz: 180},
            'TL1': {px: -1.5, py: 1.3, rz: 0},
            'TM': {px: -2.5, py: 2.3, rz: 180},
            'TS0': {px: -1.5, py: -1.7, rz: 0},
            'TS1': {px: 0.5, py: 0.3, rz: 90},
            'SQ': {px: -0.5, py: -0.7, rz: 45},
            'PL': {px: -4.0, py: 1.8, rz: 90, ry: 180},
        }, 
        {px: -0.5, py: -1.7, rz: 0}
    ),

    'InclinedChair': new Puzzle('Inclined Chair', 
        {
            'TL0': {px: 0.0, py: 0.0, rz: 0},
            'TL1': {px: -2.0, py: 0.0, rz: 180},
            'TM': {px: -4.0, py: 2.0, rz: -90},
            'TS0': {px: -5.0, py: 2.0, rz: 90},
            'TS1': {px: 1.0, py: 0.0, rz: 180},
            'SQ': {px: -1.0, py: -2.0, rz: 135},
            'PL': {px: -3.5, py: 0.5, rz: 0, ry: 180},
        }, 
        {px: -1, py: -3, rz: 0}
    ),

    'Rocket': new Puzzle('Rocket', 
        {
            'TL0': {px: -3.0, py: 1.0, rz: 180},
            'TL1': {px: -1.0, py: -1.0, rz: 0},
            'TM': {px: -4.0, py: 0.0, rz: -90},
            'TS0': {px: -5.0, py: 0.0, rz: 90},
            'TS1': {px: 1.0, py: 2.0, rz: 180},
            'SQ': {px: 0.0, py: 1.0, rz: 45},
            'PL': {px: 0.5, py: -1.5, rz: 180, ry: 180},
        }, 
        {px: 0, py: 0, rz: 0}
    ),
});


// Problem sets for each experiment
export const PUZZLE_SETS = {
    TINY_TEST: ['Square', 'InclinedChair'],
    
    //Final Order: rocket, fox, mountain, square, ninja star, heart, chair, abstract zero
    PILOT_STUDY_2025_SPRING: [
        'Rocket',          // object | symmetric |
        'Fox',             // animal | assym.    | fixed rotation
        'Mountain',        // object | symmetric |
        'Square',          // Gemo.  | symmetric | 
        'NinjaStar',       // object | symmetric | spining*
        'Heart',           // object | symmetric | fixed rotation
        'InclinedChair',   // object | symmetric | 
        'AbstractZero',    // symbol | symmetric | fixed rotation
    ],
};

// Puzzle pattern effects (rotating, rotation, etc.)
export const PUZZLE_EFFECTS = Object.freeze({
    'Bear': {
        px: -2,
        py: 1,
        update: (ref, state, delta) => {
            const t = state.clock.getElapsedTime();
            const initAngle = Math.PI * -0.03;
            const amplitude = Math.PI * 0.1;
            ref.current.rotation.z = initAngle + Math.sin(t * 0.5) * amplitude;
        },
    },

    'NinjaStar': {
        px: -2,
        py: 0,
        update: (ref, state, delta) => {
            ref.current.rotation.z += Math.PI * delta * 0.2;
        },
    },

    'Fox': {
        px: 0,
        py: 0,
        update: (ref, state, delta) => {
            ref.current.rotation.z = Math.PI * -0.25;
        },
    },

    'AbstractZero': {
        px: -2,
        py: 0,
        update: (ref, state, delta) => {
            ref.current.rotation.z = Math.PI * 0.25;
        },
    }
});