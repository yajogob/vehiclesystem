package com.micro.config;

import com.kedacom.kidp.base.web.BaseConfiguration;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;

import java.util.List;

@Configuration
@Slf4j
public class MicroConvertBaseConfiguration extends BaseConfiguration {

    @Override
    public void extendMessageConverters(List<HttpMessageConverter<?>> converters) {
    }

}
