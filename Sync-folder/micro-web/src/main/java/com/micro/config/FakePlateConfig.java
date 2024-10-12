package com.micro.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Configuration
@Data
public class FakePlateConfig {
    @Value("${fakeplateConf.enableDistance}")
    private String enableDistance;

    @Value("${fakeplateConf.enableCompare}")
    private String enableCompare;

    @Value("${fakeplateConf.enableVehicleAdmin}")
    private String enableVehicleAdmin;

    @Value("${fakeplateConf.enableFakePlate}")
    private String enableFakePlate;

    @Value("${fakeplateConf.redisDelRecordByHour}")
    private String redisDelRecordByHour;

    @Value("${fakeplateConf.vehicleSpeedByKm}")
    private String vehicleSpeedByKm;

    @Value("${fakeplateConf.plateConf}")
    private String plateConf;

    @Value("${fakeplateConf.logoConf}")
    private String logoConf;

    @Value("${fakeplateConf.plateColorConf}")
    private String plateColorConf;

    @Value("${fakeplateConf.minTimeIntevalBySecond}")
    private String minTimeIntevalBySecond;


    @Value("${fakeplateConf.fakePlateTriggerDelayByDay}")
    private String fakePlateTriggerDelayByDay;

    @Value("${fakeplateConf.minLatitude}")
    private String minLatitude;

    @Value("${fakeplateConf.maxLatitude}")
    private String maxLatitude;

    @Value("${fakeplateConf.minLongitude}")
    private String minLongitude;

    @Value("${fakeplateConf.maxLongitude}")
    private String maxLongitude;

    @Value("${fakeplateConf.enablePlateNoDiff}")
    private String enablePlateNoDiff;

    @Value("${fakeplateConf.enablePlateColorDiff}")
    private String enablePlateColorDiff;

    @Value("${fakeplateConf.enableFrontOrBack}")
    private String enableFrontOrBack;

    @Value("${fakeplateConf.vehicleBrightness}")
    private String vehicleBrightness;

    @Value("${fakeplateConf.threshold}")
    private String threshold;

    @Value("${fakeplateConf.isFilterPlateColor}")
    private String isFilterPlateColor;

    @Value("${fakeplateConf.mode}")
    private String mode;

    @Value("${fakeplateConf.throughDistance}")
    private String throughDistance;

    @Value("${fakeplateConf.picBrightness}")
    private String picBrightness;

    @Value("${fakeplateConf.vehicleType}")
    private String vehicleType;

    @Value("${fakeplateConf.enableVehicleSubBrand}")
    private String enableVehicleSubBrand;

    @Value("${fakeplateConf.plateFirstCharConf}")
    private String plateFirstCharConf;

    @Value("${fakeplateConf.needQueryAgain:false}")
    private Boolean needQueryAgain;

    @Value("${fakeplateConf.cgkUrl}")
    private String cgkUrl;

    @Value("${fakeplateConf.senderId}")
    private String senderId;

    @Value("${fakeplateConf.serviceId}")
    private String serviceId;

    @Value("${fakeplateConf.certificate}")
    private String certificate;

    @Value("${fakeplateConf.department}")
    private String department;

    @Value("${fakeplateConf.deviceId}")
    private String deviceId;

    @Value("${fakeplateConf.idCard}")
    private String idCard;

    @Value("${fakeplateConf.name}")
    private String name;

    @Value("${fakeplateConf.enableIsStained}")
    private String enableIsStained;

    @Value("${fakeplateConf.vehicleBrandAnalysisCron:0 15 0 * * ?}")
    private String vehicleBrandAnalysisCron;

    @Value("${fakeplateConf.vehicleBrandAnalysisJudgeTimes:10}")
    private int vehicleBrandAnalysisJudgeTimes;
}
