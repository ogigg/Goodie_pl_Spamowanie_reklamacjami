# Goodie_pl_Spamowanie_reklamacjami
Skrypt w JS napisany żeby wysyłać requesty o zaliczenie zaległego cashbacku do polskiego opieszałego serwisu zajmującego się zwrotem za zakupy.

Bez modyfikacji skrypt sprawdza ostatnie 20 stron (każda strona ma 20 transakcji) i wysyła request z reklamacją dla kazdego zamówienia które ma powyżej 60 dni. Aby zmodyfikować od której strony zaczyna można zmienić pętlę for w funkcji main()
