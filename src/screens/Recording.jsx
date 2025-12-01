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

  const typewriterEffect = async (text, onUpdate, onComplete) => {
    setIsTyping(true);
    let currentText = '';

    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      onUpdate(currentText);
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

    typewriterEffect(
      pass1Data.transcript,
      (text) => setTranscript(text),
      () => {
        // After typewriter completes, show detected fields
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

    typewriterEffect(
      pass2Data.transcript,
      (text) => setTranscript(currentText + text),
      () => {
        // After typewriter completes, update fields
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
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header: Back Button + Title on same line */}
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

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column: Questions (compact) */}
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4">
            <h3 className="font-heading font-semibold text-charcoal mb-3 text-lg">{t('questions')}</h3>
            <ol className="list-decimal list-inside space-y-2">
              {config.questions[language].map((question, idx) => (
                <li key={idx} className="font-body text-slate text-sm" title={question}>
                  {question}
                </li>
              ))}
            </ol>
          </div>

          {/* Right Column: Transcription + Detected Fields + Actions */}
          <div className="space-y-4">
            {/* Transcription */}
            {transcript ? (
              <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4">
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
              <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4 text-center">
                <p className="font-body text-slate text-sm">{t('recording')}</p>
              </div>
            )}

            {/* Detected Answers */}
            {Object.keys(detectedFields).length > 0 && (
              <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4">
                <h3 className="font-heading font-semibold text-rockman-blue mb-2 text-sm flex items-center gap-2">
                  <span>✓</span>
                  {t('answersDetected')}
                </h3>
                <div className="grid gap-2">
                  {Object.entries(detectedFields).map(([key, value]) => {
                    if (key === 'tags' && Array.isArray(value)) {
                      return (
                        <div key={key} className="bg-white border border-rockman-blue rounded-audiogami p-2 animate-fade-in">
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
                      <div key={key} className="bg-white border border-rockman-blue rounded-audiogami p-2 animate-fade-in">
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
              </div>
            )}

            {/* Test Pass 1 Button */}
            {currentPass === 0 && (
              <div className="text-center">
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
                <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-4">
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
                <div className="text-center">
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
      </div>
    </div>
  );
};

export default Recording;
