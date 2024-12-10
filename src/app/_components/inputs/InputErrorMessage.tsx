import React from 'react';

interface InputErrorMessageProps {
  message: string;
}

const InputErrorMessage: React.FC<InputErrorMessageProps> = ({ message }) => {
  return <div className="text-xs text-destructive px-1">{message}</div>;
};

export default InputErrorMessage;
