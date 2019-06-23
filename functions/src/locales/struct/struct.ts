interface LocalizationObject<T> {
  [key: string]: T;
  en: T;
  ru: T;
}

export interface WordForms {
  [key: string]: string;
  mus?: string;
  fem?: string;
  sin?: string;
  plr?: string;
  imn?: string;
  rod?: string;
  dat?: string;
  vin?: string;
  prd?: string;
  'mus/sin'?: string;
  'fem/sin'?: string;
  'mus/plr'?: string;
  'fem/plr'?: string;
  'mus/imn'?: string;
  'fem/imn'?: string;
  'mus/vin'?: string;
  'fem/vin'?: string;
  'mus/rod'?: string;
  'fem/rod'?: string;
  'mus/tvr'?: string;
  'fem/tvr'?: string;
  'sin/rod'?: string;
  'plr/rod'?: string;
  'plr/tvr'?: string;
  'fem/sin/rod'?: string;
  'mus/sin/rod'?: string;
  'fem/plr/rod'?: string;
  'mus/plr/rod'?: string;
  'fem/plr/tvr'?: string;
  'mus/plr/tvr'?: string;
  'fem/plr/vin'?: string;
  'mus/plr/vin'?: string;
}

export type Langs = LocalizationObject<string>;
export type rLangs = LocalizationObject<string[]>;
