package com.micro.util;

import cn.hutool.core.util.StrUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.TypeReference;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.nio.charset.Charset;
import java.util.List;
import java.util.Map;

/**
 * RestTemplateUtil
 **/
@Slf4j
@Component
public class RestTemplateUtil {

    /**
     *  restTemplate
     * @return
     */
    public static RestTemplate getRestTemplate(){
        return  new RestTemplateBuilder().additionalMessageConverters(new StringHttpMessageConverter(Charset.forName("UTF-8"))).build();
    }

    public static <S, T> S request(String url, HttpMethod method, T body, Class<S> responseType ) {
        String responseEntity = RestTemplateUtil.getRestTemplate().exchange(url, method, createHttpEntity(body,""), String.class).getBody();
        return JSON.parseObject(responseEntity, responseType);
    }


    public static <S> S request(String url, HttpMethod method, Object body, Class<S> responseType,String jwtToken) {
        String responseEntity = RestTemplateUtil.getRestTemplate().exchange(url, method, createHttpEntity(body,jwtToken), String.class).getBody();
        return JSON.parseObject(responseEntity, responseType);
    }

    public static <S> List<S> requestList(String url, HttpMethod method, Object body, Class<S> responseType, String jwtToken) {
        String responseEntity = RestTemplateUtil.getRestTemplate().exchange(url, method, createHttpEntity(body,jwtToken), String.class).getBody();
        return JSON.parseObject(responseEntity, new TypeReference<List<S>>(responseType) {
        });
    }


    public static <T> String request(String url, HttpMethod method, T body, String jwtToken) {
        return RestTemplateUtil.getRestTemplate().exchange(url, method, createHttpEntity(body,jwtToken), String.class).getBody();
    }

    public static <T> String request(String url, HttpMethod method, T body, HttpHeaders headers) {
        return RestTemplateUtil.getRestTemplate().exchange(url, method, createHttpEntity(body,headers), String.class).getBody();
    }

    /**
     * get request
     * @param url
     * @param responseType
     * @param map
     * @param <S>
     * @param <T>
     * @return
     */
    public static <S,T> S getForObject(String url, Class<S> responseType, Map map){
        String responseEntity = RestTemplateUtil.getRestTemplate().getForObject(url,String.class,map);
        return JSON.parseObject(responseEntity, responseType);
    }

    /**
     * HttpEntity
     *
     * @param body
     * @return
     */
    public static HttpEntity createHttpEntity(Object body,String jwtToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);
        if(StringUtils.isBlank(jwtToken)){
            //jwtToken = ServletUtils.getRequest().getHeader("jwt-token");
        }
        if(StrUtil.isNotBlank(jwtToken)){
            headers.add("jwt-token",jwtToken);
        }

        if (null != body) {
            return new HttpEntity<>(JSON.toJSONString(body), headers);
        } else {
            return new HttpEntity<>(headers);
        }
    }

    /**
     * HttpEntity
     *
     * @param body
     * @return
     */
    public static HttpEntity createHttpEntity(Object body,HttpHeaders headers) {
        headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
        headers.add("Accept", MediaType.APPLICATION_JSON_UTF8_VALUE);

        if (null != body) {
            return new HttpEntity<>(JSON.toJSONString(body), headers);
        } else {
            return new HttpEntity<>(headers);
        }
    }
}