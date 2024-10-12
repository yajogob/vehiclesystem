package com.micro.service;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.JSONPath;
import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.micro.model.fake.SubscribeNotification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.Iterator;
import java.util.List;

@Slf4j
@Service
public class ProcessDataService {

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @Value("${spring.kafka.fake.plate.topic}")
    private String fakePlateTopic;

    public ResponseMessage<Object> processSubscribeNotificationData(List<SubscribeNotification> subscribeNotificationObject) {
        subscribeNotificationObject.forEach(
                subscribeNotification -> {

                    JSONObject imageJson = new JSONObject();
                    if (null != subscribeNotification.getImageInfoList()) {
                        imageJson = getImgJson(subscribeNotification.getImageInfoList().toJSONString());
                    }
                    try {
                        if (null != subscribeNotification.getMotorVehicleObjectList()) {
                            List<JSONObject> motorVehicleList = (List<JSONObject>) JSONPath.read(subscribeNotification.getMotorVehicleObjectList().toJSONString(), "$.MotorVehicleObject");
                            log.debug(" motorVehicleObjects: {}  {}  {}",!CollectionUtils.isEmpty(motorVehicleList), motorVehicleList.toString(), subscribeNotification.toString());
                            if (!CollectionUtils.isEmpty(motorVehicleList)) {
                                processMotorVehicle(motorVehicleList,fakePlateTopic);
                            } else {
                                log.info("No vehicle passing data once, device subscription filtering: {}");
                            }
                        }
                    } catch (Exception e) {
                        log.error("Handling Vehicle Data Anomalies：", e);
                    }
                }
        );
        return ResponseMessage.ok();
    }

    private JSONObject getImgJson(String json) {
        List<JSONObject> imageInfoObject = (List<JSONObject>) JSONPath.read(json, "$.ImageInfoObject");
        JSONObject imageJson = new JSONObject();
        if (null != imageInfoObject && imageInfoObject.size() > 0) {
            imageJson.put("CollectorID", imageInfoObject.get(0).getString("CollectorID"));
            imageJson.put("CollectorName", imageInfoObject.get(0).getString("CollectorName"));
            imageJson.put("ShotPlaceLongitude", imageInfoObject.get(0).getString("ShotPlaceLongitude"));
            imageJson.put("ShotPlaceLatitude", imageInfoObject.get(0).getString("ShotPlaceLatitude"));
        }
        return imageJson;
    }

    private void processMotorVehicle(List<JSONObject> motorVehicleObjects,String topic){
        Iterator<JSONObject> iterator = motorVehicleObjects.iterator();
//        if (iterator.hasNext()){
//            JSONObject motorVehicleObject = iterator.next();
//            JSONArray subImageInfoObject = motorVehicleObject.getJSONObject("SubImageList").getJSONArray("SubImageInfoObject");
//            if (subImageInfoObject == null || subImageInfoObject.size() == 0){
//                iterator.remove();
//            }
//        }
        if (motorVehicleObjects.size() > 0){
            JSONObject params = new JSONObject();
            JSONObject motorVehicleObjectList = new JSONObject();

//            getImageInfo(motorVehicleObjects.get(0), dataLinkOperator, msg);

            motorVehicleObjectList.put("MotorVehicleObject", motorVehicleObjects);
            params.put("MotorVehicleList", motorVehicleObjectList);
            processMotorvehicleData(topic, params);
//            processMotorvehicleProtoData(motorVehicleNotificationProtobufTopic, motorVehicleObjects);
        }
    }

    private void processMotorvehicleData(String topic, JSONObject MotorVehicleObjectList) {
        kafkaTemplate.send(topic,MotorVehicleObjectList.toJSONString() );
    }

}
