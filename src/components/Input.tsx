import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className, id, ...props }) => {
    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <input
                id={id}
                className={clsx(styles.input, error && styles.inputError)}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};
