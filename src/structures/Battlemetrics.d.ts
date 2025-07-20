export interface BattleMetricsServerResponseDto {
  data: BattleMetricsData2;
  included: Included[];
}

export interface BattleMetricsIncluded {
  type: string;
  id: string;
  attributes: BattleMetricsAttributes2;
  relationships: BattleMetricsRelationships2;
  meta: Meta;
}

export interface BattleMetricsMeta {
  metadata: Metadatum[];
}

export interface BattleMetricsMetadatum {
  key: string;
  value: boolean;
  private: boolean;
}

export interface BattleMetricsRelationships2 {
  server: BattleMetricsGame;
}

export interface BattleMetricsAttributes2 {
  id: string;
  name: string;
  private: boolean;
  positiveMatch: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BattleMetricsData2 {
  type: string;
  id: string;
  attributes: BattleMetricsAttributes;
  relationships: Relationships;
}

export interface BattleMetricsRelationships {
  game: BattleMetricsGame;
}

export interface BattleMetricsGame {
  data: Data;
}

export interface BattleMetricsData {
  type: string;
  id: string;
}

export interface BattleMetricsAttributes {
  id: string;
  name: string;
  address: string;
  ip: string;
  port: number;
  players: number;
  maxPlayers: number;
  rank: number;
  location: number[];
  status: string;
  details: Details;
  private: boolean;
  createdAt: string;
  updatedAt: string;
  portQuery: number;
  country: string;
  queryStatus: string;
}

interface Details {
  tags: string[];
  official: boolean;
  rust_type: string;
  map: string;
  environment: string;
  rust_build: string;
  rust_ent_cnt_i: number;
  rust_fps: number;
  rust_fps_avg: number;
  rust_gc_cl: number;
  rust_gc_mb: number;
  rust_hash: string;
  rust_headerimage: string;
  rust_mem_pv: null;
  rust_mem_ws: null;
  pve: boolean;
  rust_uptime: number;
  rust_url: string;
  rust_world_seed: number;
  rust_world_size: number;
  rust_world_levelurl: string;
  rust_maps: Rustmaps;
  rust_description: string;
  rust_modded: boolean;
  rust_queued_players: number;
  rust_gamemode: string;
  rust_premium: boolean;
  rust_born: string;
  rust_last_ent_drop: string;
  rust_last_seed_change: string;
  rust_last_wipe: string;
  rust_last_wipe_ent: number;
  rust_settings_source: string;
  rust_settings: Rustsettings;
  rust_wipes: Rustwipe[];
  rust_next_wipe: string;
  rust_next_wipe_map: string;
  rust_next_wipe_bp: string;
  rust_next_wipe_full: string;
  serverSteamId: string;
}

export interface BattleMetricsRustwipe {
  type: string;
  timestamp: string;
}

export interface BattleMetricsRustsettings {
  upkeep: number;
  blueprints: boolean;
  forceWipeType: string;
  groupLimit: number;
  teamUILimit: number;
  kits: boolean;
  rates: Rates;
  wipes: Wipe[];
  decay: number;
  timeZone: string;
  version: number;
}

export interface BattleMetricsWipe {
  days: string[];
  hour: number;
  minute: number;
  type: string;
  weeks: number[];
}

export interface BattleMetricsRates {
  component: number;
  craft: number;
  gather: number;
  scrap: number;
}

export interface BattleMetricsRustmaps {
  seed: number;
  size: number;
  url: string;
  thumbnailUrl: string;
  monumentCount: number;
  barren: boolean;
  updatedAt: string;
  mapUrl: string;
  biomePercentages: BiomePercentages;
  islands: number;
  mountains: number;
  iceLakes: number;
  rivers: number;
  monumentCounts: MonumentCounts;
  monuments: string[];
}

export interface BattleMetricsMonumentCounts {
  Canyon: number;
  Lake: number;
  Oasis: number;
  'Large Harbor': number;
  'Ferry Terminal': number;
  'Small Harbor': number;
  'Fishing Village': number;
  'Military Base': number;
  'Arctic Research Base': number;
  Airfield: number;
  Excavator: number;
  'Launch Site': number;
  'Military Tunnels': number;
  Trainyard: number;
  'Water Treatment': number;
  Outpost: number;
  'Nuclear Missile Silo': number;
  'Sphere Tank': number;
  Junkyard: number;
  Ranch: number;
  Powerplant: number;
  'Sewer Branch': number;
  'Satellite Dish': number;
  'Hqm Quarry': number;
  'Sulfur Quarry': number;
  'Stone Quarry': number;
  'Tunnel Entrance': number;
  'Water Well': number;
  Ruin: number;
  'Ice Lake': number;
  'Gas Station': number;
  Warehouse: number;
  Radtown: number;
  Supermarket: number;
  'Power Substation Small': number;
  'Power Substation Big': number;
  Powerline: number;
  'Cave Small Medium': number;
  'Cave Large Hard': number;
  'Cave Medium Hard': number;
  'Cave Small Easy': number;
  'Cave Medium Easy': number;
  'Cave Medium Medium': number;
  'Cave Small Hard': number;
  'Underwater Lab': number;
  'Anvil Rock': number;
  'Large God Rock': number;
  '3 Wall Rock': number;
  'Medium God Rock': number;
  'Tiny God Rock': number;
  'Small Oilrig': number;
  'Large Oilrig': number;
  Lighthouse: number;
  Iceberg: number;
}

export interface BattleMetricsBiomePercentages {
  s: number;
  d: number;
  f: number;
  t: number;
  j: number;
}