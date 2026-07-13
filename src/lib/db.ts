import { PrismaClient } from '@prisma/client';
import newsData from './news.json';

// Singleton for Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaInstance: PrismaClient | null = null;

try {
  if (process.env.DATABASE_URL) {
    prismaInstance = globalForPrisma.prisma || new PrismaClient();
    if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prismaInstance;
  }
} catch (e) {
  console.warn("Failed to initialize Prisma, falling back to mock database:", e);
}

export const prisma = prismaInstance;

// --- MOCK DATABASE IMPLEMENTATION ---
// This enables the project to run out-of-the-box without requiring a running PostgreSQL instance.
export interface MockDataStore {
  users: any[];
  teams: any[];
  players: any[];
  matches: any[];
  news: any[];
  predictions: any[];
  favorites: any[];
}

let teamBlueprints = [
  { id: "team-arg", name: "Argentina", code: "ARG", flag: "ar", group: "Group A", rank: 1, coach: "Lionel Scaloni", form: "W,W,W,D,W" },
  { id: "team-fra", name: "France", code: "FRA", flag: "fr", group: "Group A", rank: 2, coach: "Didier Deschamps", form: "W,L,W,W,W" },
  { id: "team-esp", name: "Spain", code: "ESP", flag: "es", group: "Group C", rank: 3, coach: "Luis de la Fuente", form: "W,W,W,W,W" },
  { id: "team-eng", name: "England", code: "ENG", flag: "gb-eng", group: "Group B", rank: 4, coach: "Thomas Tuchel", form: "D,W,W,W,D" },
  { id: "team-bra", name: "Brazil", code: "BRA", flag: "br", group: "Group B", rank: 5, coach: "Dorival Júnior", form: "W,W,D,L,W" },
  { id: "team-por", name: "Portugal", code: "POR", flag: "pt", group: "Group B", rank: 6, coach: "Roberto Martínez", form: "W,W,L,W,W" },
  { id: "team-nl", name: "Netherlands", code: "NED", flag: "nl", group: "Group C", rank: 7, coach: "Ronald Koeman", form: "W,D,W,L,W" },
  { id: "team-be", name: "Belgium", code: "BEL", flag: "be", group: "Group E", rank: 8, coach: "Domenico Tedesco", form: "L,W,D,W,L" },
  { id: "team-it", name: "Italy", code: "ITA", flag: "it", group: "Group E", rank: 9, coach: "Luciano Spalletti", form: "W,W,D,W,W" },
  { id: "team-hr", name: "Croatia", code: "CRO", flag: "hr", group: "Group F", rank: 10, coach: "Zlatko Dalić", form: "W,D,L,D,W" },
  { id: "team-ger", name: "Germany", code: "GER", flag: "de", group: "Group C", rank: 11, coach: "Julian Nagelsmann", form: "W,D,L,W,W" },
  { id: "team-mar", name: "Morocco", code: "MAR", flag: "ma", group: "Group D", rank: 13, coach: "Walid Regragui", form: "W,W,D,W,L" },
  { id: "team-uy", name: "Uruguay", code: "URU", flag: "uy", group: "Group F", rank: 14, coach: "Marcelo Bielsa", form: "W,L,W,D,W" },
  { id: "team-co", name: "Colombia", code: "COL", flag: "co", group: "Group G", rank: 15, coach: "Néstor Lorenzo", form: "W,W,D,W,W" },
  { id: "team-jpn", name: "Japan", code: "JPN", flag: "jp", group: "Group D", rank: 16, coach: "Hajime Moriyasu", form: "W,W,W,L,W" },
  { id: "team-us", name: "USA", code: "USA", flag: "us", group: "Group H", rank: 18, coach: "Mauricio Pochettino", form: "L,W,W,L,D" },
  { id: "team-mx", name: "Mexico", code: "MEX", flag: "mx", group: "Group H", rank: 19, coach: "Javier Aguirre", form: "W,D,L,W,D" },
  { id: "team-sn", name: "Senegal", code: "SEN", flag: "sn", group: "Group I", rank: 20, coach: "Aliou Cissé", form: "W,W,D,W,W" },
  { id: "team-ir", name: "Iran", code: "IRN", flag: "ir", group: "Group J", rank: 21, coach: "Amir Ghalenoei", form: "W,W,W,D,W" },
  { id: "team-dk", name: "Denmark", code: "DEN", flag: "dk", group: "Group J", rank: 22, coach: "Brian Riemer", form: "D,L,W,D,L" },
  { id: "team-kr", name: "Korea Republic", code: "KOR", flag: "kr", group: "Group K", rank: 23, coach: "Hong Myung-bo", form: "W,W,D,W,W" },
  { id: "team-au", name: "Australia", code: "AUS", flag: "au", group: "Group K", rank: 24, coach: "Tony Popovic", form: "D,W,D,L,W" },
  { id: "team-ua", name: "Ukraine", code: "UKR", flag: "ua", group: "Group L", rank: 25, coach: "Serhiy Rebrov", form: "L,W,D,L,W" },
  { id: "team-at", name: "Austria", code: "AUT", flag: "at", group: "Group G", rank: 26, coach: "Ralf Rangnick", form: "W,W,D,W,L" },
  { id: "team-se", name: "Sweden", code: "SWE", flag: "se", group: "Group F", rank: 28, coach: "Jon Dahl Tomasson", form: "W,D,W,W,L" },
  { id: "team-pl", name: "Poland", code: "POL", flag: "pl", group: "Group L", rank: 30, coach: "Michał Probierz", form: "L,L,W,D,L" },
  { id: "team-hu", name: "Hungary", code: "HUN", flag: "hu", group: "Group I", rank: 32, coach: "Marco Rossi", form: "D,W,L,W,D" },
  { id: "team-dz", name: "Algeria", code: "ALG", flag: "dz", group: "Group A", rank: 33, coach: "Vladimir Petković", form: "W,W,D,W,W" },
  { id: "team-sa", name: "Saudi Arabia", code: "KSA", flag: "sa", group: "Group J", rank: 34, coach: "Hervé Renard", form: "L,D,W,L,W" },
  { id: "team-eg", name: "Egypt", code: "EGY", flag: "eg", group: "Group I", rank: 36, coach: "Hossam Hassan", form: "W,W,W,D,W" },
  { id: "team-ec", name: "Ecuador", code: "ECU", flag: "ec", group: "Group G", rank: 38, coach: "Sebastián Beccacece", form: "W,D,W,L,W" },
  { id: "team-cl", name: "Chile", code: "CHI", flag: "cl", group: "Group H", rank: 40, coach: "Ricardo Gareca", form: "L,L,L,D,W" },
  { id: "team-pe", name: "Peru", code: "PER", flag: "pe", group: "Group G", rank: 42, coach: "Jorge Fossati", form: "D,L,W,L,D" },
  { id: "team-ng", name: "Nigeria", code: "NGA", flag: "ng", group: "Group E", rank: 44, coach: "Augustine Eguavoen", form: "W,D,W,W,L" },
  { id: "team-tn", name: "Tunisia", code: "TUN", flag: "tn", group: "Group B", rank: 46, coach: "Kais Yaâkoubi", form: "L,W,D,L,W" },
  { id: "team-cm", name: "Cameroon", code: "CMR", flag: "cm", group: "Group F", rank: 48, coach: "Marc Brys", form: "W,W,D,W,W" },
  { id: "team-ca", name: "Canada", code: "CAN", flag: "ca", group: "Group A", rank: 50, coach: "Jesse Marsch", form: "W,D,L,W,W" },
  { id: "team-tr", name: "Turkey", code: "TUR", flag: "tr", group: "Group L", rank: 52, coach: "Vincenzo Montella", form: "W,W,D,W,L" },
  { id: "team-no", name: "Norway", code: "NOR", flag: "no", group: "Group K", rank: 54, coach: "Ståle Solbakken", form: "W,L,W,W,D" },
  { id: "team-cz", name: "Czech Republic", code: "CZE", flag: "cz", group: "Group I", rank: 56, coach: "Ivan Hašek", form: "D,W,D,W,L" },
  { id: "team-ro", name: "Romania", code: "ROU", flag: "ro", group: "Group F", rank: 58, coach: "Mircea Lucescu", form: "W,W,W,W,W" },
  { id: "team-gr", name: "Greece", code: "GRE", flag: "gr", group: "Group E", rank: 60, coach: "Ivan Jovanović", form: "W,W,L,W,W" },
  { id: "team-qa", name: "Qatar", code: "QAT", flag: "qa", group: "Group D", rank: 62, coach: "Tintín Márquez", form: "L,W,L,D,W" },
  { id: "team-za", name: "South Africa", code: "RSA", flag: "za", group: "Group H", rank: 64, coach: "Hugo Broos", form: "W,D,W,W,D" },
  { id: "team-gh", name: "Ghana", code: "GHA", flag: "gh", group: "Group E", rank: 66, coach: "Otto Addo", form: "D,L,L,D,L" },
  { id: "team-ci", name: "Ivory Coast", code: "CIV", flag: "ci", group: "Group A", rank: 68, coach: "Emerse Faé", form: "W,L,L,W,W" },
  { id: "team-ml", name: "Mali", code: "MLI", flag: "ml", group: "Group J", rank: 70, coach: "Tom Saintfiet", form: "W,W,D,W,W" },
  { id: "team-cr", name: "Costa Rica", code: "CRC", flag: "cr", group: "Group C", rank: 72, coach: "Claudio Vivas", form: "D,W,L,W,L" },
  { id: "team-sct", name: "Scotland", code: "SCO", flag: "gb-sct", group: "Group D", rank: 74, coach: "Steve Clarke", form: "W,W,D,L,L" },
  { id: "team-wls", name: "Wales", code: "WAL", flag: "gb-wls", group: "Group C", rank: 76, coach: "Craig Bellamy", form: "W,D,W,D,D" }
];

