package com.micro.config;

import lombok.Data;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.KafkaListenerContainerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
@Data
@EnableKafka
public class KafkaConsumerConfig {
    @Value("${spring.kafka.bootstrap-servers}")
    private String servers;
    @Value("${spring.kafka.consumer.group-id:lpr-data-process}")
    private String groupId;
    @Value("${spring.kafka.consumer.enable-auto-commit:true}")
    private String enableAutoCommit;
    @Value("${spring.kafka.consumer.auto-offset-reset:latest}")
    private String autoOffsetReset;
    @Value("${spring.kafka.consumer.max-poll-records:100}")
    private String maxPollRecords;
    @Value("${spring.kafka.consumer.concurrency:3}")
    private String concurrency;


    @Bean
    public KafkaListenerContainerFactory<?> batchNoByteFactory(){
        ConcurrentKafkaListenerContainerFactory<Integer, String> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(new DefaultKafkaConsumerFactory(consumerNoByteConfigs()));
        factory.setBatchListener(true);
        factory.setConcurrency(Integer.parseInt(concurrency));
        return factory;
    }

    private Map<String,Object> consumerNoByteConfigs(){
        Map<String,Object> props = new HashMap<String, Object>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG,servers);
        props.put(ConsumerConfig.GROUP_ID_CONFIG,groupId);
        props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG,autoOffsetReset);
        props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG,enableAutoCommit);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,"org.apache.kafka.common.serialization.StringDeserializer");
        props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG,maxPollRecords);
        props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG,"50000");
        props.put(ConsumerConfig.REQUEST_TIMEOUT_MS_CONFIG,"60000");
        return props;
    }
}
