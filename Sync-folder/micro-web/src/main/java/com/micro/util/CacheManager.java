package com.micro.util;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @create 2019-09-29 16:06
 **/
public class CacheManager {
    private static Map<String,CacheData> CACHE_DATA = new ConcurrentHashMap<String, CacheData>();
    public static <T> T getData(String key,Load<T> load,int expire){
        T data = getData(key);
        if(data == null && load != null){
            data = load.load();
            if(data != null){
                setData(key,data,expire);
            }
        }
        return data;
    }
    public static <T> T getData(String key){
        CacheData<T> data = CACHE_DATA.get(key);
        if(data != null && (data.getExpire() <= 0 || data.getSaveTime() >= new Date().getTime())){
            return data.getData();
        }
        return null;
    }
    public static <T> void setData(String key,T data,int expire){
        CACHE_DATA.put(key,new CacheData(data,expire));
    }
    public static void clear(String key){
        CACHE_DATA.remove(key);
    }
    public static void clearAll(){
        CACHE_DATA.clear();
    }
    public interface Load<T>{
        T load();
    }
    private static class CacheData<T>{
        CacheData(T t,int expire){
            this.data = t;
            this.expire = expire <= 0 ? 0 : expire * 1000;
            this.saveTime = new Date().getTime() + this.expire;
        }
        private T data;
        private long saveTime;
        private long expire;
        public T getData() {
            return data;
        }
        public long getExpire() {
            return expire;
        }
        public long getSaveTime() {
            return saveTime;
        }
    }
}