const extraCountriesRaw = "Iceland;ISL;is;Group A;71;Åge Hareide|Finland;FIN;fi;Group B;62;Markku Kanerva|Slovakia;SVK;sk;Group D;41;Francesco Calzona|Slovenia;SVN;si;Group E;55;Matjaž Kek|Bulgaria;BUL;bg;Group G;83;Ilian Iliev|Ireland;IRL;ie;Group H;58;Heimir Hallgrímsson|Northern Ireland;NIR;gb-nir;Group I;73;Michael O'Neill|Serbia;SRB;rs;Group L;35;Dragan Stojković|Bosnia and Herzegovina;BIH;ba;Group A;75;Sergej Barbarez|Albania;ALB;al;Group B;66;Sylvinho|Georgia;GEO;ge;Group C;70;Willy Sagnol|Armenia;ARM;am;Group D;96;Oleksandr Petrakov|Azerbaijan;AZE;az;Group E;113;Fernando Santos|Kazakhstan;KAZ;kz;Group F;109;Stanislav Cherchesov|Cyprus;CYP;cy;Group G;121;Sofronis Avgousti|Malta;MLT;mt;Group H;171;Davide Mazzotta|Luxembourg;LUX;lu;Group I;89;Luc Holtz|Liechtenstein;LIE;li;Group J;200;Konrad Fünfstück|Andorra;AND;ad;Group K;169;Koldo Álvarez|San Marino;SMR;sm;Group L;210;Roberto Cevoli|Gibraltar;GIB;gi;Group A;197;Julio César Ribas|Faroe Islands;FRO;fo;Group B;138;Håkan Ericson|Moldova;MDA;md;Group C;102;Serghei Cleşcenco|North Macedonia;MKD;mk;Group D;68;Blagoja Milevski|Kosovo;KOS;xk;Group E;101;Franco Foda|Montenegro;MNE;me;Group F;72;Robert Prosinečki|Estonia;EST;ee;Group G;124;Jürgen Henn|Latvia;LVA;lv;Group H;137;Paolo Nicolato|Lithuania;LTU;lt;Group I;141;Edgaras Jankauskas|Belarus;BLR;by;Group J;97;Carlos Alós|Venezuela;VEN;ve;Group K;44;Fernando Batista|Paraguay;PAR;py;Group L;56;Gustavo Alfaro|Bolivia;BOL;bo;Group A;82;Oscar Villegas|New Zealand;NZL;nz;Group B;91;Darren Bazeley|Solomon Islands;SOL;sb;Group C;132;Josh Smith|Fiji;FJI;fj;Group D;146;Rob Sherman|New Caledonia;NCL;nc;Group E;158;Johann Sidaner|Tahiti;TAH;pf;Group F;161;Samuel Garcia|Vanuatu;VAN;vu;Group G;164;Juliano Schmeling|Papua New Guinea;PNG;pg;Group H;168;Warren Moon|Samoa;SAM;ws;Group I;186;Paul Ifill|Tonga;TGA;to;Group J;199;Kilifi Uele|Cook Islands;COK;ck;Group K;187;Tuka Tisam|American Samoa;ASA;as;Group L;188;Ruben Luvu|Cabo Verde;CPV;cv;Group A;65;Bubista|DR Congo;COD;cd;Group B;57;Sébastien Desabre|Guinea;GUI;gn;Group C;78;Kaba Diawara|Equatorial Guinea;EQG;gq;Group D;88;Juan Micha|Zambia;ZAM;zm;Group E;93;Avram Grant|Uganda;UGA;ug;Group F;90;Paul Put|Gabon;GAB;ga;Group G;84;Thierry Mouyouma|Kenya;KEN;ke;Group H;102;Engin Fırat|Zimbabwe;ZIM;zw;Group I;117;Michael Nees|Angola;ANG;ao;Group J;85;Pedro Gonçalves|Benin;BEN;bj;Group K;95;Gernot Rohr|Congo;CGO;cg;Group L;112;Isaac Ngata|Madagascar;MAD;mg;Group A;108;Romuald Rakotondrabe|Mozambique;MOZ;mz;Group B;103;Chiquinho Conde|Mauritania;MTN;mr;Group C;114;Amir Abdou|Namibia;NAM;na;Group D;115;Collin Benjamin|Togo;TOG;tg;Group E;119;Daré Nibombé|Libya;LBY;ly;Group F;120;Milutin Sredojević|Sudan;SDN;sd;Group G;121;James Kwesi Appiah|Sierra Leone;SLE;sl;Group H;122;Amidu Karim|Central African Republic;CTA;cf;Group I;125;Raoul Savoy|Niger;NIG;ne;Group J;127;Badou Zaki|Rwanda;RWA;rw;Group K;128;Torsten Spittler|Gambia;GAM;gm;Group L;129;Johnny McKinstry|Tanzania;TAN;tz;Group A;130;Hemed Suleiman|Ethiopia;ETH;et;Group B;131;Gebremedhin Haile|Malawi;MWI;mw;Group C;132;Patrick Mabedi|Liberia;LBR;lr;Group D;133;Mario Marinică|Eswatini;SWZ;sz;Group E;134;Zdravko Logarušić|Botswana;BOT;bw;Group F;135;Didier Gomes Da Rosa|Lesotho;LES;ls;Group G;136;Leslie Notši|Burundi;BDI;bi;Group H;137;Etienne Ndayiragije|South Sudan;SSD;ss;Group I;138;Nicolas Dupuis|Mauritius;MRI;mu;Group J;139;Guillaume Moulin|Somalia;SOM;so;Group K;140;Rachid Lousteque|Seychelles;SEY;sc;Group L;141;Ralph Jean-Louis|Djibouti;DJI;dj;Group A;142;Abdourahman Okieh|Eritrea;ERI;er;Group B;143;Alemseged Efrem|Chad;CHA;td;Group C;144;Kevin Nicaise|Sao Tome and Principe;STP;st;Group D;145;Adriano Eusébio";

const remainingCountriesRaw = "Panama;PAN;pa|Jamaica;JAM;jm|Honduras;HON;hn|El Salvador;SLV;sv|Haiti;HAI;ht|Curaçao;CUW;cw|Trinidad and Tobago;TRI;tt|Guatemala;GUA;gt|Nicaragua;NCA;ni|Suriname;SUR;sr|Antigua and Barbuda;ATG;ag|Dominican Republic;DOM;do|Bermuda;BER;bm|Barbados;BRB;bb|Grenada;GRN;gd|St. Vincent and the Grenadines;VIN;vc|Cuba;CUB;cu|Puerto Rico;PUR;pr|Guyana;GUY;gy|Belize;BLZ;bz|St. Lucia;LCA;lc|Montserrat;MSR;ms|Dominica;DMA;dm|Aruba;ARU;aw|Cayman Islands;CAY;ky|St. Kitts and Nevis;SKN;kn|Anguilla;AIA;ai|Turks and Caicos Islands;TCA;tc|British Virgin Islands;VGB;vg|US Virgin Islands;VIR;vi|Bahamas;BAH;bs|Sri Lanka;SRI;lk|Pakistan;PAK;pk|Bhutan;BHU;bt|India;IND;in|Vietnam;VIE;vn|Lebanon;LBN;lb|Tajikistan;TJK;tj|Thailand;THA;th|Yemen;YEM;ye|Kuwait;KUW;kw|Hong Kong;HKG;hk|Indonesia;IDN;id|Malaysia;MAS;my|Singapore;SGP;sg|Maldives;MDV;mv|Philippines;PHI;ph|Afghanistan;AFG;af|Chinese Taipei;TPE;tw|Myanmar;MYA;mm|Cambodia;KHM;kh|Bangladesh;BAN;bd|Nepal;NEP;np|Macau;MAC;mo|Laos;LAO;la|Mongolia;MNG;mn|Brunei;BRU;bn|Timor-Leste;TLS;tl|Guam;GUM;gu|Iraq;IRQ;iq|Uzbekistan;UZB;uz|United Arab Emirates;UAE;ae|Jordan;JOR;jo|Oman;OMA;om|Bahrain;BHR;bh|China PR;CHN;cn|Syria;SYR;sy|Palestine;PLE;ps|Kyrgyz Republic;KGZ;kg";

extraCountriesRaw.split('|').forEach(c => {
  const parts = c.split(';');
  teamBlueprints.push({
    id: `team-${parts[1].toLowerCase()}`,
    name: parts[0],
    code: parts[1],
    flag: parts[2],
    group: parts[3],
    rank: parseInt(parts[4]),
    coach: parts[5],
    form: "W,D,W"
  });
});

let tempRank = 146;
const groupsList = ["Group A", "Group B", "Group C", "Group D", "Group E", "Group F", "Group G", "Group H", "Group I", "Group J", "Group K", "Group L"];
remainingCountriesRaw.split('|').forEach((c, idx) => {
  const parts = c.split(';');
  teamBlueprints.push({
    id: `team-${parts[1].toLowerCase()}`,
    name: parts[0],
    code: parts[1],
    flag: parts[2],
    group: groupsList[idx % groupsList.length],
    rank: tempRank++,
    coach: "National Head Coach",
    form: "D,W,L"
  });
});

