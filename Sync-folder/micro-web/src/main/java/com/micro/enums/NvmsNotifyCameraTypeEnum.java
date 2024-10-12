package com.micro.enums;

public enum NvmsNotifyCameraTypeEnum {	
	
	MobileDevice("1","MobileDevice"),
	CaptureCamera("2","CaptureCamera"),
	VideoStreamCamera("3","VideoStreamCamera");

   
    private String value;
    private String lable;

    NvmsNotifyCameraTypeEnum(String value,String lable){
        
        this.value = value;
        this.lable = lable;
    }

    public String getLable() {
        return lable;
    }

    public String getValue() {
        return value;
    }
    
    
    public static NvmsNotifyCameraTypeEnum getByValue(String value){
        for (NvmsNotifyCameraTypeEnum siteTypeEnum : NvmsNotifyCameraTypeEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum;
            }
        }
        return null;
    }

    public static String getLabelByValue(String value){
        for (NvmsNotifyCameraTypeEnum siteTypeEnum : NvmsNotifyCameraTypeEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum.getLable();
            }
        }
        return null;
    }
    
    public static String getValueByLable(String lable){
        for (NvmsNotifyCameraTypeEnum siteTypeEnum : NvmsNotifyCameraTypeEnum.values()) {
            if(siteTypeEnum.getLable().equals(lable)){
                return siteTypeEnum.getValue();
            }
        }
        return null;
    }
}
