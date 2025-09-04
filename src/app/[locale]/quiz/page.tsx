'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, ArrowRight, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Riddle = {
  id: string;
  question_text: string;
  question_answer: string;
  location: string;
  tags: string[];
  established_at: string | null;
  near_spots: string[] | null;
  short_def: string | null;
  image: string | null;
};

export default function QuizPage() {
  const pathname = usePathname();
  const locale = useMemo(() => (pathname?.split('/')[1] || 'tr'), [pathname]);
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>([]);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRandomRiddles();
  }, []);

  const fetchRandomRiddles = async () => {
    try {
      const { data, error } = await supabase
        .from('riddles')
        .select('*');

      if (error) throw error;

      // Shuffle and get 10 random riddles
      const shuffled = (data || []).sort(() => 0.5 - Math.random());
      const quizRiddles = shuffled.slice(0, Math.min(10, shuffled.length));
      
      setRiddles(quizRiddles);
      setUserAnswers(new Array(quizRiddles.length).fill(''));
    } catch (error) {
      console.error('Error fetching riddles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = () => {
    const currentAnswer = userAnswers[currentIndex];
    const correctAnswer = riddles[currentIndex].question_answer.toLowerCase();
    
    if (currentAnswer.toLowerCase().trim() === correctAnswer.trim()) {
      setScore(prev => prev + 1);
    }
    
    setShowAnswer(true);
  };

  const nextQuestion = () => {
    if (currentIndex < riddles.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowAnswer(false);
    } else {
      setIsCompleted(true);
    }
  };

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const updateAnswer = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const restartQuiz = () => {
    setCurrentIndex(0);
    setUserAnswers(new Array(riddles.length).fill(''));
    setShowAnswer(false);
    setScore(0);
    setIsCompleted(false);
    fetchRandomRiddles();
  };

  const isCorrect = () => {
    const currentAnswer = userAnswers[currentIndex];
    const correctAnswer = riddles[currentIndex].question_answer.toLowerCase();
    return currentAnswer.toLowerCase().trim() === correctAnswer.trim();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{locale === 'tr' ? 'Quiz hazırlanıyor...' : 'Preparing quiz...'}</p>
        </div>
      </div>
    );
  }

  if (riddles.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 text-lg mb-4">
            {locale === 'tr' ? 'Henüz bilmece bulunmuyor.' : 'No riddles available yet.'}
          </p>
          <Link 
            href={`/${locale}`}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {locale === 'tr' ? 'Ana Sayfaya Dön' : 'Back to Home'}
          </Link>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    const percentage = Math.round((score / riddles.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <Link href={`/${locale}`} className="text-2xl font-bold text-gray-900">
                Bilmece Bulmaca
              </Link>
              <div className="flex items-center space-x-2">
                <Link 
                  href="/tr" 
                  className={`px-3 py-1 rounded-md text-sm font-medium ${locale === 'tr' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  TR
                </Link>
                <Link 
                  href="/en" 
                  className={`px-3 py-1 rounded-md text-sm font-medium ${locale === 'en' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  EN
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-6">
              {percentage >= 80 ? (
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              ) : percentage >= 60 ? (
                <CheckCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
              ) : (
                <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              )}
              
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {locale === 'tr' ? 'Quiz Tamamlandı!' : 'Quiz Completed!'}
              </h2>
              
              <div className="text-6xl font-bold text-indigo-600 mb-2">
                {score}/{riddles.length}
              </div>
              
              <p className="text-xl text-gray-600 mb-6">
                {locale === 'tr' ? `%${percentage} başarı oranı` : `${percentage}% success rate`}
              </p>
              
              <p className="text-gray-600 mb-8">
                {percentage >= 80 
                  ? locale === 'tr' ? 'Mükemmel! Türkiye hakkında çok şey biliyorsunuz.' : 'Excellent! You know a lot about Turkey.'
                  : percentage >= 60
                  ? locale === 'tr' ? 'İyi! Biraz daha pratik yapabilirsiniz.' : 'Good! You could practice a bit more.'
                  : locale === 'tr' ? 'Daha fazla bilmece çözerek gelişebilirsiniz.' : 'You can improve by solving more riddles.'
                }
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={restartQuiz}
                className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                {locale === 'tr' ? 'Tekrar Dene' : 'Try Again'}
              </button>
              
              <Link
                href={`/${locale}/riddles`}
                className="flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                {locale === 'tr' ? 'Tüm Bilmeceleri Gör' : 'View All Riddles'}
              </Link>
              
              <Link
                href={`/${locale}`}
                className="flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                {locale === 'tr' ? 'Ana Sayfa' : 'Home'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentRiddle = riddles[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href={`/${locale}`} className="text-2xl font-bold text-gray-900">
              Bilmece Bulmaca
            </Link>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {currentIndex + 1} / {riddles.length}
              </div>
              <div className="flex items-center space-x-2">
                <Link 
                  href="/tr" 
                  className={`px-3 py-1 rounded-md text-sm font-medium ${locale === 'tr' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  TR
                </Link>
                <Link 
                  href="/en" 
                  className={`px-3 py-1 rounded-md text-sm font-medium ${locale === 'en' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:text-indigo-600'}`}
                >
                  EN
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / riddles.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Image */}
          {currentRiddle.image && (
            <div className="mb-6">
              <Image
                src={currentRiddle.image}
                alt={currentRiddle.location}
                width={800}
                height={256}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Question */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {locale === 'tr' ? 'Soru' : 'Question'} {currentIndex + 1}
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              {currentRiddle.question_text}
            </p>
          </div>

          {/* Answer Input */}
          {!showAnswer && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {locale === 'tr' ? 'Cevabınız:' : 'Your Answer:'}
              </label>
              <input
                type="text"
                value={userAnswers[currentIndex]}
                onChange={(e) => updateAnswer(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder={locale === 'tr' ? 'Cevabınızı yazın...' : 'Type your answer...'}
              />
            </div>
          )}

          {/* Answer Display */}
          {showAnswer && (
            <div className={`mb-6 p-4 rounded-lg ${isCorrect() ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex items-center mb-2">
                {isCorrect() ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mr-2" />
                )}
                <span className={`font-medium ${isCorrect() ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect() 
                    ? locale === 'tr' ? 'Doğru!' : 'Correct!'
                    : locale === 'tr' ? 'Yanlış!' : 'Incorrect!'
                  }
                </span>
              </div>
              <p className={`${isCorrect() ? 'text-green-700' : 'text-red-700'}`}>
                <strong>{locale === 'tr' ? 'Doğru Cevap:' : 'Correct Answer:'}</strong> {currentRiddle.question_answer}
              </p>
              {currentRiddle.short_def && (
                <p className={`text-sm mt-2 ${isCorrect() ? 'text-green-600' : 'text-red-600'}`}>
                  {currentRiddle.short_def}
                </p>
              )}
            </div>
          )}

          {/* Location and Tags */}
          <div className="mb-6 text-sm text-gray-600">
            <p><strong>{locale === 'tr' ? 'Lokasyon:' : 'Location:'}</strong> {currentRiddle.location}</p>
            {currentRiddle.established_at && (
              <p><strong>{locale === 'tr' ? 'Kurulma Tarihi:' : 'Established:'}</strong> {currentRiddle.established_at}</p>
            )}
            <div className="flex flex-wrap gap-2 mt-2">
              {currentRiddle.tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={previousQuestion}
              disabled={currentIndex === 0}
              className="flex items-center px-4 py-2 text-gray-600 disabled:text-gray-400 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              {locale === 'tr' ? 'Önceki' : 'Previous'}
            </button>

            <div className="flex space-x-3">
              {!showAnswer ? (
                <button
                  onClick={handleAnswerSubmit}
                  disabled={!userAnswers[currentIndex].trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {locale === 'tr' ? 'Cevapla' : 'Submit'}
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {currentIndex === riddles.length - 1 
                    ? locale === 'tr' ? 'Sonuçları Gör' : 'View Results'
                    : locale === 'tr' ? 'Sonraki' : 'Next'
                  }
                </button>
              )}
            </div>

            <button
              onClick={nextQuestion}
              disabled={currentIndex === riddles.length - 1}
              className="flex items-center px-4 py-2 text-gray-600 disabled:text-gray-400 hover:text-gray-800 transition-colors"
            >
              {locale === 'tr' ? 'Sonraki' : 'Next'}
              <ArrowRight className="h-5 w-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
