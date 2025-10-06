export interface GeneralSettingsTemplate {
  language: string
  voiceGender: string
  prefix: string
  muteInGameBotMessages: boolean
  trademark: string
  inGameCommandsEnabled: boolean
  fcmAlarmNotificationEnabled: boolean
  fcmAlarmNotificationEveryone: boolean
  smartAlarmNotifyInGame: boolean
  smartSwitchNotifyInGameWhenChangedFromDiscord: boolean
  leaderCommandEnabled: boolean
  leaderCommandOnlyForPaired: boolean
  commandDelay: number
  connectionNotify: boolean
  afkNotify: boolean
  deathNotify: boolean
  mapWipeNotifyEveryone: boolean
  itemAvailableInVendingMachineNotifyInGame: boolean
  displayInformationBattlemetricsAllOnlinePlayers: boolean
  battlemetricsServerNameChanges: boolean
  battlemetricsTrackerNameChanges: boolean
  battlemetricsGlobalNameChanges: boolean
  battlemetricsGlobalLogin: boolean
  battlemetricsGlobalLogout: boolean
  rusticatedWipeId: number
}
