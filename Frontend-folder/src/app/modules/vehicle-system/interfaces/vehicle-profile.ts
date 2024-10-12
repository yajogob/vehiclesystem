export interface CaptureInfo {
  captureDate?: string,
  captureTime: string,
  captureImage?: string,
  longitude?: string,
  latitude?: string,
  plateNumber: string,
  key1: string
}

export interface DailyCaptureInfo {
  'date': string,
  captureInfos: CaptureInfo[],
  open: string
}
