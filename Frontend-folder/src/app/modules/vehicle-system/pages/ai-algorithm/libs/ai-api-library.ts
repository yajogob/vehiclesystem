/**
 * API const
 */
export class AiApiLibrary {
  public static readonly algorithmsListSearch = "/lpr/algorithmInfo/search"; // algorithms search
  public static readonly watchlistTaskSearch = "/lpr/algorithms/watchlistTaskSearch"; // query watch list task
  public static readonly watchListTaskSave = "/lpr/algorithms/watchListTaskSave"; // create watchlist task save
  public static readonly watchlistTaskDelete = "/lpr/algorithms/watchlistTaskDelete"; // Delete watchlist task
  public static readonly whitelistTaskSearch = "/lpr/algorithms/whitelistTask/list"; // query white list task
  public static readonly whitelistTaskSave = "/lpr/algorithms/whitelistTask"; // create whitelist task save
  public static readonly whitelistTaskDelete = "/lpr/algorithms/whitelistTask"; // /{taksId} Delete whitelist task
  public static readonly behavioralTaskSearch = "/lpr/behavior/searchTask"; // query Behavioral task
  public static readonly behavioralAlgorithmInfo = "/lpr/behavior/devices/algorithmDevicesWithoutTask"; // query Behavioral algorithm info
  public static readonly behavioralTaskDelete = "/lpr/behavior/delete"; // Delete Behavioral task
  public static readonly whitelistTaskDetail = "/lpr/algorithms/whiteListAlert/list"; // query white list Task Detail
  public static readonly watchListTaskEnable = "/lpr/algorithms/watchListTaskEnable"; // watch List Task Enable
  public static readonly watchListTaskDisable = "/lpr/algorithms/watchListTaskDisable"; // watch List Task Disable
  public static readonly gpuLprTaskSearch = "/lpr/algorithms/gpuLprTaskSearch"; // query gpu lpr task
  public static readonly gpuLprTaskCameraQuery = "/lpr/algorithms/gpuLprTaskCameraQuery"; // query Camera list
  public static readonly gpuLprTaskDelete = "/lpr/algorithms/gpuLprTaskDelete"; // Delete gpuLpr Task
  public static readonly gpuLprTaskSave = "/lpr/algorithms/gpuLprTaskSave"; // create or update gpuLpr Task
  public static readonly gpuLprTaskStart = "/lpr/algorithms/gpuLprTaskStart"; // start Task
  public static readonly gpuLprTaskStop = "/lpr/algorithms/gpuLprTaskStop"; // stop Task
  public static readonly behavioralTaskSave = "/lpr/behavior/saveTask"; // create or update behavioral Task
  public static readonly geofenceListTaskSearch = "/lpr/algorithms/geofenceTaskSearch"; // query geofence list task
  public static readonly geofenceListTaskDelete = "/lpr/algorithms/geofenceTaskDelete"; // Delete geofence list task
  public static readonly geofenceListTaskSave = "/lpr/algorithms/geofenceTaskSave";
  public static readonly geofenceListTaskEnable = "/lpr/algorithms/updateTaskStatus"; // watch List Task Enable
  public static readonly geofenceTaskDetail = "/lpr/algorithms/queryGeofenctTaskbytaskId"; // query white list Task Detail
  public static readonly watchlistTaskSearcDevice = "/lpr/algorithms/watchlistTaskSearch/detail"; // watch List Task Enable
  public static readonly getAllDeviceData = "/lpr/behavior/queryLocation/tree"; // get all device data
}
