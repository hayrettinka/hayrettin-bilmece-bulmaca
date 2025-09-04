'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { MapPin, Calendar, Eye, EyeOff, Shuffle } from 'lucide-react';
import Link from 'next/link';

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
  created_at: string;
};

export default function RiddlesPage({ params: { locale } }: { params: { locale: string } }) {
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [filteredRiddles, setFilteredRiddles] = useState<Riddle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [visibleAnswers, setVisibleAnswers] = useState<Set<string>>(new Set());
  const [allLocations, setAllLocations] = useState<string[]>([]);
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchRiddles();
  }, []);

  const fetchRiddles = async () => {
    try {
      const { data, error } = await supabase
        .from('riddles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setRiddles(data || []);
      setFilteredRiddles(data || []);
      
      // Extract unique locations and tags
      const locations = [...new Set(data?.map(r => r.location) || [])];
      const tags = [...new Set(data?.flatMap(r => r.tags) || [])];
      
      setAllLocations(locations);
      setAllTags(tags);
    } catch (error) {
      console.error('Error fetching riddles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = riddles;

    if (selectedLocation) {
      filtered = filtered.filter(riddle => riddle.location === selectedLocation);
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(riddle => 
        selectedTags.some(tag => riddle.tags.includes(tag))
      );
    }

    setFilteredRiddles(filtered);
  }, [riddles, selectedLocation, selectedTags]);

  const toggleAnswer = (riddleId: string) => {
    const newVisible = new Set(visibleAnswers);
    if (newVisible.has(riddleId)) {
      newVisible.delete(riddleId);
    } else {
      newVisible.add(riddleId);
    }
    setVisibleAnswers(newVisible);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const generateRandomQuiz = () => {
    const shuffled = [...filteredRiddles].sort(() => 0.5 - Math.random());
    const quiz = shuffled.slice(0, Math.min(10, shuffled.length));
    
    // Export as JSON
    const quizData = {
      title: locale === 'tr' ? 'Rastgele Quiz' : 'Random Quiz',
      riddles: quiz.map(r => ({
        question: r.question_text,
        answer: r.question_answer,
        location: r.location,
        tags: r.tags
      }))
    };
    
    const blob = new Blob([JSON.stringify(quizData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quiz-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">{locale === 'tr' ? 'Bilmeceler yükleniyor...' : 'Loading riddles...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link href={`/${locale}`} className="flex items-center">
              <MapPin className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Bilmece Bulmaca</h1>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {locale === 'tr' ? 'Tarihi Mekan Bilmeceleri' : 'Historical Place Riddles'}
          </h2>
          
          {/* Filters */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Location Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'tr' ? 'Lokasyona Göre Filtrele' : 'Filter by Location'}
                </label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">
                    {locale === 'tr' ? 'Tüm Lokasyonlar' : 'All Locations'}
                  </option>
                  {allLocations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </select>
              </div>

              {/* Tags Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === 'tr' ? 'Etiketlere Göre Filtrele' : 'Filter by Tags'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedTags.includes(tag)
                          ? 'bg-indigo-100 text-indigo-700 border-indigo-300'
                          : 'bg-gray-100 text-gray-700 border-gray-300'
                      } border`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mt-6">
              <button
                onClick={generateRandomQuiz}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                {locale === 'tr' ? 'Rastgele Quiz Oluştur' : 'Generate Random Quiz'}
              </button>
              <span className="text-sm text-gray-600 flex items-center">
                {filteredRiddles.length} {locale === 'tr' ? 'bilmece bulundu' : 'riddles found'}
              </span>
            </div>
          </div>

          {/* Riddles Grid */}
          <div className="grid gap-6">
            {filteredRiddles.map((riddle) => (
              <div key={riddle.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  {riddle.image && (
                    <div className="lg:w-1/3">
                      <img
                        src={riddle.image}
                        alt={riddle.location}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="mb-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {locale === 'tr' ? 'Soru' : 'Question'}
                      </h3>
                      <p className="text-gray-700 text-lg">{riddle.question_text}</p>
                    </div>

                    <div className="mb-4">
                      <button
                        onClick={() => toggleAnswer(riddle.id)}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                      >
                        {visibleAnswers.has(riddle.id) ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            {locale === 'tr' ? 'Cevabı Gizle' : 'Hide Answer'}
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            {locale === 'tr' ? 'Cevabı Göster' : 'Show Answer'}
                          </>
                        )}
                      </button>
                      
                      {visibleAnswers.has(riddle.id) && (
                        <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-md">
                          <p className="text-green-800 font-medium">{riddle.question_answer}</p>
                          {riddle.short_def && (
                            <p className="text-green-700 text-sm mt-2">{riddle.short_def}</p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {riddle.location}
                      </div>
                      
                      {riddle.established_at && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {riddle.established_at}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {riddle.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {riddle.near_spots && riddle.near_spots.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600">
                          <strong>{locale === 'tr' ? 'Yakın Yerler:' : 'Nearby Spots:'}</strong>{' '}
                          {riddle.near_spots.join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredRiddles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {locale === 'tr' ? 'Henüz bilmece bulunmuyor.' : 'No riddles found yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
