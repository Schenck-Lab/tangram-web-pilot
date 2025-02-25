import { useState } from 'react';
import { useGameContext } from '../../contexts/GameContext.js';
import { Input, Button, Typography, Alert, Space } from 'antd';
import { GAS_URL, ACTION } from '../../constants/gameConfig.js';

const { Title } = Typography;

function Login({ onEnterGame }) {
    const { pid, firstName, lastName, emailAddress } = useGameContext();
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [taskCompleted, setTaskCompleted] = useState(null);
    const [validated, setValidated] = useState(false);

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const handleLogin = () => {
        setError('');
        setSuccessMessage('');
        setValidated(false);
    
        if (!isValidEmail(email)) {
            setError('Invalid email format. Please enter a valid email.');
            return;
        }
        setLoading(true);
        const action = ACTION.loginVerification;
        const encodedEmail = encodeURIComponent(email);
    
        fetch(`${GAS_URL}?action=${action}&email=${encodedEmail}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    pid.current = data.pid;
                    firstName.current = data.firstName;
                    lastName.current = data.lastName;
                    emailAddress.current = email;
                    
                    setTaskCompleted(data.taskCompleted);
                    setSuccessMessage(`Welcome, ${data.firstName} ${data.lastName}!`);
                    setValidated(true);
                } else {
                    setError('Email not found. Please enter a valid registered email.');
                }
            })
            .catch(err => {
                console.error('Error during login:', err);
                setError('Something went wrong. Please try again.');
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const containerStyle = {
        display: 'flex',
        justifyContent: 'center',  // Center hori
        alignItems: 'center',      // Center vert
        height: '100vh',           // Full viewport height
    };
    const boxStyle = {
        width: 400,
        textAlign: 'center',
        padding: 30,
        border: '1px solid #ddd',
        borderRadius: 8,
        backgroundColor: '#ffffff',  // Light green
    };

    return (
        <div style={containerStyle}><div style={boxStyle}>
            <Title level={2}>Login</Title>
            
            <Space direction='vertical' size='large' style={{ width: '100%' }}>
                <Input
                    type='email'
                    placeholder='Enter your registered email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading || validated}
                    size='large'
                />

                <Button 
                    type='primary' 
                    onClick={handleLogin} 
                    loading={loading} 
                    disabled={!email.trim() || validated}
                    block
                >
                    Confirm
                </Button>

                {error && <Alert message={error} type='error' showIcon />}
                {successMessage && <Alert message={successMessage} type='success' showIcon />}
                
                {/* Move button below the message */}
                {validated && taskCompleted === false && (
                    <Button 
                        type='primary' 
                        onClick={onEnterGame} 
                        block
                    >
                        Enter the Game
                    </Button>
                )}

                {validated && taskCompleted === true && (
                    <Alert message='You have already completed the task.' type='warning' showIcon />
                )}
            </Space>
        </div></div>
    );
}

export default Login;