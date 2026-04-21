export interface Station {
  changeuuid: string;
  stationuuid: string;
  name: string;
  url: string;
  url_resolved: string;
  homepage: string;
  favicon: string;
  tags: string;
  country: string;
  countrycode: string;
  state: string;
  language: string;
  languagecodes: string;
  votes: number;
  lastchangetime: string;
  codec: string;
  bitrate: number;
  hls: number;
  lastcheckok: number;
  lastchecktime: string;
  lastcheckoktime: string;
  lastlocalchecktime: string;
  clicktimestamp: string;
  clickcount: number;
  clicktrend: number;
  ssl_error: number;
  geo_lat: number;
  geo_long: number;
  has_extended_info: boolean;
}

export interface User {
  id: string;
  username: string;
  email: string;
  created_at: number;
}

export interface FavoriteStation {
  id: string;
  user_id: string;
  station_uuid: string;
  station_name: string;
  station_url: string;
  station_favicon: string;
  created_at: number;
}

export interface PlayHistory {
  id: string;
  user_id: string;
  station_uuid: string;
  station_name: string;
  station_url: string;
  played_at: number;
}
