import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import { useCaseConfig } from '../data/useCases';
import { Status, Priority, Tags } from '../data/enums';

const Validate = () => {
  const { useCaseId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { language, t } = useLanguage();

  const config = useCaseConfig[useCaseId];
  const initialData = location.state?.detectedFields || {};
  const transcript = location.state?.transcript || '';

  const [formData, setFormData] = useState(initialData);
  const [tags, setTags] = useState(initialData.tags || []);

  useEffect(() => {
    setFormData(initialData);
    setTags(initialData.tags || []);
  }, [initialData]);

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

  const handleValidate = () => {
    const ticketData = {
      ...formData,
      tags,
      use_case: useCaseId,
      status: formData.status || Status.NEW,
      language,
      raw_transcript: transcript,
    };

    navigate(`/confirmation/${useCaseId}`, {
      state: { ticketData },
    });
  };

  const renderField = (field) => {
    const value = formData[field.name] || '';

    // Enum fields (dropdown)
    if (field.name === 'category') {
      return (
        <select
          value={value}
          onChange={(e) => handleFieldChange(field.name, e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
          className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
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
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        placeholder={field.required ? `${t(field.name)} *` : t(field.name)}
      />
    );
  };

  const requiredFields = config.fields.filter(f => f.required && !f.auto);
  const optionalFields = config.fields.filter(f => !f.required && !f.auto);
  const autoFields = config.fields.filter(f => f.auto);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-indigo-600 hover:text-indigo-800 flex items-center gap-2"
      >
        ← Back
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="text-5xl">{config.icon}</div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {t('validateInformation')}
            </h2>
            <p className="text-gray-600">{config.name[language]}</p>
          </div>
        </div>

        {/* Completion Message */}
        <div className={`mt-4 p-4 rounded-lg ${isFormComplete() ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
          <p className={`font-semibold ${isFormComplete() ? 'text-green-800' : 'text-yellow-800'}`}>
            {isFormComplete() ? t('allFieldsComplete') : t('pleaseComplete')}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        {/* Required Fields */}
        {requiredFields.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('requiredFields')}
            </h3>
            <div className="space-y-4">
              {requiredFields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t(field.name)} <span className="text-red-500">*</span>
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {t('optionalFields')}
            </h3>
            <div className="space-y-4">
              {optionalFields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Auto-detected
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {autoFields.map(field => (
                <div key={field.name}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {t('tags')}
          </h3>
          <div className="flex flex-wrap gap-2">
            {Object.values(Tags).map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  tags.includes(tag)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
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
          onClick={() => navigate(-1)}
          className="px-6 py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          {t('completeWithVoice')}
        </button>
        <button
          onClick={handleValidate}
          disabled={!isFormComplete()}
          className={`px-8 py-3 rounded-lg font-semibold text-white transition-colors ${
            isFormComplete()
              ? 'bg-green-600 hover:bg-green-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {t('validate')}
        </button>
      </div>
    </div>
  );
};

export default Validate;
