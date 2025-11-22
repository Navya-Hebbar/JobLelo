import React from 'react';

const QuestionCard = ({ question, selectedOption, onSelectOption }) => {
  // Define badge colors based on difficulty
  const badgeColor = {
    Easy: "bg-green-100 text-green-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Hard: "bg-red-100 text-red-800"
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded ${badgeColor[question.difficulty]}`}>
          {question.difficulty}
        </span>
        <span className="text-gray-500 text-sm">Select one answer</span>
      </div>
      
      <h3 className="text-xl font-bold text-gray-800 mb-6">{question.question}</h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(option)}
            className={`w-full text-left p-4 rounded border transition-all ${
              selectedOption === option
                ? 'border-blue-600 bg-blue-50 text-blue-700 ring-1 ring-blue-600'
                : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;