package com.micro.dto;

import com.micro.dto.SiteDto;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class SiteinfoDto implements Serializable {
    /**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private String siteName;
    private String siteCode;
    private String siteType;
    private String siteTypeName;
    private String longitude;
    private String latitude;
    private String city;
    private String gantryId;
    private String civilCode;

    private String id;
    private String region;

    private String district;
    private String emirate;
    
    private Integer siteCameraNum;
    
    private List<SiteDto> sites;
    
    
    private Integer lprCameraNum;
    private Integer behavioralAlertNum;
    private Integer totalTask;

    private String areaPath;
}
