# İngilizce 500

En sık kullanılan 500 İngilizce kelimeyi, CEFR seviyesine göre (A1 → C2) kolaydan zora
sıralı şekilde öğreten bir mobil uygulama (Expo / React Native, hem iOS/Android hem
web'de çalışır).

## Nasıl çalışır

1. Uygulama kolaydan zora sırayla rastgele değil, sıralı olarak kelime getirir (500
   kelime A1'den C2'ye önceden sınıflandırılmıştır).
2. Kelimenin 4 şıklı Türkçe karşılığı sorulur.
3. Doğru cevapta tebrik mesajı + kelimeyle ilgili 3 örnek İngilizce cümle gösterilir.
4. Yanlış cevapta doğru karşılık ve yine 3 örnek cümle gösterilir; kelime daha sonra
   tekrar (review) olarak karşınıza çıkar.
5. Her ekranın sonunda "Bir sonraki kelimeye geçelim mi?" diye sorulur.
6. Ana sayfa günlük hedefi (10 kelime/gün), toplam ilerlemeyi, günlük seriyi (streak)
   ve tahmini bitiş süresini gösterir. 500 kelime ÷ 10 kelime/gün ≈ 50 gün — yaklaşık
   2 aylık hedefe, ara tekrar günleriyle birlikte rahatça ulaşılır.

## Çalıştırma

```bash
cd ingilizce500
npm install
npm run web    # tarayıcıda dene
npm run ios    # veya
npm run android
```

İlerleme cihazda `AsyncStorage` ile saklanır (sunucu / hesap gerekmez).

## Proje yapısı

```
src/data/words.json     500 kelimelik veri seti (id, word, pos, level, turkish, examples[3])
src/data/types.ts       Tip tanımları
src/state/progress.ts   İlerleme takibi, günlük hedef, sıradaki kelime seçimi, şık üretimi
src/screens/            HomeScreen, QuizScreen, FeedbackScreen
src/components/         ProgressBar, LevelBadge
App.tsx                 Ekranlar arası basit durum makinesi
```

## Uygulamayı geliştirmek için öneriler

Bunlar şu an uygulanmadı; sıradaki adımlar olarak düşünülebilir:

1. **Aralıklı tekrar (Spaced Repetition / SM-2 benzeri algoritma):** Öğrenilen kelimeler
   1 gün, 3 gün, 7 gün, 14 gün, 30 gün sonra otomatik tekrar kartı olarak geri gelsin.
   Şu an sadece "yanlış cevaplananlar" basitçe tekrar kuyruğuna giriyor; gerçek bir SRS
   unutma eğrisine göre çalışırsa kalıcılık çok artar.
2. **Sesli telaffuz:** `expo-speech` ile her kelime ve örnek cümle için TTS (metinden
   sese) çalma butonu — Amerikan aksanına odaklandığınız için `en-US` sesi seçilebilir.
3. **Dinleme modu:** Kelimeyi/cümleyi dinleyip yazma (dictation) alıştırması.
4. **Tersten soru:** Bazen Türkçe → İngilizce yönünde de sorulsun (üretici hafıza).
5. **Cümle tamamlama sorusu:** Örnek cümledeki kelime boş bırakılıp 4 şıktan seçtirilsin.
6. **Günlük bildirim / hatırlatma:** `expo-notifications` ile "bugünkü 10 kelimeni henüz
   tamamlamadın" bildirimi.
7. **Rozetler / başarımlar:** 50, 100, 250, 500 kelime; 7/14/30 günlük seri gibi
   kilometre taşlarında rozet.
8. **Zorluk bazlı adaptif tekrar:** Sık yanlış yapılan kelimeler daha sık tekrar
   kuyruğuna alınsın (basit bir "leitner box" sistemi).
9. **Seviye testi / atla:** Uygulamaya ilk girişte kısa bir seviye tespit testiyle
   kullanıcı zaten bildiği seviyeyi (ör. A1-A2) atlayıp doğrudan B1'den başlayabilsin.
10. **İstatistik ekranı:** Haftalık/aylık öğrenme grafiği, en çok hata yapılan kelimeler
    listesi.
11. **Çoklu cihaz senkronizasyonu:** Şu an ilerleme sadece cihazda saklanıyor; bulut
    senkronizasyonu (ör. basit bir backend + hesap) eklenerek cihaz değişse de ilerleme
    korunabilir.
12. **Kelime kartı / flashcard modu:** Quiz dışında serbestçe kaydırarak tüm 500
    kelimeye göz atma ekranı.

## Veri seti hakkında not

`src/data/words.json` içindeki 500 kelime, en yaygın kullanılan İngilizce kelimelere
dayanan bir frekans listesinden seçilmiş; CEFR seviyeleri ve Türkçe karşılıklar dil
bilgisine dayanarak atanmıştır. Gerçek bir üretim uygulamasında bu listenin bir dil
uzmanı tarafından gözden geçirilmesi önerilir.
