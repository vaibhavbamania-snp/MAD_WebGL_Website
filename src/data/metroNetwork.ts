// Stylized schematic model of the Delhi Metro network.
// Coordinates are an artistic layout inspired by the real network's shape and
// interchange topology — not literal survey/GPS data. y = 0 is street grade;
// negative y is underground, positive y is an elevated viaduct.

export type Vec3 = [number, number, number];

export interface Station {
  id: string;
  name: string;
  /** [x, y, z] scene position */
  pos: Vec3;
  lines: LineId[];
}

export type LineId = "yellow" | "blue" | "red" | "violet" | "green" | "pink";

export interface MetroLine {
  id: LineId;
  name: string;
  color: string;
  /** ordered station ids describing the route */
  stationIds: string[];
}

export const stations: Station[] = [
  // ---- Yellow line (north–south spine) ----
  { id: "samaypur-badli", name: "Samaypur Badli", pos: [0, 2.6, -34], lines: ["yellow"] },
  { id: "jahangirpuri", name: "Jahangirpuri", pos: [1, 2.6, -28], lines: ["yellow"] },
  { id: "vishwavidyalaya", name: "Vishwavidyalaya", pos: [0.5, -4.2, -18], lines: ["yellow"] },
  { id: "kashmere-gate", name: "Kashmere Gate", pos: [0, -4.4, -10], lines: ["yellow", "red", "violet"] },
  { id: "chandni-chowk", name: "Chandni Chowk", pos: [0, -4.4, -6], lines: ["yellow"] },
  { id: "chawri-bazar", name: "Chawri Bazar", pos: [0, -4.4, -3], lines: ["yellow"] },
  { id: "rajiv-chowk", name: "Rajiv Chowk", pos: [0, -4.6, 0], lines: ["yellow", "blue"] },
  { id: "patel-chowk", name: "Patel Chowk", pos: [0.5, -4.4, 4], lines: ["yellow"] },
  { id: "central-secretariat", name: "Central Secretariat", pos: [1, -4.2, 8], lines: ["yellow", "violet"] },
  { id: "ina", name: "INA", pos: [1.5, -3, 14], lines: ["yellow"] },
  { id: "aiims", name: "AIIMS", pos: [2, 2.6, 18], lines: ["yellow"] },
  { id: "hauz-khas", name: "Hauz Khas", pos: [2, 2.8, 22], lines: ["yellow"] },
  { id: "malviya-nagar", name: "Malviya Nagar", pos: [2, 2.8, 26], lines: ["yellow"] },
  { id: "huda-city-centre", name: "HUDA City Centre", pos: [2, 2.8, 34], lines: ["yellow"] },

  // ---- Blue line (east–west) ----
  { id: "dwarka-sec21", name: "Dwarka Sec-21", pos: [-34, 2.8, 5], lines: ["blue"] },
  { id: "dwarka-mor", name: "Dwarka Mor", pos: [-27, 2.8, 4], lines: ["blue"] },
  { id: "rajouri-garden", name: "Rajouri Garden", pos: [-16, 2.8, 2], lines: ["blue", "pink"] },
  { id: "karol-bagh", name: "Karol Bagh", pos: [-8, 2.6, 1], lines: ["blue"] },
  { id: "barakhamba-road", name: "Barakhamba Road", pos: [6, -4.4, -1], lines: ["blue"] },
  { id: "mandi-house", name: "Mandi House", pos: [12, -4.4, -1.5], lines: ["blue", "violet"] },
  { id: "indraprastha", name: "Indraprastha", pos: [18, -4.2, -2], lines: ["blue"] },
  { id: "yamuna-bank", name: "Yamuna Bank", pos: [24, 2.6, -2.5], lines: ["blue"] },
  { id: "laxmi-nagar", name: "Laxmi Nagar", pos: [29, 2.6, -2.5], lines: ["blue"] },
  { id: "noida-sec15", name: "Noida Sec-15", pos: [35, 2.6, -3], lines: ["blue"] },

  // ---- Red line (northwest–east) ----
  { id: "rithala", name: "Rithala", pos: [-31, 2.6, -21], lines: ["red"] },
  { id: "netaji-subhash-place", name: "Netaji Subhash Place", pos: [-21, 2.6, -17], lines: ["red", "pink"] },
  { id: "kohat-enclave", name: "Kohat Enclave", pos: [-14, 2.6, -14], lines: ["red"] },
  { id: "inderlok", name: "Inderlok", pos: [-8, 2.6, -12], lines: ["red", "green"] },
  { id: "welcome", name: "Welcome", pos: [8, 2.6, -13], lines: ["red"] },
  { id: "shahdara", name: "Shahdara", pos: [17, 2.6, -15], lines: ["red"] },
  { id: "shaheed-sthal", name: "Shaheed Sthal", pos: [27, 2.6, -19], lines: ["red"] },

  // ---- Violet line ----
  { id: "ito", name: "ITO", pos: [5, -4.4, -5], lines: ["violet"] },
  { id: "lajpat-nagar", name: "Lajpat Nagar", pos: [7, 2.8, 16], lines: ["violet", "pink"] },
  { id: "escorts-mujesar", name: "Escorts Mujesar", pos: [11, 2.8, 24], lines: ["violet"] },
  { id: "raja-nahar-singh", name: "Raja Nahar Singh", pos: [15, 2.8, 31], lines: ["violet"] },

  // ---- Green line (isolated spur off Red) ----
  { id: "ashok-park-main", name: "Ashok Park Main", pos: [-14, 2.6, -12], lines: ["green"] },
  { id: "punjabi-bagh", name: "Punjabi Bagh", pos: [-20, 2.6, -11], lines: ["green"] },
  { id: "peera-garhi", name: "Peera Garhi", pos: [-26, 2.6, -10], lines: ["green"] },
  { id: "mundka", name: "Mundka", pos: [-34, 2.6, -9], lines: ["green"] },

  // ---- Pink line (outer arc) ----
  { id: "majlis-park", name: "Majlis Park", pos: [-11, 2.8, -29], lines: ["pink"] },
  { id: "trilokpuri", name: "Trilokpuri", pos: [21, 2.8, 11], lines: ["pink"] },
  { id: "shiv-vihar", name: "Shiv Vihar", pos: [30, 2.8, -7], lines: ["pink"] },
];

