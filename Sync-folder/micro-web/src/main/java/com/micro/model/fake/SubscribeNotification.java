package com.micro.model.fake;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.annotation.JSONField;
import lombok.Data;

import java.util.List;

/**
 **/
@Data
public class SubscribeNotification {

	@JSONField(name = "NotificationID")
	private String notificationID;

	@JSONField(name = "SubscribeID")
	private String subscribeID;

	@JSONField(name = "Title")
	private String title;

	@JSONField(name = "TriggerTime")
	private String triggerTime;

	@JSONField(name = "InfoIDs")
	private String infoIDs;

	@JSONField(name = "TollgateList")
	private JSONObject tollgateList;

	@JSONField(name = "LaneList")
	private JSONObject laneList;

	@JSONField(name = "DeviceList")
	private JSONObject deviceList;

	@JSONField(name = "MotorVehicleObjectList")
	private JSONObject motorVehicleObjectList;

	@JSONField(name = "KedaMotorVehicleObjectList")
	private JSONObject kedaMotorVehicleObjectList;

	@JSONField(name = "PersonObjectList")
	private List<JSONObject> personRecordObjectList;

	@JSONField(name = "NonMotorVehicleObjectList")
	private JSONObject nonMotorVehicleObjectList;


	@JSONField(name = "KedaNonMotorVehicleObjectList")
	private JSONObject KedaNonMotorVehicleObjectList;

	@JSONField(name = "NonMotorIllegalRecordObjectList")
	private List<JSONObject> nonMotorIllegalRecordObjectList;

	@JSONField(name = "AccessRecordObjectList")
	private List<JSONObject> accessRecordObjectList;

	@JSONField(name = "FaceObjectList")
	private JSONObject faceList;

	@JSONField(name = "TrafficEventObjectList")
	private List<JSONObject> trafficEventObjectList;

	@JSONField(name = "ImageInfoList")
	private JSONObject imageInfoList;

	@JSONField(name = "IllegalRecordObjectList")
	private JSONObject illegalRecordObjectList;

	@JSONField(name = "DataClassTabObjectList")
	private JSONObject dataClassTabObjectList;

	@JSONField(name = "ExecuteOperation")
	private int executeOperation;

}
