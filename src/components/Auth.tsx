import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Input } from './Input';
import { Button } from './Button';
import styles from './Auth.module.css';

export const Auth: React.FC = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { signIn, signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            if (isLogin) {
                await signIn(email, password);
            } else {
                await signUp(email, password);
                setMessage('Account created! You can now sign in.');
                setIsLogin(true);
                setPassword('');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>PesaTracker</h1>
                <h2 className={styles.subtitle}>
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <Input
                        label="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                    />

                    <Input
                        label="Password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="••••••••"
                    />

                    {error && <p className={styles.error}>{error}</p>}
                    {message && <p className={styles.success}>{message}</p>}

                    <Button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : isLogin ? 'Sign In' : 'Sign Up'}
                    </Button>
                </form>

                <p className={styles.toggle}>
                    {isLogin ? "Don't have an account? " : 'Already have an account? '}
                    <button
                        type="button"
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setError('');
                            setMessage('');
                        }}
                        className={styles.toggleBtn}
                    >
                        {isLogin ? 'Sign Up' : 'Sign In'}
                    </button>
                </p>
            </div>
        </div>
    );
};
