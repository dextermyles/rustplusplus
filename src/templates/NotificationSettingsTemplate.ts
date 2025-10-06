export interface NotificationSettingsTemplate {
  cargoShipDetectedSetting: CargoShipDetectedSetting
  cargoShipLeftSetting: CargoShipLeftSetting
  cargoShipEgressSetting: CargoShipEgressSetting
  cargoShipDockingAtHarborSetting: CargoShipDockingAtHarborSetting
  patrolHelicopterDetectedSetting: PatrolHelicopterDetectedSetting
  patrolHelicopterLeftSetting: PatrolHelicopterLeftSetting
  patrolHelicopterDestroyedSetting: PatrolHelicopterDestroyedSetting
  lockedCrateOilRigUnlockedSetting: LockedCrateOilRigUnlockedSetting
  heavyScientistCalledSetting: HeavyScientistCalledSetting
  chinook47DetectedSetting: Chinook47DetectedSetting
  travelingVendorDetectedSetting: TravelingVendorDetectedSetting
  travelingVendorHaltedSetting: TravelingVendorHaltedSetting
  travelingVendorLeftSetting: TravelingVendorLeftSetting
  vendingMachineDetectedSetting: VendingMachineDetectedSetting
}

export interface CargoShipDetectedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface CargoShipLeftSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface CargoShipEgressSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface CargoShipDockingAtHarborSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface PatrolHelicopterDetectedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface PatrolHelicopterLeftSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface PatrolHelicopterDestroyedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface LockedCrateOilRigUnlockedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface HeavyScientistCalledSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface Chinook47DetectedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface TravelingVendorDetectedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface TravelingVendorHaltedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface TravelingVendorLeftSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}

export interface VendingMachineDetectedSetting {
  image: string
  discord: boolean
  inGame: boolean
  voice: boolean
}
