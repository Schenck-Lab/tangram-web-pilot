import React from 'react';
import { Button } from 'antd';

const Start = ({ onStart }) => {
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
            <h2 style={styles.text}>🚀 Press "Start" to begin the game. 😊</h2>
            <Button
                type="primary" 
                size="large" 
                danger 
                onClick={onStart}
                style={buttonStyle}
            >
                Start
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
        marginBottom: "20px",
        fontFamily: "'Roboto', sans-serif",
    },
};

export default Start;
