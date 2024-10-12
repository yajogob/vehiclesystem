package com.micro.controller;

import com.alibaba.fastjson.JSONObject;
import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.kedacom.kiaf.common.viid.util.JSONUtils;
import com.kedacom.kidp.base.web.support.ResponseGenerator;
import com.micro.constant.DispositionConstants;
import com.micro.model.alarm.DispositionNotification;
import com.micro.model.alarm.DispositionNotificationListObjectEx;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.concurrent.TimeUnit;

/**
 *
 *
 * @author kedacom
 * @since 2018-09-03
 */
@Slf4j
@RestController
@RequestMapping("/dispositionNotification")
public class AlarmController {
    @Resource
    private RedisTemplate redisTemplate;

    @Autowired
    private KafkaTemplate kafkaTemplate;
    @PostMapping
    public ResponseMessage receiveNotification(@RequestBody String dispositionNotificationStr) {
        log.info("receive DispositionNotification from viid ，data  is  {}", dispositionNotificationStr);
        DispositionNotificationListObjectEx dispositionNotificationListObjectEx = JSONUtils.jsonToBean(dispositionNotificationStr, DispositionNotificationListObjectEx.class);
        if (null == dispositionNotificationListObjectEx || null == dispositionNotificationListObjectEx.getDispositionNotificationListObject()) {
            log.error("empty request for DispositionNotification，{}", dispositionNotificationListObjectEx.toString());
            return ResponseGenerator.genFailResult("empty request for DispositionNotification");
        } else if (null != dispositionNotificationListObjectEx.getDispositionNotificationListObject().getDispositionNotifications() && dispositionNotificationListObjectEx.getDispositionNotificationListObject().getDispositionNotifications().size() != 0) {
            String notificationID = dispositionNotificationListObjectEx.getDispositionNotificationListObject().getDispositionNotifications().get(0).getNotificationID();
            String dispositionID = dispositionNotificationListObjectEx.getDispositionNotificationListObject().getDispositionNotifications().get(0).getDispositionID();
            if (redisTemplate.opsForValue().get(DispositionConstants.NOTIFICATION_TPOIC.REDIS_NOTIFICATION_ID + notificationID) == null) {
                log.debug("receive correct DispositionNotification from viid");
                redisTemplate.opsForValue().set(DispositionConstants.NOTIFICATION_TPOIC.REDIS_NOTIFICATION_ID + notificationID, dispositionID, 7, TimeUnit.DAYS);
                kafkaTemplate.send(DispositionConstants.NOTIFICATION_TPOIC.KAFKA_TOPIC, JSONObject.toJSONString(dispositionNotificationListObjectEx));
            } else {
                log.debug("receive duplicate notificationID: {}", notificationID);
                return ResponseGenerator.genFailResult("receive duplicate notificationID");
            }
            return ResponseGenerator.genSuccessResult("receive DispositionNotification from viid success");
        } else {
            log.error("empty request for DispositionNotification，{}", dispositionNotificationListObjectEx.toString());
            return ResponseGenerator.genFailResult("empty request for DispositionNotification");
        }
    }

    @PostMapping("/send/{topic}")
    public ResponseMessage receiveNotification(@RequestBody String json,@PathVariable("topic") String topic) {
        kafkaTemplate.send(topic, json);
        return ResponseMessage.ok();
    }

}
