import { ChevronLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface QuizProps {
  onComplete: (text: string) => void;
  onCancel: () => void;
  darkMode?: boolean;
}

export function Quiz({ onComplete, onCancel, darkMode = false }: QuizProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({
    year: '',
    diploma: '',
    about: '',
    hobbies: '',
    electives: '',
    study_methods: [],
    study_methods_other: '', // For "Others" text input
    study_group_size: '',
    strengths: '',
    weaknesses: '',
    study_mode: '',
    study_time: ''
  });

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleCheckboxChange = (questionId: string, option: string, checked: boolean) => {
    const currentValues = (answers[questionId] as string[]) || [];
    if (checked) {
      handleAnswer(questionId, [...currentValues, option]);
    } else {
      handleAnswer(questionId, currentValues.filter(v => v !== option));
      // Clear "Others" text if unchecking Others
      if (option === 'Others') {
        handleAnswer('study_methods_other', '');
      }
    }
  };

  const pages = [
    {
      progress: 0,
      questions: [
        { 
          id: 'diploma', 
          label: 'What diploma are you from?', 
          type: 'text',
          placeholder: 'e.g., Diploma in Information Technology'
        },
        { 
          id: 'year', 
          label: 'What year are you currently?', 
          type: 'radio',
          options: ['Year 1', 'Year 2', 'Year 3']
        },
        { 
          id: 'about', 
          label: 'Tell me about yourself...', 
          type: 'textarea',
          placeholder: 'Share something about yourself...'
        }
      ]
    },
    {
      progress: 25,
      questions: [
        { 
          id: 'hobbies', 
          label: 'What are your hobbies?', 
          type: 'text',
          placeholder: 'e.g., Reading, Gaming, Sports'
        },
        { 
          id: 'electives', 
          label: 'What electives are you taking?', 
          type: 'text',
          placeholder: 'e.g., Mobile App Development'
        },
        { 
          id: 'study_methods', 
          label: 'What study methods do you use?', 
          type: 'checkbox',
          options: ['Doing Quizzes', 'Writing Notes', 'Group Discussions', 'Others']
        }
      ]
    },
    {
      progress: 50,
      questions: [
        { 
          id: 'study_group_size', 
          label: 'How many people do you usually study with?', 
          type: 'radio',
          options: ['I don\'t study with anyone', '2-3 people', '4-5 people', '5+ people']
        },
        { 
          id: 'strengths', 
          label: 'What are some of your strengths?', 
          type: 'textarea',
          placeholder: 'e.g., Good at explaining concepts'
        },
        { 
          id: 'weaknesses', 
          label: 'What are some of your weaknesses?', 
          type: 'textarea',
          placeholder: 'e.g., Procrastination'
        }
      ]
    },
    {
      progress: 75,
      questions: [
        { 
          id: 'study_mode', 
          label: 'Do you prefer studying online or face-to-face?', 
          type: 'radio',
          options: ['Online', 'Face-to-face']
        },
        { 
          id: 'study_time', 
          label: 'What time do you usually study at?', 
          type: 'textarea',
          placeholder: 'e.g., Evenings after 7pm'
        }
      ]
    }
  ];

  const currentPageData = pages[currentPage];
  const isLastPage = currentPage === pages.length - 1;

  // Check if all questions on current page are answered
  const allQuestionsAnswered = currentPageData.questions.every(q => {
    const answer = answers[q.id];
    if (Array.isArray(answer)) {
      // For checkboxes with "Others", also check if the text field is filled
      if (q.id === 'study_methods' && answer.includes('Others')) {
        return answer.length > 0 && answers.study_methods_other && answers.study_methods_other.trim() !== '';
      }
      return answer.length > 0;
    }
    return answer && answer.toString().trim() !== '';
  });

  const handleNext = () => {
    if (isLastPage) {
      // Show loading screen
      setIsGenerating(true);
      
      // Simulate generation delay
      setTimeout(() => {
        // Get study methods text
        const studyMethodsArray = answers.study_methods as string[];
        let studyMethodsText = studyMethodsArray.filter(m => m !== 'Others').join(', ');
        if (studyMethodsArray.includes('Others') && answers.study_methods_other) {
          studyMethodsText += (studyMethodsText ? ', ' : '') + answers.study_methods_other;
        }

        // Format the final text with inline format (header: content on same line)
        const formattedText = `Bio: ${answers.about || 'N/A'}

Hobbies: ${answers.hobbies || 'N/A'}

Diploma: ${answers.diploma || 'N/A'}

Electives: ${answers.electives || 'N/A'}

Study Methods: ${studyMethodsText || 'N/A'}

Strengths: ${answers.strengths || 'N/A'}

Weaknesses: ${answers.weaknesses || 'N/A'}`;
        
        onComplete(formattedText);
      }, 2000);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleBack = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Get progress bar color based on percentage
  const getProgressColor = (progress: number) => {
    return 'from-indigo-500 to-indigo-600';
  };

  // Loading Screen
  if (isGenerating) {
    return (
      <div className={`h-full flex flex-col items-center justify-center px-6 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="text-center space-y-6">
          <p className={`text-sm font-black ${darkMode ? 'text-white' : 'text-slate-900'}`}>Finishing up your Profile Page!</p>
          <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
          <p className="text-xs font-bold text-slate-400">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`h-full flex flex-col ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
      <div className={`backdrop-blur-xl border-b-2 py-6 px-6 flex items-center justify-between shrink-0 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <button onClick={onCancel} className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all hover:bg-slate-50 active:scale-95 shadow-sm group ${darkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700' : 'bg-white border-slate-200 hover:bg-slate-50'}`}>
          <ChevronLeft size={20} className={`${darkMode ? 'text-white group-hover:text-indigo-400' : 'text-slate-900 group-hover:text-indigo-600'} transition-colors`} />
        </button>
        <h1 className={`text-[10px] font-black uppercase tracking-[.4em] ${darkMode ? 'text-white' : 'text-slate-900'}`}>Stubby Profile Quiz</h1>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-6 pb-6 min-h-0">
        {/* Questions for current page */}
        <div className="space-y-6 mb-8">
          {currentPageData.questions.map((question) => (
            <div key={question.id} className="space-y-3">
              <label className={`text-sm font-bold block ${darkMode ? 'text-white' : 'text-slate-900'}`}>{question.label}</label>
              
              {question.type === 'text' && (
                <input
                  type="text"
                  value={answers[question.id] as string || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  className={`w-full p-4 border-2 rounded-xl focus:outline-none focus:border-indigo-600 transition-colors text-sm placeholder:text-slate-400 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                />
              )}

              {question.type === 'textarea' && (
                <textarea
                  value={answers[question.id] as string || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  className={`w-full h-32 p-4 border-2 rounded-xl resize-none focus:outline-none focus:border-indigo-600 transition-colors text-sm placeholder:text-slate-400 ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-slate-200 text-slate-700'}`}
                />
              )}

              {question.type === 'radio' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <label key={option} className={`flex items-center gap-3 p-3 border-2 rounded-xl hover:border-indigo-200 cursor-pointer transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                      <input
                        type="radio"
                        name={question.id}
                        value={option}
                        checked={answers[question.id] === option}
                        onChange={(e) => handleAnswer(question.id, e.target.value)}
                        className="w-4 h-4 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className={`text-sm ${darkMode ? 'text-white' : 'text-slate-700'}`}>{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {question.type === 'checkbox' && question.options && (
                <div className="space-y-2">
                  {question.options.map((option) => (
                    <div key={option}>
                      <label className={`flex items-center gap-3 p-3 border-2 rounded-xl hover:border-indigo-200 cursor-pointer transition-colors ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                        <input
                          type="checkbox"
                          checked={(answers[question.id] as string[] || []).includes(option)}
                          onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className={`text-sm ${darkMode ? 'text-white' : 'text-slate-700'}`}>{option}</span>
                      </label>
                      {/* Show text input when "Others" is checked */}
                      {option === 'Others' && (answers[question.id] as string[] || []).includes('Others') && (
                        <input
                          type="text"
                          value={answers.study_methods_other as string || ''}
                          onChange={(e) => handleAnswer('study_methods_other', e.target.value)}
                          placeholder="Please specify..."
                          className={`w-full mt-2 p-4 border-2 border-indigo-300 rounded-xl focus:outline-none focus:border-indigo-600 transition-colors text-sm placeholder:text-slate-400 bg-indigo-50/30 ${darkMode ? 'bg-slate-800/50 text-white' : 'text-slate-700'}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <p className={`text-xs font-bold mb-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{currentPageData.progress}% Completed</p>
          <div className={`w-full h-3 rounded-full overflow-hidden shadow-inner ${darkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
            <div 
              className={`h-full bg-gradient-to-r ${getProgressColor(currentPageData.progress)} transition-all duration-500 shadow-lg`}
              style={{ 
                width: `${currentPageData.progress}%`,
              }}
            />
          </div>
        </div>
      </div>

      <div className={`p-6 border-t-2 shrink-0 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex gap-3">
          {currentPage > 0 && (
            <button
              onClick={handleBack}
              className={`flex-1 py-4 border-2 rounded-xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-95 text-xs ${darkMode ? 'bg-slate-800 border-indigo-500/50 text-indigo-400 hover:bg-slate-700' : 'bg-white border-slate-700 text-slate-700 hover:bg-slate-50'}`}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            className={`py-4 bg-slate-800 text-white rounded-xl font-black uppercase tracking-widest hover:bg-slate-900 transition-all active:scale-95 text-xs ${currentPage === 0 ? 'w-full' : 'flex-1'}`}
          >
            {isLastPage ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
}