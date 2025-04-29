import React, { useEffect, useState } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-markdown';

import styles from './TextFormatter.module.css';

interface TextFormatterProps {
  prompt: string;
}

const TextFormatter: React.FC<TextFormatterProps> = ({ prompt }) => {
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    Prism.highlightAll();
  }, [prompt]);

  const handleCopy = async (code: string, blockId: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedStates(prev => ({ ...prev, [blockId]: true }));
      setTimeout(() => {
        setCopiedStates(prev => ({ ...prev, [blockId]: false }));
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatText = (text: string): JSX.Element[] => {
    const sections = text.split(/(```[\s\S]*?```)/g);
    
    return sections.map((section, idx) => {
      const codeMatch = section.match(/```(\w*)\n([\s\S]*?)```/);
      
      if (codeMatch) {
        const [, lang, code] = codeMatch;
        const languageClass = lang ? `language-${lang}` : 'language-javascript';
        const blockId = `code-block-${idx}`;
        const isCopied = copiedStates[blockId] || false;

        return (
          <div key={idx} className={styles.codeBlockWrapper}>
            <div className={styles.codeBlockHeader}>
              <span className={styles.languageLabel}>{lang || 'text'}</span>
              <button
                className={styles.copyButton}
                onClick={() => handleCopy(code.trim(), blockId)}
                title="Copy code"
              >
                {isCopied ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M17.663 3.118c.225.015.45.032.673.05C19.876 3.298 21 4.604 21 6.109v9.642a3 3 0 01-3 3V16.5c0-5.922-4.576-10.775-10.384-11.217.324-1.132 1.3-2.01 2.548-2.114.224-.019.448-.036.673-.051A3 3 0 0113.5 1.5H15a3 3 0 012.663 1.618zM12 4.5A1.5 1.5 0 0113.5 3H15a1.5 1.5 0 011.5 1.5H12z" clipRule="evenodd" />
                    <path d="M3 8.625c0-1.036.84-1.875 1.875-1.875h.375A3.75 3.75 0 019 10.5v1.875c0 1.036.84 1.875 1.875 1.875h1.875A3.75 3.75 0 0116.5 18v2.625c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625v-12z" />
                    <path d="M10.5 10.5a5.23 5.23 0 00-1.279-3.434 9.768 9.768 0 016.963 6.963 5.23 5.23 0 00-3.434-1.279h-1.875a.375.375 0 01-.375-.375V10.5z" />
                  </svg>
                )}
              </button>
            </div>
            <pre className={styles.codeBlock}>
              <code className={languageClass}>{code.trim()}</code>
            </pre>
          </div>
        );
      }

      const formattedSection = section
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^-\s+(.*)/gm, '<li>$1</li>')
        .split('\n\n')
        .map((para, paraIdx) => {
          if (para.includes('<li>')) {
            return `<ul>${para}</ul>`;
          }
          return `<div class="${styles.paragraph}">${para}</div>`;
        })
        .join('');

      return (
        <div 
          key={idx} 
          dangerouslySetInnerHTML={{ __html: formattedSection }} 
          className={styles.formattedText}
        />
      );
    });
  };

  return <div className={styles.container}>{formatText(prompt)}</div>;
};

export default TextFormatter;
