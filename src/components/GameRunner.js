import React, { useState, useEffect, useRef } from 'react';

function GameRunner() {
    console.log('GameRunner is rendering...');

    const [clickData, setClickData] = useState([]);
    const [sheetId, setSheetId] = useState(null);
    const tokenClient = useRef();

    // Determine if the app is running on localhost or GitHub Pages
    const isLocalhost = window.location.hostname === 'localhost';
    const redirectUri = isLocalhost
        ? 'http://localhost:3000/tangram-web-tester/oauth2callback'       // Local testing redirect URI
        : 'https://orc-dev.github.io/tangram-web-tester/oauth2callback';  // GitHub Pages redirect URI

    // Initialize Google Identity Services (GIS)
    useEffect(() => {
        const initClient = () => {
            if (window.google) {
                tokenClient.current = window.google.accounts.oauth2.initTokenClient({
                    client_id: '798378298588-l6rjibbg4leh8nl39q3pea1ovmf4975a.apps.googleusercontent.com',  // client ID
                    scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets',
                    callback: (tokenResponse) => {
                        console.log('Access token:', tokenResponse.access_token);
                    },
                });
            } else {
                console.error('Google Identity Services script not loaded.');
            }
        };
        initClient();
    }, [redirectUri]);

    // Function to request access token (triggers the Google sign-in prompt)
    const requestAccessToken = () => {
        if (tokenClient.current) {
            tokenClient.current.requestAccessToken();
        } else {
            console.error('Token client not initialized.');
        }
    };

    // Testing function
    const handleTimingClick = () => {
        const clickId = clickData.length + 1;
        const currentTime = new Date().toLocaleTimeString();
        setClickData([...clickData, { clickId, currentTime }]);
        console.log(`clicked: ${currentTime}`);
    };


    const handleDoneClick = () => {
        if (sheetId) {
            saveDataToGoogleSheet(sheetId, clickData);
        } else {
            console.log('No sheet available.');
        }
    };

    const createGoogleSheet = () => {
        // Google drive folder ID
        const folderId = '19mzh4KDbphsstyke9P9oVYl2vRU5xtrr';  
    
        const fileMetadata = {
            'name': 'Tangram Game Data - Test1',
            'mimeType': 'application/vnd.google-apps.spreadsheet',
            'parents': [folderId]
        };
    
        // Ensure tokenClient is initialized
        if (tokenClient.current) {
            // Set the callback to handle the token response
            tokenClient.current.callback = (tokenResponse) => {
                const accessToken = tokenResponse.access_token;
                fetch('https://www.googleapis.com/drive/v3/files', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(fileMetadata),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('New Sheet Created with ID:', data.id);
                    setSheetId(data.id);  // Store the sheet ID for future use
                })
                .catch(error => {
                    console.error('Error creating Google Sheet:', error);
                });
            };
    
            // Request token and create the sheet when access is granted
            tokenClient.current.requestAccessToken();
        } else {
            console.error('Token client is not initialized.');
        }
    };

    const saveDataToGoogleSheet = (sheetId, data) => {
        const formattedData = data.map((entry) => [entry.clickId, entry.currentTime]);

        const valueRangeBody = {
            values: [
                ['Click ID', 'Time'],
                ...formattedData,
            ],
        };

        // Get the access token before saving data to Google Sheets
        tokenClient.current.callback = (tokenResponse) => {
            const accessToken = tokenResponse.access_token;
            fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:append?valueInputOption=RAW`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(valueRangeBody),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Data saved successfully:', data);
            })
            .catch(error => {
                console.error('Error saving data:', error);
            });
        };

        // Request token and save the data when access is granted
        requestAccessToken();
    };

    return (
        <div>
            <h1>This is the GameRunner</h1>
            <button onClick={handleTimingClick}>Timing</button>
            <button onClick={handleDoneClick}>Done</button>
            <button onClick={createGoogleSheet}>Create New Google Sheet</button>
        </div>
    );
}

export default GameRunner;
