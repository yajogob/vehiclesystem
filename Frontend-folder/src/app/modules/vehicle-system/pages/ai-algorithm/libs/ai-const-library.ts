import { KeyValueType } from "../../../interfaces/key-value-type";

export interface I18nKeyValueMap {
  [key: string]: KeyValueType;
}

/**
 *  const
 * @export
 * @class AiConstLibrary
 */
export class AiConstLibrary {
  public static readonly taskStopped = 'vs.public.taskStopped';
  public static readonly taskDeleted = 'vs.public.taskDeleted';
  public static readonly recordDeleted = 'vs.public.recordDeleted';
  public static readonly taskEdited = 'vs.public.taskEdited';
  public static readonly taskStarted = 'vs.public.taskStarted';
  public static readonly taskEditeFailure = 'vs.public.taskEditeFailure';
  public static readonly taskDeleteFailure = 'vs.public.taskDeleteFailure';
  public static readonly taskStopFailure = 'vs.public.taskStopFailure';
  public static readonly taskStartFailure = 'vs.public.taskStartFailure';
  public static readonly taskExpired = 'vs.public.taskExpired';
  public static readonly taskCreated = 'vs.public.taskCreated';
  public static readonly taskCreateFailure = 'vs.public.taskCreateFailure';
  public static readonly alertDeleted = 'vs.public.alertDeleted';
  public static readonly alertDeleteFailure = 'vs.public.alertDeleteFailure';
  public static readonly deleteAlertTipsInfo = 'vs.public.deleteAlertTipsInfo';

  public static readonly taskCycleExpiredCode = 'GEOFENCETASK_SUBSCRIBE_TASK_END_DATE_EXPIRED';

  public static readonly operateSuccess = 'operate success';
  public static readonly saveSuccess = 'save success';
  public static readonly deleteSuccess = 'delete success';
  public static readonly behavioral = 'behavioral';
  public static readonly watchList = 'watchList';
  public static readonly geofenceList = 'geofenceList';
  public static readonly whiteList = 'whiteList';
  public static readonly gpuLpr = 'gpuLpr';
  public static readonly createTask = 'createTask';
  public static readonly delete = 'delete';
  public static readonly edit = 'edit';
  public static readonly alert = 'alert';
  public static readonly starter = 'starter';
  public static readonly en = 'en';
  public static readonly ar = 'ar';
  public static readonly lprRegion = 'LprRegion';
  public static readonly lprPlateColor = 'LprPlateColor';
  public static readonly lprCategory = 'LprCategory';
  public static readonly lprTaskLevel = 'LprTaskLevel';

  public static readonly lprWhitelistStatus = 'LprWhitelistStatus';
  public static readonly lprGPUAlgorithmTaskStatus = 'LprGPUAlgorithmTaskStatus';
  public static readonly gpuStatusCssMap = {
    '0': 'failed',
    '1': 'inprogress',
    '4': 'inline',
    '5': 'stopped',
  };

  public static readonly allTaskList = [
    {key: 'Behavioral Task', value: 'behavioral'},
    {key: 'WatchList Task', value: 'watchList'},
    {key: 'Geofence Task', value: 'geofenceList'},
    {key: 'WhiteList Task', value: 'whiteList'},
    {key: 'GPU LPR Task', value: 'gpuLpr'},
  ];

  public static readonly taskCycleList = [
    {key: 'Day', value: 'day'},
    {key: 'Week', value: 'week'},
    {key: 'Month', value: 'month'},
    {key: 'Customize', value: 'customize'},
  ];

  public static readonly posObj = {
    '1': '-3rem',
    '2': '-2.5rem',
    '3': '-1.7rem',
  };

