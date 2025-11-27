import React, { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './Input.module.css'; // Reusing Input styles for consistency

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, className, id, options, ...props }) => {
    return (
        <div className={clsx(styles.wrapper, className)}>
            {label && <label htmlFor={id} className={styles.label}>{label}</label>}
            <select
                id={id}
                className={clsx(styles.input, error && styles.inputError)}
                {...props}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
};
