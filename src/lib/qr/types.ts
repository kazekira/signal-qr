export type PayloadKind = "url" | "text" | "wifi" | "vcard" | "email" | "sms";
export type EccLevel = "L" | "M" | "Q" | "H";
export type PresetId = "invert" | "void" | "signal" | "cyan" | "magenta";
export type ModuleShape = "square" | "soft";

export type WifiAuth = "WPA" | "WEP" | "nopass";

export type PayloadFields = {
  url: string;
  text: string;
  wifiSsid: string;
  wifiPass: string;
  wifiAuth: WifiAuth;
  wifiHidden: boolean;
  cardName: string;
  cardOrg: string;
  cardPhone: string;
  cardEmail: string;
  cardUrl: string;
  emailTo: string;
  emailSubject: string;
  emailBody: string;
  smsTo: string;
  smsBody: string;
};

export type EncoderState = {
  kind: PayloadKind;
  fields: PayloadFields;
  preset: PresetId;
  ecc: EccLevel;
  quietZone: number;
  modulePx: number;
  shape: ModuleShape;
};

export const DEFAULT_FIELDS: PayloadFields = {
  url: "https://api.radprotocol.dev",
  text: "Trust nothing. Verify everything.",
  wifiSsid: "rad-edge",
  wifiPass: "",
  wifiAuth: "WPA",
  wifiHidden: false,
  cardName: "",
  cardOrg: "RAD Protocol",
  cardPhone: "",
  cardEmail: "",
  cardUrl: "https://radprotocol.dev",
  emailTo: "",
  emailSubject: "",
  emailBody: "",
  smsTo: "",
  smsBody: "",
};

export const DEFAULT_ENCODER: EncoderState = {
  kind: "url",
  fields: DEFAULT_FIELDS,
  preset: "invert",
  ecc: "M",
  quietZone: 2,
  modulePx: 8,
  shape: "square",
};
