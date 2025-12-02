import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCaseConfig } from '../data/useCases';
import { transcriptions, transcriptionsEN } from '../data/transcriptions';

const TYPEWRITER_DELAY = 40; // ms per character

const Recording = () => {
  const { useCaseId } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [currentPass, setCurrentPass] = useState(0); // 0 = not started, 1 = pass 1, 2 = pass 2
  const [transcript, setTranscript] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [detectedFields, setDetectedFields] = useState({});
  const [missingFields, setMissingFields] = useState([]);
  const [progress, setProgress] = useState(0);
  const [selectedExample, setSelectedExample] = useState(0);
  const [pass2Prompt, setPass2Prompt] = useState('');

  const config = useCaseConfig[useCaseId];
  const transcriptData = language === 'fr' ? transcriptions : transcriptionsEN;
  const examples = transcriptData[useCaseId] || [];
  const currentExample = examples[selectedExample];

  useEffect(() => {
    // Randomly select an example on mount
    if (examples.length > 0) {
      setSelectedExample(Math.floor(Math.random() * examples.length));
    }
  }, [useCaseId]);

  // Get which fields belong to which question
  const getQuestionForField = (fieldName) => {
    if (!config.questionFieldMapping) return -1;
    for (let i = 0; i < config.questionFieldMapping.length; i++) {
      if (config.questionFieldMapping[i].includes(fieldName)) {
        return i;
      }
    }
    return -1;
  };

  // Get all detected fields for a question
  const getFieldsForQuestion = (questionIndex) => {
    if (!config.questionFieldMapping) return {};
    const fieldNames = config.questionFieldMapping[questionIndex] || [];
    const fields = {};
    fieldNames.forEach(fieldName => {
      if (detectedFields[fieldName] !== undefined) {
        fields[fieldName] = detectedFields[fieldName];
      }
    });
    return fields;
  };

  // Check if a question has any answers
  const isQuestionAnswered = (questionIndex) => {
    const fields = getFieldsForQuestion(questionIndex);
    return Object.keys(fields).length > 0;
  };

  // Sort questions: answered first, unanswered last
  const getSortedQuestions = () => {
    const questions = config.questions[language].map((q, idx) => ({ text: q, index: idx }));
    return questions.sort((a, b) => {
      const aAnswered = isQuestionAnswered(a.index);
      const bAnswered = isQuestionAnswered(b.index);
      if (aAnswered && !bAnswered) return -1;
      if (!aAnswered && bAnswered) return 1;
      return 0;
    });
  };

  const typewriterEffect = async (text, onUpdate, onProgress, onComplete) => {
    setIsTyping(true);
    let currentText = '';

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      onUpdate(currentText);

      // Call progress callback to enable real-time field detection
      if (onProgress) {
        onProgress(currentText);
      }

      await new Promise(resolve => setTimeout(resolve, TYPEWRITER_DELAY));
    }

    setIsTyping(false);
    onComplete();
  };

  const startPass1 = () => {
    if (!currentExample) return;

    setCurrentPass(1);
    setTranscript('');
    setDetectedFields({});
    setProgress(30);

    const pass1Data = currentExample.pass1;

    // Simulate progressive field detection during transcription
    // In reality, this would be done by the AI as it processes the audio
    // For the demo, we'll show fields progressively based on transcript length
    const totalLength = pass1Data.transcript.length;
    const fieldEntries = Object.entries(pass1Data.mapping);

    typewriterEffect(
      pass1Data.transcript,
      (text) => setTranscript(text),
      (currentText) => {
        // Progressive field detection based on transcript progress
        const progressRatio = currentText.length / totalLength;
        const fieldsToShow = Math.floor(progressRatio * fieldEntries.length);

        const newFields = {};
        for (let i = 0; i < fieldsToShow; i++) {
          const [key, value] = fieldEntries[i];
          newFields[key] = value;
        }
        setDetectedFields(newFields);
      },
      () => {
        // After typewriter completes, ensure all fields are shown
        setTimeout(() => {
          setDetectedFields(pass1Data.mapping);
          setProgress(60);

          // Show missing fields
          if (pass1Data.missing && pass1Data.missing.length > 0) {
            setMissingFields(pass1Data.missing);
            // Show pass 2 prompt
            if (currentExample.pass2 && currentExample.pass2.prompt) {
              setPass2Prompt(currentExample.pass2.prompt[language]);
            }
          }
        }, 500);
      }
    );
  };

  const startPass2 = () => {
    if (!currentExample || !currentExample.pass2) return;

    setCurrentPass(2);
    const pass2Data = currentExample.pass2;

    // Append pass 2 transcript
    const fullTranscript = transcript + '\n\n' + pass2Data.transcript;
    let currentText = transcript + '\n\n';

    setProgress(70);

    const totalLength = pass2Data.transcript.length;
    const fieldEntries = Object.entries(pass2Data.mapping);

    typewriterEffect(
      pass2Data.transcript,
      (text) => setTranscript(currentText + text),
      (currentChunk) => {
        // Progressive field detection for pass 2
        const progressRatio = currentChunk.length / totalLength;
        const fieldsToShow = Math.floor(progressRatio * fieldEntries.length);

        const newFields = { ...detectedFields };
        for (let i = 0; i < fieldsToShow; i++) {
          const [key, value] = fieldEntries[i];
          newFields[key] = value;
        }
        setDetectedFields(newFields);
      },
      () => {
        // After typewriter completes, update all fields
        setTimeout(() => {
          setDetectedFields(prev => ({ ...prev, ...pass2Data.mapping }));
          setMissingFields([]);
          setProgress(100);

          // Auto-navigate to HITL screen after 1s
          setTimeout(() => {
            navigate(`/validate/${useCaseId}`, {
              state: {
                detectedFields: { ...detectedFields, ...pass2Data.mapping },
                transcript: fullTranscript,
              },
            });
          }, 1000);
        }, 500);
      }
    );
  };

  const getProgressColor = () => {
    if (progress < 60) return 'bg-chunky-bee';
    if (progress < 100) return 'bg-rockman-blue';
    return 'bg-primary';
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Header: Back Button + Title */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="text-rockman-blue hover:text-joust-blue flex items-center gap-2 font-body transition-colors"
            >
              ← Back
            </button>
            <div className="flex items-center gap-3">
              <div className="text-4xl">{config.icon}</div>
              <h2 className="text-2xl font-heading font-bold text-charcoal">
                {config.name[language]}
              </h2>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="bg-light-gray rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Transcription Section */}
        {transcript ? (
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4 mb-6">
            <h3 className="font-heading font-semibold text-charcoal mb-2 text-sm flex items-center gap-2">
              <span>📝</span>
              {t('transcription')}
            </h3>
            <div className="bg-white border border-light-gray rounded-audiogami p-3 font-body text-slate text-sm leading-relaxed whitespace-pre-wrap max-h-64 overflow-y-auto">
              {transcript}
              {isTyping && <span className="animate-pulse text-primary">▊</span>}
            </div>
          </div>
        ) : (
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4 text-center mb-6">
            <p className="font-body text-slate text-sm">{t('recording')}</p>
          </div>
        )}

        {/* Questions with Inline Answers */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4 mb-6">
          <h3 className="font-heading font-semibold text-charcoal mb-4 text-lg">{t('questions')}</h3>
          <div className="space-y-4">
            {getSortedQuestions().map(({ text, index }) => {
              const fields = getFieldsForQuestion(index);
              const answered = Object.keys(fields).length > 0;

              return (
                <div
                  key={index}
                  className={`border rounded-audiogami p-3 transition-all ${
                    answered
                      ? 'bg-white border-rockman-blue'
                      : 'bg-light-gray border-light-gray'
                  }`}
                >
                  {/* Question */}
                  <div className="flex items-start gap-2 mb-2">
                    <span className="text-sm font-body font-semibold text-charcoal">
                      {index + 1}.
                    </span>
                    <div className="flex-1">
                      <p className="font-body text-slate text-sm">{text}</p>
                    </div>
                    {answered && (
                      <span className="text-rockman-blue text-sm">✓</span>
                    )}
                  </div>

                  {/* Detected Answers for this Question */}
                  {answered && (
                    <div className="ml-6 space-y-2 animate-fade-in">
                      {Object.entries(fields).map(([key, value]) => {
                        // Skip auto-generated fields
                        if (key === 'category' || key === 'priority' || key === 'tags') {
                          return null;
                        }

                        if (key === 'tags' && Array.isArray(value)) {
                          return (
                            <div key={key} className="bg-rockman-blue/10 rounded-audiogami p-2">
                              <div className="text-xs font-body font-semibold text-rockman-blue mb-1">
                                {t(key)}
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {value.map(tag => (
                                  <span key={tag} className="bg-rockman-blue text-white px-2 py-0.5 rounded text-xs font-body">
                                    {t(tag)}
                                  </span>
                                ))}
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div key={key} className="bg-rockman-blue/10 rounded-audiogami p-2">
                            <div className="text-xs font-body font-semibold text-rockman-blue mb-1">
                              {t(key)}
                            </div>
                            <div className="font-body text-slate text-xs">
                              {typeof value === 'string' ? (t(value) || value) : JSON.stringify(value)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Test Pass 1 Button */}
        {currentPass === 0 && (
          <div className="text-center mb-4">
            <button
              onClick={startPass1}
              className="bg-primary hover:bg-chunky-bee text-white px-8 py-3 rounded-audiogami font-body font-semibold transition-colors shadow-sm w-full"
            >
              {t('testPass1')}
            </button>
          </div>
        )}

        {/* Missing Fields + Test Pass 2 */}
        {currentPass === 1 && !isTyping && missingFields.length > 0 && (
          <>
            {/* Missing Fields */}
            <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4 mb-4">
              <h3 className="font-heading font-semibold text-primary mb-2 text-sm flex items-center gap-2">
                <span>❓</span>
                {t('questionsRemaining')}
              </h3>
              {pass2Prompt && (
                <p className="text-charcoal font-body text-xs mb-2">
                  {pass2Prompt}
                </p>
              )}
              <div className="flex flex-wrap gap-1">
                {missingFields.map(field => (
                  <span key={field} className="bg-chunky-bee text-charcoal px-2 py-1 rounded-audiogami text-xs font-body font-medium">
                    {t(field)}
                  </span>
                ))}
              </div>
            </div>

            {/* Test Pass 2 Button */}
            <div className="text-center mb-4">
              <button
                onClick={startPass2}
                className="bg-primary hover:bg-chunky-bee text-white px-8 py-3 rounded-audiogami font-body font-semibold transition-colors shadow-sm w-full"
              >
                {t('testPass2')}
              </button>
            </div>
          </>
        )}

        {/* Recording Indicator */}
        {isTyping && (
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
              <span className="text-charcoal font-body font-semibold text-sm">{t('recording')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recording;
