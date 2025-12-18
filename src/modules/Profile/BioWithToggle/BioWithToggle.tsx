import React, { useState } from "react";
import styles from "./BioWithToggle.module.css";

interface BioWithToggleProps {
  text: string | null | undefined;
  maxChars?: number;
}

const BioWithToggle: React.FC<BioWithToggleProps> = ({
  text,
  maxChars = 130,
}) => {
  const [expanded, setExpanded] = useState<boolean>(false);

  if (!text) {
    return null;
  }

  const lines = text.split("\n");

  const renderClamped = () => {
    let charCount = 0;
    const clampedLines: string[] = [];

    for (const line of lines) {
      if (charCount >= maxChars) break;

      const remaining = maxChars - charCount;

      if (line.length <= remaining) {
        clampedLines.push(line);
        charCount += line.length;
      } else {
        clampedLines.push(line.slice(0, remaining));
        charCount += remaining;
        break;
      }
    }

    return clampedLines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i === clampedLines.length - 1 ? "..." : <br />}
      </React.Fragment>
    ));
  };

  const renderFull = () =>
    lines.map((line, i) => (
      <React.Fragment key={i}>
        {line}
        {i < lines.length - 1 && <br />}
      </React.Fragment>
    ));

  return (
    <p className={styles.bioText}>
      {expanded ? renderFull() : renderClamped()}{" "}
      {text.length > maxChars && (
        <button
          onClick={() => setExpanded(!expanded)}
          className={styles.toggleButton}
          type="button"
        >
          {expanded ? "less" : "more"}
        </button>
      )}
    </p>
  );
};

export default BioWithToggle;
