import { AiCreateTaskAccessType, AlertEchartsAccessType, AllResourceListType, MeunMapType, NoMeunMapType } from "../interfaces/rbac";

// router path
export enum PathLib {
  LOGIN = 'vs/auth/login',
  HOME = 'vs/home',
  TRAFFIC_SEARCH = 'vs/traffic-search',
  ALERT = 'vs/alert',
  FAKE_PLATE = 'vs/alert/fake-plate',
  AI_ALGORITHM = 'vs/ai-algorthm',
  TASK_MANAGEMENT = 'vs/task-management',
  TRAFFIC_FINE = 'vs/traffic-fine',
  VEHICLE_PROFILE = 'vs/vehicle-profile',
  INDEX = 'vs/index',
  MY_PROFILE = 'vs/my-profile',
  RENTAL = 'vs/rental',
  CAR_RENTAL_LIST = 'vs/rental/car-rental-list',
  CAR_RENTAL_HISTORY = 'vs/rental/car-rental-history',
  CAMERA_MAMANGERMENT = 'vs/camera-management',
}

export enum tableActionsLib {
  delete = 'delete',
  edit = 'edit',
  starter = 'starter',
  details = 'details',
}

// local all meun
export class localMeunClass {
  static readonly list = [{
    title: 'home',
    icon: 'home',
    path: PathLib.HOME,
  }, {
    title: 'traffic.search',
    icon: 'traffic-search',
    path: PathLib.TRAFFIC_SEARCH,
  }, {
    title: 'vehicle.profile',
    icon: 'menu-vehicle',
    path: PathLib.VEHICLE_PROFILE,
  }, {
    title: 'alert',
    icon: 'alert',
    path: PathLib.ALERT,
  }, {
    title: 'ai.algorthm',
    icon: 'ai',
    path: PathLib.AI_ALGORITHM,
  }, {
    title: 'task.management',
    icon: 'task',
    path: PathLib.TASK_MANAGEMENT,
  }, {
    title: 'traffic.fine',
    icon: 'traffic',
    path: PathLib.TRAFFIC_FINE,
  }, {
    title: 'rental',
    icon: 'pental',
    path: PathLib.RENTAL,
  }, {
    title: 'index',
    icon: 'index',
    path: PathLib.INDEX,
  }];
}


// meun level
export class MeunMapClass {
  static readonly map: MeunMapType = {
    'Traffic/Home': PathLib.HOME,
    'Traffic/TrafficSearch': PathLib.TRAFFIC_SEARCH,
    'Traffic/VehicleProfile': PathLib.VEHICLE_PROFILE,
    'Traffic/Alert': PathLib.ALERT,
    'Traffic/AIAlgorithmOverview': PathLib.AI_ALGORITHM,
    'Traffic/TaskManagement': PathLib.TASK_MANAGEMENT,
    'Traffic/TrafficFine': PathLib.TRAFFIC_FINE,
    'Traffic/Rental': PathLib.RENTAL,
    'Traffic/Index': PathLib.INDEX,
    'Traffic/Settings': PathLib.CAMERA_MAMANGERMENT,
    'Traffic/MyProfile': PathLib.MY_PROFILE,
  };
}

// no meun level
export class NoMeunMapClass {
  static readonly map: NoMeunMapType = {
    'Traffic/Alert/FakePlate': PathLib.FAKE_PLATE,
    'Traffic/Rental/CarRentalList': PathLib.CAR_RENTAL_LIST,
    'Traffic/Rental/CarRentalHistory': PathLib.CAR_RENTAL_HISTORY,
  };
}

