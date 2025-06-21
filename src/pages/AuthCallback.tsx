import { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import toast from 'react-hot-toast';
import { AuthContext } from '../contexts/AuthContext';

const AuthCallback = () => {
    const auth = useContext(AuthContext);
    if (!auth) throw new Error("AuthContext not found.");

    const { login } = auth;
    const navigate = useNavigate();

    useEffect(() => {
        const handleGoogleAuth = async () => {
            const urlParams = new URLSearchParams(window.location.search);
            const code = urlParams.get('code');
            const error = urlParams.get('error');

            // Check if we're in a popup window
            const isPopup = window.opener && window.opener !== window;
            console.log('Is popup:', isPopup, 'window.opener:', !!window.opener);

            if (error) {
                if (isPopup) {
                    // Send error to parent window
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        message: 'Google login denied'
                    }, window.location.origin);
                    window.close();
                } else {
                    toast.error('Google login denied');
                    navigate('/signin');
                }
                return;
            }

            if (!code) {
                if (isPopup) {
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        message: 'No code found in URL'
                    }, window.location.origin);
                    window.close();
                } else {
                    toast.error('No code found in URL');
                    navigate('/signin');
                }
                return;
            }

            try {
                const res = await api.post(
                    '/auth/google',
                    { code },
                    { withCredentials: true }
                );

                if (res.data.success) {
                    if (isPopup) {
                        // Send success data to parent window
                        console.log('Sending success message to parent window:', res.data.data.user);
                        window.opener.postMessage({
                            type: 'GOOGLE_AUTH_SUCCESS',
                            user: res.data.data.user
                        }, '*'); // Use '*' for now to ensure message is sent

                        // Small delay before closing to ensure message is sent
                        setTimeout(() => {
                            window.close();
                        }, 100);
                    } else {
                        login(res.data.data.user);
                        toast.success('Signed in with Google!');
                        navigate('/dashboard');
                    }
                } else {
                    if (isPopup) {
                        window.opener.postMessage({
                            type: 'GOOGLE_AUTH_ERROR',
                            message: 'Google login failed'
                        }, window.location.origin);
                        window.close();
                    } else {
                        toast.error('Google login failed');
                        navigate('/signin');
                    }
                }
            } catch (err: any) {
                console.error('Auth callback error:', err);
                const errorMessage = err?.response?.data?.message || 'Login failed';

                if (isPopup) {
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_ERROR',
                        message: errorMessage
                    }, window.location.origin);
                    window.close();
                } else {
                    toast.error(errorMessage);
                    navigate('/signin');
                }
            }
        };

        handleGoogleAuth();
    }, [login, navigate]);

    return <div className="p-4 text-center">Logging you in via Google...</div>;
};

export default AuthCallback;