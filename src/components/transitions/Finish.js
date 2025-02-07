import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { Button } from 'antd';


const Finish = () => {
    const { addMetaData, exportCSV } = useGameContext();
    const download = () => {
        addMetaData('Optional', 'None');
        exportCSV('test');
    };
    const buttonStyle = {
        width: "400px",
        height: "80px",
        fontSize: "36px",
        fontWeight: "bold",
        marginTop: "30px",
        borderRadius: "8px",
    };
    const message = "🎉 Congratulations! You have completed all the puzzle tasks. Thank you! 🎊";
    return (
        <div style={styles.overlay}>
        <div style={styles.content}>
            <h1 style={styles.text}>{ message }</h1>
            <Button
                type="primary" 
                size="large"  
                onClick={download}
                style={buttonStyle}
                >
                    Download CSV File
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
        marginLeft: "150px",
        marginRight: "150px",
        fontShadow: "3px 3px 5px rgba(0, 0, 0, 0.5)",
    },
};

export default Finish;