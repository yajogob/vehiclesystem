package com.micro.model.common;

import lombok.Data;

@Data
public class DeckRelatedModel {
    private String id;
    private String carThroughId;
    private String deckRecordId;
    private String deviceCode;
    private double hatStatusConf;
    private Integer hatStatus;
    private Integer maskFaceStatus;
    private double maskConf;
    private String imageUrl;
	private Integer plateColor;
	private String plateNo;
	private Integer deckStatus;
	private String subVehicleType;
	private double sunGlassConf;
	private Integer sunGlassStatus;
	private Integer sunVisorConf;
	private Integer sunVisorStatus;
	private String throughTime;
	private Integer vehicleColor;
	private Integer vehicleType;
	private String vehiclePosition;
	private String platePosition;
    private String vehicleLogo;
}
