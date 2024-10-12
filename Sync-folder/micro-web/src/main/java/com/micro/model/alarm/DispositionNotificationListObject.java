package com.micro.model.alarm;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.List;

@Data
public class DispositionNotificationListObject {
    @JSONField(name = "DispositionNotificationObject")
    public List<DispositionNotification> dispositionNotifications;
}
