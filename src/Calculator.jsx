import React, { useState } from 'react';

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [isResult, setIsResult] = useState(false);

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
        setDisplay(formatIndianNumber(evalResult));
        setIsResult(true);
      } catch {
        setDisplay("Error");
        setIsResult(true);
      }
    } else if (value === 'AC') {
      setDisplay('0');
      setExpression('');
      setIsResult(false);
    } else if (value === '⌫') {
      if (isResult) {
        setDisplay('0');
        setExpression('');
        setIsResult(false);
      } else {
        const newExpression = expression.slice(0, -1);
        setExpression(newExpression);
        setDisplay(newExpression ? formatExpressionWithIndianCommas(newExpression) : '0');
      }
    } else {
      if (isResult) {
        // Agar result show ho raha hai aur number press kiya toh new calculation start karo
        if (!isNaN(value) && value !== '.') {
          setExpression(value);
          setDisplay(value);
          setIsResult(false);
        } else {
          // Operator press kiya toh current result ke saath continue karo
          const newExpression = display.replace(/,/g, '') + value;
          setExpression(newExpression);
          setDisplay(formatExpressionWithIndianCommas(newExpression));
          setIsResult(false);
        }
      } else {
        const lastChar = expression.slice(-1);
        const operators = ['+', '-', '×', '÷', '%'];
        if (operators.includes(lastChar) && operators.includes(value)) {
          return; // Don't add consecutive operators
        }
        const newExpression = expression + value;
        setExpression(newExpression);
        setDisplay(formatExpressionWithIndianCommas(newExpression));
      }
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
        <div className="main-display">
          {display}
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

  html, body {
    height: 100%;
    overflow: hidden;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background-color: #000;
    color: white;
  }

  #root {
    height: 100vh;
    width: 100vw;
  }

  .calculator {
    width: 100vw;
    height: 100vh;
    background-color: #000;
    display: flex;
    flex-direction: column;
    padding: 0;
    margin: 0;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .display {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 30px 20px 20px 20px;
    text-align: right;
    background-color: #000;
  }

  .main-display {
    font-size: 56px;
    font-weight: 300;
    color: white;
    word-wrap: break-word;
    line-height: 1.1;
    min-height: 60px;
  }

  .buttons {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    padding: 20px;
    background-color: #000;
  }

  button {
    border: none;
    border-radius: 50%;
    font-size: 30px;
    font-weight: 400;
    cursor: pointer;
    transition: all 0.1s ease;
    aspect-ratio: 1;
    height: calc((100vw - 80px) / 4 - 9px);
    max-height: 80px;
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

  /* Small phones */
  @media (max-width: 360px) {
    .display {
      padding: 20px 15px 15px 15px;
    }

    .main-display {
      font-size: 48px;
      min-height: 50px;
    }

    .buttons {
      gap: 8px;
      padding: 15px;
    }

    button {
      font-size: 26px;
      height: calc((100vw - 64px) / 4 - 6px);
      max-height: 70px;
    }
  }

  /* Large phones */
  @media (min-width: 414px) {
    .display {
      padding: 40px 25px 25px 25px;
    }

    .main-display {
      font-size: 64px;
      min-height: 70px;
    }

    .buttons {
      gap: 15px;
      padding: 25px;
    }

    button {
      font-size: 34px;
      height: calc((100vw - 110px) / 4 - 11px);
      max-height: 90px;
    }
  }

  /* Tablets and larger screens */
  @media (min-width: 768px) {
    .calculator {
      max-width: 400px;
      max-height: 700px;
      margin: 0 auto;
      position: relative;
      border-radius: 20px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      top: 50%;
      transform: translateY(-50%);
    }

    .display {
      padding: 40px 30px 30px 30px;
    }

    .main-display {
      font-size: 56px;
    }

    .buttons {
      padding: 30px;
      gap: 15px;
    }

    button {
      height: 75px;
      font-size: 32px;
    }
  }

  /* Extra large screens */
  @media (min-width: 1024px) {
    .calculator {
      max-width: 450px;
      max-height: 750px;
    }

    button {
      height: 85px;
      font-size: 36px;
    }

    .main-display {
      font-size: 64px;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);