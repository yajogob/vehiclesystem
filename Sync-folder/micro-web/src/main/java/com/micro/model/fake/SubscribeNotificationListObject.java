package com.micro.model.fake;

import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.List;

/**
 **/
@Data
public class SubscribeNotificationListObject {

	@JSONField(name = "SubscribeNotificationObject")
	public List<SubscribeNotification> subscribeNotificationObject;

}
