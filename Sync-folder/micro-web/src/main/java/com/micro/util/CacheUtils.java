package com.micro.util;

import com.alibaba.fastjson.JSON;
import com.kedacom.kiaf.common.code.dto.CodeDTO;
import edu.umd.cs.findbugs.annotations.SuppressFBWarnings;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.Cursor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.ScanOptions;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;

/**
 * @author
 * @date 2023-06-19 10:26
 */
@SuppressFBWarnings("ST_WRITE_TO_STATIC_FROM_INSTANCE_METHOD")
@Component
@Slf4j
public class CacheUtils {

    private static RedisTemplate redisTemplate;

    private static int CACHE_TIMEOUT_MINUTE = 300;

    private final static String PROJECT = "lpr:";

    @Resource
    private RedisTemplate visualRedisTemplate;

    private static Set<String> keys = new HashSet<>();

    /*static ExpiringMap cacheMap = ExpiringMap.builder()
                                        .maxSize(Integer.MAX_VALUE)
                                        .variableExpiration()
                                        .expirationPolicy(ExpirationPolicy.CREATED)
                                        .expiration(300, TimeUnit.SECONDS)
                                        .build();*/

    public static void put(String key, Object value, long duration){
        keys.add(PROJECT + key);
        redisTemplate.opsForValue().set(PROJECT + key, value, duration, TimeUnit.MINUTES);
    }

    public static void put(String key, Object value){
        keys.add(PROJECT + key);
        redisTemplate.opsForValue().set(PROJECT + key, value);
    }

    public static Object get(String key){
        Object o = redisTemplate.opsForValue().get(PROJECT + key);
        if(null != o){
            return JSON.toJSON(o);
        }
        return null;
    }

    public static boolean hasKey(String key){
        return redisTemplate.hasKey(PROJECT + key);
    }


    public static Integer getAsInt(String key){
        return (Integer)redisTemplate.opsForValue().get(PROJECT + key);
    }

    public static String getAsString(String key){
        return (String)redisTemplate.opsForValue().get(PROJECT + key);
    }

    public static Map<String, List<CodeDTO>> getAsMap(String key){
        return (Map<String, List<CodeDTO>>)redisTemplate.opsForValue().get(PROJECT + key);
    }

    public static void removeKey(String key){
        redisTemplate.delete(PROJECT + key);
    }

    public static void clearAllAasCache(){
        redisTemplate.delete(keys);
    }

    public static void clearAllCache(){
        String param = PROJECT + "*";
        Set<String> keys = getValuesForStringByScan(param);
        log.info("######delete all redis：{}", JSON.toJSONString(keys));
        redisTemplate.delete(keys);
    }

    /**
     * match all key，use scan
     *
     * @param patten reg
     * @return return all keys
     */
    public static Set<String> getValuesForStringByScan(String patten) {
        return (Set<String>) redisTemplate.execute(connect -> {
            Set<String> binaryKeys = new HashSet<>();
            Cursor<byte[]> cursor = connect.scan(ScanOptions.scanOptions().match(patten).count(200000).build());
            while (cursor.hasNext() && binaryKeys.size() < 200000) {
                binaryKeys.add(new String(cursor.next()));
            }
            return binaryKeys;
        }, true);
    }


    @Resource
    public void setRedisTemplate(RedisTemplate visualRedisTemplate1){
        CacheUtils.redisTemplate = visualRedisTemplate;
    }

    @Value("${cache.expire.minute:30}")
    public void setSessionTimeout(int timeout){
        CacheUtils.CACHE_TIMEOUT_MINUTE = timeout;
    }

}
