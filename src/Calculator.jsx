import React, { useState, useEffect } from 'react';

const Calculator = () => {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isTyping, setIsTyping] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);

  // Haptic feedback function
  const vibrate = () => {
    if (navigator.vibrate) {
      navigator.vibrate(50); // 50ms vibration
    }
  };

  function formatIndianNumber(num) {
    const number = Number(num);
    if (isNaN(number)) return 'Error';
    return number.toLocaleString("en-IN");
  }

  function formatExpressionWithIndianCommas(expr) {
    const parts = expr.split(/([+\-×÷%])/);
    return parts
      .map((part) => {
        if (!isNaN(part) && part.trim() !== '') {
          return Number(part).toLocaleString('en-IN');
        }
        return part;
      })
      .join('');
  }

  // Calculate result in real-time
  const calculateRealTimeResult = (expr) => {
    if (!expr || expr === '') return '0';
    
    try {
      // Remove trailing operators for calculation
      let cleanExpr = expr.replace(/[+\-×÷%]$/, '');
      if (!cleanExpr) return '0';
      
      const sanitized = cleanExpr
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      
      const evalResult = eval(sanitized);
      return isNaN(evalResult) ? 'Error' : evalResult.toString();
    } catch {
      return '0';
    }
  };

  // Update result whenever expression changes
  useEffect(() => {
    if (expression && !showFinalResult) {
      const realTimeResult = calculateRealTimeResult(expression);
      setResult(realTimeResult);
    }
  }, [expression, showFinalResult]);

  const handleClick = (value) => {
    vibrate(); // Add haptic feedback
    
    if (value === '=') {
      try {
        const sanitized = expression
          .replace(/×/g, '*')
          .replace(/÷/g, '/');
        const evalResult = eval(sanitized);
        setResult(evalResult.toString());
        setShowFinalResult(true);
        setIsTyping(false);
      } catch {
        setResult("Error");
        setShowFinalResult(true);
        setIsTyping(false);
      }
    } else if (value === 'AC') {
      setExpression('');
      setResult('0');
      setIsTyping(false);
      setShowFinalResult(false);
    } else if (value === '⌫') {
      setExpression(prev => prev.slice(0, -1));
      setIsTyping(expression.length > 1);
      setShowFinalResult(false);
    } else {
      // If we just showed final result and user starts typing a number, start fresh
      if (showFinalResult && !['+', '-', '×', '÷', '%'].includes(value)) {
        setExpression(value);
        setShowFinalResult(false);
        setIsTyping(true);
        return;
      }
      
      // If we just showed final result and user adds an operator, continue with current result
      if (showFinalResult && ['+', '-', '×', '÷', '%'].includes(value)) {
        setExpression(result + value);
        setShowFinalResult(false);
        setIsTyping(true);
        return;
      }
      
      setExpression(prev => {
        const lastChar = prev.slice(-1);
        const operators = ['+', '-', '×', '÷', '%'];
        
        // Prevent consecutive operators
        if (operators.includes(lastChar) && operators.includes(value)) {
          return prev.slice(0, -1) + value;
        }
        
        return prev + value;
      });
      setIsTyping(true);
      setShowFinalResult(false);
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
        <div className={`expression ${isTyping && !showFinalResult ? 'bold' : ''}`}>
          {expression ? formatExpressionWithIndianCommas(expression) : ''}
        </div>
        <div className={`result ${showFinalResult ? 'bold' : ''}`}>
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

      <style jsx>{`
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

        .calculator {
          width: 100vw;
          height: 100vh;
          height: 100dvh; /* Dynamic viewport height for mobile */
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
          /* Handle safe areas for devices with notches/home indicators */
          padding-top: env(safe-area-inset-top);
          padding-bottom: env(safe-area-inset-bottom);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }

        .display {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 30px 10px 30px 20px;
          text-align: right;
          background-color: #000;
          overflow: hidden;
          min-height: 0; /* Allow flex shrinking */
        }

        .expression {
          font-size: 28px;
          color: #666;
          margin-bottom: 15px;
          font-weight: 300;
          min-height: 35px;
          word-wrap: break-word;
          word-break: break-all;
          overflow-wrap: break-word;
          transition: all 0.2s ease;
          padding-right: 10px;
          margin-right: 0;
        }

        .expression.bold {
          font-weight: 600;
          color: #fff;
          transform: scale(1.05);
          font-size: 40px;
          transform-origin: right center;
        }

        .result {
          font-size: 56px;
          font-weight: 300;
          color: #666;
          word-wrap: break-word;
          word-break: break-all;
          overflow-wrap: break-word;
          line-height: 1.1;
          transition: all 0.2s ease;
          padding-right: 10px;
          margin-right: 0;
        }

        .result.bold {
          font-weight: 600;
          color: white;
          transform: scale(1.02);
        }

        .buttons {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          padding: 20px;
          padding-bottom: max(20px, env(safe-area-inset-bottom, 20px)); /* Ensure bottom spacing */
          background-color: #000;
          flex-shrink: 0; /* Prevent buttons from being compressed */
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
          min-height: 60px; /* Ensure minimum button size */
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

          .expression {
            font-size: 24px;
            min-height: 30px;
          }

          .expression.bold {
            font-size: 34px;
          }

          .result {
            font-size: 48px;
          }

          .buttons {
            gap: 8px;
            padding: 15px;
            padding-bottom: max(25px, env(safe-area-inset-bottom, 25px));
          }

          button {
            font-size: 26px;
            height: calc((100vw - 64px) / 4 - 6px);
            max-height: 70px;
            min-height: 55px;
          }
        }

        /* Large phones */
        @media (min-width: 414px) {
          .display {
            padding: 40px 25px 25px 25px;
          }

          .expression {
            font-size: 32px;
            min-height: 40px;
          }

          .expression.bold {
            font-size: 44px;
          }

          .result {
            font-size: 64px;
          }

          .buttons {
            gap: 15px;
            padding: 25px;
            padding-bottom: max(35px, env(safe-area-inset-bottom, 35px));
          }

          button {
            font-size: 34px;
            height: calc((100vw - 110px) / 4 - 11px);
            max-height: 90px;
            min-height: 70px;
          }
        }

        /* Extra small screens - emergency fallback */
        @media (max-height: 600px) {
          .display {
            padding: 15px 10px 10px 15px;
          }

          .expression {
            font-size: 22px;
            min-height: 25px;
            margin-bottom: 10px;
          }

          .expression.bold {
            font-size: 30px;
          }

          .result {
            font-size: 42px;
          }

          .buttons {
            gap: 6px;
            padding: 12px;
            padding-bottom: max(22px, env(safe-area-inset-bottom, 22px));
          }

          button {
            font-size: 24px;
            height: calc((100vw - 60px) / 4 - 4px);
            max-height: 65px;
            min-height: 50px;
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
            padding: 0; /* Reset safe area padding for desktop */
          }

          .display {
            padding: 40px 30px 30px 30px;
          }

          .expression {
            font-size: 28px;
          }

          .expression.bold {
            font-size: 38px;
          }

          .result {
            font-size: 56px;
          }

          .buttons {
            padding: 30px;
            padding-bottom: 30px; /* Standard padding for desktop */
            gap: 15px;
          }

          button {
            height: 75px;
            font-size: 32px;
            min-height: 75px;
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
            min-height: 85px;
          }

          .result {
            font-size: 64px;
          }

          .expression {
            font-size: 32px;
          }

          .expression.bold {
            font-size: 42px;
          }
        }
      `}</style>
    </div>
  );
};

export default Calculator;