package com.micro.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.Ordered;
import org.springframework.core.env.*;
import org.springframework.web.context.support.StandardServletEnvironment;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

/**
 *
 */
@Slf4j
public class VisualContextInitializer implements ApplicationContextInitializer, Ordered {

    private int order = Ordered.HIGHEST_PRECEDENCE + 11;


    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        MutablePropertySources propertySources = environment.getPropertySources();
        PropertySource<?> p = locate(environment);
        if(null != p){
            propertySources.addFirst(p);
        }
    }

    @Override
    public int getOrder() {
        return this.order;
    }


    /**
     * @param environment the current Environment
     * @return a PropertySource or null if there is none
     * @throws IllegalStateException if there is a fail fast condition
     */
    public PropertySource<?> locate(Environment environment) {
        Map<String, Object> property = setConfig(environment);
        if (property != null && property.size() > 0) {
            return new MapPropertySource("visualProperty", property);
        } else {
            return null;
        }
    }

    private Map<String, Object> setConfig(Environment environment) {
        Map<String, Object> visualMap = new HashMap<>();
        if(environment instanceof StandardServletEnvironment){

        }else {
            return null;
        }
        Iterator<PropertySource<?>> iterable = ((StandardServletEnvironment) environment).getPropertySources().iterator();
        while (iterable.hasNext()){
            PropertySource<?> source = iterable.next();
            log.info("visualMap={},value={}",source.getName(),source.getSource());
//            insertMap(visualMap,source.getProperty("spring.elasticsearch.rest.uris"),"spring.elasticsearch.jest.uris");
        }

        return visualMap;
    }

    private void insertMap(Map<String, Object> visualMap,Object o,String key){
        if(null!=o){
            visualMap.put(key,o);
            log.info("visualMap,key={},value={}",key,o.toString());
        }
    }

    private void insertMap(Map<String, Object> visualMap,Object o,String key,String str){
        if(null!=o){
            visualMap.put(key,o + str);
            log.info("visualMap,key={},value={}",key,o.toString() + str);
        }
    }
}