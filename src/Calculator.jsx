import React, { useState } from 'react';

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

  const getButtonClass = (btn) => {
    if (btn === '=') return 'equals';
    if (['AC', '%', '⌫', '÷', '×', '-', '+'].includes(btn)) return 'operator';
    return 'number';
  };

  return (
    <div className="calculator">
      <div className="display">
        <div className="expression">
          {expression ? formatExpressionWithIndianCommas(expression) : ''}
        </div>
        <div className="result">
          {result === '' ? '0' : isNaN(result) ? result : formatIndianNumber(result)}
        </div>
      </div>

      <div className="buttons">
        {buttons.map((btn, index) => (
          <button 
            key={index} 
            onClick={() => handleClick(btn)} 
            className={getButtonClass(btn)}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Calculator;

// Inline styles for the calculator
const styles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #000;
    color: white;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .calculator {
    width: 100%;
    max-width: 375px;
    background-color: #000;
    padding: 20px;
    border-radius: 0;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .display {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 20px;
    text-align: right;
    min-height: 200px;
  }

  .expression {
    font-size: 32px;
    color: #666;
    margin-bottom: 10px;
    font-weight: 300;
    min-height: 40px;
  }

  .result {
    font-size: 64px;
    font-weight: 300;
    color: white;
    word-wrap: break-word;
    line-height: 1;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 20px 0;
  }

  button {
    border: none;
    border-radius: 50%;
    font-size: 32px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.1s ease;
    aspect-ratio: 1;
    min-height: 75px;
    display: flex;
    align-items: center;
    justify-content: center;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
  }

  button:active {
    transform: scale(0.95);
  }

  button.number {
    background-color: #333;
    color: white;
  }

  button.number:active {
    background-color: #666;
  }

  button.operator {
    background-color: #666;
    color: white;
  }

  button.operator:active {
    background-color: #999;
  }

  button.equals {
    background-color: #ff9500;
    color: white;
  }

  button.equals:active {
    background-color: #ffb143;
  }

  /* Mobile responsiveness */
  @media (max-width: 480px) {
    .calculator {
      padding: 10px;
      border-radius: 0;
    }

    .display {
      padding: 20px 10px;
      min-height: 150px;
    }

    .expression {
      font-size: 24px;
    }

    .result {
      font-size: 48px;
    }

    button {
      font-size: 28px;
      min-height: 65px;
    }

    .buttons {
      gap: 8px;
      padding: 10px 0;
    }
  }

  @media (max-width: 320px) {
    .display {
      min-height: 120px;
    }

    .expression {
      font-size: 20px;
    }

    .result {
      font-size: 40px;
    }

    button {
      font-size: 24px;
      min-height: 55px;
    }
  }

  /* For larger screens */
  @media (min-width: 481px) {
    .calculator {
      max-width: 400px;
      height: auto;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .display {
      min-height: 160px;
    }

    button {
      min-height: 80px;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);