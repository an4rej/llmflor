/**
 * Букеты: данные с витрин Florista (снимок).
 * - https://florista.tomsk.ru/bouquets
 * - https://florista.tomsk.ru/bouquets_of_roses
 * - https://florista.tomsk.ru/Bouquets_of_flowers
 * - https://florista.tomsk.ru/mixed-bouquet
 */
(function () {
  const FLORISTA_BOUQUET_PRODUCTS = {
        "bq-240": { name: "9 роз в Крафте", price: 2690, priceStr: "2,690₽ (было 2,890₽)", desc: "Отличный букет из 9 эквадорских роз упакованных в крафтовую бумагу по недорогой цене…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/9roses-228x228.jpg", productUrl: "https://florista.tomsk.ru/9roses_kraft", img: 2, badge: "Акция", badgeClass: "text-bg-warning" },
        "bq-86": { name: "Букет Аврора", price: 3490, priceStr: "3,490₽", desc: "Отличный, стильный букет из 11 белых роз с зеленью, по недорогой цене, оформленный мешковиной и краф…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/Avroraa-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_aurora", img: 2 },
        "bq-116": { name: "Букет Анастасия", price: 4500, priceStr: "4,500₽", desc: "Яркий, красочный весенний букет, состоящий из роз и хризантем с зеленью, согреет сердца ваших близки…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/anastasia-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_anastasia", img: 2 },
        "bq-79": { name: "Букет Ариэль", price: 3490, priceStr: "3,490₽", desc: "Красивый букет, состоящих из 11 нежно-розовых роз .Смотрится очень стильно и современно. Количество …", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/Ariall-228x228.jpg", productUrl: "https://florista.tomsk.ru/ariel_bouquet", img: 2 },
        "bq-244": { name: "Букет Ариэль Мини ", price: 2650, priceStr: "2,650₽", desc: "Нежный небольшой букет из 7 роз , зелени и упаковки. …", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/9C994B24-62DB-4FBB-8A61-5341B7B393C6-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets?product_id=244", img: 2 },
        "bq-78": { name: "Букет Беллона", price: 4390, priceStr: "4,390₽", desc: "Этот букет вобрал в себя все краски лета, необычный яркий букет из 15 роз упакованных крафт-бумагу и…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/Bellonaa-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_bellona", img: 2 },
        "bq-325": { name: "Букет Вальс", price: 2500, priceStr: "2,500₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/1 sent/IMG_3487-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets?product_id=325", img: 2 },
        "bq-129": { name: "Букет Весенний", price: 3790, priceStr: "3,790₽", desc: "Красочный весенний букет состоящий из 3х роз, 2х альстромерий, и 5 ирисов, с зеленью, оформленных уп…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/vesenny-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_vesenniy", img: 2 },
        "bq-254": { name: "Букет Весна ", price: 5450, priceStr: "5,450₽", desc: "Солнечный букет состоящий из 15 Тюльпанов и мимозы…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/tulips/C6F7DC00-FF76-4F92-9069-9A3FD82EEC22-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets?product_id=254", img: 2 },
        "bq-328": { name: "Букет Взрыв ", price: 3890, priceStr: "3,890₽", desc: "Яркий букет из роз в стильной упаковке …", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/IMG_5482-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets?product_id=328", img: 2 },
        "bq-127": { name: "Букет Вуаля", price: 3000, priceStr: "3,000₽", desc: "В основе этого букета лежит орхидея(Цимбидиум) издревле этот цветок считался божественным, это самое…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/vualya-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_vualya", img: 2 },
        "bq-119": { name: "Букет Гармония", price: 2990, priceStr: "2,990₽", desc: "Хороший букет по приемлемой цене, состоящий из 7 роз и 4 кустовых хризантем, перевязанный атласной л…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/first-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet-harmony", img: 2 },
        "bq-85": { name: "Букет Грация", price: 1490, priceStr: "1,490₽", desc: "Небольшой и оригинальный букет состоящий из 3 роз и зелени. Отличный букетик, который можно подарить…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/bellona-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_of_grace", img: 2 },
        "bq-84": { name: "Букет Дуэт", price: 6500, priceStr: "6,500₽", desc: "Букет состоящий из 25 красных и белых роз. Букет прекрасно подчеркнет ваши чувства ненавязчиво говор…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/roses/rozafreedom-i-polarstar-500x500-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_duet", img: 2 },
        "bq-162": { name: "Букет из  5 роз", price: 2390, priceStr: "2,390₽", desc: "Цвет роз можно менять…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/1 sent/IMG_6840-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_5roses", img: 2 },
        "bq-181": { name: "Букет из 101 розы", price: 25500, priceStr: "25,500₽", desc: "Смый шикарный подарок, которым можно удивить свою любимую. Девушки всегда ценили щедрость в мужчинах…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/101rosesfl-228x228.jpg", productUrl: "https://florista.tomsk.ru/101rose", img: 2 },
        "bq-298": { name: "Букет из 11 красных роз ", price: 3300, priceStr: "3,300₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/F112586B-15A1-4B84-9B0B-B479E319ADEC-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets?product_id=298", img: 2 },
        "bq-303": { name: "Букет из 15 белых роз ", price: 3950, priceStr: "3,950₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/108F9961-55E4-4FCA-B552-19D28358F873-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets?product_id=303", img: 2 },
        "bq-265": { name: "Букет из 15 белых Тюльпанов", price: 4000, priceStr: "4,000₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/tulips/870C9BE8-539C-48CD-8A80-7B3933D65C03-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets?product_id=265", img: 2 },
        "bq-271": { name: "Букет из 19 роз Кения", price: 4490, priceStr: "4,490₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/BBDDB097-AF51-42AA-87F8-E188B868C773-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_of_roses?product_id=271", img: 2 },
        "bq-321": { name: "Букет из 25 белых роз ", price: 6250, priceStr: "6,250₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/IMG_9920-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_of_roses?product_id=321", img: 2 },
        "bq-255": { name: "Букет из 25 роз ", price: 6750, priceStr: "6,750₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/roses/5A46FF72-C459-49CA-8653-A15F5A5D37BA-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_of_roses?product_id=255", img: 2 },
        "bq-301": { name: "Букет из 5 белых роз ", price: 1850, priceStr: "1,850₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/267A1FB0-DE71-44EB-8106-C2197F7FC46B-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_of_roses?product_id=301", img: 2 },
        "bq-257": { name: "Букет из 5 красных роз ", price: 2450, priceStr: "2,450₽", desc: "Букет из 5 красных роз с зеленью и упаковкой…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/B9EACE71-88CD-48B1-8DBB-A6BF6155F27B-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_of_roses?product_id=257", img: 2 },
        "bq-327": { name: "Букет из 5 роз и зелени ", price: 2450, priceStr: "2,450₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/1 sent/IMG_3470-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_of_roses?product_id=327", img: 2 },
        "bq-286": { name: "Букет из 51 розы Кения ", price: 15300, priceStr: "15,300₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/roses/0ED1CBAB-83A1-4FAE-81B6-F4D2F7B1802D-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquets_of_roses?product_id=286", img: 2 },
        "bq-88": { name: "Букет Искренность", price: 5350, priceStr: "5,350₽", desc: "Этот букет из 9 кустовых хризантем и зелени будет продолжительное время радовать глаз, ведь все знаю…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/iskrennost-228x228.jpeg", productUrl: "https://florista.tomsk.ru/bouquet_sincerity", img: 2 },
        "bq-89": { name: "Букет Краски", price: 2390, priceStr: "2,390₽ (было 2,690₽)", desc: "Этот красочный букет будет состоять из 5 кустовых хризантем трех видов. Количество и цвет хризантем …", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/kraskiorigin-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_paints", img: 2, badge: "Акция", badgeClass: "text-bg-warning" },
        "bq-258": { name: "Букет Март", price: 3290, priceStr: "3,290₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/102B9331-4383-4B2E-A01F-41E2816BD17D-228x228.jpeg", productUrl: "https://florista.tomsk.ru/Bouquets_of_flowers?product_id=258", img: 2 },
        "bq-288": { name: "Букет Облако S", price: 4500, priceStr: "4,500₽", desc: "Букет из 15 хризантем…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/434D01B5-ADEA-49C0-9BFD-860BE4A7B370-228x228.jpeg", productUrl: "https://florista.tomsk.ru/Bouquets_of_flowers?product_id=288", img: 2 },
        "bq-289": { name: "Букет Облако Xs", price: 2500, priceStr: "2,500₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/6428BF50-C8CA-4843-9722-987CFD5C6879-228x228.jpeg", productUrl: "https://florista.tomsk.ru/Bouquets_of_flowers?product_id=289", img: 2 },
        "bq-287": { name: "Букет Облако М", price: 6490, priceStr: "6,490₽", desc: "Буки из 21 хризантемы …", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/FC644A18-D963-481D-A590-0A7ABAF6C5ED-228x228.jpeg", productUrl: "https://florista.tomsk.ru/Bouquets_of_flowers?product_id=287", img: 2 },
        "bq-91": { name: "Букет Пробуждение", price: 3990, priceStr: "3,990₽", desc: "Классический пышный букет из кустовых хризантем с зеленью. Количество и цвет хризантем можно менять…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/probugdenie-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_awakening", img: 2 },
        "bq-92": { name: "Букет Ромашка", price: 3200, priceStr: "3,200₽", desc: "Букет из 7 кустовых хризантем, напоминающий нежные ромашки, просто создан для нежных и мечтательных …", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/romaska9-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_daisy", img: 2 },
        "bq-285": { name: "Букет ромашка макси ", price: 5500, priceStr: "5,500₽", desc: "15 штук …", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/chrisantemums/065A483D-A184-40DB-B6E8-F22D9F306462-228x228.jpeg", productUrl: "https://florista.tomsk.ru/Bouquets_of_flowers?product_id=285", img: 2 },
        "bq-159": { name: "Букет Ромашка мини", price: 1990, priceStr: "1,990₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/1_september/dbac96d5-577c-483c-b7b8-b54bed4f4068-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquets_romashka", img: 2 },
        "bq-279": { name: "Букет №3", price: 3200, priceStr: "3,200₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/1 sent/A9D4EF8A-5BED-4CC2-BF67-792E6D1723EB-228x228.jpeg", productUrl: "https://florista.tomsk.ru/Bouquets_of_flowers?product_id=279", img: 2 },
        "bq-151": { name: "Букет из Альстромерий", price: 2490, priceStr: "2,490₽ (было 2,900₽)", desc: "Изысканный букет из альстромерий микс упаковынный в стильную крафт бумагу…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/otherflowers/alstroeria-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquets_of_Alstroemerias", img: 2, badge: "Акция", badgeClass: "text-bg-warning" },
        "bq-331": { name: "Букет из гипсофилы S", price: 2490, priceStr: "2,490₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/IMG_5493-228x228.jpeg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=331", img: 2 },
        "bq-330": { name: "Букет из гипсофилы Xs", price: 2090, priceStr: "2,090₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/IMG_5490-228x228.jpeg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=330", img: 2 },
        "bq-253": { name: "Букет из Мимозы ", price: 2990, priceStr: "2,990₽", desc: "Яркий букет из мимозы покорит любое сердце !…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/tulips/10B82A35-BF15-43B1-92FA-7EDE9B71DEEF-228x228.jpeg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=253", img: 2 },
        "bq-313": { name: "Букет Ирис S", price: 3290, priceStr: "3,290₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/IMG_7464-228x228.jpeg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=313", img: 2 },
        "bq-121": { name: "Букет Капелла", price: 3990, priceStr: "3,990₽", desc: "Данный букет включает в себя 7 алых роз и 4 альстромерий с зеленью оформленных в упаковочную бумагу(…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/kapella-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_kapella1", img: 2 },
        "bq-318": { name: "Букет комплимент 3", price: 2890, priceStr: "2,890₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/IMG_8501-228x228.jpeg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=318", img: 2 },
        "bq-231": { name: "Букет Комплимент М", price: 3490, priceStr: "3,490₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/e244491b5cacc61a5464b5f10d7f73f9-228x228.jpg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=231", img: 2 },
        "bq-155": { name: "Букет Лира", price: 3490, priceStr: "3,490₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/1_september/1475522280_70154019-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquets_lira", img: 2 },
        "bq-326": { name: "Букет Лучик ", price: 2690, priceStr: "2,690₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/1 sent/IMG_3472-228x228.jpeg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=326", img: 2 },
        "bq-125": { name: "Букет Наслаждение", price: 3590, priceStr: "3,590₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/naslagdenie-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_naslagdenie", img: 2 },
        "bq-165": { name: "Букет Нежность", price: 5750, priceStr: "5,750₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/4CX0y2D_Dj0-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquets_negnost", img: 2 },
        "bq-120": { name: "Букет Рай", price: 7690, priceStr: "7,690₽", desc: "В этом букете, собранном на европейский манер, прекрасно сочетаются 7 кустовых роз и 11 альстромерий…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/Ray-228x228.jpg", productUrl: "https://florista.tomsk.ru/bouquet_paradise", img: 2 },
        "bq-232": { name: "Букет Свежесть", price: 3490, priceStr: "3,490₽", desc: "…", imageUrl: "https://florista.tomsk.ru/image/cache/catalog/bouquets/mixed/bcb78792efe718cdf844de86273400a9-228x228.jpg", productUrl: "https://florista.tomsk.ru/mixed-bouquet?product_id=232", img: 2 }
      };

  const idLists = {
  "all": [
    "bq-240",
    "bq-86",
    "bq-116",
    "bq-79",
    "bq-244",
    "bq-78",
    "bq-325",
    "bq-129",
    "bq-254",
    "bq-328",
    "bq-127",
    "bq-119",
    "bq-85",
    "bq-84",
    "bq-162",
    "bq-181",
    "bq-298",
    "bq-303",
    "bq-265"
  ],
  "roses": [
    "bq-240",
    "bq-86",
    "bq-79",
    "bq-244",
    "bq-78",
    "bq-328",
    "bq-85",
    "bq-84",
    "bq-162",
    "bq-181",
    "bq-298",
    "bq-303",
    "bq-271",
    "bq-321",
    "bq-255",
    "bq-301",
    "bq-257",
    "bq-327",
    "bq-286"
  ],
  "chrys": [
    "bq-325",
    "bq-88",
    "bq-89",
    "bq-258",
    "bq-288",
    "bq-289",
    "bq-287",
    "bq-91",
    "bq-92",
    "bq-285",
    "bq-159",
    "bq-279"
  ],
  "mixed": [
    "bq-116",
    "bq-129",
    "bq-254",
    "bq-127",
    "bq-119",
    "bq-151",
    "bq-331",
    "bq-330",
    "bq-253",
    "bq-313",
    "bq-121",
    "bq-318",
    "bq-231",
    "bq-155",
    "bq-326",
    "bq-125",
    "bq-165",
    "bq-120",
    "bq-232"
  ]
};

  window.FLORISTA_BOUQUET_PRODUCTS = FLORISTA_BOUQUET_PRODUCTS;
  window.FLORISTA_BOUQUET_ID_LISTS = idLists;
  window.FLORISTA_BOUQUETS = Object.fromEntries(
    Object.keys(FLORISTA_BOUQUET_PRODUCTS).map((k) => {
      const p = FLORISTA_BOUQUET_PRODUCTS[k];
      return [k, { name: p.name, price: p.price, img: p.img, imageUrl: p.imageUrl }];
    }),
  );
})();

