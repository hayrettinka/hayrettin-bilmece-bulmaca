- Bir web-sitesi yapacağım , basit bir landing page : 
	- Bu site şu şekilde çalışacak , içerisinde tarihi mekanlar , şehirlerin simge konumları , en bilinen yerler , kültürel spot'lar hakkında bilmeceler bulunacak.
	- supabase kullanacağım.
	- Database içinde her bilmece bir varlık olacak ve : uuid , question_text , created_at , question_answer , location , tags , established_at , near_spots , short_def ve image içerecek. -Eğer başka önerin varsa ekleyebiliriz-
	- Kayıt olma gibi bir mekanik olmayacağıdan save/star/bookmark olmayacak.
	- Kullanıcılar bulmacaları : tags, location attribute'leri ile filtreleyip random quiz oluşturabilecekler ve bunu import edebilecekler. Ama kayıt opsiyonu yok siteye.
	- Türkçe/İngilizce opsiyonları olacak : Eğer kullanıcı tarayıcı dili olarak Türkçe kullanıyorsa site otomatik Türkçe aksi takdirde diğer her dil için İngilizce başlayacak.
	- Siteye girdikten sonra manuel şekilde dil değiştirilebilir.
	- next.js , supabase ve vercel kullanılacak.

