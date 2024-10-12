package com.micro.model.common;

import lombok.Data;

/**
 * @author chenhuan
 * @create 2019-12-02 13:42
 **/
@Data
public class PropModel {
    private String tollRecID;
    private String tollNO;
    private String plateNumber;
    private Long passTime;
    private String vehcURL;
    private String vehicleColor;
    private String vehicleType;
    private Long vehicleLogo;
    private String vehicleSubLogo;
    private String vehicleYear;
    private String plateColor;
    private double logoConf;
    private double plateConf;
    private double plateFirstCharConf;
    private String vehiclePosition;
    private String platePosition;
    private Long frontBack;
    private String firstPlateName;
    private double vehicleBrightness;
    private Integer firstPlateColor;
    private long sunvisorStatus;
    private double sunvisorConf;
    private long maskFaceStatus;
    private double maskFaceConf;
    private long hatStatus;
    private double hatConf;
    private long sunglassStatus;
    private double sunglassConf;
    private long picSharpness;
    private double plateColorConf;
    private double beamConf;
    private String analysisObjID;
    private String featureString;
    private String algorithmVersion;
    private double vehBrightness;
    private double picBrightness;
    private Long IsStained;

    private double plateReliability;

    private String plateType;
    private String nationalityCode;
    private String placeCode;

}