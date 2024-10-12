export class OutLoginParams {
  access_token!: string;
  token_type!: string;
  session_state!: string;
  refresh_expires_in!: string;
  expires_in!: string;
  refresh_token!: string;
  username!: string;
}

export interface SsoLoginRes {
  result?: OutLoginParams;
  code?: string;
  message?: string;
}

export interface LogoutParams {
  refreshToken: string;
}

export class LogoutResponse {
  result!: LogoutResponseResult;
  code!: string;
  message!: string;
}

export class loginResponseResult {
  access_token?: string;
  token_type?: string;
  session_state?: string;
  refresh_expires_in?: string;
  expires_in?: string;
  refresh_token?: string;
  user_name?: string;
}

export class LogoutResponseResult {
  code!: string;
}

export class RefreshTokenResponse {
  code!: string;
  message!: string;
  result!: loginResponseResult;
}
export class RefreshTokenResult {
  access_token?: string;
  token_type?: string;
  session_state?: string;
  refresh_expires_in?: string;
  expires_in?: string;
  refresh_token?: string;
}

export class MeunListResponse {
  code!: string;
  message!: string;
  result!: {
    permittedModuleInfo: {
      TRAFFIC: Array<TRAFFICMenuList>
    }
  };
}

export class TRAFFICMenuList {
  moduleType!: string;
  id!: string;
  resourceName!: string;
  uriSet!: string;
}

export interface localMeunListType {
  title: string;
  icon: string;
  path: string;
  show?: boolean;
}

export interface MeunMapType {
  'Traffic/Home': string;
  'Traffic/TrafficSearch': string;
  'Traffic/VehicleProfile': string;
  'Traffic/Alert': string;
  'Traffic/AIAlgorithmOverview': string;
  'Traffic/TaskManagement': string;
  'Traffic/TrafficFine': string;
  'Traffic/Rental': string;
  'Traffic/Index': string;
  'Traffic/Settings': string;
  'Traffic/MyProfile': string;
}

export interface NoMeunMapType {
  'Traffic/Alert/FakePlate': string;
  'Traffic/Rental/CarRentalList': string;
  'Traffic/Rental/CarRentalHistory': string;
}

export class AllResourceListType {
  'TrafficSearch': string;
  'TrafficAlert': string;
  'AlertFakePlate': string;
  'AlertNoNumberPlate': string;
  'WatchListListAlerts': string;
  'BehavioralListAlerts': string;
  'GeofenceListAlerts': string;
  'BehavioralCreateTask': string;
  'BehavioralListTask': string;
  'WatchListCreateTask': string;
  'WatchListListTask': string;
  'GeofenceCreateTask': string;
  'GeofenceListTask': string;
  'WhiteListListTask': string;
  'WhiteListCreateTask': string;
  'TrafficRental': string;
  'CarRentalList': string;
  'CarRentalHistory': string;
  'TrafficFineFine': string;
  'TrafficFineFineType': string;
  'TrafficFineNumberPlate': string;
  'VehicleProfileOwner': string;
  'fakePlate_details': string;
  'noNumberPlate_delete': string;
  'watchList_delete': string;
  'behavioral_delete': string;
  'geofenceList_delete': string;
  'behavioralTaskPage_delete'!: string;
  'watchListTaskPage_delete': string;
  'geofenceTaskPage_delete': string;
  'whiteListTaskPage_delete': string;
  'behavioralTaskPage_edit'!: string;
  'watchListTaskPage_edit': string;
  'geofenceTaskPage_edit': string;
  'whiteListTaskPage_edit': string;
  'cameraList_edit': string;
  'cameraList_delete': string;
}

export class AiCreateTaskAccessType {
  '1'!: string;
  '2'!: string;
  '3'!: string;
  '4'!: string;
}

export class AlertEchartsAccessType {
  watchListAlerts!: string;
  behavioralAlerts!: string;
  geofenceAlerts!: string;
}
