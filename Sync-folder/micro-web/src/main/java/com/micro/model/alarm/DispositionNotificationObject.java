package com.micro.model.alarm;

import lombok.Data;

@Data
public class DispositionNotificationObject {
    private String notificationID;
    private String dispositionID;
    private String plateNo;
    private String plateColor;
    private String passTime;
    private String triggerTime;
    private String vehicleColor;
    private SubImageDTO subImageList;
    private String deviceID;
    private String tollgateID;
    /**
     */
    private String laneNo;

    /**
     */
    private String direction;

    /**
     */
    private String reason;
    private String selfDefData;
    private String beginTime;
    private String endTime;
    private String priorityLevel;
    private String applicantOrg;
    private String applicantName;
    private Double speed;

    /**
     */
    private String storageUrl1;

    /**
     */
    private String storageUrl2;

    /**
     */
    private String storageUrl3;

    /**
     */
    private String storageUrl4;

    /**
     */
    private String storageUrl5;

    private String nameOfPassedRoad;
    private String vehicleBrand;
    private String vehicleModel;

    /**
     */
    private String title;
}



