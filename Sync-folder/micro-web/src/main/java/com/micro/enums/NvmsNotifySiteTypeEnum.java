package com.micro.enums;


public enum NvmsNotifySiteTypeEnum {

	Hotel("4","Hotel","Hotels"),
	Mall("5","Mall","Malls"),
	Gantry("6","Gantry","Gantry"),
	FE_1("7","FE_1","FE1"),
	FE_2("8","FE_2","FE2"),
	Others("9","Others","Others");

   
    private String value;
    private String lable;
    private String mysqlValue;

    NvmsNotifySiteTypeEnum(String value,String lable,String mysqlValue){
        
        this.value = value;
        this.lable = lable;
        this.mysqlValue = mysqlValue;
    }

    public String getLable() {
        return lable;
    }

    public String getValue() {
        return value;
    }

    public String getMysqlValue() {
        return mysqlValue;
    }
    
    
    public static NvmsNotifySiteTypeEnum getByValue(String value){
        for (NvmsNotifySiteTypeEnum siteTypeEnum : NvmsNotifySiteTypeEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum;
            }
        }
        return null;
    }

    public static String getLabelByValue(String value){
        for (NvmsNotifySiteTypeEnum siteTypeEnum : NvmsNotifySiteTypeEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum.getLable();
            }
        }
        return null;
    }

    public static String getValueByLable(String lable){
        for (NvmsNotifySiteTypeEnum siteTypeEnum : NvmsNotifySiteTypeEnum.values()) {
            if(siteTypeEnum.getLable().equals(lable)){
                return siteTypeEnum.getValue();
            }
        }
        return null;
    }

    public static String getMysqlValueByValue(String value){
        for (NvmsNotifySiteTypeEnum siteTypeEnum : NvmsNotifySiteTypeEnum.values()) {
            if(siteTypeEnum.getValue().equals(value)){
                return siteTypeEnum.getMysqlValue();
            }
        }
        return null;
    }
}
