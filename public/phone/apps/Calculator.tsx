import React, { useState } from 'react';

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? digit : display + digit);
    }
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(display);

    if (prevValue === null) {
      setPrevValue(inputValue);
    } else if (operator) {
      const currentValue = prevValue || 0;
      const newValue = calculate(currentValue, inputValue, operator);
      setPrevValue(newValue);
      setDisplay(String(newValue));
    }

    setWaitingForOperand(true);
    setOperator(nextOperator);
  };

  const calculate = (prev: number, next: number, op: string) => {
    switch (op) {
      case '/': return prev / next;
      case '*': return prev * next;
      case '-': return prev - next;
      case '+': return prev + next;
      default: return next;
    }
  };

  const clear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperator(null);
    setWaitingForOperand(false);
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const percent = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  const btnClass = "h-16 w-16 rounded-full text-3xl font-medium flex items-center justify-center transition-opacity active:opacity-70 select-none";
  const grayBtn = `${btnClass} bg-gray-400 text-black`;
  const orangeBtn = `${btnClass} bg-amber-500 text-white`;
  const darkBtn = `${btnClass} bg-neutral-800 text-white`;
  
  // Double width for zero
  const zeroBtn = "h-16 w-36 rounded-full text-3xl font-medium flex items-center pl-8 bg-neutral-800 text-white active:opacity-70 select-none";

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 pb-12">
      <div className="flex-1 flex items-end justify-end p-4">
        <span className="text-7xl font-light tracking-tight truncate">{display}</span>
      </div>
      <div className="grid grid-cols-4 gap-3 mb-4">
        <button className={grayBtn} onClick={clear}>{display === '0' && !prevValue ? 'AC' : 'C'}</button>
        <button className={grayBtn} onClick={toggleSign}>+/-</button>
        <button className={grayBtn} onClick={percent}>%</button>
        <button className={orangeBtn} onClick={() => performOperation('/')}>÷</button>
        
        <button className={darkBtn} onClick={() => inputDigit('7')}>7</button>
        <button className={darkBtn} onClick={() => inputDigit('8')}>8</button>
        <button className={darkBtn} onClick={() => inputDigit('9')}>9</button>
        <button className={orangeBtn} onClick={() => performOperation('*')}>×</button>
        
        <button className={darkBtn} onClick={() => inputDigit('4')}>4</button>
        <button className={darkBtn} onClick={() => inputDigit('5')}>5</button>
        <button className={darkBtn} onClick={() => inputDigit('6')}>6</button>
        <button className={orangeBtn} onClick={() => performOperation('-')}>−</button>
        
        <button className={darkBtn} onClick={() => inputDigit('1')}>1</button>
        <button className={darkBtn} onClick={() => inputDigit('2')}>2</button>
        <button className={darkBtn} onClick={() => inputDigit('3')}>3</button>
        <button className={orangeBtn} onClick={() => performOperation('+')}>+</button>
        
        <button className={zeroBtn} onClick={() => inputDigit('0')}>0</button>
        <button className={darkBtn} onClick={() => inputDigit('.')}>.</button>
        <button className={orangeBtn} onClick={() => performOperation('=')}>=</button>
      </div>
    </div>
  );
};

export default Calculator;