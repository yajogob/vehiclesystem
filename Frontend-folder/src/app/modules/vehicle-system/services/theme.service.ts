
import { Theme } from '@enums/theme';
import { BehaviorSubject } from 'rxjs';

export interface ThemeEventData {
  eventType: string,
  data: Theme | string
}
export class ThemeSubject {
  subject: BehaviorSubject<ThemeEventData> = new BehaviorSubject<ThemeEventData>({eventType: '', data: ''});
}