// button level
export const AllResourceList: AllResourceListType = {
  'TrafficSearch': 'Traffic/TrafficSearch',
  'TrafficAlert': 'Traffic/Alert',
  'AlertFakePlate': 'Traffic/Alert/FakePlate',
  'AlertNoNumberPlate': 'Traffic/Alert/NoNumberPlate',
  'WatchListListAlerts': 'Traffic/Alert/WatchList/ListAlerts',
  'BehavioralListAlerts': 'Traffic/Alert/Behavioral/ListAlerts',
  'GeofenceListAlerts': 'Traffic/Alert/Geofence/ListAlerts',
  'BehavioralCreateTask': 'Traffic/TaskManagement/Behavioral/CreateTask',
  'BehavioralListTask': 'Traffic/TaskManagement/Behavioral/ListTask',
  'WatchListCreateTask': 'Traffic/TaskManagement/WatchList/CreateTask',
  'WatchListListTask': 'Traffic/TaskManagement/WatchList/ListTask',
  'GeofenceCreateTask': 'Traffic/TaskManagement/Geofence/CreateTask',
  'GeofenceListTask': 'Traffic/TaskManagement/Geofence/ListTask',
  'WhiteListListTask': 'Traffic/TaskManagement/WhiteList/ListTask',
  'WhiteListCreateTask': 'Traffic/TaskManagement/WhiteList/CreateTask',
  'TrafficRental': 'Traffic/Rental',
  'CarRentalList': 'Traffic/Rental/CarRentalList',
  'CarRentalHistory': 'Traffic/Rental/CarRentalHistory',
  'TrafficFineFine': 'Traffic/TrafficFine',
  'TrafficFineFineType': 'Traffic/TrafficFine/FineType',
  'TrafficFineNumberPlate': 'Traffic/TrafficFine/NumberPlate',
  'VehicleProfileOwner': 'Traffic/VehicleProfile/Owner',
  'fakePlate_details': 'Traffic/Alert/FakePlate/ListDetails',
  'noNumberPlate_delete': 'Traffic/Alert/NoNumberPlate/Delete',
  'watchList_delete': 'Traffic/Alert/WatchList/DeleteAlerts',
  'behavioral_delete': 'Traffic/Alert/Behavioral/DeleteAlerts',
  'geofenceList_delete': 'Traffic/Alert/Geofence/DeleteAlerts',
  'behavioralTaskPage_delete': 'Traffic/TaskManagement/Behavioral/DeleteTask',
  'watchListTaskPage_delete': 'Traffic/TaskManagement/WatchList/DeleteTask',
  'geofenceTaskPage_delete': 'Traffic/TaskManagement/Geofence/DeleteTask',
  'whiteListTaskPage_delete': 'Traffic/TaskManagement/WhiteList/DeleteTask',
  'behavioralTaskPage_edit': 'Traffic/TaskManagement/Behavioral/UpdateTask',
  'watchListTaskPage_edit': 'Traffic/TaskManagement/WatchList/UpdateTask',
  'geofenceTaskPage_edit': 'Traffic/TaskManagement/Geofence/UpdateTask',
  'whiteListTaskPage_edit': 'Traffic/TaskManagement/WhiteList/UpdateTask',
  'cameraList_edit': 'Traffic/CameraManagement/EditCamera',
  'cameraList_delete': 'Traffic/CameraManagement/DeleteCamera',
};

export const AiCreateTaskAccess: AiCreateTaskAccessType = {
  '1': 'Traffic/TaskManagement/WatchList/CreateTask',
  '2': 'Traffic/TaskManagement/Behavioral/CreateTask',
  '3': 'Traffic/TaskManagement/Geofence/CreateTask',
  '4': 'Traffic/TaskManagement/WhiteList/CreateTask',
};

export const AlertEchartsAccess: AlertEchartsAccessType = {
  'watchListAlerts': 'Traffic/Alert/WatchList/ListAlerts',
  'behavioralAlerts': 'Traffic/Alert/Behavioral/ListAlerts',
  'geofenceAlerts': 'Traffic/Alert/Geofence/ListAlerts',
};

export const NotPartOfTheUAE: string[] = ['Bahrain', 'Kuwait', 'Oman', 'Qatar', 'Saudi Arabia', 'Unknown'];
