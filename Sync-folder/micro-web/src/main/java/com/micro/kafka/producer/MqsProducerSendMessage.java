package com.micro.kafka.producer;


import org.apache.kafka.clients.producer.Callback;
import org.apache.kafka.clients.producer.RecordMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@Component
public class MqsProducerSendMessage {

	
	@Value("${lpr.nvms.device.notigy.topic:lpr-nvms-device-notify}")
    private String topic;
	
	@Autowired
	private MqsProducer<String, String> producer;
	
	    public void sendMessage(JSONObject msg) throws Exception {
	        //MqsProducer<String, String> producer = new MqsProducer<>();
	        int partiton = 0;
	        String[] array = new String[1];
	        array[0] =  JSON.toJSONString(msg);
	        try {
	            for (int i = 0; i < array.length; i++) {
	                String key = null;
	                String data = array[i];
	                producer.produce(topic, partiton, key, data, new Callback() {
	                    public void onCompletion(RecordMetadata metadata,
	                        Exception exception) {
	                        if (exception != null) {
	                            exception.printStackTrace();
	                            return;
	                        }
	                        log.info("produce msg completed");
	                    }
	                });
	                log.info("produce msg:" + data);
	            }
	        } catch (Exception e) {
	            e.printStackTrace();
	        } finally {
	            producer.close();
	        }
	        
	    }
}
