//package com.micro;
//
//import com.kedacom.kidp.base.web.audit.service.AuditConfig;
//import org.springframework.boot.autoconfigure.AutoConfiguration;
//import org.springframework.boot.context.properties.EnableConfigurationProperties;
//import org.springframework.context.annotation.ComponentScan;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.scheduling.annotation.EnableAsync;
//import org.springframework.web.servlet.config.annotation.CorsRegistry;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
//
///**
// */
//@AutoConfiguration
//@EnableAsync
//@ComponentScan
//@EnableConfigurationProperties(AuditConfig.class)
//public class KiafBaseConfiguration implements WebMvcConfigurer {
//
//    @Override
//    public void addCorsMappings(CorsRegistry registry) {
//        registry.addMapping("/**").allowedOriginPatterns("*")
//                .allowedMethods("GET", "HEAD", "POST", "PUT", "DELETE", "OPTIONS")
//                .allowedHeaders("*")
//                .allowCredentials(false).maxAge(3600);
//    }
//
//}
