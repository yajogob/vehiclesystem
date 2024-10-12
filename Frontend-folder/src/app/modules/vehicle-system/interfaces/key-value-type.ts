import { TimePeriod } from "ngx-daterangepicker-material/daterangepicker.component";

export interface KeyValueType {
    [key: string]: string;
}

export interface CancelRouteReuse {
    path: string;
    keep: boolean;
}

export interface DateKey {
    startDate: number | null;
    endDate: number | null;
    curSelected: TimePeriod | null;
    activedTab?: string;
    selectedDateLabel?: string;
}

export interface SelectType {
  accessName?: string;
  label: string;
  value: string;
}

export interface IconsListType {
    imgClass: string;
    imgType: string;
    [propName: string]: string;
}

export class RestfulCodeItemsApi {
  code!: string;
  status!: number;
  result!: Array<CodeItemsApi>;
}

export class CodeItemsApi {
  codeType!: string;
  codesArray!: Array<CodesArrayItem>;
}

export class CodesArrayItem {
  arabItemName!: string;
  englishItemName!: string;
  codeItemValue!: string;
  checked?: boolean;
}

export class MadalType {
  isShow?: boolean;
  title?: string;
  content?: string;
  cancelText?: string;
  confirmText?: string;
  onOk?: () => void;
}

export interface customPositionType {
  position?: string | number;
  top?: string | number;
  left?: string | number;
  right?: string | number;
  bottom?: string | number;
}

export interface CustomRanges {
  [key: string]: TimePeriod | undefined
}
