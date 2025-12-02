import { useState, useEffect } from 'react';
import { useLanguage } from '../hooks/useLanguage';
import { useCaseConfig } from '../data/useCases';
import { Status, Priority, Tags } from '../data/enums';

const Validate = ({ useCaseId, detectedFields, transcript, onValidate, onBack }) => {
  const { language, t } = useLanguage();

  const config = useCaseConfig[useCaseId];
  const [formData, setFormData] = useState(detectedFields || {});
  const [tags, setTags] = useState(detectedFields?.tags || []);

  useEffect(() => {
    setFormData(detectedFields || {});
    setTags(detectedFields?.tags || []);
  }, [detectedFields]);

  const handleFieldChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const toggleTag = (tag) => {
    setTags(prev => {
      if (prev.includes(tag)) {
        return prev.filter(t => t !== tag);
      } else {
        return [...prev, tag];
      }
    });
  };

  const isFormComplete = () => {
    const requiredFields = config.fields.filter(f => f.required);
    return requiredFields.every(field => formData[field.name]);
  };

  const handleValidateClick = () => {
    const ticketData = {
      ...formData,
      tags,
      use_case: useCaseId,
      status: formData.status || Status.NEW,
      language,
      raw_transcript: transcript,
    };

    onValidate(ticketData);
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';

    // Enum fields (dropdown)
    if (field.name === 'category') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
        >
          <option value="">Select...</option>
          {Object.values(config.categories).map(cat => (
            <option key={cat} value={cat}>{t(cat)}</option>
          ))}
        </select>
      );
    }

    if (field.name === 'priority') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
        >
          <option value="">Select...</option>
          {Object.values(Priority).map(priority => (
            <option key={priority} value={priority}>{t(priority)}</option>
          ))}
        </select>
      );
    }

    if (field.name === 'status') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
        >
          <option value="">Select...</option>
          {Object.values(Status).map(status => (
            <option key={status} value={status}>{t(status)}</option>
          ))}
        </select>
      );
    }

    // Text area for longer fields
    if (['symptoms', 'description', 'impact', 'actions_tried', 'steps_to_reproduce', 'context', 'expected_behavior', 'ideas_needs', 'desired_resolution'].includes(field.name)) {
      return (
        <textarea
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          rows={3}
          className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
          placeholder={field.required ? `${t(field.name)} *` : t(field.name)}
        />
      );
    }

    // Regular text input
    return (
      <input
        type="text"
        value={value}
        onChange={(e) => handleFieldChange(field.name, e.target.value)}
        className="w-full border border-light-gray rounded-audiogami px-4 py-2 font-body focus:ring-2 focus:ring-rockman-blue focus:border-rockman-blue"
        placeholder={field.required ? `${t(field.name)} *` : t(field.name)}
      />
    );
  };

  const requiredFields = config.fields.filter(f => f.required && !f.auto);
  const optionalFields = config.fields.filter(f => !f.required && !f.auto);
  const autoFields = config.fields.filter(f => f.auto);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 text-rockman-blue hover:text-joust-blue flex items-center gap-2 font-body transition-colors"
        >
          ← Back
        </button>

        {/* Header */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{config.icon}</div>
            <div>
              <h2 className="text-2xl font-heading font-bold text-charcoal">
                {t('validateInformation')}
              </h2>
              <p className="font-body text-slate">{config.name[language]}</p>
            </div>
          </div>

          {/* Completion Message */}
          <div className={`mt-4 p-4 rounded-audiogami ${isFormComplete() ? 'bg-white border-2 border-rockman-blue' : 'bg-white border-2 border-chunky-bee'}`}>
            <p className={`font-body font-semibold ${isFormComplete() ? 'text-rockman-blue' : 'text-charcoal'}`}>
              {isFormComplete() ? t('allFieldsComplete') : t('pleaseComplete')}
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-off-white border border-light-gray rounded-audiogami shadow-sm p-6 mb-6">
          {/* Required Fields */}
          {requiredFields.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-heading font-semibold text-charcoal mb-4">
                {t('requiredFields')}
              </h3>
              <div className="space-y-4">
                {requiredFields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-body font-medium text-slate mb-2">
                      {t(field.name)} <span className="text-primary">*</span>
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optional Fields */}
          {optionalFields.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-heading font-semibold text-charcoal mb-4">
                {t('optionalFields')}
              </h3>
              <div className="space-y-4">
                {optionalFields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-body font-medium text-slate mb-2">
                      {t(field.name)}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Auto Fields (Category, Priority, Status) */}
          {autoFields.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-heading font-semibold text-charcoal mb-4">
                Auto-detected
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {autoFields.map(field => (
                  <div key={field.name}>
                    <label className="block text-sm font-body font-medium text-slate mb-2">
                      {t(field.name)}
                    </label>
                    {renderField(field)}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-charcoal mb-4">
              {t('tags')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {Object.values(Tags).map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-4 py-2 rounded-audiogami font-body font-medium transition-colors ${
                    tags.includes(tag)
                      ? 'bg-rockman-blue text-white'
                      : 'bg-white border border-light-gray text-slate hover:border-rockman-blue'
                  }`}
                >
                  {t(tag)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-end">
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-audiogami font-body font-semibold bg-white border border-light-gray text-slate hover:border-rockman-blue transition-colors"
          >
            {t('completeWithVoice')}
          </button>
          <button
            onClick={handleValidateClick}
            disabled={!isFormComplete()}
            className={`px-8 py-3 rounded-audiogami font-body font-semibold text-white transition-colors shadow-sm ${
              isFormComplete()
                ? 'bg-primary hover:bg-chunky-bee'
                : 'bg-silver cursor-not-allowed'
            }`}
          >
            {t('validate')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Validate;
