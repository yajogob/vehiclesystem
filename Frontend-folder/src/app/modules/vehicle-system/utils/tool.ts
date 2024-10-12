export const timestamp2time = (timestamp: string|number, timeType?: string):string => {
  if (timestamp) {
    const date = new Date(Number(timestamp));
    const y = date.getFullYear();
    let m:string|number = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    let d:string|number = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    let h:string|number = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    let minute:string|number = date.getMinutes();
    minute = minute < 10 ? ('0' + minute) : minute;
    let second:string|number = date.getSeconds();
    second = second < 10 ? ('0' + second) : second;
    if (timeType === 'yyyy-MM-dd') {
      return `${y}-${m}-${d}`;
    } else if (timeType === 'yyyyMMddHHmmss') {
      return `${y}${m}${d}${h}${minute}${second}`;
    } else if (timeType === 'dd-MM-yyyy HH:mm:ss') {
      return `${d}-${m}-${y} ${h}:${minute}:${second}`;
    } else {
      return `${h}:${minute}:${second}, ${d}/${m}/${y}`;
    }
  }
  return '';
};

/*
* Science and technology
 */
export const addSeparatorToNumber = (num: number): string => {
  const numStr = num.toString();
  const numArr = numStr.split('');
  let result = '';
  let count = 0;
  for (let i = numArr.length - 1; i >= 0; i--) {
    result = numArr[i] + result;
    count++;
    if (count === 3 && i !== 0) {
      result = ',' + result;
      count = 0;
    }
  }
  return result;
};

// Gets the timestamp of the start time of the day
export const getStartOfDayTimestamp = (): number => {
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return startOfDay.getTime();
};
// Gets the timestamp of the last second of the day
export const getEndOfDayTimestamp = (): number => {
  const now = new Date();
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
  return endOfDay.getTime();
};

export const getContextPath = (): string => {
  let contextPath = location.pathname + '/';
  const index = contextPath.indexOf('/vs/');
  if(index >= 0){
    contextPath = location.pathname.substring(0, index) + '/';
  }
  contextPath = contextPath.replace(/\/\//g, '/');
  return contextPath;
};

export const url2RoutingPath = (url: string): string => {
  if(url.indexOf('/') == 0){
    url = url.substring(1);
  }
  if(url.indexOf('?') >= 0){
    url = url.split('?')[0];
  }
  return url;
};
