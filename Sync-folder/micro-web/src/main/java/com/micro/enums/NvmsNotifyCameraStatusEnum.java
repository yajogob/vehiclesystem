package com.micro.enums;

public enum NvmsNotifyCameraStatusEnum {	
	
	Online("1","Online"),
	Offline("4","Offline"),
    Unknown("99","Unknown");
   
    private String value;
    private String lable;

    NvmsNotifyCameraStatusEnum(String value,String lable){
        
        this.value = value;
        this.lable = lable;
    }

    public String getLable() {
        return lable;
    }

    public String getValue() {
        return value;
    }
    
    
    public static NvmsNotifyCameraStatusEnum getByValue(String value){
        for (NvmsNotifyCameraStatusEnum siteTypeEnum : NvmsNotifyCameraStatusEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum;
            }
        }
        return null;
    }

    public static String getLabelByValue(String value){
        for (NvmsNotifyCameraStatusEnum siteTypeEnum : NvmsNotifyCameraStatusEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum.getLable();
            }
        }
        return null;
    }
    
    public static String getValueByLable(String lable){
        for (NvmsNotifyCameraStatusEnum siteTypeEnum : NvmsNotifyCameraStatusEnum.values()) {
            if(siteTypeEnum.getLable().equals(lable)){
                return siteTypeEnum.getValue();
            }
        }
        return null;
    }
}
