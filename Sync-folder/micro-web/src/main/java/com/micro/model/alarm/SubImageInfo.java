package com.micro.model.alarm;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import org.apache.commons.collections.CollectionUtils;
import org.hibernate.validator.constraints.Length;

import javax.validation.constraints.NotNull;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @author Shen Huang Jian
 * @since 2018-07-27
 */
@Data
public class SubImageInfo {
    private String imageID;
    private Integer eventSort;
    private String deviceID;
    private String storagePath;
    private String type;
    private String fileFormat;
    private Date shotTime;
    private Integer width;

    private Integer height;
    private String data;
    private FeatureInfo featureInfo;

    public SubImageInfo() {
    }

    private SubImageInfo(Builder builder) {
        setImageID(builder.imageID);
        setEventSort(builder.eventSort);
        setDeviceID(builder.deviceID);
        setStoragePath(builder.storagePath);
        setType(builder.type);
        setFileFormat(builder.fileFormat);
        setShotTime(builder.shotTime);
        setWidth(builder.width);
        setHeight(builder.height);
        setFeatureInfo(builder.featureInfo);
    }


    public static Map<String, Object> buildListToMap(List<SubImageInfo> subImageInfoList) {
        Map<String, Object> map = null;
        if (!CollectionUtils.isEmpty(subImageInfoList)) {
            map = new HashMap<>(1);
            map.put("SubImageInfoObject", subImageInfoList);
        }
        return map;
    }


    public static final class Builder {
        private String imageID;
        private Integer eventSort;
        private String deviceID;
        private String storagePath;
        private String type;
        private String fileFormat;
        private Date shotTime;
        private Integer width;
        private Integer height;
        private FeatureInfo featureInfo;

        public Builder() {
        }

        public Builder imageID(String val) {
            imageID = val;
            return this;
        }

        public Builder eventSort(Integer val) {
            eventSort = val;
            return this;
        }

        public Builder deviceID(String val) {
            deviceID = val;
            return this;
        }

        public Builder storagePath(String val) {
            storagePath = val;
            return this;
        }

        public Builder type(String val) {
            type = val;
            return this;
        }

        public Builder fileFormat(String val) {
            fileFormat = val;
            return this;
        }

        public Builder shotTime(Date val) {
            shotTime = val;
            return this;
        }

        public Builder width(Integer val) {
            width = val;
            return this;
        }

        public Builder height(Integer val) {
            height = val;
            return this;
        }

        public Builder featureInfo(FeatureInfo val){
            featureInfo = val;
            return this;
        }

        public SubImageInfo build() {
            return new SubImageInfo(this);
        }
    }

}
