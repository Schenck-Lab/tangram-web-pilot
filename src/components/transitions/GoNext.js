import React from 'react';
import { STATUS } from '../../constants/gameConfig';
import { Button } from 'antd';

const GoNext = ({ onNext, result }) => {
    const message = {
        [STATUS.SOLVED]: "Congratulations! 🎉 You have solved this puzzle! 😊",
        [STATUS.TIMEOUT]: "Nice try! ⏰ Time is up, but you did great! 😊",
    };
    const promptToGo = 'Press "Go Next" to do the next puzzle task.';

    const buttonStyle = {
        width: "300px",
        height: "80px",
        fontSize: "36px",
        fontWeight: "bold",
        marginTop: "30px",
        borderRadius: "8px",
    };
    return (
        <div style={styles.overlay}>
        <div style={styles.content}>
            <p style={styles.text}>{message[result]}</p>
            <p style={styles.text}>{promptToGo}</p>
            <Button
                type="primary" 
                size="large"  
                onClick={onNext}
                style={buttonStyle}
            >
                Go Next
            </Button>
        </div>
        </div>
    );
};

// Styling for background blur and centered content
const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backdropFilter: "blur(90px)", // Blurred background
        backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay for better contrast
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000, // Ensure it's above other elements
    },
    content: {
        textAlign: "center",
    },
    text: {
        color: "white",
        fontSize: "50px",
        fontWeight: "bold",
        marginBottom: "35px",
        fontFamily: "'Roboto', sans-serif",
        fontShadow: "3px 3px 5px rgba(0, 0, 0, 0.5)",
    },
};

export default GoNext;

