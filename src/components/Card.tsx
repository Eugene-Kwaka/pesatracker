import React, { ReactNode } from 'react';
import styles from './Card.module.css';
import clsx from 'clsx';

interface CardProps {
    title: string;
    value?: string | number;
    children?: ReactNode;
    className?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
}

export const Card: React.FC<CardProps> = ({ title, value, children, className, trend, trendValue }) => {
    return (
        <div className={clsx(styles.card, className)}>
            <div className={styles.title}>{title}</div>
            {value && <div className={styles.value}>{value}</div>}
            {trend && trendValue && (
                <div className={clsx(styles.trend, {
                    [styles.trendUp]: trend === 'up',
                    [styles.trendDown]: trend === 'down',
                })}>
                    <span>{trend === 'up' ? '↑' : trend === 'down' ? '↓' : '•'}</span>
                    <span>{trendValue}</span>
                </div>
            )}
            {children}
        </div>
    );
};
