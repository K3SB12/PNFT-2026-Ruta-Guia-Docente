import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckCircle, XCircle, AlertTriangle, Play, RefreshCw, FileText } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

export function Simulator() {
  const { state, addSimulatorScore } = useAppContext();
  const [isStarted, setIsStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isFinished, setIsFinished] = useState(false);

  const questions = state.simulatorQuestions;

  const handleStart = () => {
    setIsStarted(true);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setIsFinished(false);
  };

  const handleAnswer = (optionIndex: number) => {
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIndex]: optionIndex }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      finishSimulator();
    }
  };

  const finishSimulator = () => {
    let score = 0;
    questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        score += 1;
      }
    });
    const finalScore = Math.round((score / questions.length) * 100);
    addSimulatorScore(finalScore);
    setIsFinished(true);
  };

  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-500 py-12">
        <div className="w-24 h-24 glass-panel rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
          <FileText className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-4xl font-bold tracking-tight text-zinc-100">Simulador de Idoneidad</h2>
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Motor de examen con ítems de selección única basados en resolución de casos contextualizados para el Estrato Técnico Docente.
        </p>
        
        <div className="glass-panel rounded-2xl p-6 max-w-md mx-auto text-left space-y-4">
          <div className="flex items-center gap-3 text-zinc-300">
            <CheckCircle className="w-5 h-5 text-emerald-500" />
            <span>{questions.length} ítems de selección única</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span>Nota mínima de aprobación: 70</span>
          </div>
          <div className="flex items-center gap-3 text-zinc-300">
            <Play className="w-5 h-5 text-blue-500" />
            <span>Casos prácticos, no memoria</span>
          </div>
        </div>

        <button 
          onClick={handleStart}
          className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold rounded-full text-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
        >
          Iniciar Prueba
        </button>
      </div>
    );
  }

  if (isFinished) {
    const score = state.simulatorScores[state.simulatorScores.length - 1];
    const isPassed = score >= 70;

    return (
      <div className="max-w-3xl mx-auto space-y-8 animate-in slide-in-from-bottom-4 duration-500 py-8">
        <div className="glass-panel rounded-3xl p-10 text-center">
          <div className={twMerge(
            "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border-4",
            isPassed ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500" : "bg-amber-500/10 border-amber-500/30 text-amber-500"
          )}>
            {isPassed ? <CheckCircle className="w-12 h-12" /> : <AlertTriangle className="w-12 h-12" />}
          </div>
          
          <h2 className="text-3xl font-bold text-zinc-100 mb-2">
            {isPassed ? '¡Prueba Superada!' : 'Requiere Refuerzo'}
          </h2>
          <p className="text-zinc-400 mb-8">Has obtenido una calificación de:</p>
          
          <div className="text-7xl font-black tracking-tighter mb-8">
            <span className={isPassed ? "text-emerald-500" : "text-amber-500"}>{score}</span>
            <span className="text-zinc-600 text-4xl">/100</span>
          </div>

          <button 
            onClick={handleStart}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-medium rounded-full transition-colors mx-auto"
          >
            <RefreshCw className="w-4 h-4" /> Reintentar Simulador
          </button>
        </div>

        {/* Review Answers */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold text-zinc-100 border-b border-zinc-800 pb-4">Revisión de Casos</h3>
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <div key={q.id} className={twMerge(
                "p-6 rounded-2xl border",
                isCorrect ? "bg-emerald-950/20 border-emerald-900/50" : "bg-rose-950/20 border-rose-900/50"
              )}>
                <div className="flex gap-4">
                  <div className="mt-1">
                    {isCorrect ? <CheckCircle className="w-6 h-6 text-emerald-500" /> : <XCircle className="w-6 h-6 text-rose-500" />}
                  </div>
                  <div className="space-y-4 flex-1">
                    <p className="text-zinc-200 font-medium leading-relaxed">
                      <span className="text-zinc-500 mr-2">{index + 1}.</span>
                      {q.text}
                    </p>
                    
                    <div className="space-y-2">
                      {q.options.map((opt, i) => (
                        <div key={i} className={twMerge(
                          "p-3 rounded-lg text-sm",
                          i === q.correctAnswer ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : 
                          i === userAnswer && !isCorrect ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" : 
                          "bg-black/20 text-zinc-500"
                        )}>
                          {opt}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 p-4 bg-black/20 rounded-xl border border-white/5 text-sm text-zinc-400">
                      <strong className="text-zinc-300 block mb-1">Justificación Normativa:</strong>
                      {q.explanation}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const hasAnswered = selectedAnswers[currentQuestionIndex] !== undefined;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300 py-8">
      {/* Progress Bar */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-zinc-400">Caso {currentQuestionIndex + 1} de {questions.length}</span>
        <span className="text-sm font-medium text-emerald-500">{Math.round(((currentQuestionIndex) / questions.length) * 100)}%</span>
      </div>
      <div className="w-full bg-black/40 rounded-full h-2 mb-8 overflow-hidden">
        <div 
          className="bg-emerald-500 h-2 rounded-full transition-all duration-500 ease-out" 
          style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        ></div>
      </div>

      {/* Question Card */}
      <div className="glass-panel rounded-3xl p-8 shadow-2xl">
        <h3 className="text-xl font-medium text-zinc-100 leading-relaxed mb-8">
          {currentQuestion.text}
        </h3>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => {
            const isSelected = selectedAnswers[currentQuestionIndex] === index;
            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                className={twMerge(
                  "w-full text-left p-4 rounded-xl border transition-all duration-200",
                  isSelected 
                    ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
                    : "bg-zinc-950 border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={twMerge(
                    "w-6 h-6 rounded-full border flex items-center justify-center flex-shrink-0 mt-0.5",
                    isSelected ? "border-emerald-500 bg-emerald-500/20" : "border-zinc-600"
                  )}>
                    {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />}
                  </div>
                  <span className="leading-relaxed">{option}</span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex justify-end">
          <button
            onClick={handleNext}
            disabled={!hasAnswered}
            className={twMerge(
              "px-8 py-3 rounded-full font-medium transition-all",
              hasAnswered 
                ? "bg-emerald-500 hover:bg-emerald-600 text-zinc-950" 
                : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
            )}
          >
            {currentQuestionIndex === questions.length - 1 ? 'Finalizar Prueba' : 'Siguiente Caso'}
          </button>
        </div>
      </div>
    </div>
  );
}
