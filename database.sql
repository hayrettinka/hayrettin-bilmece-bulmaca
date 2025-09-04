-- Create the riddles table
CREATE TABLE IF NOT EXISTS public.riddles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_text TEXT NOT NULL,
    question_answer TEXT NOT NULL,
    location TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    established_at TEXT,
    near_spots TEXT[],
    short_def TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Add RLS (Row Level Security) policies
ALTER TABLE public.riddles ENABLE ROW LEVEL SECURITY;

-- Allow public read access to riddles
CREATE POLICY "Allow public read access" ON public.riddles
    FOR SELECT USING (true);

-- Only authenticated users can insert riddles
CREATE POLICY "Authenticated users can insert riddles" ON public.riddles
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Only creators can update their riddles
CREATE POLICY "Users can update own riddles" ON public.riddles
    FOR UPDATE USING (auth.uid() = created_by);

-- Only creators can delete their riddles
CREATE POLICY "Users can delete own riddles" ON public.riddles
    FOR DELETE USING (auth.uid() = created_by);

-- Create a function to automatically set created_at if null
CREATE OR REPLACE FUNCTION set_created_at()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.created_at IS NULL THEN
        NEW.created_at = timezone('utc'::text, now());
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically set created_at
CREATE TRIGGER set_riddle_created_at
    BEFORE INSERT ON public.riddles
    FOR EACH ROW
    EXECUTE FUNCTION set_created_at();

-- Sample data
INSERT INTO public.riddles (question_text, question_answer, location, tags, established_at, near_spots, short_def, image) VALUES 
(
    'Bu yapı, İstanbul''un en ünlü simgelerinden biridir. 6. yüzyılda inşa edilmiş, hem kilise hem de cami olarak kullanılmıştır. Büyük kubbesi ve minareleriyle tanınır. Nedir?',
    'Ayasofya',
    'İstanbul',
    ARRAY['Bizans', 'Osmanlı', 'Müze', 'Mimari'],
    '537',
    ARRAY['Sultanahmet Camii', 'Topkapı Sarayı', 'Yerebatan Sarnıcı'],
    'Ayasofya, İstanbul''da bulunan ve hem Bizans hem de Osmanlı mimarisinin özelliklerini taşıyan tarihi bir yapıdır.',
    null
),
(
    'Kapadokya''da bulunan bu yer altı şehri, 8 kata kadar derinliğe inmektedir. Hıristiyanların saklandığı bu yer neresidir?',
    'Derinkuyu Yeraltı Şehri',
    'Nevşehir',
    ARRAY['Kapadokya', 'Yeraltı', 'Hıristiyanlık', 'Arkeoloji'],
    '7. yüzyıl',
    ARRAY['Kaymaklı Yeraltı Şehri', 'Göreme Açık Hava Müzesi', 'Uçhisar Kalesi'],
    'Derinkuyu, dünyanın en derin yeraltı şehirlerinden biridir ve binlerce kişiyi barındırabilecek kapasitededir.',
    null
),
(
    'Antalya''da bulunan bu antik tiyatro, Roma döneminden kalma olup 15.000 kişi kapasitelidir. Akdeniz manzaralı bu yapı nedir?',
    'Aspendos Tiyatrosu',
    'Antalya',
    ARRAY['Roma', 'Antik', 'Tiyatro', 'Akdeniz'],
    '2. yüzyıl',
    ARRAY['Perge Antik Kenti', 'Side Antik Kenti', 'Manavgat Şelalesi'],
    'Aspendos Tiyatrosu, Roma döneminin en iyi korunmuş tiyatrolarından biridir.',
    null
),
(
    'Bu kale, Ankara''nın simgesi olup, Galat, Roma, Bizans ve Osmanlı dönemlerinden izler taşır. Şehrin merkezindeki bu yapı nedir?',
    'Ankara Kalesi',
    'Ankara',
    ARRAY['Galat', 'Roma', 'Bizans', 'Osmanlı', 'Kale'],
    'M.Ö. 3. yüzyıl',
    ARRAY['Anıtkabir', 'Etnografya Müzesi', 'Roma Hamamı'],
    'Ankara Kalesi, başkentin en eski yerleşim alanlarından biri olup, şehrin panoramik manzarasını sunar.',
    null
),
(
    'İzmir''de bulunan bu antik kent, Yunan filozofu Homer''in doğduğu yer olarak bilinir. Agora''sı ile ünlü bu yer neresidir?',
    'Smyrna (İzmir) Agorası',
    'İzmir',
    ARRAY['Antik', 'Yunan', 'Homer', 'Agora'],
    'M.Ö. 4. yüzyıl',
    ARRAY['Kadifekale', 'Kemeralti Çarşısı', 'Saat Kulesi'],
    'Smyrna Agorası, antik çağın en önemli ticaret merkezlerinden biriydi.',
    null
);

INSERT INTO public.riddles (question_text, question_answer, location, tags, established_at, near_spots, short_def, image) VALUES 
(
    'This structure is one of Istanbul''s most famous landmarks. Built in the 6th century, it has served as both a church and a mosque. Known for its great dome and minarets. What is it?',
    'Hagia Sophia',
    'Istanbul',
    ARRAY['Byzantine', 'Ottoman', 'Museum', 'Architecture'],
    '537',
    ARRAY['Blue Mosque', 'Topkapi Palace', 'Basilica Cistern'],
    'Hagia Sophia is a historic building in Istanbul that carries features of both Byzantine and Ottoman architecture.',
    null
),
(
    'This underground city in Cappadocia goes down to 8 levels deep. Where did Christians hide in this place?',
    'Derinkuyu Underground City',
    'Nevşehir',
    ARRAY['Cappadocia', 'Underground', 'Christianity', 'Archaeology'],
    '7th century',
    ARRAY['Kaymaklı Underground City', 'Göreme Open Air Museum', 'Uçhisar Castle'],
    'Derinkuyu is one of the world''s deepest underground cities and could accommodate thousands of people.',
    null
),
(
    'This ancient theater in Antalya is from the Roman period and has a capacity of 15,000 people. What is this structure with Mediterranean views?',
    'Aspendos Theater',
    'Antalya',
    ARRAY['Roman', 'Ancient', 'Theater', 'Mediterranean'],
    '2nd century',
    ARRAY['Perge Ancient City', 'Side Ancient City', 'Manavgat Waterfall'],
    'Aspendos Theater is one of the best-preserved Roman theaters.',
    null
);