  public static readonly algorithNameI18nMap:I18nKeyValueMap = {
    'view-more': {
      'en': 'View more Algorithms',
      'ar': 'عرض المزيد من الخوارزميات',
    },
    'g42_animal_crossing_detection_composition_v1': {
      'en': 'Animal Crossing Detection',
      'ar': 'كشف عبور الحيوانات',
    },
    'g42_detect_littering_vehicle_composition_v1': {
      'en': 'Detecting Vehicle Littering',
      'ar': 'رمي المخلفات من المركبة',
    },
    'g42_detect_taxi_drivers_using_fast_lane_composition_v1': {
      'en': 'Taxi Drivers using Fast Lane',
      'ar': 'استخدام الخط السريع (تاكسي)',
    },
    'g42_jaywalking_pedestrians_composition_v1': {
      'en': 'Jaywalking Pedestrians Detection',
      'ar': 'عبور المشاه',
    },
    'g42_seat_belt_not_fastened_driver_or_front_passenger_composition_v1': {
      'en': 'Seat Belt Not Fastened Driver or Front Passenger',
      'ar': 'عدم ربط حزام الأمان للسائق أو الراكب الأمامي',
    },
    'g42_stopped_car_unallowed_places_composition_v1': {
      'en': 'Stopped Car at Unallowed Places',
      'ar': 'إيقاف السيارة في أماكن غير مسموح بها',
    },
    'g42_sudden_lane_change_composition_v1': {
      'en': 'Vehicle Sudden Lane Change',
      'ar': 'انحراف مفاجئ',
    },
    'g42_using_3wheel_bike_road_composition_v1': {
      'en': '3wheels vehicle using on road',
      'ar': 'مركبة ذات 3 عجلات',
    },
    'g42_using_lights_while_driving_inside_tunnels_composition_v1': {
      'en': 'Vehicle Using Lights While Driving Inside Tunnels',
      'ar': 'استخدام المركبات للأضواء أثناء القيادة داخل الأنفاق',
    },
    'g42_vehicle_safe_distance_front_vehicle_composition_v1': {
      'en': 'Vehicle Safe Distance from Front Vehicle',
      'ar': 'عدم ترك مسافة آمنه بين المركبات',
    },
    'g42_vehicle_smoke_detection_composition_v1': {
      'en': 'Vehicle Smoke Detection',
      'ar': 'كشف دخان السيارة',
    },
    'g42_vehicle_without_back_plate_composition_v1': {
      'en': 'Vehicle Without Back Plate Detection',
      'ar': 'مركبة بدون أرقام خلفية',
    },
    'g42_voilation_giving_priority_to_official_or_emergency_vehicles_composition_v1': {
      'en': 'Official Or Emergency Priority Vehicles',
      'ar': 'اولوية المركبات الرسمية و مركبات الطوارئ',
    },
    'g42_voilation_giving_priority_to_the_vehicles_which_on_the_main_road_composition_v1': {
      'en': 'Priority Vehicles which on the main road',
      'ar': 'افساح الطريق لمركبات الطوارئ',
    },
    'g42_voilation_pedestrians_not_adhering_to_traffic_signals_composition_v1': {
      'en': 'Pedestrians not adhering to traffic signals',
      'ar': 'عدم التزام المشاة بإشارات المرور',
    },
    'g42_voilation_smoking_while_driving_composition_v1': {
      'en': 'Voilation Smoking While Driving Detection',
      'ar': 'كشف مخالفات التدخين أثناء القيادة',
    },
    'yitu_behavior_event_ABNORMAL_PARK_composition_v1': {
      'en': 'Illegal parking detection',
      'ar': 'موقف غير قانوني',
    },
    'yitu_behavior_event_CAR_CROSSS_LINE_composition_v1': {
      'en': 'Motor Vehicle Driving Across Lanes Detection',
      'ar': 'كشف قيادة المركبة عبر خطوط المسارات',
    },
    'yitu_behavior_event_CAR_INTRUSION_composition_v1': {
      'en': 'Car Intrusion',
      'ar': 'اقتحام السيارة',
    },
    'yitu_behavior_event_CAR_PARK_composition_v1': {
      'en': 'Illegal Parking',
      'ar': 'موقف غير قانوني',
    },
    'yitu_behavior_event_CAR_WRONG_WAY_composition_v1': {
      'en': 'Counter Flow of Motor Vehicles',
      'ar': 'تدفق المركبات',
    },
    'yitu_behavior_event_CYCLING_WITHOUT_HEADPIECE_composition_v1': {
      'en': 'Riders Without Helmet',
      'ar': 'عدم ارتداء خوذة الحماية',
    },
    'yitu_behavior_event_EMERGENCY_LANE_OCCUPANCY_composition_v1': {
      'en': 'Occupied Emergency Lane Detection',
      'ar': 'استخدام خط الطوارئ',
    },
    'yitu_behavior_event_LINE_COUNT_CAR_composition_v1': {
      'en': 'Motor Vehicle Count by Tripwire',
      'ar': 'عد المركبات من خلال وضع خط',
    },
    'yitu_behavior_event_LINE_COUNT_NON_MOTOR_VEHICLE_composition_v1': {
      'en': 'Non-motor Vehicle Count by Tripwire',
      'ar': 'عد المركبات بدون محرك من خلال وضع خط',
    },
    'yitu_behavior_event_NON_MOTOR_PARK_composition_v1': {
      'en': 'Illegal Parking of Non-motor Vehicles',
      'ar': 'موقف غير قانوني للمركبات بدون مجرك',
    },
    'g42_voilation_taxi_fast_lane_composition_v1': {
      'en': 'Taxi fast lane',
      'ar': 'تاكسي في الخط السريع',
    },
  };

