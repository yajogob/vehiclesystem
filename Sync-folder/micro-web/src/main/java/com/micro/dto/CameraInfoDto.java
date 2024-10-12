package com.micro.dto;

import lombok.Getter;
import lombok.Setter;

import java.io.Serializable;

@Setter
@Getter
public class CameraInfoDto implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String id;

    private String cameraName; //name

    private String cameraId;  //GBID

    private String cameraCode;  //deviceAttripc.cameraCode

    private String cameraType;   //deviceAttr.ipc.cameraForm

    private String longitude;

    private String latitude;

    private String siteName;
    private String siteCode;

    private String cameraStatus;  //status

    private String deviceType;

    //private Integer laneNo;

    private Integer laneId;


    private String  ip;

    private String username;
    private String password;
    private String port;
    private String streamURL;
    private String isGpuAnalysis;
    private String viid;
    private String cameraSource;

    //private String siteName;
    private String siteCity;
    private String siteEmirate;
    private String siteType;

    private String code;  //devicearr.site.code
    private String areaPath;

}
