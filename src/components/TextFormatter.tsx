import React, { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css'; // Optional theme
import 'prismjs/components/index'; // Import all languages

import styles from './TextFormatter.module.css';

interface TextFormatterProps {
  prompt: string;
}

const TextFormatter: React.FC<TextFormatterProps> = ({ prompt }) => {
  useEffect(() => {
    Prism.highlightAll(); // Apply syntax highlighting after each render
  }, [prompt]);

  const formatText = (text: string): JSX.Element[] => {
    const boldPattern = /\*\*(.*?)\*\*/g;
    const bulletPattern = /^-\s+(.*)/gm;
    const codePattern = /```(\w*)\n([\s\S]*?)```/g; // Capture language and code

    // Split the text into paragraphs
    const formattedText = text.split('\n\n').map((para) => {
      // Replace code blocks
      para = para.replace(codePattern, (match, lang, code) => {
        const languageClass = lang ? `language-${lang}` : 'language-javascript'; // Default to JS
        return `<pre><code class="${languageClass}">${code.trim()}</code></pre>`;
      });

      // Handle bold text
      para = para.replace(boldPattern, (_, boldText) => `<strong>${boldText}</strong>`);

      // Handle bullet points
      para = para.replace(bulletPattern, (_, bullet) => `<li>${bullet}</li>`);

      // Return the formatted paragraph
      return `<div>${para}</div>`;
    });

    return formattedText.map((para, idx) => (
      <div key={idx} dangerouslySetInnerHTML={{ __html: para }} />
    ));
  };

  return <div className={styles.formattedText}>{formatText(prompt)}</div>;
};

export default TextFormatter;
