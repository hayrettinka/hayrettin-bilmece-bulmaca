import Link from 'next/link';
import { MapPin, Compass, Star } from 'lucide-react';
import { AuthHeader } from '@/components/AuthHeader';

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Compass className="h-8 w-8 text-indigo-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Bilmece Bulmaca</h1>
            </div>
            <nav className="flex items-center space-x-8">
              <Link href={`/${locale}`} className="text-gray-700 hover:text-indigo-600 font-medium">
                {locale === 'tr' ? 'Ana Sayfa' : 'Home'}
              </Link>
              <Link href={`/${locale}/riddles`} className="text-gray-700 hover:text-indigo-600 font-medium">
                {locale === 'tr' ? 'Bilmeceler' : 'Riddles'}
              </Link>
              <div className="flex items-center space-x-4">
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
                <AuthHeader locale={locale} />
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            {locale === 'tr' ? 'Türkiye\'yi Bilmecelerle Keşfet' : 'Discover Turkey Through Riddles'}
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {locale === 'tr' 
              ? 'Türkiye\'nin tarihi yerleri, kültürel simgeleri ve ikonik konumları hakkındaki bilginizi test edin'
              : 'Test your knowledge about Turkey\'s historical places, cultural landmarks, and iconic locations'
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href={`/${locale}/quiz`}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
            >
              {locale === 'tr' ? 'Quiz Başlat' : 'Start Quiz'}
            </Link>
            <Link 
              href={`/${locale}/riddles`}
              className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold border-2 border-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {locale === 'tr' ? 'Bilmeceleri Keşfet' : 'Explore Riddles'}
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <MapPin className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'tr' ? 'Tarihi Mekanlar' : 'Historical Places'}
              </h3>
              <p className="text-gray-600">
                {locale === 'tr' 
                  ? 'Türkiye\'nin zengin tarihinden bilmeceler keşfedin'
                  : 'Discover riddles from Turkey\'s rich history'
                }
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <Star className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'tr' ? 'Kültürel Yerler' : 'Cultural Landmarks'}
              </h3>
              <p className="text-gray-600">
                {locale === 'tr' 
                  ? 'Kültürel mirasımızın simgelerini öğrenin'
                  : 'Learn about the symbols of our cultural heritage'
                }
              </p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <Compass className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">
                {locale === 'tr' ? 'Interaktif Quiz' : 'Interactive Quiz'}
              </h3>
              <p className="text-gray-600">
                {locale === 'tr' 
                  ? 'Özel quizler oluşturun ve bilginizi test edin'
                  : 'Create custom quizzes and test your knowledge'
                }
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Bilmece Bulmaca</h3>
            <p className="text-gray-400 mb-4">
              {locale === 'tr' 
                ? 'Türkiye\'nin zengin tarihini ve kültürünü interaktif bilmecelerle keşfedin.'
                : 'Discover Turkey\'s rich history and culture through interactive riddles.'
              }
            </p>
            <p className="text-gray-500 text-sm">
              © 2025 Bilmece Bulmaca. {locale === 'tr' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
