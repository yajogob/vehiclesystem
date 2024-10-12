package com.micro.model.common;

import lombok.Data;

@Data
public class DeckModel {
    /**
     * ID
     */
    private String id;
    /**
     */
    private String deviceCode;
    /**
     */
    private String plateNo;
    /**
     */
    private Integer plateColor;
    /**
     */
    private String vehicleLogo;
    /**
     */
    private Integer vehicleType;
    /**
     */
    private Integer vehicleColor;
    /**
     */
    private String subVehicleType;
    /**
     */
    private String imageUrl;
    /**
     */
    private String criterion;
    /**
     */
    private String vehiclePosition;
    /**
     */
    private String platePosition;
    /**
     */
    private String carThroughId;
    /**
     */
    private Integer maskFaceStatus;
    /**
     */
    private double maskConf;
    /**
     */
    private Integer sunVisorConf;
    /**
     */
    private Integer sunVisorStatus;
    /**
     */
    private double hatStatusConf;
    /**
     */
    private Integer hatStatus;
    /**
     */
    private Integer deckStatus;
    /**
     */
    private double sunGlassConf;
    /**
     */
    private Integer sunGlassStatus;
    /**
     */
    private Integer suspected;
    /**
     */
    private String throughTime;
    /**
     */
    private String baseReason;
    /**
     */
    private String updateTime;
    /**
     */
    private String realVehicleBrand;

    private String vehicleYear;
    private Long vehicleMake;
    private String vehicleModel;

    private String plateType;
    private String nationalityCode;
    private String placeCode;

    private String lastCameraName;
    private String lastCameraId;
    private String lastCaptureDateTime;
    private String lastVehicleMake;
    private String lastPlateNumber;
    private String lastVehicleImage;
    private String lastVehicleModel;
    private String lastPlateType;
    private String lastNationalityCode;
    private String lastPlaceCode;
}
