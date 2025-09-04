'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/AuthHeader';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Plus, 
  Upload, 
  Save, 
  X, 
  MapPin, 
  Tag, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Trash2,
  Edit
} from 'lucide-react';

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

export default function AdminPage({ params: { locale } }: { params: { locale: string } }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [riddles, setRiddles] = useState<Riddle[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingRiddle, setEditingRiddle] = useState<Riddle | null>(null);
  const [jsonInput, setJsonInput] = useState('');
  const [showJsonUpload, setShowJsonUpload] = useState(false);
  const [formData, setFormData] = useState({
    question_text: '',
    question_answer: '',
    location: '',
    tags: '',
    established_at: '',
    near_spots: '',
    short_def: '',
    image: ''
  });
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/${locale}/auth/login`);
    }
  }, [user, loading, locale, router]);

  useEffect(() => {
    if (user) {
      fetchRiddles();
    }
  }, [user]);

  const fetchRiddles = async () => {
    try {
      const { data, error } = await supabase
        .from('riddles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRiddles(data || []);
    } catch (error) {
      console.error('Error fetching riddles:', error);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveLoading(true);

    if (!user) {
      alert(locale === 'tr' ? 'Kullanıcı bilgisi bulunamadı!' : 'User information not found!');
      setSaveLoading(false);
      return;
    }

    try {
      const riddleData = {
        question_text: formData.question_text,
        question_answer: formData.question_answer,
        location: formData.location,
        tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
        established_at: formData.established_at || null,
        near_spots: formData.near_spots ? formData.near_spots.split(',').map(s => s.trim()).filter(s => s) : null,
        short_def: formData.short_def || null,
        image: formData.image || null,
        created_by: user.id
      };

      let result;
      if (editingRiddle) {
        result = await supabase
          .from('riddles')
          .update(riddleData)
          .eq('id', editingRiddle.id);
      } else {
        result = await supabase
          .from('riddles')
          .insert([riddleData]);
      }

      if (result.error) throw result.error;

      // Reset form
      setFormData({
        question_text: '',
        question_answer: '',
        location: '',
        tags: '',
        established_at: '',
        near_spots: '',
        short_def: '',
        image: ''
      });
      setShowForm(false);
      setEditingRiddle(null);
      fetchRiddles();
    } catch (error) {
      console.error('Error saving riddle:', error);
      alert(locale === 'tr' ? 'Bilmece kaydedilemedi!' : 'Failed to save riddle!');
    } finally {
      setSaveLoading(false);
    }
  };

  const handleJsonUpload = async () => {
    if (!user) {
      alert(locale === 'tr' ? 'Kullanıcı bilgisi bulunamadı!' : 'User information not found!');
      return;
    }

    try {
      const data = JSON.parse(jsonInput);
      const riddles = Array.isArray(data) ? data : [data];

      for (const riddle of riddles) {
        const riddleData = {
          question_text: riddle.question_text,
          question_answer: riddle.question_answer,
          location: riddle.location,
          tags: Array.isArray(riddle.tags) ? riddle.tags : [],
          established_at: riddle.established_at || null,
          near_spots: Array.isArray(riddle.near_spots) ? riddle.near_spots : null,
          short_def: riddle.short_def || null,
          image: riddle.image || null,
          created_at: riddle.created_at || new Date().toISOString(),
          created_by: user.id
        };

        const { error } = await supabase
          .from('riddles')
          .insert([riddleData]);

        if (error) throw error;
      }

      setJsonInput('');
      setShowJsonUpload(false);
      fetchRiddles();
      alert(locale === 'tr' ? 'JSON başarıyla yüklendi!' : 'JSON uploaded successfully!');
    } catch (error) {
      console.error('Error uploading JSON:', error);
      alert(locale === 'tr' ? 'JSON formatı hatalı!' : 'Invalid JSON format!');
    }
  };

  const handleEdit = (riddle: Riddle) => {
    setEditingRiddle(riddle);
    setFormData({
      question_text: riddle.question_text,
      question_answer: riddle.question_answer,
      location: riddle.location,
      tags: riddle.tags.join(', '),
      established_at: riddle.established_at || '',
      near_spots: riddle.near_spots ? riddle.near_spots.join(', ') : '',
      short_def: riddle.short_def || '',
      image: riddle.image || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(locale === 'tr' ? 'Bu bilmeceyi silmek istediğinizden emin misiniz?' : 'Are you sure you want to delete this riddle?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('riddles')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchRiddles();
    } catch (error) {
      console.error('Error deleting riddle:', error);
      alert(locale === 'tr' ? 'Bilmece silinemedi!' : 'Failed to delete riddle!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Link href={`/${locale}`} className="text-2xl font-bold text-gray-900 mr-8">
                Bilmece Bulmaca
              </Link>
              <h1 className="text-xl font-semibold text-gray-700">
                {locale === 'tr' ? 'Admin Panel' : 'Admin Panel'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">{user.email}</span>
              <Link 
                href={`/${locale}`}
                className="text-indigo-600 hover:text-indigo-700"
              >
                {locale === 'tr' ? 'Siteye Dön' : 'Back to Site'}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            {locale === 'tr' ? 'Yeni Bilmece Ekle' : 'Add New Riddle'}
          </button>
          
          <button
            onClick={() => setShowJsonUpload(true)}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            <Upload className="h-5 w-5 mr-2" />
            {locale === 'tr' ? 'JSON Yükle' : 'Upload JSON'}
          </button>
        </div>

        {/* Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {editingRiddle 
                      ? (locale === 'tr' ? 'Bilmeceyi Düzenle' : 'Edit Riddle')
                      : (locale === 'tr' ? 'Yeni Bilmece Ekle' : 'Add New Riddle')
                    }
                  </h2>
                  <button
                    onClick={() => {
                      setShowForm(false);
                      setEditingRiddle(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileText className="h-4 w-4 inline mr-1" />
                      {locale === 'tr' ? 'Bilmece Metni' : 'Riddle Text'} *
                    </label>
                    <textarea
                      required
                      value={formData.question_text}
                      onChange={(e) => setFormData({...formData, question_text: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                      placeholder={locale === 'tr' ? 'Bilmece sorusunu yazın...' : 'Write the riddle question...'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'tr' ? 'Doğru Cevap' : 'Correct Answer'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.question_answer}
                      onChange={(e) => setFormData({...formData, question_answer: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={locale === 'tr' ? 'Doğru cevabı yazın...' : 'Enter the correct answer...'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {locale === 'tr' ? 'Lokasyon' : 'Location'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={locale === 'tr' ? 'İstanbul, Ankara, vb.' : 'Istanbul, Ankara, etc.'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Tag className="h-4 w-4 inline mr-1" />
                      {locale === 'tr' ? 'Etiketler' : 'Tags'}
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={locale === 'tr' ? 'Osmanlı, Cami, Tarih (virgülle ayırın)' : 'Ottoman, Mosque, History (comma separated)'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Calendar className="h-4 w-4 inline mr-1" />
                      {locale === 'tr' ? 'Kurulma Tarihi' : 'Established Date'}
                    </label>
                    <input
                      type="text"
                      value={formData.established_at}
                      onChange={(e) => setFormData({...formData, established_at: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={locale === 'tr' ? '1453, 16. yüzyıl, vb.' : '1453, 16th century, etc.'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'tr' ? 'Yakın Yerler' : 'Near Spots'}
                    </label>
                    <input
                      type="text"
                      value={formData.near_spots}
                      onChange={(e) => setFormData({...formData, near_spots: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder={locale === 'tr' ? 'Sultanahmet, Topkapı (virgülle ayırın)' : 'Sultanahmet, Topkapi (comma separated)'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {locale === 'tr' ? 'Kısa Açıklama' : 'Short Description'}
                    </label>
                    <textarea
                      value={formData.short_def}
                      onChange={(e) => setFormData({...formData, short_def: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={2}
                      placeholder={locale === 'tr' ? 'Kısa açıklama...' : 'Short description...'}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <ImageIcon className="h-4 w-4 inline mr-1" />
                      {locale === 'tr' ? 'Resim URL' : 'Image URL'}
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setShowForm(false);
                        setEditingRiddle(null);
                      }}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      {locale === 'tr' ? 'İptal' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={saveLoading}
                      className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {saveLoading 
                        ? (locale === 'tr' ? 'Kaydediliyor...' : 'Saving...')
                        : (locale === 'tr' ? 'Kaydet' : 'Save')
                      }
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* JSON Upload Modal */}
        {showJsonUpload && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold">
                    {locale === 'tr' ? 'JSON Dosyası Yükle' : 'Upload JSON File'}
                  </h2>
                  <button
                    onClick={() => setShowJsonUpload(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {locale === 'tr' ? 'JSON Verisi' : 'JSON Data'}
                    </label>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="w-full h-64 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                      placeholder={`[
  {
    "question_text": "Bilmece metni...",
    "question_answer": "Cevap",
    "location": "İstanbul",
    "tags": ["tag1", "tag2"],
    "established_at": "1453",
    "near_spots": ["yer1", "yer2"],
    "short_def": "Açıklama",
    "image": "https://..."
  }
]`}
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowJsonUpload(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      {locale === 'tr' ? 'İptal' : 'Cancel'}
                    </button>
                    <button
                      onClick={handleJsonUpload}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {locale === 'tr' ? 'Yükle' : 'Upload'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Riddles List */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              {locale === 'tr' ? 'Mevcut Bilmeceler' : 'Existing Riddles'} ({riddles.length})
            </h3>
          </div>
          
          <div className="divide-y divide-gray-200">
            {riddles.map((riddle) => (
              <div key={riddle.id} className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="text-lg font-medium text-gray-900 mb-2">
                      {riddle.question_text}
                    </h4>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>{locale === 'tr' ? 'Cevap:' : 'Answer:'}</strong> {riddle.question_answer}
                    </p>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span>📍 {riddle.location}</span>
                      {riddle.established_at && <span>📅 {riddle.established_at}</span>}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {riddle.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(riddle)}
                      className="p-2 text-indigo-600 hover:text-indigo-800"
                      title={locale === 'tr' ? 'Düzenle' : 'Edit'}
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(riddle.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                      title={locale === 'tr' ? 'Sil' : 'Delete'}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {riddles.length === 0 && (
              <div className="p-12 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>{locale === 'tr' ? 'Henüz bilmece eklenmemiş.' : 'No riddles added yet.'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
