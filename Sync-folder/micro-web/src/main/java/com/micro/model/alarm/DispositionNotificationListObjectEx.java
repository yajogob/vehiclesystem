package com.micro.model.alarm;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

@Data
public class DispositionNotificationListObjectEx {
    @JSONField(name = "DispositionNotificationListObject")
    public DispositionNotificationListObject dispositionNotificationListObject;
}