  public static readonly algorithDescriptionI18nMap:I18nKeyValueMap = {
    'g42_animal_crossing_detection_composition_v1': {
      'en': 'Recognize animal crossing appear in videos or images',
      'ar': 'التعرف على عبور الحيوانات من مقاطع الفيديو أو الصور',
    },
    'g42_detect_littering_vehicle_composition_v1': {
      'en': 'Recognize Vehicle Littering appear in videos or images',
      'ar': 'التعرف على رمي مخلفات المركبات من مقاطع الفيديو أو الصور',
    },
    'g42_detect_taxi_drivers_using_fast_lane_composition_v1': {
      'en': 'Recognize taxi drivers using fast lane appear in videos or images',
      'ar': 'التعرف على سائقي سيارات الأجرة الذين يستخدمون الخط السريع  من مقاطع الفيديو أو الصور',
    },
    'g42_jaywalking_pedestrians_composition_v1': {
      'en': 'Recognize jaywalking pedestrians appear in videos or images',
      'ar': 'التعرف على عبور المشاة من مقاطع الفيديو أو الصور',
    },
    'g42_seat_belt_not_fastened_driver_or_front_passenger_composition_v1': {
      'en': 'Recognize seat belt fastening driver or front passanger appear in videos or images',
      'ar': 'التعرف على ارتداء حزام الأمان للسائق أو الراكب الأمامي من مقاطع الفيديو أو الصور',
    },
    'g42_stopped_car_unallowed_places_composition_v1': {
      'en': 'Recognize Stopped Car at Unallowed Places appear in videos or images',
      'ar': 'التعرف على السيارة المتوقفة في الأماكن غير المسموح بها من مقاطع الفيديو أو الصور',
    },
    'g42_sudden_lane_change_composition_v1': {
      'en': 'Recognize vehicle sudden lane change appear in videos or images',
      'ar': 'التعرف على التغيير المفاجئ في مسار السيارة من مقاطع الفيديو أو الصور',
    },
    'g42_using_3wheel_bike_road_composition_v1': {
      'en': 'Recognize 3 wheels bike using on road appear in videos or images',
      'ar': 'التعرف على دراجة ثلاثية العجلات تستخدم الطريق تظهر من مقاطع الفيديو أو الصور',
    },
    'g42_using_lights_while_driving_inside_tunnels_composition_v1': {
      'en': 'Recognize vehicles using lights while driving inside tunnels appear in videos or images',
      'ar': 'التعرف على المركبات التي تستخدم الأضواء أثناء القيادة داخل الأنفاق من مقاطع الفيديو أو الصور',
    },
    'g42_vehicle_safe_distance_front_vehicle_composition_v1': {
      'en': 'Recognize vehicle safe distance from front vehicle appear in videos or images',
      'ar': 'التعرف على المسافة الآمنة للمركبة من السيارة الأمامية من مقاطع الفيديو أو الصور',
    },
    'g42_vehicle_smoke_detection_composition_v1': {
      'en': 'Recognize vehicle smoke appear in videos or images',
      'ar': 'التعرف على دخان السيارة من مقاطع الفيديو أو الصور',
    },
    'g42_vehicle_without_back_plate_composition_v1': {
      'en': 'Recognize vehicle without back plate appear in videos or images',
      'ar': 'التعرف على السيارة بدون اللوحة الخلفية من مقاطع الفيديو أو الصور',
    },
    'g42_voilation_giving_priority_to_official_or_emergency_vehicles_composition_v1': {
      'en': 'Recognize voilation of giving priority to official or emergency vehicles appear in videos or images',
      'ar': 'التعرف على عدم افساح الطريق للمركبات الرسمية أو سيارات الطوارئ من مقاطع الفيديو أو الصور',
    },
    'g42_voilation_giving_priority_to_the_vehicles_which_on_the_main_road_composition_v1': {
      'en': 'Recognize voilation of giving priority to the vehicles which on the main road appear in videos or images',
      'ar': 'التعرف على عدم إعطاء الأولوية للمركبات التي تظهر على الطريق الرئيسي من الفيديو أو الصور',
    },
    'g42_voilation_pedestrians_not_adhering_to_traffic_signals_composition_v1': {
      'en': 'Recognize voilation of pedestrians not adhering to traffic signals appear in videos or images',
      'ar': 'التعرف على عدم التزام المشاة بإشارات المرور من مقاطع الفيديو أو الصور',
    },
    'g42_voilation_smoking_while_driving_composition_v1': {
      'en': 'Recognize voilation smoking while driving appear in videos or images',
      'ar': 'التعرف على مخالفة التدخين أثناء القيادة من الفيديوهات أو الصور',
    },
    'yitu_behavior_event_ABNORMAL_PARK_composition_v1': {
      'en': 'detect motor vehicles stop in the specified area and stay over set time',
      'ar': 'كشف توقف المركبات  في المنطقة المحددة والبقاء خلال الوقت المحدد',
    },
    'yitu_behavior_event_CAR_CROSSS_LINE_composition_v1': {
      'en': 'detect motor vehicle driving across lanes',
      'ar': 'كشف قيادة السيارة عبر المسارات',
    },
    'yitu_behavior_event_CAR_INTRUSION_composition_v1': {
      'en': 'Vehicle detection entering designated areas',
      'ar': 'كشف المركبات التي تدخل المناطق المخصصة',
    },
    'yitu_behavior_event_CAR_PARK_composition_v1': {
      'en': 'Vehicle parking time exceeds specified time in designated area',
      'ar': 'تجاوز وقت ركن السيارة الوقت المحدد في المنطقة المخصصة',
    },
    'yitu_behavior_event_CAR_WRONG_WAY_composition_v1': {
      'en': 'detect motor vehicles driving in opposing direction in the specified area',
      'ar': 'كشف السيارات التي تسير في الاتجاه المعاكس في المنطقة المحددة',
    },
    'yitu_behavior_event_CYCLING_WITHOUT_HEADPIECE_composition_v1': {
      'en': 'Detect if the rider is wearing a helmet',
      'ar': 'اكتشاف ما إذا كان الراكب يرتدي خوذة',
    },
    'yitu_behavior_event_EMERGENCY_LANE_OCCUPANCY_composition_v1': {
      'en': 'detect occupied emergency lane',
      'ar': 'كشف استخدام مسار الطوارئ ',
    },
    'yitu_behavior_event_LINE_COUNT_CAR_composition_v1': {
      'en': 'draw a trip wire and specify its direction, detect and count the number of motor vehicles crossing the tripwire',
      'ar': 'ارسم سلك التعثر وحدد اتجاهه واكتشف واحسب عدد المركبات التي تعبر ',
    },
    'yitu_behavior_event_LINE_COUNT_NON_MOTOR_VEHICLE_composition_v1': {
      'en': 'draw a trip wire and specify its direction, detect and count the number of non-motor vehicles crossing the tripwire',
      'ar': 'رسم سلك التعثر وتحديد اتجاهه، وكشف وحساب عدد المركبات بدون محرك التي تعبر ',
    },
    'yitu_behavior_event_NON_MOTOR_PARK_composition_v1': {
      'en': 'alert when pedestrians or non-motor vehicles appear in the specified area',
      'ar': 'تنبيه عند ظهور المشاة أو المركبات بدون محرك في المنطقة المحددة',
    },
    'g42_voilation_taxi_fast_lane_composition_v1': {
      'en': 'Recognize voilation of taxi fast lane appear in videos or images',
      'ar': 'التعرف على استخدام التاكسي للخط السريع من مقاطع الفيديو أو الصور',
    },
  };
}
