import React, { useState } from 'react';
import { CCIParameter } from '../app/types';

interface DataCollectionFormProps {
  parameters: CCIParameter[];
  onComplete: (updatedParameters: CCIParameter[]) => void;
  onCancel: () => void;
}

const DataCollectionForm: React.FC<DataCollectionFormProps> = ({
  parameters,
  onComplete,
  onCancel
}) => {
  const [formData, setFormData] = useState<CCIParameter[]>(parameters);

  const handleChange = (paramId: number, field: keyof CCIParameter, value: any) => {
    setFormData(prevData =>
      prevData.map(param =>
        param.id === paramId ? { ...param, [field]: value } : param
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete(formData);
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6 bg-black border-b">
        <h2 className="text-xl font-semibold text-white">Detailed Data Collection</h2>
      </div>
      <form onSubmit={handleSubmit} className="p-6">
        <div className="space-y-8">
          {formData.map((param) => (
            <div key={param.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-black mb-2">{param.measureId}: {param.title}</h3>
              <p className="text-gray-600 mb-4">{param.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Numerator {param.numeratorHelp && <span className="text-xs text-gray-500">({param.numeratorHelp})</span>}
                  </label>
                  <input
                    type="number"
                    value={param.numerator}
                    onChange={(e) => handleChange(param.id, 'numerator', Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Denominator {param.denominatorHelp && <span className="text-xs text-gray-500">({param.denominatorHelp})</span>}
                  </label>
                  <input
                    type="number"
                    value={param.denominator}
                    onChange={(e) => handleChange(param.id, 'denominator', Number(e.target.value))}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                    min="1"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Implementation Evidence</label>
                <textarea
                  value={param.implementationEvidence || ''}
                  onChange={(e) => handleChange(param.id, 'implementationEvidence', e.target.value)}
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  placeholder="Provide evidence of implementation..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auditor Comments</label>
                <textarea
                  value={param.auditorComments || ''}
                  onChange={(e) => handleChange(param.id, 'auditorComments', e.target.value)}
                  rows={2}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  placeholder="Auditor comments..."
                />
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="bg-gray-200 hover:bg-gray-300 text-black py-2 px-6 rounded-md transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-black hover:bg-gray-800 text-white py-2 px-6 rounded-md transition duration-200"
          >
            Save and Calculate
          </button>
        </div>
      </form>
    </div>
  );
};

export default DataCollectionForm; 