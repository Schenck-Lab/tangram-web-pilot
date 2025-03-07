import React, { useState, useEffect } from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { GAS_URL, ACTION, CSV_HEADER } from '../../constants/gameConfig';
import { Spin, Alert, Button } from 'antd';

const Finish = ( {state} ) => {
    const { 
        pid, firstName, lastName, emailAddress, fileName, 
        totalTimeInSec, addMetaData, csvMetaBufRef, csvGameBufRef,
    } = useGameContext();

    const [taskDone, setTaskDone] = useState(false);
    const [status, setStatus] = useState('loading'); // 'loading', 'success', 'error', 'timeout'
    const message = '🎉 Congratulations! You have completed all the puzzle tasks. Thank you! 🎊';

    // Debug output:
    console.log(`totalTimeInSec: ${totalTimeInSec.current}`);
    console.log(`state.taskId: ${state.taskId}`);
    console.log(`state.status: ${state.status}`);
    console.log(`state.deadline: ${state.deadline}`);

    function generateFileName(isDownloaded = false) {
        const F = firstName.current.charAt(0).toUpperCase();
        const L = lastName.current.charAt(0).toUpperCase();
        const now = new Date();
        const month  = String(now.getMonth() + 1).padStart(2, '0');
        const day    = String(now.getDate()).padStart(2, '0');
        const hour   = String(now.getHours()).padStart(2, '0');
        const minute = String(now.getMinutes()).padStart(2, '0');
        const suffix = isDownloaded ? '_DL.csv' : '.csv';
        return `${pid.current}_${F}${L}_${month}${day}_${hour}${minute}${suffix}`;
    }

    const generateCSVContent = () => {
        const metaData = {
            'PID': pid.current,
            'First_Name': firstName.current,
            'Last_Name': lastName.current,
            'Email_Address': emailAddress.current,
            'Date': `${new Date()}`,
        };
        csvMetaBufRef.current = [];
        Object.entries(metaData).forEach(([key, value]) => {
            addMetaData(key, value);
        });

        const csvContentArray = [
            csvMetaBufRef.current.join('\n'),
            '---',
            Object.keys(CSV_HEADER).join(','), 
            csvGameBufRef.current.map(row => row.join(',')).join('\n')
        ];
        return csvContentArray.join('\n');
    };

    const sendCSVToDrive = () => {
        fileName.current = generateFileName();
        const csvContent = generateCSVContent();

        fetch(GAS_URL, {
            method: 'POST',
            mode: 'no-cors',
            redirect: 'follow',
            headers: { 
                'Content-Type': 'text/plain;charset=utf-8',
                'Accept': 'application/json',
            },
            body: JSON.stringify({ 
                fileName: fileName.current, 
                csvContent, 
                emailAddress: emailAddress.current 
            }),
        })
        .then(() => {
            console.log('Tasks have been finished and ready to check.');
            setTaskDone(true);
        })
        .catch(error => {
            console.error('Error: ', error);
            setStatus('error');
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
                console.warn('Task marked as completed, but file not found.');
                setStatus('error');
            })
            .catch(error => {
                console.error('Error checking upload status: ', error);
                setStatus('error');
            });
    };

    useEffect(() => {
        // Set a timeout to trigger the manual download option if no response
        const timeoutTimer = setTimeout(() => {
            setStatus(prevStatus => {
                if (prevStatus === 'loading') {
                    console.log('status is set to TIMEOUT.');
                    return 'timeout';
                }
                return prevStatus; // If status changed, keep the latest value
            });
        }, 20000); // 20 seconds timeout

        return () => {
            clearTimeout(timeoutTimer);
        };
    // eslint-disable-next-line
    }, []);

    useEffect(() => {
        if (!taskDone) {
            sendCSVToDrive();
            return;
        }
        const verifyTimer = setTimeout(() => {
            verifyCSVUpload();
        }, 2000);

        return () => {
            clearTimeout(verifyTimer);
        };
    // eslint-disable-next-line
    }, [taskDone]);

    const downloadCSV = () => {
        const csvContent = generateCSVContent();
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = generateFileName(true);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div style={styles.overlay}>
            <div style={styles.content}>
                <h1 style={styles.text}>{message}</h1>
                <div style={{ width: '600px', margin: 'auto', marginTop: '100px' }}>
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

                    {(status === 'timeout' || status === 'error') && (<>
                        <Alert 
                            message='Network is busy, please manually download the CSV file.'
                            type='warning'
                            showIcon 
                            style={styles.alert}
                        />
                        <Button 
                            type='primary' 
                            onClick={downloadCSV} 
                            style={styles.downloadButton}
                        >
                            Download CSV Data
                        </Button>
                    </>)}
                </div>
            </div>
        </div>
    );
};

// Styling for background blur and centered content
const styles = {
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backdropFilter: 'blur(90px)',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    content: {
        textAlign: 'center',
    },
    text: {
        color: 'white',
        fontSize: '50px',
        fontWeight: 'bold',
        marginBottom: '20px',
        fontFamily: "'Roboto', sans-serif",
        textShadow: '3px 3px 5px rgba(0, 0, 0, 0.5)',
    },
    alert: {
        fontSize: '20px',
        padding: '20px',
        height: '80px',
    },
    downloadButton: {
        width: '400px',
        height: '55px',
        marginTop: '35px',
        fontSize: '20px',
        padding: '10px 20px',
    },
};

export default Finish;
