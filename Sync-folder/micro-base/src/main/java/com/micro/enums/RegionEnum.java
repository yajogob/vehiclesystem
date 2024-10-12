package com.micro.enums;

import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.Map;

public enum RegionEnum {
    ABZB("Abu Dhabi", "784","000007",true),
    AJM("Ajman", "784","000004",true),
    BL("Bahrain", "048","",false),
    DB("Dubai", "784","000006",true),
    FCYL("Fujairah", "784","000003",true),
    KWT("Kuwait", "414","",false),
    AM("Oman", "512","",false),
    KTR("Qatar", "634","",false),
    HYMJ("Ras Al Khaimah", "784","000002",true),
    STALB("Saudi Arabia", "682","",false),
    SJ("Sharjah", "784","000005",true),
    ALQ("UAE", "784","",false),
    GW("Umm Al Quwain", "784","000001",true),
    UKW("Unknown", "","",false);

    private static final Map<String,RegionEnum> stateMap;

    private static final Map<String,RegionEnum> placeCodeMap;

    private static final Map<String,RegionEnum> nationalityMap;

    static {
        stateMap = new HashMap();
        placeCodeMap = new HashMap<>();
        nationalityMap = new HashMap<>();
        for (RegionEnum regionEnum : values()) {
            stateMap.put(regionEnum.getEnName(), regionEnum);
            if(!StringUtils.isEmpty(regionEnum.getPlaceCode())){
                placeCodeMap.put(regionEnum.getPlaceCode(), regionEnum);
            }
            if(!StringUtils.isEmpty(regionEnum.getNationalityCode()) && StringUtils.isEmpty(regionEnum.getPlaceCode())){
                nationalityMap.put(regionEnum.getNationalityCode(), regionEnum);
            }
        }
    }

    private String enName;
    private String nationalityCode;
    private String placeCode;
    private Boolean havePlaceCode;

    private RegionEnum(String enName, String nationalityCode, String placeCode, Boolean havePlaceCode) {
        this.enName = enName;
        this.nationalityCode = nationalityCode;
        this.placeCode = placeCode;
        this.havePlaceCode = havePlaceCode;
    }

    public String getEnName() {
        return this.enName;
    }

    public void setEnName(String enName) {
        this.enName = enName;
    }

    public String getNationalityCode() {
        return this.nationalityCode;
    }

    public void setNationalityCode(String nationalityCode) {
        this.nationalityCode = nationalityCode;
    }

    public String getPlaceCode() {
        return this.placeCode;
    }

    public void setPlaceCode(String placeCode) {
        this.placeCode = placeCode;
    }

    public Boolean getHavePlaceCode() {
        return this.havePlaceCode;
    }

    public void setHavePlaceCode(Boolean havePlaceCode) {
        this.havePlaceCode = havePlaceCode;
    }

    public static RegionEnum getEnum(String code) {
        RegionEnum data = stateMap.get(code);
        if(null != data){
            return data;
        }else {
            return stateMap.get("UAE");
        }
    }

    public static RegionEnum getPlaceEnum(String code) {
        if(StringUtils.isEmpty(code)){
            return null;
        }
        RegionEnum data = placeCodeMap.get(code);
        if(null != data){
            return data;
        }else {
            return stateMap.get("UAE");
        }
    }

    public static RegionEnum getNationalityEnum(String code) {
        if(StringUtils.isEmpty(code)){
            return null;
        }
        RegionEnum data = nationalityMap.get(code);
        if(null != data){
            return data;
        }else {
            return stateMap.get("UAE");
        }
    }

    public static String getRegionByPlaceCodeOrNationCode(String nationalityCode,String placeCode){
        if(!StringUtils.isEmpty(placeCode)){
            RegionEnum regionEnum = getPlaceEnum(placeCode);
            return regionEnum.getEnName();
        }
        if(!StringUtils.isEmpty(nationalityCode)){
            RegionEnum regionEnum = getNationalityEnum(nationalityCode);
            return regionEnum.getEnName();
        }
        return "";
    }
}
