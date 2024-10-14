import React from 'react';
import styles from './TextFormatter.module.css'; // Example CSS module

const TextFormatter = ({ prompt }) => {
  // Function to parse the prompt and convert it into JSX elements
  const formatText = (text) => {
    // Regex patterns for bold, bullets, and code blocks
    const boldPattern = /\*\*(.*?)\*\*/g;
    const bulletPattern = /^-\s+(.*)/gm;
    const codePattern = /```([\s\S]*?)```/g;

    // Split into paragraphs
    let formattedText = text.split('\n\n').map((para, idx) => {
      // Parse code blocks
      para = para.replace(codePattern, (match, p1) => `<code>${p1}</code>`);
      // Parse bold text
      para = para.replace(boldPattern, (match, p1) => `<strong>${p1}</strong>`);
      // Parse bullet points
      para = para.replace(bulletPattern, (match, p1) => `<li>${p1}</li>`);

      return para;
    });

    return formattedText.map((para, idx) => (
      <p key={idx} dangerouslySetInnerHTML={{ __html: para }} />
    ));
  };

  return <div className={styles.formattedText}>{formatText(prompt)}</div>;
};

export default TextFormatter;
