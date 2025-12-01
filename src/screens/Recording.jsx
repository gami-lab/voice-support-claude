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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 text-rockman-blue hover:text-joust-blue flex items-center gap-2 font-body transition-colors"
        >
          ← Back
        </button>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-light-gray rounded-full h-3 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${getProgressColor()}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Use Case Header */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-5xl">{config.icon}</div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-charcoal">
                {config.name[language]}
              </h2>
              <p className="font-body text-slate">{config.context[language]}</p>
            </div>
          </div>

          {/* Questions */}
          <div className="mt-6">
            <h3 className="font-heading font-semibold text-charcoal mb-3">{t('questions')}</h3>
            <ol className="list-decimal list-inside space-y-2">
              {config.questions[language].map((question, idx) => (
                <li key={idx} className="font-body text-slate">{question}</li>
              ))}
            </ol>
          </div>
        </div>

        {/* Recording Controls */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <div className="text-center">
            {currentPass === 0 && (
              <div>
                <div className="mb-4">
                  <div className="inline-block w-20 h-20 bg-gradient-to-br from-primary to-chunky-bee rounded-full flex items-center justify-center text-white text-3xl shadow-md">
                    🎤
                  </div>
                </div>
                <button
                  onClick={startPass1}
                  className="bg-primary hover:bg-chunky-bee text-white px-8 py-3 rounded-audiogami font-body font-semibold text-lg transition-colors shadow-sm"
                >
                  {t('testPass1')}
                </button>
              </div>
            )}

            {currentPass === 1 && !isTyping && missingFields.length > 0 && (
              <div>
                <div className="mb-4 p-4 bg-off-white border-2 border-chunky-bee rounded-audiogami">
                  <p className="text-charcoal font-body font-semibold mb-2">
                    {pass2Prompt}
                  </p>
                </div>
                <button
                  onClick={startPass2}
                  className="bg-primary hover:bg-chunky-bee text-white px-8 py-3 rounded-audiogami font-body font-semibold text-lg transition-colors shadow-sm"
                >
                  {t('testPass2')}
                </button>
              </div>
            )}

            {isTyping && (
              <div className="flex items-center justify-center gap-3">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-chunky-bee rounded-full flex items-center justify-center text-white text-2xl shadow-md animate-pulse">
                  🎤
                </div>
                <span className="text-charcoal font-body font-semibold">{t('recording')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Transcription */}
        {transcript && (
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
            <h3 className="font-heading font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span>📝</span>
              {t('transcription')}
            </h3>
            <div className="bg-white border border-light-gray rounded-audiogami p-4 font-body text-slate leading-relaxed whitespace-pre-wrap">
              {transcript}
              {isTyping && <span className="animate-pulse text-primary">▊</span>}
            </div>
          </div>
        )}

        {/* Detected Answers */}
        {Object.keys(detectedFields).length > 0 && (
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
            <h3 className="font-heading font-semibold text-rockman-blue mb-4 flex items-center gap-2">
              <span>✓</span>
              {t('answersDetected')}
            </h3>
            <div className="grid gap-3">
              {Object.entries(detectedFields).map(([key, value]) => {
                if (key === 'tags' && Array.isArray(value)) {
                  return (
                    <div key={key} className="bg-white border border-rockman-blue rounded-audiogami p-3 animate-fade-in">
                      <div className="text-sm font-body font-semibold text-rockman-blue mb-1">
                        {t(key)}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {value.map(tag => (
                          <span key={tag} className="bg-rockman-blue text-white px-2 py-1 rounded text-sm font-body">
                            {t(tag)}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={key} className="bg-white border border-rockman-blue rounded-audiogami p-3 animate-fade-in">
                    <div className="text-sm font-body font-semibold text-rockman-blue mb-1">
                      {t(key)}
                    </div>
                    <div className="font-body text-slate">
                      {typeof value === 'string' ? (t(value) || value) : JSON.stringify(value)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Missing Fields */}
        {missingFields.length > 0 && currentPass === 1 && (
          <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6">
            <h3 className="font-heading font-semibold text-primary mb-4 flex items-center gap-2">
              <span>❓</span>
              {t('questionsRemaining')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {missingFields.map(field => (
                <span key={field} className="bg-chunky-bee text-charcoal px-3 py-1 rounded-audiogami text-sm font-body font-medium">
                  {t(field)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Recording;
