import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Loader2 } from 'lucide-react';
import type { FeedbackMessage } from '../../types';

interface OutputPanelProps {
  output: string | null;
  isExecuting: boolean;
  onRun: () => void;
  language: string;
  previewCode: string | null;
  feedback: FeedbackMessage | null;
}

/**
 * Painel de console/preview com feedback contextual.
 *
 * Adaptações pedagógicas:
 * - Erros nunca em vermelho agressivo — usa coral suave
 * - Feedback do motor de feedback integrado
 * - Preview HTML/CSS via iframe
 * - Mensagens de incentivo no estado vazio
 */
export const OutputPanel: React.FC<OutputPanelProps> = ({
  output,
  isExecuting,
  onRun,
  language,
  previewCode,
  feedback,
}) => {
  const isWebLanguage = language === 'html' || language === 'css';

  return (
    <div className="h-52 bg-surface rounded-2xl border border-white/5 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/5">
        <span className="font-mono text-sm text-muted">
          {isWebLanguage ? 'Preview' : 'Console'}
        </span>
        <button
          onClick={onRun}
          disabled={isExecuting}
          className={`px-5 py-2 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${
            isExecuting
              ? 'bg-muted/20 text-muted cursor-not-allowed'
              : 'bg-success hover:bg-success/90 text-background hover:scale-[1.02] active:scale-[0.98]'
          }`}
        >
          {isExecuting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              Executar Código
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 p-4 font-mono text-sm overflow-y-auto whitespace-pre-wrap relative">
        {isWebLanguage && previewCode !== null ? (
          <iframe
            srcDoc={
              language === 'css'
                ? `<style>${previewCode}</style><div style="padding:20px;font-family:sans-serif;color:black;">Pré-visualização CSS ativada. Escreva regras para tags como body, h1, div.</div>`
                : previewCode
            }
            className="w-full h-full bg-white border-0 rounded-lg"
            sandbox="allow-scripts"
          />
        ) : output ? (
          <span
            className={
              output.startsWith('Erro')
                ? 'text-rose-300'  // Coral suave, não vermelho agressivo
                : 'text-emerald-300'
            }
          >
            {output}
          </span>
        ) : (
          <span className="text-muted italic">
            Saída do seu programa aparecerá aqui...
          </span>
        )}

        {/* Feedback overlay */}
        <AnimatePresence>
          {feedback && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`absolute bottom-3 left-3 right-3 px-4 py-2.5 rounded-xl text-sm font-medium backdrop-blur-md ${
                feedback.type === 'success'
                  ? 'bg-success/15 border border-success/20 text-success'
                  : feedback.type === 'hint'
                  ? 'bg-warning/15 border border-warning/20 text-warning'
                  : 'bg-surface/80 border border-white/10'
              }`}
            >
              {feedback.emoji && <span className="mr-2">{feedback.emoji}</span>}
              {feedback.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
