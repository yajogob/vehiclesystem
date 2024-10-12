package com.micro.model.alarm;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

/**
 **/
@Data
public class FeatureInfo {

    @Length(min = 0, max = 100, message = "")
    @JSONField(name = "Vendor")
    private String vendor;

    @Length(min = 0, max = 100, message = "")
    @JSONField(name = "AlgorithmVersion")
    private String algorithmVersion;

    @JSONField(name = "FeatureData")
    private String featureData;
}
