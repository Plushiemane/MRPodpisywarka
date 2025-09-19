// TO MOŻE BYĆ OUTDATED - sprawdź w razie czego
// https://sejmsenat2023.pkw.gov.pl/sejmsenat2023/pl/okregowe
export interface SejmOkręg {
  nr: number;
  powiaty: string[];
  miastaPrawaPow: string[];
}

export const okregiSejm: SejmOkręg[] = [
  {
    nr: 1,
    powiaty: [
      "bolesławiecki",
      "głogowski",
      "jaworski",
      "karkonoski",
      "kamiennogórski",
      "legnicki",
      "lubański",
      "lubiński",
      "lwówecki",
      "polkowicki",
      "zgorzelecki",
      "złotoryjski"
    ],
    miastaPrawaPow: ["Jelenia Góra", "Legnica"]
  },
  {
    nr: 2,
    powiaty: ["dzierżoniowski", "kłodzki", "świdnicki", "wałbrzyski", "ząbkowicki"],
    miastaPrawaPow: ["Wałbrzych"]
  },
  {
    nr: 3,
    powiaty: ["górowski", "milicki", "oleśnicki", "oławski", "strzeliński", "średzki", "trzebnicki", "wołowski", "wrocławski"],
    miastaPrawaPow: ["Wrocław"]
  },
  {
    nr: 4,
    powiaty: ["bydgoski", "inowrocławski", "mogileński", "nakielski", "sępoleński", "świecki", "tucholski", "żniński"],
    miastaPrawaPow: ["Bydgoszcz"]
  },
  {
    nr: 5,
    powiaty: ["aleksandrowski", "brodnicki", "chełmiński", "golubsko-dobrzyński", "grudziądzki", "lipnowski", "radziejowski", "rypiński", "toruński", "wąbrzeski", "włocławski"],
    miastaPrawaPow: ["Grudziądz", "Toruń", "Włocławek"]
  },
  {
    nr: 6,
    powiaty: ["janowski", "kraśnicki", "lubartowski", "lubelski", "łęczyński", "łukowski", "opolski", "puławski", "rycki", "świdnicki"],
    miastaPrawaPow: ["Lublin"]
  },
  {
    nr: 7,
    powiaty: ["bialski", "biłgorajski", "chełmski", "hrubieszowski", "krasnostawski", "parczewski", "radzyński", "tomaszowski", "włodawski", "zamojski"],
    miastaPrawaPow: ["Biała Podlaska", "Chełm", "Zamość"]
  },
  {
    nr: 8,
    powiaty: [],  // cały województwo lubuskie
    miastaPrawaPow: []  // brak specyfikacji miast na prawach powiatu poza tym co PKW podało
  },
  {
    nr: 9,
    powiaty: ["brzeziński", "łódzki wschodni"],
    miastaPrawaPow: ["Łódź"]
  },
  {
    nr: 10,
    powiaty: ["bełchatowski", "opoczyński", "piotrkowski", "radomszczański", "rawski", "skierniewicki", "tomaszowski"],
    miastaPrawaPow: ["Piotrków Trybunalski", "Skierniewice"]
  },
  {
    nr: 11,
    powiaty: ["kutnowski", "łaski", "łęczycki", "łowicki", "pabianicki", "pajęczański", "poddębicki", "sieradzki", "wieluński", "wieruszowski", "zduńskowolski", "zgierski"],
    miastaPrawaPow: []
  },
  {
    nr: 12,
    powiaty: ["chrzanowski", "myślenicki", "oświęcimski", "suski", "wadowicki"],
    miastaPrawaPow: []
  },
  {
    nr: 13,
    powiaty: ["krakowski", "miechowski", "olkuski"],
    miastaPrawaPow: ["Kraków"]
  },
  {
    nr: 14,
    powiaty: ["gorlicki", "limanowski", "nowosądecki", "nowotarski", "tatrzański"],
    miastaPrawaPow: ["Nowy Sącz"]
  },
  {
    nr: 15,
    powiaty: ["bocheński", "brzeski", "dąbrowski", "proszowicki", "tarnowski", "wielicki"],
    miastaPrawaPow: ["Tarnów"]
  },
  {
    nr: 16,
    powiaty: ["ciechanowski", "gostyniński", "mławski", "płocki", "płoński", "przasnyski", "sierpecki", "sochaczewski", "żyrardowski"],
    miastaPrawaPow: ["Płock"]
  },
  {
    nr: 17,
    powiaty: ["białobrzeski", "grójecki", "kozienicki", "lipski", "przysuski", "radomski", "szydłowiecki", "zwoleński"],
    miastaPrawaPow: ["Radom"]
  },
  {
    nr: 18,
    powiaty: ["garwoliński", "łosicki", "makowski", "miński", "ostrołęcki", "ostrowski", "pułtuski", "siedlecki", "sokołowski", "węgrowski", "wyszkowski"],
    miastaPrawaPow: ["Ostrołęka", "Siedlce"]
  },
  {
    nr: 19,
    powiaty: [],
    miastaPrawaPow: ["Warszawa", "zagranica", "statki"]
  },
  {
    nr: 20,
    powiaty: ["grodziski", "legionowski", "nowodworski", "otwocki", "piaseczyński", "pruszkowski", "warszawski zachodni", "wołomiński"],
    miastaPrawaPow: []
  },
  {
    nr: 21,
    powiaty: [],  // całe województwo opolskie
    miastaPrawaPow: ["Opole"]
  },
  {
    nr: 22,
    powiaty: ["bieszczadzki", "brzozowski", "jarosławski", "jasielski", "krośnieński", "leski", "lubaczowski", "przemyślski", "przeworski", "sanocki"],
    miastaPrawaPow: ["Krosno", "Przemyśl"]
  },
  {
    nr: 23,
    powiaty: ["dębicki", "kolbuszowski", "leżajski", "łańcucki", "mielecki", "niżański", "ropczycko-sędziszowski", "rzeszowski", "stalowowolski", "strzyżowski", "tarnobrzeski"],
    miastaPrawaPow: ["Rzeszów", "Tarnobrzeg"]
  },
  {
    nr: 24,
    powiaty: [],  // całe województwo podlaskie
    miastaPrawaPow: ["Białystok"]
  },
  {
    nr: 25,
    powiaty: ["gdański", "kwidzyński", "malborski", "nowodworski", "starogardzki", "sztumski", "tczewski"],
    miastaPrawaPow: ["Gdańsk", "Sopot"]
  },
  {
    nr: 26,
    powiaty: ["bytowski", "chojnicki", "człuchowski", "kartuski", "kościerski", "lęborski", "pucki", "słupski", "wejherowski"],
    miastaPrawaPow: ["Gdynia", "Słupsk"]
  },
  {
    nr: 27,
    powiaty: ["bielski", "cieszyński", "pszczyński", "żywiecki"],
    miastaPrawaPow: ["Bielsko-Biała"]
  },
  {
    nr: 28,
    powiaty: ["częstochowski", "kłobucki", "lubliniecki", "myszkowski"],
    miastaPrawaPow: ["Częstochowa"]
  },
  {
    nr: 29,
    powiaty: ["gliwicki", "tarnogórski"],
    miastaPrawaPow: ["Bytom", "Gliwice", "Zabrze"]
  },
  {
    nr: 30,
    powiaty: ["mikołowski", "raciborski", "rybnicki", "wodzisławski"],
    miastaPrawaPow: ["Jastrzębie-Zdrój", "Rybnik", "Żory"]
  },
  {
    nr: 31,
    powiaty: ["bieruńsko-lędziński"],
    miastaPrawaPow: ["Chorzów", "Katowice", "Mysłowice", "Piekary Śląskie", "Ruda Śląska", "Siemianowice Śląskie", "Świętochłowice", "Tychy"]
  },
  {
    nr: 32,
    powiaty: ["będziński", "zawierciański"],
    miastaPrawaPow: ["Dąbrowa Górnicza", "Jaworzno", "Sosnowiec"]
  },
  {
    nr: 33,
    powiaty: [],  // całe województwo świętokrzyskie
    miastaPrawaPow: ["Kielce"]
  },
  {
    nr: 34,
    powiaty: ["bartoszycki", "braniewski", "działdowski", "elbląski", "iławski", "lidzbarski", "nowomiejski", "ostródzki"],
    miastaPrawaPow: ["Elbląg"]
  },
  {
    nr: 35,
    powiaty: ["ełcki", "giżycki", "gołdapski", "kętrzyński", "mrągowski", "nidzicki", "olsztyński", "piski", "szczycieński", "węgorzewski"],
    miastaPrawaPow: ["Olsztyn"]
  },
  {
    nr: 36,
    powiaty: ["gostyński", "jarociński", "kaliski", "kępiński", "kościański", "krotoszyński", "leszczyński", "ostrowski", "ostrzeszowski", "pleszewski", "rawicki"],
    miastaPrawaPow: ["Kalisz", "Leszno"]
  },
  {
    nr: 37,
    powiaty: ["gnieźnieński", "kolski", "koniński", "słupecki", "średzki", "śremski", "turecki", "wrzesiński"],
    miastaPrawaPow: ["Konin"]
  },
  {
    nr: 38,
    powiaty: ["chodzieski", "czarnkowsko-trzcianecki", "grodziski", "międzychodzki", "nowotomyski", "obornicki", "pilski", "szamotulski", "wągrowiecki", "wolsztyński", "złotowski"],
    miastaPrawaPow: []
  },
  {
    nr: 39,
    powiaty: ["poznański"],
    miastaPrawaPow: ["Poznań"]
  },
  {
    nr: 40,
    powiaty: ["białogardzki", "choszczeński", "drawski", "kołobrzeski", "koszaliński", "sławieński", "szczecinecki", "świdwiński", "wałecki"],
    miastaPrawaPow: ["Koszalin"]
  },
  {
    nr: 41,
    powiaty: ["goleniowski", "gryficki", "gryfiński", "kamieński", "łobeski", "myśliborski", "policki", "pyrzycki", "stargardzki"],
    miastaPrawaPow: ["Szczecin", "Świnoujście"]
  }
];
