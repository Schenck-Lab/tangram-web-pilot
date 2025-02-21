import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { GAS_URL, ACTION, CSV_HEADER } from '../../constants/gameConfig';
import { Spin, Alert } from 'antd';

const Finish = () => {
    const { 
        pid, firstName, lastName, emailAddress, fileName, 
        addMetaData, csvMetaBufRef, csvGameBufRef,
    } = useGameContext();

    const [taskDone, setTaskDone] = useState(false);
    const [status, setStatus] = useState('loading'); // "loading", "success", or "error"
    const message = '🎉 Congratulations! You have completed all the puzzle tasks. Thank you! 🎊';

    function generateFileName() {
        // Extract first letter of first and last name
        const F = firstName.current.charAt(0).toUpperCase();
        const L = lastName.current.charAt(0).toUpperCase();
    
        // Get current date and time
        const now = new Date();
        const month  = String(now.getMonth() + 1).padStart(2, '0');
        const day    = String(now.getDate()).padStart(2, '0');
        const hour   = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0')

        // Construct the file name
        return `${pid.current}_${F}${L}_${month}${day}_${hour}${minute}.csv`;
    }

    const generateCSVContent = () => {
        // Organize meta data:
        const metaData = {
            'PID': pid.current,
            'First_Name': firstName.current,
            'Last_Name': lastName.current,
            'Email_Address': emailAddress.current,
            'Date': `${new Date()}`,
        };
        // Add meta data to csv buffer
        csvMetaBufRef.current = [];
        Object.entries(metaData).forEach(([key, value]) => {
            addMetaData(key, value);
        });

        const csvContentArray = [
            csvMetaBufRef.current.join('\n'),   // Metadata
            '---',                              // '---' as separation
            Object.keys(CSV_HEADER).join(','),  // Header
            csvGameBufRef.current.map(row => row.join(',')).join('\n') // Data rows
        ];
        return csvContentArray.join('\n');
    };

    const sendCSVToDrive = () => {
        fileName.current = generateFileName();
        const csvContent = generateCSVContent();
    
        fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',     // Use 'no-cors' to avoid CORS policy
            redirect: 'follow',  // Allow GAS to redirect to process requests
            headers: { 
                'Content-Type': 'text/plain;charset=utf-8',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                fileName: fileName.current, 
                csvContent, 
                emailAddress: emailAddress.current }),
        })
        .then(response => {
            if (response.type === 'opaque') {
                console.log('Tasks have been finished and ready to check.');
                setTaskDone(true);
            } else {
                console.warn('Unexpected response: ', response);
            }
        })
        .catch(error => {
            console.log('Error: ', error);
        });
    };

    const verifyCSVUpload = () => {
        const action = ACTION.completionVerification;
        const encodedEmail = encodeURIComponent(emailAddress.current);

        fetch(`${GAS_URL}?action=${action}&email=${encodedEmail}&fileName=${fileName.current}`)
            .then(response => response.json())
            .then(data => {
                if (!data.success) {
                    console.error('Verification failed: ', data.message);
                    setStatus('error');
                    return;
                }
                if (data.taskCompleted && data.fileExists) {
                    console.log('Task completed and file successfully uploaded!');
                    setStatus('success');
                    return;
                }
                console.warn('Task marked as completed, but file not found.', 
                    data.taskCompleted, data.fileExists); 
                    setStatus('error');
            })
            .catch(error => {
                console.error('Error checking upload status: ', error);
                setStatus('error');
            });
    };

    useEffect(() => {
        if (!taskDone) {
            sendCSVToDrive();
            return;
        }
        
        const timer = setTimeout(() => {
            verifyCSVUpload();
        }, 2000);
    
        return () => clearTimeout(timer);  // Cleanup timeout
    // eslint-disable-next-line
    }, [taskDone]);

    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <h1 style={styles.text}>{message}</h1>
                <div style={{width: '600px', margin: 'auto', marginTop: '100px'}} >
                {status === 'loading' && (
                    <Spin size='large'>
                        <Alert 
                            message='Uploading data... Please wait.'
                            type='info' 
                            showIcon 
                            style={styles.alert}
                        />
                    </Spin>
                )}

                {status === 'success' && (
                    <Alert 
                        message='Your data has been saved. You are safe to quit the app.' 
                        type='success'
                        showIcon 
                        style={styles.alert}
                    />
                )}

                {status === 'error' && (
                    <Alert 
                        message='Error: Failed to save data. Please try again.'
                        type='error'
                        showIcon 
                        style={styles.alert}
                    />
                )}
                </div>
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
        textShadow: "3px 3px 5px rgba(0, 0, 0, 0.5)",
    },
    alert: {
        fontSize: "20px", // Increase text size
        padding: "20px",  // Add more space inside
        height: "80px",   // Make it taller
    },
};

export default Finish;
