import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return <div className={`card ${className}`}>{children}</div>;
}

export function CardContent({ children, className = "" }: CardProps) {
  return <div className={`card-content ${className}`}>{children}</div>;
}

export function CardHeader({ children, className = "" }: CardProps) {
  return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: CardProps) {
  return <div className={`card-title ${className}`}>{children}</div>;
}