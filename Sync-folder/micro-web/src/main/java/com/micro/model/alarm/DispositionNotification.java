package com.micro.model.alarm;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class DispositionNotification {
    @JSONField( name = "NotificationID" )
    private String notificationID;

    @JSONField( name = "DispositionID" )
    private String dispositionID;

    @JSONField( name = "Title" )
    private String title;

    @JSONField( name = "TriggerTime" )
    private String triggerTime;

    @JSONField( name = "CntObjectID" )
    private String cntObjectID;

    @JSONField( name = "PersonObject" )
    private JSONObject personObject;

    @JSONField( name = "MotorVehicleObject" )
    private JSONObject motorVehicleObject;

    @JSONField( name = "KedaMotorVehicleObject" )
    private JSONObject kedaMotorVehicleObject;

    @JSONField( name = "FaceObject" )
    private JSONObject faceObject;

    @JSONField( name = "ReceiveMobile" )
    private String receiveMobile;

    @JSONField( name = "ReceiveType" )
    private String receiveType;

    @JSONField( name = "ReceiveUserCode" )
    private String receiveUserCode;

    @JSONField( name = "NotificationType" )
    private String notificationType;

    @JSONField( name = "Content" )
    private String content;

    @JSONField( name = "DispositionType" )
    private String dispositionType;

    @JSONField( name = "Url" )
    private String url;

    @JSONField( name = "DispositionListObject" )
    private JSONObject dispositionListObject;
}
