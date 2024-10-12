package com.micro.controller;

import com.alibaba.fastjson.JSON;
import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.micro.model.fake.SubscribeNotification;
import com.micro.model.fake.SubscribeNotificationListObject;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.micro.service.ProcessDataService;

import java.util.List;
import java.util.Map;

/**
 *
 * @author yaorui
 * @version 1.0
 * @date 2020-06-09 15:36
 **/
@Slf4j
@RefreshScope
@RestController
@RequestMapping("/vrfm/receive")
public class MotorVehicleReceiveController {


    @Autowired
    private ProcessDataService processDataService;

    /**
     * @return ResponseMessage<Object>
     */
    @PostMapping(value = "/motorvehicles", consumes = {"*/*"}, produces = {"application/VIID+JSON"})
    public ResponseMessage<Object> motorVehicles(@RequestBody Map<String, Object> subscribeNotificationListObjectEx) {
        Object object = subscribeNotificationListObjectEx.get("SubscribeNotificationListObject");
        if (null == object) {
            log.error("empty request for vehicles，{}", subscribeNotificationListObjectEx);
            return ResponseMessage.ok();
        }
        SubscribeNotificationListObject subscribeNotificationListObject = JSON.parseObject(JSON.toJSON(object).toString(), SubscribeNotificationListObject.class);
        List<SubscribeNotification> subscribeNotificationObject = subscribeNotificationListObject.getSubscribeNotificationObject();
        if (CollectionUtils.isEmpty(subscribeNotificationObject)) {
            log.error("empty request for vehicles，{}", subscribeNotificationListObjectEx);
            return ResponseMessage.ok();
        }
        processDataService.processSubscribeNotificationData(subscribeNotificationObject);

        return ResponseMessage.ok();
    }


}
