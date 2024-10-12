package com.micro.controller;

import com.micro.dto.NvmsIdDeviceIdDTO;
import com.micro.kafka.consumer.LprNvmsDeviceNotifyConsumer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.micro.kafka.producer.MqsProducerSendMessage;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@RefreshScope
@RestController
@RequestMapping("/nvms")
public class LprNvmsDeviceNotifyController {

	@Autowired
	private MqsProducerSendMessage mqsProducerSendMessage;

    @Autowired
    private LprNvmsDeviceNotifyConsumer lprNvmsDeviceNotifyConsumer;
	
	@PostMapping("/notify")
    public ResponseMessage search(@RequestBody JSONObject message){
        try{
            log.info("######nvms notify message:{}", JSON.toJSONString(message));
            mqsProducerSendMessage.sendMessage(message);
            return ResponseMessage.ok();
        }catch (Exception e){
            log.error("######nvms notify message exception");
            log.error(e.getMessage(), e);
            return ResponseMessage.error("nvms notify message exception"); //TODO  use code return front end
        }
    }

    @PostMapping("/updateRtsp")
    public ResponseMessage updateRtsp(@RequestBody NvmsIdDeviceIdDTO nvmsIdDeviceIdDTO){
        log.info("######updateRtsp:{}", JSON.toJSONString(nvmsIdDeviceIdDTO));
        lprNvmsDeviceNotifyConsumer.updateRtspUrl(nvmsIdDeviceIdDTO);
        return ResponseMessage.ok();
    }
}