const superstarPlayers = [
  // ARGENTINA
  { id: "p1", name: "Lionel Messi", position: "Forward", jerseyNumber: 10, teamId: "team-arg", goals: 12, assists: 8, appearances: 15, rating: 8.8, transferValue: "€30M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "PSG", years: "2021-2023" }]) },
  { id: "p2", name: "Julián Álvarez", position: "Forward", jerseyNumber: 9, teamId: "team-arg", goals: 6, assists: 3, appearances: 14, rating: 7.4, transferValue: "€90M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2022-2024" }]) },
  { id: "p3", name: "Lautaro Martínez", position: "Forward", jerseyNumber: 22, teamId: "team-arg", goals: 8, assists: 2, appearances: 13, rating: 7.8, transferValue: "€110M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Racing Club", years: "2015-2018" }]) },
  { id: "p4", name: "Angel Di María", position: "Forward", jerseyNumber: 11, teamId: "team-arg", goals: 4, assists: 5, appearances: 12, rating: 7.6, transferValue: "€5M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Juventus", years: "2022-2023" }]) },
  { id: "p5", name: "Alexis Mac Allister", position: "Midfielder", jerseyNumber: 20, teamId: "team-arg", goals: 3, assists: 4, appearances: 15, rating: 7.9, transferValue: "€75M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Brighton", years: "2019-2023" }]) },
  { id: "p6", name: "Enzo Fernández", position: "Midfielder", jerseyNumber: 24, teamId: "team-arg", goals: 2, assists: 3, appearances: 14, rating: 7.5, transferValue: "€80M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Benfica", years: "2022-2023" }]) },
  { id: "p7", name: "Rodrigo De Paul", position: "Midfielder", jerseyNumber: 7, teamId: "team-arg", goals: 1, assists: 4, appearances: 16, rating: 7.7, transferValue: "€35M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Udinese", years: "2016-2021" }]) },
  { id: "p8", name: "Cristian Romero", position: "Defender", jerseyNumber: 13, teamId: "team-arg", goals: 1, assists: 0, appearances: 15, rating: 8.1, transferValue: "€65M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Atalanta", years: "2020-2021" }]) },
  { id: "p9", name: "Nicolás Otamendi", position: "Defender", jerseyNumber: 19, teamId: "team-arg", goals: 0, assists: 1, appearances: 14, rating: 7.3, transferValue: "€3M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2015-2020" }]) },
  { id: "p10", name: "Lisandro Martínez", position: "Defender", jerseyNumber: 25, teamId: "team-arg", goals: 0, assists: 0, appearances: 10, rating: 7.6, transferValue: "€45M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Ajax", years: "2019-2022" }]) },
  { id: "p11", name: "Emiliano Martínez", position: "Goalkeeper", jerseyNumber: 23, teamId: "team-arg", goals: 0, assists: 0, appearances: 15, rating: 8.3, transferValue: "€28M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Aston Villa", years: "2020-Present" }]) },

  // FRANCE
  { id: "p12", name: "Kylian Mbappé", position: "Forward", jerseyNumber: 10, teamId: "team-fra", goals: 14, assists: 5, appearances: 16, rating: 8.9, transferValue: "€180M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "PSG", years: "2017-2024" }]) },
  { id: "p13", name: "Antoine Griezmann", position: "Midfielder", jerseyNumber: 7, teamId: "team-fra", goals: 4, assists: 9, appearances: 17, rating: 7.9, transferValue: "€25M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Barcelona", years: "2019-2022" }]) },
  { id: "p14", name: "Olivier Giroud", position: "Forward", jerseyNumber: 9, teamId: "team-fra", goals: 4, assists: 1, appearances: 14, rating: 7.5, transferValue: "€4M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Chelsea", years: "2018-2021" }]) },
  { id: "p15", name: "Ousmane Dembélé", position: "Forward", jerseyNumber: 11, teamId: "team-fra", goals: 3, assists: 6, appearances: 13, rating: 7.8, transferValue: "€60M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Barcelona", years: "2017-2023" }]) },
  { id: "p16", name: "Aurélien Tchouaméni", position: "Midfielder", jerseyNumber: 8, teamId: "team-fra", goals: 2, assists: 2, appearances: 15, rating: 7.7, transferValue: "€90M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Monaco", years: "2020-2022" }]) },
  { id: "p17", name: "Adrien Rabiot", position: "Midfielder", jerseyNumber: 14, teamId: "team-fra", goals: 1, assists: 2, appearances: 14, rating: 7.4, transferValue: "€35M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Juventus", years: "2019-2024" }]) },
  { id: "p18", name: "Eduardo Camavinga", position: "Midfielder", jerseyNumber: 6, teamId: "team-fra", goals: 1, assists: 1, appearances: 12, rating: 7.6, transferValue: "€90M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Rennes", years: "2018-2021" }]) },
  { id: "p19", name: "Theo Hernandez", position: "Defender", jerseyNumber: 22, teamId: "team-fra", goals: 2, assists: 4, appearances: 16, rating: 7.8, transferValue: "€60M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Real Madrid", years: "2017-2019" }]) },
  { id: "p20", name: "Dayot Upamecano", position: "Defender", jerseyNumber: 18, teamId: "team-fra", goals: 0, assists: 1, appearances: 13, rating: 7.3, transferValue: "€50M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "RB Leipzig", years: "2017-2021" }]) },
  { id: "p21", name: "William Saliba", position: "Defender", jerseyNumber: 17, teamId: "team-fra", goals: 1, assists: 0, appearances: 15, rating: 8.2, transferValue: "€80M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Marseille", years: "2021-2022" }]) },
  { id: "p22", name: "Mike Maignan", position: "Goalkeeper", jerseyNumber: 16, teamId: "team-fra", goals: 0, assists: 0, appearances: 15, rating: 8.1, transferValue: "€45M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Lille", years: "2015-2021" }]) },

  // SPAIN
  { id: "p23", name: "Lamine Yamal", position: "Forward", jerseyNumber: 19, teamId: "team-esp", goals: 5, assists: 7, appearances: 12, rating: 8.4, transferValue: "€150M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "La Masia", years: "2014-2023" }]) },
  { id: "p24", name: "Rodri", position: "Midfielder", jerseyNumber: 16, teamId: "team-esp", goals: 3, assists: 4, appearances: 15, rating: 8.5, transferValue: "€120M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Atletico Madrid", years: "2018-2019" }]) },
  { id: "p25", name: "Nico Williams", position: "Forward", jerseyNumber: 17, teamId: "team-esp", goals: 4, assists: 5, appearances: 13, rating: 8.0, transferValue: "€70M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Bilbao Academy", years: "2013-2020" }]) },
  { id: "p26", name: "Dani Olmo", position: "Midfielder", jerseyNumber: 10, teamId: "team-esp", goals: 5, assists: 3, appearances: 11, rating: 7.9, transferValue: "€60M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "RB Leipzig", years: "2020-2024" }]) },
  { id: "p27", name: "Pedri González", position: "Midfielder", jerseyNumber: 20, teamId: "team-esp", goals: 2, assists: 4, appearances: 14, rating: 7.8, transferValue: "€80M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Las Palmas", years: "2019-2020" }]) },
  { id: "p28", name: "Gavi", position: "Midfielder", jerseyNumber: 9, teamId: "team-esp", goals: 1, assists: 2, appearances: 10, rating: 7.6, transferValue: "€90M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "La Masia", years: "2015-2021" }]) },
  { id: "p29", name: "Fabián Ruiz", position: "Midfielder", jerseyNumber: 8, teamId: "team-esp", goals: 3, assists: 2, appearances: 13, rating: 7.7, transferValue: "€35M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Napoli", years: "2018-2022" }]) },
  { id: "p30", name: "Dani Carvajal", position: "Defender", jerseyNumber: 2, teamId: "team-esp", goals: 1, assists: 2, appearances: 15, rating: 7.9, transferValue: "€12M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Leverkusen", years: "2012-2013" }]) },
  { id: "p31", name: "Aymeric Laporte", position: "Defender", jerseyNumber: 14, teamId: "team-esp", goals: 1, assists: 0, appearances: 14, rating: 7.5, transferValue: "€20M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2018-2023" }]) },
  { id: "p32", name: "Marc Cucurella", position: "Defender", jerseyNumber: 24, teamId: "team-esp", goals: 0, assists: 2, appearances: 12, rating: 7.6, transferValue: "€30M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Brighton", years: "2021-2022" }]) },
  { id: "p33", name: "Unai Simón", position: "Goalkeeper", jerseyNumber: 23, teamId: "team-esp", goals: 0, assists: 0, appearances: 15, rating: 7.8, transferValue: "€30M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Athletic Bilbao", years: "2016-Present" }]) },

  // ENGLAND
  { id: "p34", name: "Jude Bellingham", position: "Midfielder", jerseyNumber: 10, teamId: "team-eng", goals: 7, assists: 5, appearances: 15, rating: 8.7, transferValue: "€180M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Dortmund", years: "2020-2023" }]) },
  { id: "p35", name: "Harry Kane", position: "Forward", jerseyNumber: 9, teamId: "team-eng", goals: 10, assists: 4, appearances: 16, rating: 8.3, transferValue: "€100M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Tottenham", years: "2009-2023" }]) },
  { id: "p36", name: "Bukayo Saka", position: "Forward", jerseyNumber: 7, teamId: "team-eng", goals: 6, assists: 5, appearances: 15, rating: 8.2, transferValue: "€140M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Arsenal Academy", years: "2008-2018" }]) },
  { id: "p37", name: "Phil Foden", position: "Midfielder", jerseyNumber: 11, teamId: "team-eng", goals: 4, assists: 4, appearances: 14, rating: 7.9, transferValue: "€150M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City Academy", years: "2009-2016" }]) },
  { id: "p38", name: "Cole Palmer", position: "Midfielder", jerseyNumber: 24, teamId: "team-eng", goals: 8, assists: 6, appearances: 13, rating: 8.4, transferValue: "€90M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2020-2023" }]) },
  { id: "p39", name: "Declan Rice", position: "Midfielder", jerseyNumber: 4, teamId: "team-eng", goals: 2, assists: 3, appearances: 16, rating: 7.9, transferValue: "€120M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "West Ham", years: "2015-2023" }]) },
  { id: "p40", name: "John Stones", position: "Defender", jerseyNumber: 5, teamId: "team-eng", goals: 1, assists: 1, appearances: 13, rating: 7.6, transferValue: "€38M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Everton", years: "2013-2016" }]) },
  { id: "p41", name: "Kyle Walker", position: "Defender", jerseyNumber: 2, teamId: "team-eng", goals: 0, assists: 2, appearances: 15, rating: 7.4, transferValue: "€15M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Tottenham", years: "2009-2017" }]) },
  { id: "p42", name: "Trent Alexander-Arnold", position: "Defender", jerseyNumber: 8, teamId: "team-eng", goals: 2, assists: 5, appearances: 14, rating: 7.8, transferValue: "€70M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Liverpool Academy", years: "2004-2016" }]) },
  { id: "p43", name: "Jordan Pickford", position: "Goalkeeper", jerseyNumber: 1, teamId: "team-eng", goals: 0, assists: 0, appearances: 16, rating: 7.6, transferValue: "€22M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Sunderland", years: "2011-2017" }]) },
  { id: "p44", name: "Erling Haaland", position: "Forward", jerseyNumber: 9, teamId: "team-eng", goals: 15, assists: 2, appearances: 14, rating: 8.9, transferValue: "€180M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Dortmund", years: "2020-2022" }]) },

  // BRAZIL
  { id: "p45", name: "Vinícius Júnior", position: "Forward", jerseyNumber: 7, teamId: "team-bra", goals: 11, assists: 6, appearances: 15, rating: 8.8, transferValue: "€180M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Flamengo", years: "2017-2018" }]) },
  { id: "p46", name: "Neymar Jr", position: "Forward", jerseyNumber: 10, teamId: "team-bra", goals: 9, assists: 8, appearances: 13, rating: 8.5, transferValue: "€45M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "PSG", years: "2017-2023" }]) },
  { id: "p47", name: "Rodrygo Goes", position: "Forward", jerseyNumber: 11, teamId: "team-bra", goals: 6, assists: 4, appearances: 14, rating: 7.8, transferValue: "€110M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Santos", years: "2017-2019" }]) },
  { id: "p48", name: "Gabriel Martinelli", position: "Forward", jerseyNumber: 22, teamId: "team-bra", goals: 4, assists: 2, appearances: 12, rating: 7.5, transferValue: "€80M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Ituano", years: "2018-2019" }]) },
  { id: "p49", name: "Bruno Guimarães", position: "Midfielder", jerseyNumber: 5, teamId: "team-bra", goals: 2, assists: 4, appearances: 14, rating: 7.9, transferValue: "€85M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Lyon", years: "2020-2022" }]) },
  { id: "p50", name: "Lucas Paquetá", position: "Midfielder", jerseyNumber: 8, teamId: "team-bra", goals: 3, assists: 3, appearances: 13, rating: 7.6, transferValue: "€65M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Lyon", years: "2020-2022" }]) },
  { id: "p51", name: "Casemiro", position: "Midfielder", jerseyNumber: 18, teamId: "team-bra", goals: 1, assists: 1, appearances: 15, rating: 7.4, transferValue: "€20M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Real Madrid", years: "2013-2022" }]) },
  { id: "p52", name: "Marquinhos", position: "Defender", jerseyNumber: 3, teamId: "team-bra", goals: 1, assists: 0, appearances: 15, rating: 7.7, transferValue: "€50M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Roma", years: "2012-2013" }]) },
  { id: "p53", name: "Gabriel Magalhães", position: "Defender", jerseyNumber: 4, teamId: "team-bra", goals: 2, assists: 0, appearances: 14, rating: 7.8, transferValue: "€70M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Lille", years: "2017-2020" }]) },
  { id: "p54", name: "Danilo Luiz", position: "Defender", jerseyNumber: 2, teamId: "team-bra", goals: 0, assists: 1, appearances: 12, rating: 7.1, transferValue: "€10M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2017-2019" }]) },
  { id: "p55", name: "Alisson Becker", position: "Goalkeeper", jerseyNumber: 1, teamId: "team-bra", goals: 0, assists: 0, appearances: 14, rating: 8.2, transferValue: "€28M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Roma", years: "2016-2018" }]) },

  // GERMANY
  { id: "p56", name: "Florian Wirtz", position: "Midfielder", jerseyNumber: 10, teamId: "team-ger", goals: 9, assists: 8, appearances: 15, rating: 8.6, transferValue: "€130M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Köln", years: "2010-2020" }]) },
  { id: "p57", name: "Jamal Musiala", position: "Midfielder", jerseyNumber: 42, teamId: "team-ger", goals: 8, assists: 6, appearances: 14, rating: 8.5, transferValue: "€130M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Chelsea Acad", years: "2011-2019" }]) },
  { id: "p58", name: "Kai Havertz", position: "Forward", jerseyNumber: 7, teamId: "team-ger", goals: 6, assists: 4, appearances: 15, rating: 7.8, transferValue: "€75M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Chelsea", years: "2020-2023" }]) },
  { id: "p59", name: "Leroy Sané", position: "Forward", jerseyNumber: 19, teamId: "team-ger", goals: 4, assists: 5, appearances: 13, rating: 7.7, transferValue: "€60M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2016-2020" }]) },
  { id: "p60", name: "İlkay Gündoğan", position: "Midfielder", jerseyNumber: 21, teamId: "team-ger", goals: 3, assists: 4, appearances: 15, rating: 7.9, transferValue: "€15M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2016-2023" }]) },
  { id: "p61", name: "Toni Kroos", position: "Midfielder", jerseyNumber: 8, teamId: "team-ger", goals: 1, assists: 8, appearances: 14, rating: 8.2, transferValue: "€5M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Bayern Munich", years: "2006-2014" }]) },
  { id: "p62", name: "Joshua Kimmich", position: "Midfielder", jerseyNumber: 6, teamId: "team-ger", goals: 2, assists: 4, appearances: 16, rating: 7.9, transferValue: "€50M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "RB Leipzig", years: "2013-2015" }]) },
  { id: "p63", name: "Antonio Rüdiger", position: "Defender", jerseyNumber: 2, teamId: "team-ger", goals: 1, assists: 0, appearances: 15, rating: 7.9, transferValue: "€25M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Chelsea", years: "2017-2022" }]) },
  { id: "p64", name: "Jonathan Tah", position: "Defender", jerseyNumber: 4, teamId: "team-ger", goals: 0, assists: 1, appearances: 13, rating: 7.4, transferValue: "€30M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Hamburg", years: "2013-2015" }]) },
  { id: "p65", name: "David Raum", position: "Defender", jerseyNumber: 3, teamId: "team-ger", goals: 0, assists: 3, appearances: 12, rating: 7.3, transferValue: "€17M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Hoffenheim", years: "2021-2022" }]) },
  { id: "p66", name: "Manuel Neuer", position: "Goalkeeper", jerseyNumber: 1, teamId: "team-ger", goals: 0, assists: 0, appearances: 14, rating: 7.8, transferValue: "€4M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Schalke 04", years: "2006-2011" }]) },

  // MOROCCO
  { id: "p67", name: "Achraf Hakimi", position: "Defender", jerseyNumber: 2, teamId: "team-mar", goals: 3, assists: 5, appearances: 16, rating: 8.1, transferValue: "€65M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Inter Milan", years: "2020-2021" }]) },
  { id: "p68", name: "Hakim Ziyech", position: "Forward", jerseyNumber: 7, teamId: "team-mar", goals: 4, assists: 4, appearances: 14, rating: 7.6, transferValue: "€9M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Chelsea", years: "2020-2023" }]) },
  { id: "p69", name: "Youssef En-Nesyri", position: "Forward", jerseyNumber: 19, teamId: "team-mar", goals: 6, assists: 0, appearances: 15, rating: 7.5, transferValue: "€20M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Sevilla", years: "2020-2024" }]) },
  { id: "p70", name: "Sofyan Amrabat", position: "Midfielder", jerseyNumber: 4, teamId: "team-mar", goals: 0, assists: 1, appearances: 16, rating: 7.8, transferValue: "€22M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Fiorentina", years: "2020-2024" }]) },
  { id: "p71", name: "Azzedine Ounahi", position: "Midfielder", jerseyNumber: 8, teamId: "team-mar", goals: 1, assists: 3, appearances: 13, rating: 7.4, transferValue: "€12M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Angers", years: "2021-2023" }]) },
  { id: "p72", name: "Brahim Díaz", position: "Midfielder", jerseyNumber: 10, teamId: "team-mar", goals: 4, assists: 2, appearances: 11, rating: 7.8, transferValue: "€40M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "AC Milan", years: "2020-2023" }]) },
  { id: "p73", name: "Nayef Aguerd", position: "Defender", jerseyNumber: 5, teamId: "team-mar", goals: 1, assists: 0, appearances: 14, rating: 7.6, transferValue: "€35M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Rennes", years: "2020-2022" }]) },
  { id: "p74", name: "Romain Saïss", position: "Defender", jerseyNumber: 6, teamId: "team-mar", goals: 1, assists: 0, appearances: 15, rating: 7.2, transferValue: "€2M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Wolves", years: "2016-2022" }]) },
  { id: "p75", name: "Noussair Mazraoui", position: "Defender", jerseyNumber: 3, teamId: "team-mar", goals: 0, assists: 2, appearances: 13, rating: 7.5, transferValue: "€30M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Bayern Munich", years: "2022-2024" }]) },
  { id: "p76", name: "Amine Adli", position: "Forward", jerseyNumber: 21, teamId: "team-mar", goals: 2, assists: 3, appearances: 10, rating: 7.1, transferValue: "€25M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Leverkusen", years: "2021-Present" }]) },
  { id: "p77", name: "Yassine Bounou", position: "Goalkeeper", jerseyNumber: 1, teamId: "team-mar", goals: 0, assists: 0, appearances: 16, rating: 8.0, transferValue: "€11M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Sevilla", years: "2020-2023" }]) },

  // JAPAN
  { id: "p78", name: "Kaoru Mitoma", position: "Forward", jerseyNumber: 7, teamId: "team-jpn", goals: 5, assists: 6, appearances: 14, rating: 8.1, transferValue: "€45M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Union SG", years: "2021-2022" }]) },
  { id: "p79", name: "Takefusa Kubo", position: "Forward", jerseyNumber: 20, teamId: "team-jpn", goals: 4, assists: 5, appearances: 13, rating: 8.0, transferValue: "€50M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Real Madrid", years: "2019-2022" }]) },
  { id: "p80", name: "Wataru Endo", position: "Midfielder", jerseyNumber: 6, teamId: "team-jpn", goals: 1, assists: 2, appearances: 16, rating: 7.8, transferValue: "€13M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Stuttgart", years: "2019-2023" }]) },
  { id: "p81", name: "Ritsu Doan", position: "Forward", jerseyNumber: 8, teamId: "team-jpn", goals: 3, assists: 2, appearances: 15, rating: 7.4, transferValue: "€18M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "PSV", years: "2019-2022" }]) },
  { id: "p82", name: "Daichi Kamada", position: "Midfielder", jerseyNumber: 14, teamId: "team-jpn", goals: 2, assists: 3, appearances: 12, rating: 7.3, transferValue: "€15M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Frankfurt", years: "2017-2023" }]) },
  { id: "p83", name: "Takumi Minamino", position: "Midfielder", jerseyNumber: 10, teamId: "team-jpn", goals: 4, assists: 4, appearances: 13, rating: 7.6, transferValue: "€20M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Liverpool", years: "2020-2022" }]) },
  { id: "p84", name: "Hiroki Ito", position: "Defender", jerseyNumber: 21, teamId: "team-jpn", goals: 0, assists: 1, appearances: 14, rating: 7.4, transferValue: "€30M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Stuttgart", years: "2021-2024" }]) },
  { id: "p85", name: "Ko Itakura", position: "Defender", jerseyNumber: 4, teamId: "team-jpn", goals: 1, assists: 0, appearances: 15, rating: 7.5, transferValue: "€15M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man City", years: "2019-2022" }]) },
  { id: "p86", name: "Takehiro Tomiyasu", position: "Defender", jerseyNumber: 22, teamId: "team-jpn", goals: 0, assists: 1, appearances: 11, rating: 7.7, transferValue: "€30M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Bologna", years: "2019-2021" }]) },
  { id: "p87", name: "Yukinari Sugawara", position: "Defender", jerseyNumber: 2, teamId: "team-jpn", goals: 1, assists: 3, appearances: 13, rating: 7.2, transferValue: "€12M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "AZ Alkmaar", years: "2019-2024" }]) },
  { id: "p88", name: "Zion Suzuki", position: "Goalkeeper", jerseyNumber: 1, teamId: "team-jpn", goals: 0, assists: 0, appearances: 12, rating: 7.1, transferValue: "€2M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Urawa Reds", years: "2021-2024" }]) },

  // PORTUGAL
  { id: "p89", name: "Cristiano Ronaldo", position: "Forward", jerseyNumber: 7, teamId: "team-por", goals: 13, assists: 3, appearances: 16, rating: 8.6, transferValue: "€15M", imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Man United", years: "2021-2022" }]) },
  { id: "p90", name: "Bruno Fernandes", position: "Midfielder", jerseyNumber: 8, teamId: "team-por", goals: 6, assists: 7, appearances: 15, rating: 8.3, transferValue: "€70M", imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Sporting CP", years: "2017-2020" }]) },
  { id: "p91", name: "Bernardo Silva", position: "Midfielder", jerseyNumber: 10, teamId: "team-por", goals: 4, assists: 5, appearances: 15, rating: 8.1, transferValue: "€70M", imageUrl: "https://images.unsplash.com/photo-1517466788219-7f61d285c5c5?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Monaco", years: "2014-2017" }]) },
  { id: "p92", name: "Rafael Leão", position: "Forward", jerseyNumber: 17, teamId: "team-por", goals: 5, assists: 4, appearances: 13, rating: 7.9, transferValue: "€90M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Lille", years: "2018-2019" }]) },
  { id: "p93", name: "Vitinha", position: "Midfielder", jerseyNumber: 23, teamId: "team-por", goals: 2, assists: 3, appearances: 14, rating: 8.0, transferValue: "€55M", imageUrl: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Porto", years: "2020-2022" }]) },
  { id: "p94", name: "Rúben Dias", position: "Defender", jerseyNumber: 4, teamId: "team-por", goals: 1, assists: 0, appearances: 15, rating: 8.2, transferValue: "€80M", imageUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Benfica", years: "2015-2020" }]) },
  { id: "p95", name: "João Cancelo", position: "Defender", jerseyNumber: 2, teamId: "team-por", goals: 2, assists: 3, appearances: 14, rating: 7.7, transferValue: "€25M", imageUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Juventus", years: "2018-2019" }]) },
  { id: "p96", name: "Nuno Mendes", position: "Defender", jerseyNumber: 19, teamId: "team-por", goals: 0, assists: 2, appearances: 12, rating: 7.5, transferValue: "€60M", imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Sporting CP", years: "2020-2022" }]) },
  { id: "p97", name: "Diogo Dalot", position: "Defender", jerseyNumber: 20, teamId: "team-por", goals: 1, assists: 1, appearances: 13, rating: 7.4, transferValue: "€35M", imageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Porto", years: "2017-2018" }]) },
  { id: "p98", name: "Diogo Jota", position: "Forward", jerseyNumber: 21, teamId: "team-por", goals: 3, assists: 2, appearances: 11, rating: 7.3, transferValue: "€50M", imageUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Wolves", years: "2017-2020" }]) },
  { id: "p99", name: "Diogo Costa", position: "Goalkeeper", jerseyNumber: 22, teamId: "team-por", goals: 0, assists: 0, appearances: 15, rating: 7.9, transferValue: "€45M", imageUrl: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Porto", years: "2019-Present" }]) },
  { id: "p100", name: "Rafael Leão", position: "Forward", jerseyNumber: 17, teamId: "team-por", goals: 5, assists: 4, appearances: 13, rating: 7.9, transferValue: "€90M", imageUrl: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=300&fit=crop", careerHistory: JSON.stringify([{ club: "Lille", years: "2018-2019" }]) }
];

const generateAllPlayers = () => {
  const list = superstarPlayers.map(p => {
    let age = 27; // default average age
    let currentClub = "Free Agent";
    
    // Real values for top players
    if (p.name === "Lionel Messi") { age = 38; currentClub = "Inter Miami"; }
    else if (p.name === "Cristiano Ronaldo") { age = 41; currentClub = "Al Nassr"; }
    else if (p.name === "Kylian Mbappé") { age = 27; currentClub = "Real Madrid"; }
    else if (p.name === "Erling Haaland") { age = 25; currentClub = "Manchester City"; }
    else if (p.name === "Jude Bellingham") { age = 22; currentClub = "Real Madrid"; }
    else if (p.name === "Lamine Yamal") { age = 18; currentClub = "Barcelona"; }
    else if (p.name === "Rodri") { age = 29; currentClub = "Manchester City"; }
    else if (p.name === "Harry Kane") { age = 32; currentClub = "Bayern Munich"; }
    else if (p.name === "Vinícius Júnior") { age = 25; currentClub = "Real Madrid"; }
    else if (p.name === "Florian Wirtz") { age = 22; currentClub = "Bayer Leverkusen"; }
    else if (p.name === "Jamal Musiala") { age = 22; currentClub = "Bayern Munich"; }
    else if (p.name === "Achraf Hakimi") { age = 27; currentClub = "PSG"; }
    else {
      try {
        const history = JSON.parse(p.careerHistory);
        if (history && history.length > 0) {
          currentClub = history[history.length - 1]?.club || history[0]?.club || "Unknown Club";
        }
      } catch (e) {}
      age = Math.floor(Math.random() * 13) + 21; // 21 to 33
    }

    return {
      ...p,
      age,
      currentClub,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  const superstarTeamIds = new Set(superstarPlayers.map(p => p.teamId));

  teamBlueprints.forEach(t => {
    if (!superstarTeamIds.has(t.id)) {
      const positions = ["Forward", "Midfielder", "Midfielder", "Defender", "Goalkeeper"];
      const roleNames = ["Striker", "Playmaker", "Midfielder", "Defender", "Goalkeeper"];
      
      positions.forEach((pos, idx) => {
        list.push({
          id: `p-${t.id}-${idx}`,
          name: `${t.name} ${roleNames[idx]}`,
          position: pos,
          jerseyNumber: [9, 10, 8, 4, 1][idx],
          teamId: t.id,
          goals: Math.floor(Math.random() * 3),
          assists: Math.floor(Math.random() * 3),
          appearances: Math.floor(Math.random() * 6) + 4,
          rating: Number((7.0 + Math.random() * 1.5).toFixed(1)),
          transferValue: `€${Math.floor(15 + Math.random() * 50)}M`,
          age: Math.floor(Math.random() * 12) + 20, // 20 to 31
          currentClub: `${t.name} FC`,
          imageUrl: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=150&fit=crop",
          careerHistory: JSON.stringify([{ club: `${t.name} FC`, years: "2021-Present" }]),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      });
    }
  });

  return list;
};

const mockStore: MockDataStore = {
  users: [
    {
      id: "admin-user-id",
      email: "admin@footballhub.asia",
      passwordHash: "$2a$10$U35327pE8fX5X9rJjY4KVeJg0/G/cE/k0K10iHq4tV.7wKj1t75kK", // bcrypt for "adminpassword"
      role: "ADMIN",
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  teams: teamBlueprints.map(t => ({
    id: t.id,
    name: t.name,
    code: t.code,
    flagUrl: `https://flagcdn.com/w320/${t.flag}.png`,
    groupName: t.group,
    ranking: t.rank,
    form: t.form,
    coachName: t.coach,
    createdAt: new Date(),
    updatedAt: new Date()
  })),
  players: generateAllPlayers(),
  matches: [
    {
      id: "match-1",
      teamAId: "team-arg",
      teamBId: "team-fra",
      teamAScore: 2,
      teamBScore: 2,
      status: "LIVE",
      timeElapsed: 75,
      datetime: new Date(),
      venue: "Lusail Stadium, Lusail",
      stage: "Group Stage",
      groupName: "Group A",
      stats: JSON.stringify({
        possession: { teamA: 52, teamB: 48 },
        shots: { teamA: 12, teamB: 9 },
        shotsOnTarget: { teamA: 6, teamB: 5 },
        fouls: { teamA: 11, teamB: 14 },
        yellowCards: { teamA: 2, teamB: 3 },
        redCards: { teamA: 0, teamB: 0 },
        corners: { teamA: 5, teamB: 3 }
      }),
      events: JSON.stringify([
        { time: 12, type: "GOAL", team: "ARG", player: "L. Messi (Pen)", detail: "Penalty scored cleanly bottom-right." },
        { time: 35, type: "GOAL", team: "ARG", player: "J. Álvarez", detail: "Assist by L. Messi. Counter attack finish." },
        { time: 42, type: "CARD", team: "FRA", player: "O. Dembélé", detail: "Yellow card for tactical foul." },
        { time: 64, type: "GOAL", team: "FRA", player: "K. Mbappé", detail: "Assist by A. Griezmann. Volley inside the box." },
        { time: 71, type: "GOAL", team: "FRA", player: "K. Mbappé (Pen)", detail: "Penalty converted after handball." }
      ]),
      commentary: JSON.stringify([
        { time: 75, text: "Corner to Argentina. Messi floats it in, but Upamecano heads it away cleanly." },
        { time: 71, text: "GOAL! Kylian Mbappé completes the quick double! Game is level at 2-2!" },
        { time: 70, text: "PENALTY TO FRANCE! Romero blocks a shot with an outstretched arm!" },
        { time: 64, text: "GOAL! France pulls one back! Spectacular half-volley from Mbappé!" },
        { time: 45, text: "Halftime. Argentina leads 2-0 after a masterful performance by Messi." }
      ]),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "match-2",
      teamAId: "team-esp",
      teamBId: "team-ger",
      teamAScore: 3,
      teamBScore: 1,
      status: "FT",
      timeElapsed: 90,
      datetime: new Date(Date.now() - 86400000), // 1 day ago
      venue: "Al Bayt Stadium, Al Khor",
      stage: "Group Stage",
      groupName: "Group C",
      stats: JSON.stringify({
        possession: { teamA: 61, teamB: 39 },
        shots: { teamA: 18, teamB: 8 },
        shotsOnTarget: { teamA: 9, teamB: 3 },
        fouls: { teamA: 8, teamB: 12 },
        yellowCards: { teamA: 1, teamB: 2 },
        redCards: { teamA: 0, teamB: 0 },
        corners: { teamA: 7, teamB: 4 }
      }),
      events: JSON.stringify([
        { time: 8, type: "GOAL", team: "ESP", player: "L. Yamal", detail: "Stunning curler into top left corner." },
        { time: 31, type: "GOAL", team: "ESP", player: "Rodri", detail: "Low shot from outside the box." },
        { time: 55, type: "GOAL", team: "GER", player: "F. Wirtz", detail: "Tap-in after goalie rebound." },
        { time: 88, type: "GOAL", team: "ESP", player: "N. Williams", detail: "Solo run down the wing, slots it home." }
      ]),
      commentary: JSON.stringify([
        { time: 90, text: "Fulltime! Spain dominates Germany with a 3-1 win, claiming the top spot in Group C." }
      ]),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "match-por-hr",
      teamAId: "team-por",
      teamBId: "team-hr",
      teamAScore: 2,
      teamBScore: 1,
      status: "FT",
      timeElapsed: 90,
      datetime: new Date(Date.now() - 86400000), // Yesterday
      venue: "Estádio da Luz, Lisbon",
      stage: "Group Stage",
      groupName: "Group B",
      stats: JSON.stringify({
        possession: { teamA: 55, teamB: 45 },
        shots: { teamA: 14, teamB: 10 },
        shotsOnTarget: { teamA: 7, teamB: 4 },
        fouls: { teamA: 10, teamB: 12 },
        yellowCards: { teamA: 1, teamB: 2 },
        redCards: { teamA: 0, teamB: 0 },
        corners: { teamA: 6, teamB: 4 }
      }),
      events: JSON.stringify([
        { time: 7, type: "GOAL", team: "POR", player: "Cristiano Ronaldo", detail: "Incredible header from a Bruno Fernandes cross." },
        { time: 34, type: "GOAL", team: "POR", player: "Rafael Leão", detail: "Sensational solo run and finish into the bottom corner." },
        { time: 41, type: "CARD", team: "CRO", player: "Luka Modrić", detail: "Yellow card for stopping a promising counter attack." },
        { time: 72, type: "GOAL", team: "CRO", player: "Andrej Kramarić", detail: "Tap-in after a defensive rebound." }
      ]),
      commentary: JSON.stringify([
        { time: 90, text: "Full Time! Portugal wins 2-1 against Croatia in a thrilling encounter." },
        { time: 72, text: "GOAL! Kramarić scores for Croatia! Game on in Lisbon." },
        { time: 45, text: "Half Time: Portugal leads 2-0 after dominant play by Ronaldo and Leão." },
        { time: 34, text: "GOAL! Rafael Leão makes it 2-0! A sensational solo run." },
        { time: 7, text: "GOAL! Cristiano Ronaldo scores the opener! Estádio da Luz is rocking!" }
      ]),
      createdAt: new Date(Date.now() - 86400000),
      updatedAt: new Date(Date.now() - 86400000)
    },
    {
      id: "match-3",
      teamAId: "team-eng",
      teamBId: "team-bra",
      teamAScore: 0,
      teamBScore: 0,
      status: "SCHEDULED",
      timeElapsed: 0,
      datetime: new Date(Date.now() + 86400000 * 2), // 2 days later
      venue: "Education City Stadium, Al Rayyan",
      stage: "Group Stage",
      groupName: "Group B",
      stats: JSON.stringify({}),
      events: JSON.stringify([]),
      commentary: JSON.stringify([]),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: "match-4",
      teamAId: "team-mar",
      teamBId: "team-jpn",
      teamAScore: 0,
      teamBScore: 0,
      status: "SCHEDULED",
      timeElapsed: 0,
      datetime: new Date(Date.now() + 3600000 * 5), // 5 hours later
      venue: "Ahmad Bin Ali Stadium, Al Rayyan",
      stage: "Group Stage",
      groupName: "Group D",
      stats: JSON.stringify({}),
      events: JSON.stringify([]),
      commentary: JSON.stringify([]),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  news: newsData.map(n => ({
    ...n,
    createdAt: new Date(n.createdAt),
    updatedAt: new Date(n.updatedAt)
  })),
  predictions: [],
  favorites: []
};

// Background Live Simulation Engine
const commentaryTemplates = {
  GOAL: [
    "GOAL! What an extraordinary strike from distance! The keeper had absolutely no chance.",
    "GOAL! A towering header from the corner kick finds the back of the net!",
    "GOAL! A neat tap-in after a brilliant low cross from the right flank.",
    "GOAL! Penalty converted! Cool as you like, sending the goalkeeper the wrong way.",
    "GOAL! An absolute defensive disaster leads to an easy tap-in!"
  ],
  CARD: [
    "YELLOW CARD! Tactical foul to stop a dangerous counter-attack.",
    "YELLOW CARD! High-boot challenge in the midfield circle.",
    "YELLOW CARD! Caution shown for constant dissent towards the official.",
    "YELLOW CARD! Late sliding challenge that caught the opponent's ankle."
  ],
  EVENT: [
    "Foul committed in the center circle. Free kick awarded.",
    "Corner kick floated into the box, cleared away by the central defender.",
    "Shot wide! A powerful attempt from outside the box goes high and wide.",
    "Offside! The assistant referee raises the flag to stop the play.",
    "A quick counter-attack by the hosts, but the final pass is intercepted.",
    "The referee calls for a brief water break. Tactical discussions ongoing on the touchline."
  ]
};

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

function simulateLiveMatches() {
  // Ensure background simulation ticker runs exactly once
  const globalForSimulator = global as unknown as { simulatorRunning: boolean };
  if (globalForSimulator.simulatorRunning) return;
  globalForSimulator.simulatorRunning = true;

  // Let's start the background ticking loop
  setInterval(() => {
    mockStore.matches.forEach((m) => {
      if (m.status === "LIVE") {
        // Increment time elapsed by 1 minute
        m.timeElapsed = (m.timeElapsed || 0) + 1;
        m.updatedAt = new Date();

        // Parse structures
        let stats = { possession: { teamA: 50, teamB: 50 }, shots: { teamA: 0, teamB: 0 }, shotsOnTarget: { teamA: 0, teamB: 0 }, fouls: { teamA: 0, teamB: 0 }, yellowCards: { teamA: 0, teamB: 0 }, redCards: { teamA: 0, teamB: 0 }, corners: { teamA: 0, teamB: 0 } };
        let events: any[] = [];
        let commentary: any[] = [];

        try { if (m.stats) stats = JSON.parse(m.stats); } catch (e) {}
        try { if (m.events) events = JSON.parse(m.events); } catch (e) {}
        try { if (m.commentary) commentary = JSON.parse(m.commentary); } catch (e) {}

        // Increment stats slightly
        stats.possession.teamA = 50 + Math.floor(Math.sin(m.timeElapsed / 5) * 6);
        stats.possession.teamB = 100 - stats.possession.teamA;
        if (Math.random() > 0.8) stats.shots.teamA += 1;
        if (Math.random() > 0.8) stats.shots.teamB += 1;
        if (Math.random() > 0.9) stats.shotsOnTarget.teamA += 1;
        if (Math.random() > 0.9) stats.shotsOnTarget.teamB += 1;
        if (Math.random() > 0.75) stats.fouls.teamA += 1;
        if (Math.random() > 0.75) stats.fouls.teamB += 1;
        if (Math.random() > 0.85) stats.corners.teamA += 1;
        if (Math.random() > 0.85) stats.corners.teamB += 1;

        // Roll for event occurrence
        const roll = Math.random();
        if (roll > 0.97) {
          // GOAL
          const teamAScores = Math.random() > 0.5;
          const scorer = teamAScores 
            ? (mockStore.players.filter(p => p.teamId === m.teamAId)[Math.floor(Math.random() * 5)]?.name || "Striker")
            : (mockStore.players.filter(p => p.teamId === m.teamBId)[Math.floor(Math.random() * 5)]?.name || "Forward");
          
          if (teamAScores) {
            m.teamAScore++;
            stats.shotsOnTarget.teamA++;
            stats.shots.teamA++;
          } else {
            m.teamBScore++;
            stats.shotsOnTarget.teamB++;
            stats.shots.teamB++;
          }
          
          events.push({
            time: m.timeElapsed,
            type: "GOAL",
            team: teamAScores ? "HOME" : "AWAY",
            player: scorer,
            detail: teamAScores ? `Clinical strike for ${scorer}!` : `Powerful header for ${scorer}!`
          });

          commentary.unshift({
            time: m.timeElapsed,
            text: getRandomItem(commentaryTemplates.GOAL).replace("GOAL!", `GOAL for ${teamAScores ? 'Home Team' : 'Away Team'}! (${scorer})`)
          });
        } else if (roll > 0.94) {
          // CARD
          const teamACard = Math.random() > 0.5;
          const culprit = teamACard 
            ? (mockStore.players.filter(p => p.teamId === m.teamAId)[Math.floor(Math.random() * 5)]?.name || "Defender")
            : (mockStore.players.filter(p => p.teamId === m.teamBId)[Math.floor(Math.random() * 5)]?.name || "Midfielder");
          
          if (teamACard) stats.yellowCards.teamA++; else stats.yellowCards.teamB++;

          events.push({
            time: m.timeElapsed,
            type: "CARD",
            team: teamACard ? "HOME" : "AWAY",
            player: culprit,
            detail: "Yellow card caution for a late sliding tackle."
          });

          commentary.unshift({
            time: m.timeElapsed,
            text: getRandomItem(commentaryTemplates.CARD).replace("Caution shown", `Caution shown to ${culprit}`)
          });
        } else if (roll > 0.82) {
          // General text commentary event
          commentary.unshift({
            time: m.timeElapsed,
            text: getRandomItem(commentaryTemplates.EVENT)
          });
        }

        // Set finished if reaches 90
        if (m.timeElapsed >= 90) {
          m.status = "FT";
          commentary.unshift({
            time: 90,
            text: "Full Time! The referee blows the final whistle to end the match."
          });
        }

        m.stats = JSON.stringify(stats);
        m.events = JSON.stringify(events);
        m.commentary = JSON.stringify(commentary);
      }
      
      // Auto-start scheduled matches whose start time has arrived
      if (m.status === "SCHEDULED" && m.datetime && new Date(m.datetime).getTime() <= Date.now()) {
        m.status = "LIVE";
        m.timeElapsed = 0;
        m.teamAScore = 0;
        m.teamBScore = 0;
        m.events = JSON.stringify([]);
        m.commentary = JSON.stringify([
          { time: 0, text: `Kickoff! The match has officially begun at ${m.venue}.` }
        ]);
        m.stats = JSON.stringify({
          possession: { teamA: 50, teamB: 50 },
          shots: { teamA: 0, teamB: 0 },
          shotsOnTarget: { teamA: 0, teamB: 0 },
          fouls: { teamA: 0, teamB: 0 },
          yellowCards: { teamA: 0, teamB: 0 },
          redCards: { teamA: 0, teamB: 0 },
          corners: { teamA: 0, teamB: 0 }
        });
      }
    });

    // 1. Maintain at least 2 active LIVE matches
    const liveMatches = mockStore.matches.filter(m => m.status === "LIVE");
    if (liveMatches.length < 2) {
      const needed = 2 - liveMatches.length;
      for (let i = 0; i < needed; i++) {
        const idxA = Math.floor(Math.random() * mockStore.teams.length);
        let idxB = Math.floor(Math.random() * mockStore.teams.length);
        if (idxA === idxB) idxB = (idxB + 1) % mockStore.teams.length;
        const tA = mockStore.teams[idxA];
        const tB = mockStore.teams[idxB];

        const matchId = `match-auto-live-${Math.random().toString(36).substr(2, 5)}`;
        mockStore.matches.unshift({
          id: matchId,
          teamAId: tA.id,
          teamBId: tB.id,
          teamAScore: 0,
          teamBScore: 0,
          status: "LIVE",
          timeElapsed: Math.floor(Math.random() * 30), // Start at a random minute to feel natural
          datetime: new Date(),
          venue: "International Arena",
          stage: "Global Friendly Cup",
          groupName: "Friendly",
          stats: JSON.stringify({
            possession: { teamA: 50, teamB: 50 },
            shots: { teamA: 0, teamB: 0 },
            shotsOnTarget: { teamA: 0, teamB: 0 },
            fouls: { teamA: 0, teamB: 0 },
            yellowCards: { teamA: 0, teamB: 0 },
            redCards: { teamA: 0, teamB: 0 },
            corners: { teamA: 0, teamB: 0 }
          }),
          events: JSON.stringify([]),
          commentary: JSON.stringify([
            { time: 0, text: `Kickoff! The match between ${tA.name} and ${tB.name} has officially begun.` }
          ]),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    // 2. Maintain at least 3 active SCHEDULED matches
    const scheduledMatches = mockStore.matches.filter(m => m.status === "SCHEDULED");
    if (scheduledMatches.length < 3) {
      const needed = 3 - scheduledMatches.length;
      for (let i = 0; i < needed; i++) {
        const idxA = Math.floor(Math.random() * mockStore.teams.length);
        let idxB = Math.floor(Math.random() * mockStore.teams.length);
        if (idxA === idxB) idxB = (idxB + 1) % mockStore.teams.length;
        const tA = mockStore.teams[idxA];
        const tB = mockStore.teams[idxB];

        const delayMs = (5 + Math.random() * 115) * 60 * 1000;
        const kickoffTime = new Date(Date.now() + delayMs);

        mockStore.matches.push({
          id: `match-auto-sched-${Math.random().toString(36).substr(2, 5)}`,
          teamAId: tA.id,
          teamBId: tB.id,
          teamAScore: 0,
          teamBScore: 0,
          status: "SCHEDULED",
          timeElapsed: 0,
          datetime: kickoffTime,
          venue: "International Arena",
          stage: "Global Friendly Cup",
          groupName: "Friendly",
          stats: JSON.stringify({}),
          events: JSON.stringify([]),
          commentary: JSON.stringify([]),
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }
  }, 10000); // ticks every 10 seconds
}

// Mock Query Functions mimicking Prisma Client queries
export const dbMock = {
  user: {
    findUnique: async ({ where }: { where: { email?: string; id?: string } }) => {
      return mockStore.users.find(u => (where.email && u.email === where.email) || (where.id && u.id === where.id)) || null;
    },
    create: async ({ data }: { data: any }) => {
      const newUser = { id: Math.random().toString(), createdAt: new Date(), updatedAt: new Date(), ...data };
      mockStore.users.push(newUser);
      return newUser;
    }
  },
  team: {
    findMany: async (args?: any) => {
      let results = [...mockStore.teams];
      if (args?.include?.players) {
        results = results.map(t => ({
          ...t,
          players: mockStore.players.filter(p => p.teamId === t.id)
        }));
      }
      return results;
    },
    findUnique: async ({ where, include }: { where: { id?: string; name?: string; code?: string }; include?: any }) => {
      const team = mockStore.teams.find(t => 
        (where.id && t.id === where.id) || 
        (where.name && t.name === where.name) ||
        (where.code && t.code === where.code)
      );
      if (!team) return null;
      const res = { ...team };
      if (include?.players) {
        res.players = mockStore.players.filter(p => p.teamId === team.id);
      }
      if (include?.matchesAsTeamA || include?.matchesAsTeamB) {
        res.matchesAsTeamA = mockStore.matches.filter(m => m.teamAId === team.id);
        res.matchesAsTeamB = mockStore.matches.filter(m => m.teamBId === team.id);
      }
      return res;
    },
    create: async ({ data }: { data: any }) => {
      const newTeam = { id: `team-${Math.random().toString(36).substr(2, 4)}`, createdAt: new Date(), updatedAt: new Date(), ...data };
      mockStore.teams.push(newTeam);
      return newTeam;
    }
  },
  player: {
    findMany: async (args?: any) => {
      let results = [...mockStore.players];
      if (args?.where?.teamId) {
        results = results.filter(p => p.teamId === args.where.teamId);
      }
      if (args?.include?.team) {
        results = results.map(p => ({
          ...p,
          team: mockStore.teams.find(t => t.id === p.teamId)
        }));
      }
      return results;
    },
    findUnique: async ({ where, include }: { where: { id: string }; include?: any }) => {
      const player = mockStore.players.find(p => p.id === where.id);
      if (!player) return null;
      const res = { ...player };
      if (include?.team) {
        res.team = mockStore.teams.find(t => t.id === player.teamId);
      }
      return res;
    },
    create: async ({ data }: { data: any }) => {
      const newPlayer = { id: `play-${Math.random().toString(36).substr(2, 4)}`, createdAt: new Date(), updatedAt: new Date(), ...data };
      mockStore.players.push(newPlayer);
      return newPlayer;
    }
  },
  match: {
    findMany: async (args?: any) => {
      const apiKey = process.env.FOOTBALL_API_KEY || "7e46bf08406447bfa63704fbbc86acd5";
      if (apiKey) {
        try {
          const dateFrom = new Date(Date.now() - 86400000 * 3).toISOString().split('T')[0]; // 3 days ago
          const dateTo = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];   // 3 days later
          const res = await fetch(`https://api.football-data.org/v4/matches?dateFrom=${dateFrom}&dateTo=${dateTo}&competitions=WC,CL,BL1,DED,BSA,PD,FL1,ELC,PPL,EC,SA,PL`, {
            headers: { "X-Auth-Token": apiKey },
            next: { revalidate: 30 }
          });
          if (res.ok) {
            const data = await res.json();
            if (data && Array.isArray(data.matches)) {
              const realMatches = data.matches.map((m: any) => {
                let status = "SCHEDULED";
                if (m.status === "IN_PLAY" || m.status === "PAUSED") status = "LIVE";
                if (m.status === "FINISHED") status = "FT";
                
                return {
                  id: `api-match-${m.id}`,
                  teamAId: `api-team-${m.homeTeam.id}`,
                  teamBId: `api-team-${m.awayTeam.id}`,
                  teamAScore: m.score.fullTime.home ?? 0,
                  teamBScore: m.score.fullTime.away ?? 0,
                  status,
                  timeElapsed: m.status === "IN_PLAY" ? 45 : 90,
                  datetime: new Date(m.utcDate),
                  venue: m.venue || "Stadium",
                  stage: m.stage || "Group Stage",
                  groupName: m.group || "Group A",
                  stats: JSON.stringify({
                    possession: { teamA: 50, teamB: 50 },
                    shots: { teamA: 10, teamB: 10 },
                    shotsOnTarget: { teamA: 4, teamB: 4 },
                    fouls: { teamA: 10, teamB: 10 },
                    yellowCards: { teamA: 1, teamB: 1 },
                    redCards: { teamA: 0, teamB: 0 },
                    corners: { teamA: 5, teamB: 5 }
                  }),
                  events: JSON.stringify([]),
                  commentary: JSON.stringify([]),
                  teamA: {
                    id: `api-team-${m.homeTeam.id}`,
                    name: m.homeTeam.name || "TBD Team",
                    code: m.homeTeam.tla || (m.homeTeam.name ? m.homeTeam.name.substring(0, 3).toUpperCase() : "TBD"),
                    flagUrl: m.homeTeam.crest || `https://flagcdn.com/w320/un.png`
                  },
                  teamB: {
                    id: `api-team-${m.awayTeam.id}`,
                    name: m.awayTeam.name || "TBD Team",
                    code: m.awayTeam.tla || (m.awayTeam.name ? m.awayTeam.name.substring(0, 3).toUpperCase() : "TBD"),
                    flagUrl: m.awayTeam.crest || `https://flagcdn.com/w320/un.png`
                  }
                };
              });
              
              if (realMatches.length > 0) {
                if (args?.where?.status) {
                  return realMatches.filter((m: any) => m.status === args.where.status);
                }
                return realMatches;
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch real matches:", err);
        }
      }

      simulateLiveMatches();
      let results = [...mockStore.matches];
      if (args?.where?.status) {
        results = results.filter(m => m.status === args.where.status);
      }
      results = results.map(m => ({
        ...m,
        teamA: mockStore.teams.find(t => t.id === m.teamAId),
        teamB: mockStore.teams.find(t => t.id === m.teamBId)
      }));
      return results;
    },
    findUnique: async ({ where, include }: { where: { id: string }; include?: any }) => {
      const apiKey = process.env.FOOTBALL_API_KEY || "7e46bf08406447bfa63704fbbc86acd5";
      if (apiKey && where.id.startsWith("api-match-")) {
        const matchId = where.id.replace("api-match-", "");
        try {
          const res = await fetch(`https://api.football-data.org/v4/matches/${matchId}`, {
            headers: { "X-Auth-Token": apiKey },
            next: { revalidate: 15 }
          });
          if (res.ok) {
            const m = await res.json();
            let status = "SCHEDULED";
            if (m.status === "IN_PLAY" || m.status === "PAUSED") status = "LIVE";
            if (m.status === "FINISHED") status = "FT";

            return {
              id: where.id,
              teamAId: `api-team-${m.homeTeam.id}`,
              teamBId: `api-team-${m.awayTeam.id}`,
              teamAScore: m.score.fullTime.home ?? 0,
              teamBScore: m.score.fullTime.away ?? 0,
              status,
              timeElapsed: m.status === "IN_PLAY" ? 45 : 90,
              datetime: new Date(m.utcDate),
              venue: m.venue || "Stadium",
              stage: m.stage || "Group Stage",
              groupName: m.group || "Group A",
              stats: JSON.stringify({
                possession: { teamA: 50, teamB: 50 },
                shots: { teamA: 10, teamB: 10 },
                shotsOnTarget: { teamA: 4, teamB: 4 },
                fouls: { teamA: 10, teamB: 10 },
                yellowCards: { teamA: 1, teamB: 1 },
                redCards: { teamA: 0, teamB: 0 },
                corners: { teamA: 5, teamB: 5 }
              }),
              events: JSON.stringify([]),
              commentary: JSON.stringify([]),
              teamA: {
                id: `api-team-${m.homeTeam.id}`,
                name: m.homeTeam.name,
                code: m.homeTeam.tla || m.homeTeam.name.substring(0, 3).toUpperCase(),
                flagUrl: m.homeTeam.crest || `https://flagcdn.com/w320/un.png`
              },
              teamB: {
                id: `api-team-${m.awayTeam.id}`,
                name: m.awayTeam.name,
                code: m.awayTeam.tla || m.awayTeam.name.substring(0, 3).toUpperCase(),
                flagUrl: m.awayTeam.crest || `https://flagcdn.com/w320/un.png`
              }
            };
          }
        } catch (err) {
          console.error("Failed to fetch real match details:", err);
        }
      }

      simulateLiveMatches();
      const match = mockStore.matches.find(m => m.id === where.id);
      if (!match) return null;
      const res = { ...match };
      res.teamA = mockStore.teams.find(t => t.id === match.teamAId);
      res.teamB = mockStore.teams.find(t => t.id === match.teamBId);
      return res;
    },
    create: async ({ data }: { data: any }) => {
      const newMatch = { id: `match-${Math.random().toString(36).substr(2, 4)}`, createdAt: new Date(), updatedAt: new Date(), ...data };
      mockStore.matches.push(newMatch);
      return newMatch;
    },
    update: async ({ where, data }: { where: { id: string }; data: any }) => {
      const matchIndex = mockStore.matches.findIndex(m => m.id === where.id);
      if (matchIndex === -1) throw new Error("Match not found");
      
      const updated = {
        ...mockStore.matches[matchIndex],
        ...data,
        updatedAt: new Date()
      };
      
      mockStore.matches[matchIndex] = updated;
      return updated;
    }
  },
  news: {
    findMany: async (args?: any) => {
      let results = [...mockStore.news];
      if (args?.where?.trending !== undefined) {
        results = results.filter(n => n.trending === args.where.trending);
      }
      // Sort by createdAt descending
      results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      if (args?.take) {
        results = results.slice(0, args.take);
      }
      return results;
    },
    findUnique: async ({ where }: { where: { id?: string; slug?: string } }) => {
      return mockStore.news.find(n => (where.id && n.id === where.id) || (where.slug && n.slug === where.slug)) || null;
    },
    create: async ({ data }: { data: any }) => {
      const newNews = { id: `news-${Math.random().toString(36).substr(2, 4)}`, createdAt: new Date(), updatedAt: new Date(), ...data };
      mockStore.news.push(newNews);
      return newNews;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const index = mockStore.news.findIndex(n => n.id === where.id);
      if (index === -1) throw new Error("News not found");
      const deleted = mockStore.news[index];
      mockStore.news.splice(index, 1);
      return deleted;
    }
  },
  prediction: {
    findMany: async (args?: any) => {
      let results = [...mockStore.predictions];
      if (args?.where?.matchId) {
        results = results.filter(p => p.matchId === args.where.matchId);
      }
      return results;
    },
    create: async ({ data }: { data: any }) => {
      const newPred = { id: Math.random().toString(), createdAt: new Date(), ...data };
      mockStore.predictions.push(newPred);
      return newPred;
    }
  },
  favorite: {
    findMany: async (args?: any) => {
      let results = [...mockStore.favorites];
      if (args?.where?.userId) {
        results = results.filter(f => f.userId === args.where.userId);
      }
      return results;
    },
    create: async ({ data }: { data: any }) => {
      const newFav = { id: Math.random().toString(), createdAt: new Date(), ...data };
      mockStore.favorites.push(newFav);
      return newFav;
    },
    delete: async ({ where }: { where: { id: string } }) => {
      const index = mockStore.favorites.findIndex(f => f.id === where.id);
      if (index === -1) throw new Error("Favorite not found");
      const deleted = mockStore.favorites[index];
      mockStore.favorites.splice(index, 1);
      return deleted;
    }
  }
};

// Trigger simulation background ticking immediately on startup
simulateLiveMatches();

// Export active db: either Prisma Client or Mock Database
export const db = prisma ? (prisma as any) : dbMock;
