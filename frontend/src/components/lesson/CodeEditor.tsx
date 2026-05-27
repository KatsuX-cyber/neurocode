import React from 'react';
import Editor from '@monaco-editor/react';
import type { CognitiveMode } from '../../types';

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language: string;
  cognitiveMode: CognitiveMode;
}

/**
 * Monaco Editor wrapper com configurações adaptativas por modo cognitivo.
 *
 * Adaptações:
 * - standard: fontSize 14, minimap ON
 * - energetic: fontSize 15, minimap OFF (menos distração visual)
 * - focus: fontSize 16, minimap OFF, padding extra
 * - calm: fontSize 18, minimap OFF, lineHeight maior
 */
export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  onChange,
  language,
  cognitiveMode,
}) => {
  const editorConfig = getEditorConfig(cognitiveMode);

  const getFileName = () => {
    switch (language) {
      case 'html': return 'index.html';
      case 'css': return 'style.css';
      case 'java': return 'Main.java';
      default: return 'script.js';
    }
  };

  return (
    <div className="flex-1 rounded-2xl overflow-hidden border border-surface shadow-2xl shadow-black/50 flex flex-col">
      {/* Tab bar */}
      <div className="bg-surface px-4 py-2 border-b border-white/5 flex items-center justify-between">
        <span className="text-sm font-mono text-muted">{getFileName()}</span>
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/50" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
          <div className="w-3 h-3 rounded-full bg-green-500/50" />
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={(val) => onChange(val || '')}
          options={{
            minimap: { enabled: editorConfig.minimap },
            fontSize: editorConfig.fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
            padding: { top: editorConfig.paddingTop },
            lineHeight: editorConfig.lineHeight,
            cursorBlinking: 'smooth',
            autoClosingBrackets: 'always',
            autoClosingQuotes: 'always',
            suggestOnTriggerCharacters: true,
            scrollBeyondLastLine: false,
            wordWrap: 'on',
            tabSize: 2,
            renderLineHighlight: 'gutter',
            overviewRulerBorder: false,
          }}
        />
      </div>
    </div>
  );
};

function getEditorConfig(mode: CognitiveMode) {
  switch (mode) {
    case 'energetic':
      return { fontSize: 15, minimap: false, paddingTop: 12, lineHeight: 24 };
    case 'focus':
      return { fontSize: 16, minimap: false, paddingTop: 20, lineHeight: 26 };
    case 'calm':
      return { fontSize: 18, minimap: false, paddingTop: 20, lineHeight: 28 };
    default:
      return { fontSize: 14, minimap: true, paddingTop: 16, lineHeight: 24 };
  }
}
