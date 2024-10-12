package com.micro.enums;

public enum NvmsNotifyCameraSourceEnum {

    /**
     * cameraSource lable is  1、Hotel & Mall 2、MCC-LPR Grantry 3、Central-VMS(DH)  4、Central-VMS(HW)
     * group by site type
     */
    Hotel("4","1"),
    Mall("5","3"),
    Gantry("6","4"),
    FE_1("7","2"),
    FE_2("8","2"),
    Others("9","2");


    private String value;
    private String lable;

    NvmsNotifyCameraSourceEnum(String value, String lable){
        
        this.value = value;
        this.lable = lable;
    }

    public String getLable() {
        return lable;
    }

    public String getValue() {
        return value;
    }
    
    
    public static NvmsNotifyCameraSourceEnum getByValue(String value){
        for (NvmsNotifyCameraSourceEnum siteTypeEnum : NvmsNotifyCameraSourceEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum;
            }
        }
        return null;
    }

    public static String getLabelByValue(String value){
        for (NvmsNotifyCameraSourceEnum siteTypeEnum : NvmsNotifyCameraSourceEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum.getLable();
            }
        }
        return null;
    }
    
    public static String getValueByLable(String lable){
        for (NvmsNotifyCameraSourceEnum siteTypeEnum : NvmsNotifyCameraSourceEnum.values()) {
            if(siteTypeEnum.getLable().equals(lable)){
                return siteTypeEnum.getValue();
            }
        }
        return null;
    }
}
