# İngilizce 1500

En sık kullanılan 1500 İngilizce kelimeyi, CEFR seviyesine göre (A1 → C2) öğreten bir
mobil uygulama (Expo / React Native, hem iOS/Android hem web'de çalışır). 500 kelimelik
kardeş projenin ("ingilizce500") genişletilmiş, daha esnek sürümüdür.

## 500 kelimelik sürümden farkları

1. **Seviye grubu seçimi:** Ana sayfada **A (Başlangıç: A1-A2)**, **B (Orta: B1-B2)**,
   **C (İleri: C1-C2)** butonları var. Hangi grup seçiliyse quiz o gruptaki kelimelerden
   geliyor; her grubun kendi ilerlemesi ayrıca gösteriliyor.
2. **Kelime sırası seçimi:** "Kolaydan Zora" (id sırasıyla, en sık kullanılandan başlar)
   veya "Rastgele" (seçili grup içinden rastgele kelime getirir) arasında seçim yapılabilir.
3. **Birden fazla anlam:** Bir kelimenin birincil anlamının dışında başka yaygın anlamları
   varsa (ör. "book" = "kitap" ama aynı zamanda "rezervasyon yapmak"), doğru cevaptan sonra
   "Diğer anlamları" kutusunda bunlar da gösterilir.
4. **Süre:** 1500 kelime ÷ günde 10 kelime ≈ 150 gün — yaklaşık **5 aylık** bir hedef.

## Nasıl çalışır

1. Ana sayfada seviye grubunu ve kelime sırasını seçersin.
2. Seçilen gruptan bir kelimenin 4 şıklı Türkçe karşılığı sorulur.
3. Doğru cevapta tebrik mesajı, (varsa) kelimenin diğer anlamları ve 3 örnek İngilizce
   cümle gösterilir. Yanlış cevapta doğru karşılık + aynı bilgiler gösterilir.
4. Her ekranın sonunda "Bir sonraki kelimeye geçelim mi?" diye sorulur.
5. Ana sayfa günlük hedefi (10 kelime/gün), toplam ilerlemeyi, seçili gruptaki ilerlemeyi,
   günlük seriyi (streak) ve tahmini bitiş süresini gösterir.
6. **Aralıklı tekrar (spaced repetition):** Öğrenilen her kelime Leitner-box tarzı bir
   sisteme girer (1 → 3 → 7 → 14 → 30 gün aralıklarla). Doğru tekrar edildikçe kutu büyür
   ve kelime daha seyrek karşına çıkar; yanlış cevaplanırsa kutu sıfırlanır, ertesi gün
   tekrar sorulur. Tekrar soruları, seçili gruptaki yeni kelimelerden önce gelir.
7. **Sesli telaffuz:** Kelimenin ve örnek cümlelerin yanındaki 🔊 butonuyla, `expo-speech`
   ile Amerikan İngilizcesi (`en-US`) aksanıyla sesli dinlenebilir.

## Çalıştırma

```bash
cd ingilizce1500
npm install
npm run web    # tarayıcıda dene
npm run ios    # veya
npm run android
```

İlerleme (öğrenilen kelimeler, seçili grup/sıra tercihleri, tekrar takvimi) cihazda
`AsyncStorage` ile saklanır (sunucu / hesap gerekmez).

## Proje yapısı

```
src/data/words.json     1500 kelimelik veri seti (id, word, pos, level, turkish, meanings[], examples[3])
src/data/types.ts       Tip tanımları, A/B/C seviye grubu eşlemesi
src/state/progress.ts   İlerleme takibi, seviye grubu + sıra modu, günlük hedef, SRS, şık üretimi
src/screens/            HomeScreen, QuizScreen, FeedbackScreen
src/components/         ProgressBar, LevelBadge, LevelGroupSelector, OrderModeSelector, SpeakerButton
App.tsx                 Ekranlar arası basit durum makinesi
```

## Uygulamayı geliştirmek için öneriler

500 kelimelik sürümle ortak öneriler geçerli (dinleme modu, tersten soru, cümle
tamamlama, günlük bildirim, rozetler, istatistik ekranı, çoklu cihaz senkronizasyonu,
flashcard modu). Ayrıca bu sürüme özel:

1. **Seviye tespit testi:** Girişte kısa bir testle kullanıcı hangi grupta (A/B/C)
   başlaması gerektiği otomatik önerilebilir.
2. **Karma mod:** Şu an bir seferde tek grup çalışılıyor; istenirse "tüm gruplardan
   karışık" bir dördüncü seçenek eklenebilir.
3. **Anlam bazlı ek soru türü:** Birden fazla anlamı olan kelimeler için "bu cümlede
   hangi anlamda kullanılmış?" tarzı ek bir soru tipi eklenebilir.

## Veri seti hakkında not

`src/data/words.json` içindeki 1500 kelime, en yaygın kullanılan İngilizce kelimelere
dayanan bir frekans listesinden seçilmiş; CEFR seviyeleri, Türkçe karşılıklar ve varsa
ek anlamlar dil bilgisine dayanarak atanmıştır. Gerçek bir üretim uygulamasında bu
listenin bir dil uzmanı tarafından gözden geçirilmesi önerilir.