export const lines: MetroLine[] = [
  {
    id: "yellow",
    name: "Yellow Line",
    color: "#ffd400",
    stationIds: [
      "samaypur-badli", "jahangirpuri", "vishwavidyalaya", "kashmere-gate",
      "chandni-chowk", "chawri-bazar", "rajiv-chowk", "patel-chowk",
      "central-secretariat", "ina", "aiims", "hauz-khas", "malviya-nagar", "huda-city-centre",
    ],
  },
  {
    id: "blue",
    name: "Blue Line",
    color: "#2f8dff",
    stationIds: [
      "dwarka-sec21", "dwarka-mor", "rajouri-garden", "karol-bagh", "rajiv-chowk",
      "barakhamba-road", "mandi-house", "indraprastha", "yamuna-bank", "laxmi-nagar", "noida-sec15",
    ],
  },
  {
    id: "red",
    name: "Red Line",
    color: "#ff2f4f",
    stationIds: [
      "rithala", "netaji-subhash-place", "kohat-enclave", "inderlok", "kashmere-gate",
      "welcome", "shahdara", "shaheed-sthal",
    ],
  },
  {
    id: "violet",
    name: "Violet Line",
    color: "#a04dff",
    stationIds: [
      "kashmere-gate", "ito", "central-secretariat", "mandi-house", "lajpat-nagar",
      "escorts-mujesar", "raja-nahar-singh",
    ],
  },
  {
    id: "green",
    name: "Green Line",
    color: "#1fe07a",
    stationIds: ["inderlok", "ashok-park-main", "punjabi-bagh", "peera-garhi", "mundka"],
  },
  {
    id: "pink",
    name: "Pink Line",
    color: "#ff3fb0",
    stationIds: [
      "majlis-park", "netaji-subhash-place", "rajouri-garden", "lajpat-nagar",
      "trilokpuri", "shiv-vihar",
    ],
  },
];

export const stationById = new Map(stations.map((s) => [s.id, s]));

export const interchanges = stations.filter((s) => s.lines.length > 1);

/** The route MAD "predicts" through the underground core — used by the hero train + camera. */
export const predictedJourney = [
  "aiims", "ina", "central-secretariat", "rajiv-chowk", "chawri-bazar",
  "chandni-chowk", "kashmere-gate", "vishwavidyalaya", "jahangirpuri",
];
