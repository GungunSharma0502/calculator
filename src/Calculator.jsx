import React, { useState } from 'react';
import './styles.css';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  function formatIndianNumber(num) {
    const number = Number(num);
    if (isNaN(number)) return 'Error';
    return number.toLocaleString("en-IN");
  }

  function formatExpressionWithIndianCommas(expr) {
    const parts = expr.split(/([+\-\u00d7\u00f7%])/);
    return parts
      .map((part) => {
        if (!isNaN(part) && part.trim() !== '') {
          return Number(part).toLocaleString('en-IN');
        }
        return part;
      })
      .join('');
  }

  const handleClick = (value) => {
    if (value === '=') {
      try {
        const sanitized = expression
          .replace(/\u00d7/g, '*')
          .replace(/\u00f7/g, '/');
        const evalResult = eval(sanitized);
        setResult(evalResult);
      } catch {
        setResult("Error");
      }
    } else if (value === 'AC') {
      setExpression('');
      setResult('');
    } else if (value === '⌫') {
      setExpression(expression.slice(0, -1));
    } else {
      setExpression(prev => {
        const lastChar = prev.slice(-1);
        const operators = ['+', '-', '×', '÷', '%'];
        if (operators.includes(lastChar) && operators.includes(value)) {
          return prev;
        }
        return prev + value;
      });
    }
  };

  const buttons = [
    'AC', '%', '⌫', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '00', '0', '.', '='
  ];

  return (
    <div className="calculator">
      <div className="display">
        <div className="expression">{expression ? formatExpressionWithIndianCommas(expression) : '0'}</div>
        <div className="result">
          {result === '' ? '' : isNaN(result) ? result : formatIndianNumber(result)}
        </div>
      </div>

      <div className="buttons">
        {buttons.map((btn, index) => (
          <button key={index} onClick={() => handleClick(btn)} className={btn === '=' ? 'equals' : ''}>
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;