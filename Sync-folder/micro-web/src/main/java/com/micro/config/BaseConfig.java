package com.micro.config;

import cn.hutool.core.convert.Convert;
import com.micro.service.DeckPlateService;
import com.micro.util.CacheManager;
import io.searchbox.client.JestClient;
import io.searchbox.client.JestClientFactory;
import io.searchbox.client.config.ClientConfig;
import io.searchbox.client.config.HttpClientConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.boot.autoconfigure.elasticsearch.ElasticsearchProperties;

@Configuration
public class BaseConfig {

    @Value("${spring.elasticsearch.rest.uris}")
    private String elasticUrl;

    @Bean
    @ConditionalOnMissingBean(JestClient.class)
    public JestClient jestClient() {
        JestClientFactory factory = new JestClientFactory();
        factory.setHttpClientConfig(new HttpClientConfig.
                Builder(elasticUrl).
                multiThreaded(true).build());
        return factory.getObject();
    }
    
    @Bean
    public SiteInfoDataPreloadRunner newEnumDataPreloadRunner() {
        return new SiteInfoDataPreloadRunner();
    }
}
