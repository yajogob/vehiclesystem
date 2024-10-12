package com.micro.kafka.consumer;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

import javax.annotation.PostConstruct;
import javax.annotation.Resource;

import com.kedacom.ctsp.web.controller.message.ResponseMessage;
import com.micro.dao.LprSystemLocationDao;
import com.micro.dao.VideoAnalysisDeviceVisualDao;
import com.micro.dto.*;
import com.micro.entity.LprSystemLocationEntity;
import com.micro.entity.VideoAnalysisVisualDevice;
import com.micro.enums.*;
import com.micro.feign.LprBackFegin;
import com.micro.feign.NvmsFegin;
import com.micro.feign.req.back.GpuLprTaskSaveDto;
import com.micro.feign.req.nvms.NvmsGetRtspReq;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.http.HttpMethod;
import org.springframework.kafka.annotation.KafkaListener;
//import org.springframework.kafka.support.Acknowledgment;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.kedacom.kiaf.common.util.StringUtils;
import com.kedacom.kidp.base.data.common.dto.SearchDTO;
import com.micro.constant.Const;
import com.micro.util.CacheUtils;
import com.micro.util.RestTemplateUtil;

import cn.hutool.core.collection.CollectionUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.util.ObjectUtils;

@Slf4j
@Component
public class LprNvmsDeviceNotifyConsumer {

	@Value("${feign.cdevice.url:http://lprcommon-test.testdolphin.com/cdevice-manage}")
    private String deviceUrl;
	
	private static final String cacheSiteAreaPathSuffix = "_siteAreaPath";
	private static final String cacheSiteIdSuffix = "_siteId";

	@Autowired
	private KafkaTemplate kafkaTemplate;

	@Resource
	private NvmsFegin nvmsFegin;

	@Value("${lpr.nvms.device.confirm.topic:lpr-nvms-device-confirm}")
	private String nvmConfirmTopic;

	@Resource
	private LprSystemLocationDao lprSystemLocationDao;

	@Resource
	private VideoAnalysisDeviceVisualDao videoAnalysisDeviceVisualDao;

	@Resource
	private LprBackFegin lprBackFegin;
	
	 @KafkaListener(topics = "${lpr.nvms.device.notigy.topic:lpr-nvms-device-notify}", containerFactory = "batchNoByteFactory" )
	 public void consumer(List<Object> message) {
		 log.info("######start receive nvms notify, msg: {}", message.size());
		 if (!CollectionUtil.isEmpty(message)) {
        	 
        	 for(int i = 0; i < message.size(); i++) {
        		 List<NvmsNotifyInfoDto> areaList = new ArrayList<NvmsNotifyInfoDto>();
             	 List<NvmsNotifyInfoDto> cameraList = new ArrayList<NvmsNotifyInfoDto>();
				 List<NvmsNotifyInfoDto> emirateList = new ArrayList<NvmsNotifyInfoDto>();
				 List<NvmsNotifyInfoDto> cityList = new ArrayList<NvmsNotifyInfoDto>();
        		 log.info("######msaage info:{}", message.get(i));
        		 if(message.get(i) == null) {
        			 continue;
        		 }
        		 try {
        			 //JSONObject msg = JSONObject.parseObject(String.valueOf(message.get(i)));
        			 NvmsNotifyInfoDto dto = JSONObject.parseObject(String.valueOf(message.get(i)), NvmsNotifyInfoDto.class);
        			 if(dto != null) {
        				 if(NvmsNotifyTypeEnum.Area.getValue().equalsIgnoreCase(dto.getType())) {
							 if(NvmsNotifyAreaTypeEnum.Emirate.getValue().equalsIgnoreCase(dto.getArea().getString("areaType"))){
								 emirateList.add(dto);
							 }else if(NvmsNotifyAreaTypeEnum.City.getValue().equalsIgnoreCase(dto.getArea().getString("areaType"))){
								 cityList.add(dto);
							 }else if(NvmsNotifyAreaTypeEnum.Site.getValue().equalsIgnoreCase(dto.getArea().getString("areaType"))){
								 areaList.add(dto);
							 }
		        		 }else if(NvmsNotifyTypeEnum.Camera.getValue().equalsIgnoreCase(dto.getType())) {
		        			 cameraList.add(dto);
		        		 }else {
		        			 log.info("msaage type exception:{}", dto.getType());
		        		 }
        			 }
					 if(!CollectionUtil.isEmpty(areaList)) {
						 processSiteInfo(areaList);
					 }

					 if(!CollectionUtil.isEmpty(cameraList)) {
						 boolean isDelete = processCameraInfo(cameraList);
						 checkNeedSendAutoAnalysis(cameraList,isDelete);
					 }
					 if(!CollectionUtil.isEmpty(emirateList)) {
//						 processEmirate(emirateList);
					 }
					 if(!CollectionUtil.isEmpty(cityList)) {
//						 processCity(cityList);
					 }
					 //send kafka to receiveStatus
					 ackKafkaValue(dto);
        		 }catch(Exception e) {
        			 log.error("receive nvms notify parse exception:{}", e.getMessage());
        			 log.error(e.getMessage(), e);
					 continue;
        		 }
			 }
        }        
	 }

	 private void checkNeedUpdateCameraStatus(String nvmsId){
		 log.info("checkNeedUpdateCameraStatus");
		 if(StringUtils.isEmpty(nvmsId)){
			 return;
		 }
		 List<VideoAnalysisVisualDevice> deviceByNvmsId = videoAnalysisDeviceVisualDao.findDeviceByNvmsId(nvmsId, Arrays.asList("1", "4"));
		 if(CollectionUtil.isEmpty(deviceByNvmsId)){
			 return;
		 }
		 log.info("update nvmsId={},cameraStatus and licenseStatus",nvmsId);
		 //update cameraStatus and licenseStatus
		 Map<String, String> params = new HashMap<>();
		 params.put("pageNo", "0");
		 params.put("pageSize", "1000");
		 List<String> codes = new ArrayList<String>();
		 codes.add(nvmsId.replace("-", ""));
		 if(CollectionUtil.isEmpty(codes)){
			 log.warn("can't find checkNeedUpdateCameraStatus id,update camera error.");
			 return;
		 }
		 params.put("f_in_deviceAttr."+Const.LPR_CAMERA_TYPE.toLowerCase()+".cameraCode", String.join(",", codes));
		 List<CameraInfoDto> res = new ArrayList<>();
		 Boolean hasNextPage = true;
		 while (hasNextPage){
			 Page<CameraInfoDto> page = findDevicesList(params);
			 if(page != null && page.getContent() != null && page.getContent().size() == 1000){
				 Integer pg = Integer.parseInt(params.get("pageNo"));
				 params.put("pageNo", String.valueOf(pg+1));
			 }else{
				 hasNextPage = false;
			 }
			 res.addAll(page.getContent());
		 }

		 if(CollectionUtil.isEmpty(res)){
			 log.info("result is empty don't checkNeedUpdateCameraStatus");
		 }else {
			 CameraInfoDto dto = res.get(0);
			 JSONObject request = new JSONObject();
			 JSONObject attr = new JSONObject();
			 if(!ObjectUtils.isEmpty(dto.getCameraName())) {
				 request.put("name",dto.getCameraName());
			 }
			 //NVMS topic: first add or update camera, set default value; don't use origin status
			 attr.put("cameraStatus", NvmsNotifyCameraStatusEnum.Online.getValue());
			 attr.put("licenseStatus", "Authorized");
			 request.put("civilCode", "100000");  // mandatory fields
			 request.put("accessProtocol", 0);  // mandatory fields
			 request.put("typeCode", "123");  // mandatory fields
			 request.put("deleteFlg", 0);  // mandatory fields


			 JSONObject sType = new JSONObject();
			 sType.put(Const.LPR_CAMERA_TYPE.toLowerCase(), attr);
			 request.put("deviceAttr", sType);
			 String url = deviceUrl + "/devices/audit/"+dto.getId();
			 log.info("checkNeedUpdateCameraStatus update device request URL: {}, request:{}", url, request.toJSONString());
			 String responseStr = RestTemplateUtil.request(url, HttpMethod.PUT, request, "");
			 log.info("checkNeedUpdateCameraStatus update device response: {}", responseStr);
		 }

	 }


	 private void ackKafkaValue(NvmsNotifyInfoDto dto){
		 NvmsNotifyInfoReceiveDto receiveDto = new NvmsNotifyInfoReceiveDto();
		 receiveDto.setType(dto.getType());
		 receiveDto.setOperation(dto.getOperation());
		 JSONObject mappingObj = new JSONObject();
		 String kafkaKey = "";
		 if(null != dto.getArea()){
			 kafkaKey = dto.getArea().getString("id");
			 mappingObj.put("sourceProduct","NVMS");
			 mappingObj.put("sourceId",dto.getArea().getString("id"));
			 mappingObj.put("targetId",dto.getArea().getString("id").replaceAll("-",""));
		 }else if(null != dto.getCamera()){
			 kafkaKey = dto.getCamera().getString("id");
			 mappingObj.put("sourceProduct","NVMS");
			 mappingObj.put("sourceId",dto.getCamera().getString("id"));
			 mappingObj.put("targetId",dto.getCamera().getString("id").replaceAll("-",""));
		 }else {
			 kafkaKey = UUID.randomUUID().toString();
			 mappingObj.put("sourceProduct","");
			 mappingObj.put("sourceId","");
			 mappingObj.put("targetId","");
		 }
		 mappingObj.put("targetProduct","TRAFFIC");
		 mappingObj.put("lastModifiedTime",new Date());
		 receiveDto.setMapping(mappingObj);
		 kafkaTemplate.send(nvmConfirmTopic,kafkaKey,JSONObject.toJSONString(receiveDto));
	 }
	 
	 /**
	  * handle the site info
	  * @param areaList
	  */
	 private void processSiteInfo(List<NvmsNotifyInfoDto> areaList) {
		 List<NvmsNotifyInfoDto> addList = new ArrayList<NvmsNotifyInfoDto>();
		 List<NvmsNotifyInfoDto> deleteList = new ArrayList<NvmsNotifyInfoDto>();
		 List<NvmsNotifyInfoDto> updateList = new ArrayList<NvmsNotifyInfoDto>();

		 Map<String, List<NvmsNotifyInfoDto>> resultList = areaList.stream().collect(Collectors.groupingBy(NvmsNotifyInfoDto::getOperation));
		 if(!resultList.isEmpty()) {
			 addList = resultList.get(NvmsNotifyOperationEnum.ADD.getValue());
			 deleteList = resultList.get(NvmsNotifyOperationEnum.DELETE.getValue());
			 updateList = resultList.get(NvmsNotifyOperationEnum.UPDATE.getValue());
			 
			 if (!CollectionUtil.isEmpty(addList)) {
				 addSiteInfo(addList,true);
			 }
			 
			 if (!CollectionUtil.isEmpty(deleteList)) {
				 deleteSiteInfo(deleteList);
			 }
			 if (!CollectionUtil.isEmpty(updateList)) {
				 updateSiteInfo(updateList);
			 }
		 }
	 }
	
	
	 /**
	  *  handle the camera info
	  *  
	  * @param cameraList
	  */
	 private boolean processCameraInfo(List<NvmsNotifyInfoDto> cameraList) {
		 List<NvmsNotifyInfoDto> addList = new ArrayList<NvmsNotifyInfoDto>();
		 List<NvmsNotifyInfoDto> deleteList = new ArrayList<NvmsNotifyInfoDto>();
		 List<NvmsNotifyInfoDto> updateList = new ArrayList<NvmsNotifyInfoDto>();

		 Map<String, List<NvmsNotifyInfoDto>> resultList = cameraList.stream().collect(Collectors.groupingBy(NvmsNotifyInfoDto::getOperation));
		 if(!resultList.isEmpty()) {
			 addList = resultList.get(NvmsNotifyOperationEnum.ADD.getValue());
			 deleteList = resultList.get(NvmsNotifyOperationEnum.DELETE.getValue());
			 updateList = resultList.get(NvmsNotifyOperationEnum.UPDATE.getValue());
			 
			 if (!CollectionUtil.isEmpty(addList)) {
				 addCameraInfo(addList,true);
			 }
			 
			 if (!CollectionUtil.isEmpty(deleteList)) {
				 deleteCameraInfo(deleteList);
				 return true;
			 }
			 if (!CollectionUtil.isEmpty(updateList)) {
				 updateCameraInfo(updateList);
			 }
		 }
		 return false;
	 }
	 
	 /**
	  * add site
	  * @param areaList
	  */
	 private void addSiteInfo(List<NvmsNotifyInfoDto> areaList,boolean needCheck) {
		 if(needCheck){
			 if(checkSiteExit(areaList)){
				return;
			 }
		 }

		 JSONObject deviceList = new JSONObject();
		 JSONArray array = new JSONArray();
		 for(NvmsNotifyInfoDto dto : areaList) {
			 JSONObject msg = dto.getArea();
			 JSONObject request = generateSiteRequst(msg);
		     array.add(request);
		     deviceList.put("deviceList", array);
		 }
		 
		 String url = deviceUrl + "/devices/audit/batch"; ///devices
	     log.info("add site request URL: {}, request:{}", url, deviceList.toJSONString());
	     String responseStr = RestTemplateUtil.request(url, HttpMethod.POST, deviceList, "");
	     log.info("create site response: {}", responseStr);
	     setSiteInfoToRedis(responseStr, array, true);
//		 addSiteInfoToDb(array.getJSONObject(0));
	 }

	/**
	 *
	 * @param msg
	 */
	private void addSiteInfoToDb(JSONObject msg){
		String parentCode = msg.getJSONObject("deviceAttr").getJSONObject("site").getString("city");
		LprSystemLocationEntity parentEntity = lprSystemLocationDao.findByCode(parentCode);
		if(null == parentEntity){
			return;
		}
		List<LprSystemLocationEntity> codeLevelEntityList = lprSystemLocationDao.findByCodeLevelAndParentCode(Const.LPR_LOCATION_CODE_LEVEL_2,parentCode);
		LprSystemLocationEntity entity =new LprSystemLocationEntity();
		if(CollectionUtil.isNotEmpty(codeLevelEntityList)){
			Long sortIndex = codeLevelEntityList.stream().max(Comparator.comparing(LprSystemLocationEntity::getSortIndex)).get().getSortIndex();
			entity.setCode(parentEntity.getCode() + "_" + (sortIndex + 1));
			entity.setSortIndex(sortIndex + 1);
		}else {
			entity.setCode(parentEntity.getCode() + "_1");
			entity.setSortIndex(1l);
		}
		entity.setName(msg.getString("name"));
		entity.setDescription(msg.getString("name"));
		entity.setPath(parentEntity.getPath() + parentEntity.getName() + "/");
		entity.setStatus(0);
		entity.setParentCode(parentEntity.getCode());
		entity.setCodeLevel(parentEntity.getCodeLevel() + 1);

		entity.setCodeType("location");
		lprSystemLocationDao.save(entity);
	 }

	/**
	 *
	 * @param areaList
	 * @return false not exit need add , return true exit don't need add
	 */
	 private boolean checkSiteExit(List<NvmsNotifyInfoDto> areaList){
		 Map<String, String> params = new HashMap<>();
		 params.put("pageNo", "0");
		 params.put("pageSize", "1000");
		 List<String> codes = new ArrayList<String>();
		 Map<String, JSONObject> areaMap = new HashMap<String, JSONObject>();
		 areaList.forEach(item ->{
			 if(item.getArea() != null && StringUtils.isNotBlank(item.getArea().getString("id"))) {
				 codes.add(item.getArea().getString("id").replace("-", ""));
				 areaMap.put(item.getArea().getString("id").replace("-", ""), item.getArea());
			 }
		 });
		 if(CollectionUtil.isEmpty(codes)){
			 log.warn("can't find id,checkSiteExit error。");
			 return true;
		 }
		 params.put("f_in_deviceAttr."+Const.LPR_SITE_TYPE.toLowerCase()+".code", String.join(",", codes));
		 Page<CameraInfoDto> page = findDevicesList(params);
		 if(CollectionUtil.isEmpty(page.getContent())){
			 return false;
		 }else {
			 return true;
		 }
	 }


	 /**
	  * delete site
	  * @param areaList
	  */
	 private void deleteSiteInfo(List<NvmsNotifyInfoDto> areaList) {
		 Map<String, String> params = new HashMap<>();
	     params.put("pageNo", "0");
	     params.put("pageSize", "1000");
	     List<String> codes = new ArrayList<String>();
	     areaList.forEach(item ->{
	    	 if(item.getArea() != null && StringUtils.isNotBlank(item.getArea().getString("id"))) {
	    		 codes.add(item.getArea().getString("id").replace("-", ""));
	    	 }
	     });
	     
	     if(CollectionUtil.isEmpty(codes)) {
	    	 log.info("######delete site id is null");
	    	 return;
	     }
	     params.put("f_in_deviceAttr."+Const.LPR_SITE_TYPE.toLowerCase()+".code", String.join(",", codes));
	     
	     List<CameraInfoDto> res = new ArrayList<>();
	     Boolean hasNextPage = true;
	     while (hasNextPage){
	    	 Page<CameraInfoDto> page = findDevicesList(params);
	         if(page != null && page.getContent() != null && page.getContent().size() == 1000){
	        	 Integer pg = Integer.parseInt(params.get("pageNo"));
	             params.put("pageNo", String.valueOf(pg+1));
	         }else{
	        	 hasNextPage = false;
	         }
	         res.addAll(page.getContent());
	    }
	        
	    if(CollectionUtil.isEmpty(res)) {
	    	log.info("######delete site query site is null");
	    	return;
	    }
	     
	    List<String> ids = res.stream().map(CameraInfoDto::getId).collect(Collectors.toList());
	    Map<String, String> request = new HashMap<>();
        request.put("f_eq_deviceType", Const.LPR_SITE_TYPE);
        request.put("f_in_id", String.join(",", ids));
        String url = deviceUrl + "/devices/audit/deleteDeviceByCondition";
        log.info("delete site request URL: {}, request:{}", url, request);
        String responseStr = RestTemplateUtil.request(url, HttpMethod.POST, request, "");
        log.info("delete site response: {}", responseStr);
        
        res.forEach(item ->{
        	if(StringUtils.isNotBlank(item.getAreaPath())) {
        		if(CacheUtils.get(item.getAreaPath()+cacheSiteAreaPathSuffix) != null) {
        			CacheUtils.removeKey(item.getAreaPath()+cacheSiteAreaPathSuffix); //remove redis cache
        		}
        	}
        });
	 }
	 
	 /**
	  * update site
	  * @param areaList
	  */
	 private void updateSiteInfo(List<NvmsNotifyInfoDto> areaList) {
		 Map<String, String> params = new HashMap<>();
	     params.put("pageNo", "0");
	     params.put("pageSize", "1000");
	     List<String> codes = new ArrayList<String>();
	     Map<String, JSONObject> areaMap = new HashMap<String, JSONObject>();
	     areaList.forEach(item ->{
	    	 if(item.getArea() != null && StringUtils.isNotBlank(item.getArea().getString("id"))) {
	    		 codes.add(item.getArea().getString("id").replace("-", ""));
	    		 areaMap.put(item.getArea().getString("id").replace("-", ""), item.getArea());
	    	 }
	     });
		 if(CollectionUtil.isEmpty(codes)){
			 log.warn("can't find id,update siteinfo error。");
			 return;
		 }
	     params.put("f_in_deviceAttr."+Const.LPR_SITE_TYPE.toLowerCase()+".code", String.join(",", codes));
	     
	     List<CameraInfoDto> res = new ArrayList<>();
	     Boolean hasNextPage = true;
	     while (hasNextPage){
	    	 Page<CameraInfoDto> page = findDevicesList(params);
	         if(page != null && page.getContent() != null && page.getContent().size() == 1000){
	        	 Integer pg = Integer.parseInt(params.get("pageNo"));
	             params.put("pageNo", String.valueOf(pg+1));
	         }else{
	        	 hasNextPage = false;
	         }
	         res.addAll(page.getContent());
	     }
		 if(CollectionUtil.isEmpty(res)){
			 //create
			 addSiteInfo(areaList,false);
		 }else {
			 //update
			 for(CameraInfoDto dto : res) {
				 JSONObject msg = areaMap.get(dto.getCode());
				 JSONObject request = generateSiteRequst(msg);

				 String url = deviceUrl + "/devices/audit/"+dto.getId();
				 log.info("update site request URL: {}, request:{}", url, request.toJSONString());
				 String responseStr = RestTemplateUtil.request(url, HttpMethod.PUT, request, "");
				 log.info("update site response: {}", responseStr);

				 JSONArray array = new JSONArray();
				 array.add(request);
				 setSiteInfoToRedis(responseStr, array, false);
			 }

		 }
	 }
	 
	 
	 private JSONObject generateSiteRequst(JSONObject msg) {
		 JSONObject request = new JSONObject();
		 if(StringUtils.isNoneBlank(msg.getString("name"))) {
			 request.put("name", msg.getString("name"));
		 }			 
		 JSONObject attributes = msg.getJSONObject("attributes");
		 if(attributes != null) {
			 if(attributes.get("longitude") != null) {
				 request.put("longitude", attributes.getDouble("longitude")); //longitude
			 }
			 if(attributes.get("latitude") != null) {
				 request.put("latitude", attributes.getDouble("latitude"));  //latitude
			 }
		 }
	     request.put("deviceType",Const.LPR_SITE_TYPE);

		 //blind location

	     String id = msg.getString("id");
		 if(!StringUtils.isEmpty(id)){
			 id = id.replace("-", "");
		 }

	     JSONObject attr = new JSONObject();
	     attr.put("code", id);
		 //find site with location relation

	     if(StringUtils.isNoneBlank(msg.getString("areaType"))) {
	    	 attr.put("areaType", msg.getString("areaType"));  //areaType
	     }
	     if(StringUtils.isNotBlank(msg.getString("siteType"))) {
	    	 if(NvmsNotifySiteTypeEnum.getValueByLable(msg.getString("siteType")) != null) {
		    	 attr.put("siteType", NvmsNotifySiteTypeEnum.getValueByLable(msg.getString("siteType")));  //siteType   4 Hotel  5 Mall  6 Gantry  7 FE1  8 FE2  9 others
		     }else {
		    	 attr.put("siteType", NvmsNotifySiteTypeEnum.Others.getValue());  //siteType   4 Hotel  5 Mall  6 Gantry  7 FE1  8 FE2  9 others
		     }
	    	 
	    	 if(NvmsNotifySiteTypeEnum.Gantry.getLable().equalsIgnoreCase(msg.getString("siteType"))) {
	    		 attr.put("gantryId", id);
	    	 }
	     }
		 attr = findSiteLocationRelation(msg,attr);
	     if(StringUtils.isNotEmpty(msg.getString("areaPath"))) {
	    	 attr.put("areaPath", msg.getString("areaPath"));  //areaPath
//	    	 String[] path = msg.getString("areaPath").split("/");
//	    	 if(path.length >2) {
//	    		 attr.put("emirate", path[1]);
//			     attr.put("city", path[2]);
//	    	 }
	     }
	     
	     JSONObject sType = new JSONObject();
	     sType.put(Const.LPR_SITE_TYPE.toLowerCase(), attr);
	     request.put("deviceAttr", sType);
	     
	     request.put("civilCode", "100000");  // mandatory fields
	     request.put("accessProtocol", 0);  // mandatory fields
	     request.put("typeCode", "123");  // mandatory fields
	     request.put("deleteFlg", 0);  // mandatory fields
	     
	     if(StringUtils.isNotEmpty(msg.getString("areaPath"))) {
	    	 CacheUtils.put(msg.getString("areaPath")+cacheSiteAreaPathSuffix, id); //SET the areaPath to redis
	     }
	     return request;
	 }

	private JSONObject findSiteLocationRelation(JSONObject msg,JSONObject jsonObject){
		if(ObjectUtils.isEmpty(msg.get("areaPath"))){
			return jsonObject;
		}
		///UAE/Abu Dhabi/Abu Dhabi City/
		String areaPath = msg.getString("areaPath");
		List<String> pathList = Arrays.asList(areaPath.split("/"));
		jsonObject.put("areaPath",areaPath);
		//site just like this /UAE/Abu Dhabi/
		if(pathList.size()<=3){
			String emirate = pathList.get(pathList.size() - 1);
			List<LprSystemLocationEntity> emirateList = lprSystemLocationDao.findByCodeLevelAndName(Const.LPR_LOCATION_CODE_LEVEL_2,emirate);
			if(CollectionUtil.isEmpty(emirateList)){
				return jsonObject;
			}
			//check type exist
			String type = NvmsNotifySiteTypeEnum.getMysqlValueByValue(jsonObject.getString("siteType"));
			LprSystemLocationEntity lprSystemLocationEntity = lprSystemLocationDao.findByPathAndName(areaPath,type);
			if(null == lprSystemLocationEntity && !NvmsNotifySiteTypeEnum.Others.getMysqlValue().equals(type)){
				//make /UAE/Abu Dhabi/Abu Dhabi City/ to /UAE/Abu Dhabi/
				StringBuffer newAreaPath = new StringBuffer();
				for(int num = 0; num < pathList.size() - 1 ;num++){
					newAreaPath.append(pathList.get(num)).append("/");
				}
				LprSystemLocationEntity byPathAndName = lprSystemLocationDao.findByPathAndName(newAreaPath.toString(), pathList.get(pathList.size() - 1));
				if(null != byPathAndName){
					//add five kindof type
//					lprSystemLocationEntity = addDefaultType(jsonObject.getString("siteType"),byPathAndName);
					//no need add sitetype
					lprSystemLocationEntity = new LprSystemLocationEntity();
					lprSystemLocationEntity.setParentCode(byPathAndName.getCode());
				}else {
					log.warn("could not find data,areaPath is {}, name is {}",newAreaPath.toString(),pathList.get(pathList.size() - 1));
				}
			}
			jsonObject.put("region",lprSystemLocationEntity.getParentCode());
			jsonObject.put("city",lprSystemLocationEntity.getParentCode());
			jsonObject.put("emirate",emirate);
		}else {
			//Abu Dhabi City don't need
//			String region = pathList.get(pathList.size() - 1);
			String type = NvmsNotifySiteTypeEnum.getMysqlValueByValue(jsonObject.getString("siteType"));
			//Abu Dhabi
			String emirate = pathList.get(2);
			if(StringUtils.isBlank(type) || StringUtils.isEmpty(emirate)){
				return jsonObject;
			}
			//need check right type
			//find localCode
			LprSystemLocationEntity lprSystemLocationEntity = lprSystemLocationDao.findByPathAndName(areaPath,type);
			if(null == lprSystemLocationEntity && !NvmsNotifySiteTypeEnum.Others.getMysqlValue().equals(type)){
				//make /UAE/Abu Dhabi/Abu Dhabi City/ to /UAE/Abu Dhabi/
				StringBuffer newAreaPath = new StringBuffer();
				for(int num = 0; num < pathList.size() - 1 ;num++){
					newAreaPath.append(pathList.get(num)).append("/");
				}
				LprSystemLocationEntity byPathAndName = lprSystemLocationDao.findByPathAndName(newAreaPath.toString(), pathList.get(pathList.size() - 1));
				if(null != byPathAndName){
					//add five kindof type
//					lprSystemLocationEntity = addDefaultType(jsonObject.getString("siteType"),byPathAndName);
					lprSystemLocationEntity = new LprSystemLocationEntity();
					lprSystemLocationEntity.setParentCode(byPathAndName.getCode());
				}else {
					log.warn("could not find data,areaPath is {}, name is {}",newAreaPath,pathList.get(pathList.size() - 1));
				}
			}
			String regionCode = lprSystemLocationEntity.getParentCode();
			jsonObject.put("region",regionCode);
			jsonObject.put("city",regionCode);
			jsonObject.put("emirate",emirate);
		}
		return jsonObject;
	}

	/**
	 * add defaultType
	 * @param typeString like 4 5 6 7 8 9
	 * @param entity is parentEntity
	 * @return
	 */
	private LprSystemLocationEntity addDefaultType(String typeString,LprSystemLocationEntity entity){
		LprSystemLocationEntity returnEntity = null;
		List<String> typeListCode = Arrays.asList("4","5","6","7","8");
		List<String> typeList = Arrays.asList("Hotels","Malls","Gantry","FE1","FE2");
 		//add Hotels Malls Gantry FE1 FE2 Others
		int x = 4;
		int typeListCodeNum = 0;
		List<LprSystemLocationEntity> listEntity = new ArrayList<>();
		for(String type : typeList){
			LprSystemLocationEntity model = new LprSystemLocationEntity();
			model.setParentCode(entity.getCode());
			model.setCode(entity.getCode() + "_" + x);
			model.setSortIndex(Long.valueOf(x));
			model.setName(type);
			model.setDescription(type);
			model.setPath(entity.getPath() + entity.getName() + "/");
			model.setStatus(0);
			model.setCodeLevel(4);
			model.setAreaType(1);
			model.setCodeType("location");
			listEntity.add(model);
			if(typeListCode.get(typeListCodeNum).equals(typeString)){
				returnEntity = model;
			}
			typeListCodeNum++;
			x++;
		}
		lprSystemLocationDao.saveAllAndFlush(listEntity);
		return returnEntity;
	}


	 /**
	  * set site info to redis cache
	  * @param responseStr
	  * @param array
	  */
	 private void setSiteInfoToRedis(String responseStr,JSONArray array, boolean addFlag) {
		 try {
			 if(responseStr != null && "0".equals(JSON.parseObject(responseStr).getString("code"))){
				 JSONArray arrayIds = new JSONArray();
				 if(addFlag) {
					 arrayIds = JSON.parseObject(responseStr).getJSONObject("result").getJSONArray("successIds");
				 }
		    	 for(int i=0; i <array.size(); i++) {
		    		 JSONObject request = array.getJSONObject(i);
		    		 String id = "";
		    		 if(addFlag) {
		    			 id = String.valueOf(arrayIds.get(i));
		    		 }else {
		    			 id = JSON.parseObject(responseStr).getString("result"); //update device //{"code":"0","result":"b6f65ec71e064d269ae3d40041c1d4c4","status":200,"timeElapsed":107,"timestamp":1692861121938}
		    		 }
		    		 
		    		 CacheUtils.put(request.getJSONObject("deviceAttr").getJSONObject(Const.LPR_SITE_TYPE.toLowerCase()).getString("code")+cacheSiteIdSuffix, id);
		    	 }
		     }
		 }catch(Exception e){
			 log.error("set site info to redis cache exception:{}", e.getMessage());
			 log.error(e.getMessage(), e);
		 }
		 
	 }
	 
	 
	 /**
	  * add camera
	  * @param areaList
	  */
	 private void addCameraInfo(List<NvmsNotifyInfoDto> areaList,boolean needCheckExit) {
		 if(needCheckExit){
			 if(checkCameraExit(areaList)){
				 return;
			 }
		 }
		 log.info("addCameraInfo(), camera size: {}", areaList.size());
		 JSONObject deviceList = new JSONObject();
		 JSONArray array = new JSONArray();
		 for(NvmsNotifyInfoDto dto : areaList) {
			 //JSONObject msg = dto.getMessage();
			 JSONObject msg = dto.getCamera();
			 if(msg == null) {
				 log.info("######camera is null");
				 continue;
			 }
			 JSONObject request = generateCameraRequest(msg, true);
		     array.add(request);
		     deviceList.put("deviceList", array);
		 }
		 if(deviceList.size() ==0) {
			 return;
		 }
		 String url = deviceUrl + "/devices/audit/batch"; ///devices
	     log.info("add camera request URL: {}, request:{}", url, deviceList.toJSONString());
	     String responseStr = RestTemplateUtil.request(url, HttpMethod.POST, deviceList, "");
	     log.info("create camera response: {}", responseStr);
	 }

	/**
	 * checkCameraExit
	 * @param areaList
	 * @return return false not exit need add , return true exit don't need add
	 */
	private boolean checkCameraExit(List<NvmsNotifyInfoDto> areaList){
		 Map<String, String> params = new HashMap<>();
		 params.put("pageNo", "0");
		 params.put("pageSize", "1000");
		 List<String> codes = new ArrayList<String>();
		 Map<String, JSONObject> areaMap = new HashMap<String, JSONObject>();
		 areaList.forEach(item ->{
			 if(item.getCamera() != null && StringUtils.isNotBlank(item.getCamera().getString("id"))) {
				 codes.add(item.getCamera().getString("id").replace("-", ""));
				 areaMap.put(item.getCamera().getString("id").replace("-", ""), item.getCamera());
			 }
		 });

		 if(CollectionUtil.isEmpty(codes)){
			 log.warn("can't find id,checkCameraExit error.");
			 return true;
		 }
		 params.put("f_in_deviceAttr."+Const.LPR_CAMERA_TYPE.toLowerCase()+".cameraCode", String.join(",", codes));

		Page<CameraInfoDto> page = findDevicesList(params);
		if(CollectionUtil.isEmpty(page.getContent())){
			return false;
		}else {
			return true;
		}

	 }
	 
	 /**
	  * delete camera
	  * @param areaList
	  */
	 private void deleteCameraInfo(List<NvmsNotifyInfoDto> areaList) {
		 Map<String, String> params = new HashMap<>();
	     params.put("pageNo", "0");
	     params.put("pageSize", "1000");
	     List<String> codes = new ArrayList<String>();
	     areaList.forEach(item ->{
	    	 if(item.getCamera() != null && StringUtils.isNotBlank(item.getCamera().getString("id"))) {
	    		 codes.add(item.getCamera().getString("id").replace("-", ""));
	    	 }
	     });
	     if(CollectionUtil.isEmpty(codes)) {
	    	 log.info("######delete camera id is null");
	    	 return;
	     }
	     params.put("f_in_deviceAttr."+Const.LPR_CAMERA_TYPE.toLowerCase()+".cameraCode", String.join(",", codes));
	     
	     List<CameraInfoDto> res = new ArrayList<>();
	     Boolean hasNextPage = true;
	     while (hasNextPage){
	    	 Page<CameraInfoDto> page = findDevicesList(params);
	         if(page != null && page.getContent() != null && page.getContent().size() == 1000){
	        	 Integer pg = Integer.parseInt(params.get("pageNo"));
	             params.put("pageNo", String.valueOf(pg+1));
	         }else{
	        	 hasNextPage = false;
	         }
	         res.addAll(page.getContent());
	    }
	     if(CollectionUtil.isEmpty(res)) {
	    	 log.info("######delete camera query camera is null");
	    	 return;
	     } 
	        
	    List<String> ids = res.stream().map(CameraInfoDto::getId).collect(Collectors.toList());
	    Map<String, String> request = new HashMap<>();
        request.put("f_eq_deviceType", Const.LPR_CAMERA_TYPE);
        request.put("f_in_id", String.join(",", ids));
        String url = deviceUrl + "/devices/audit/deleteDeviceByCondition";
        log.info("delete device request URL: {}, request:{}", url, request);
        String responseStr = RestTemplateUtil.request(url, HttpMethod.POST, request, "");
        log.info("delete device response: {}", responseStr);
	 }
	 
	 /**
	  * update camera
	  * @param areaList
	  */
	 private void updateCameraInfo(List<NvmsNotifyInfoDto> areaList) {
		 Map<String, String> params = new HashMap<>();
	     params.put("pageNo", "0");
	     params.put("pageSize", "1000");
	     List<String> codes = new ArrayList<String>();
	     Map<String, JSONObject> areaMap = new HashMap<String, JSONObject>();
	     areaList.forEach(item ->{
	    	 if(item.getCamera() != null && StringUtils.isNotBlank(item.getCamera().getString("id"))) {
	    		 codes.add(item.getCamera().getString("id").replace("-", ""));
	    		 areaMap.put(item.getCamera().getString("id").replace("-", ""), item.getCamera());
	    	 }
	     });

		 if(CollectionUtil.isEmpty(codes)){
			 log.warn("can't find id,update camera error.");
			 return;
		 }

	     params.put("f_in_deviceAttr."+Const.LPR_CAMERA_TYPE.toLowerCase()+".cameraCode", String.join(",", codes));
	     
	     List<CameraInfoDto> res = new ArrayList<>();
	     Boolean hasNextPage = true;
	     while (hasNextPage){
	    	 Page<CameraInfoDto> page = findDevicesList(params);
	         if(page != null && page.getContent() != null && page.getContent().size() == 1000){
	        	 Integer pg = Integer.parseInt(params.get("pageNo"));
	             params.put("pageNo", String.valueOf(pg+1));
	         }else{
	        	 hasNextPage = false;
	         }
	         res.addAll(page.getContent());
	     }

		 if(CollectionUtil.isEmpty(res)){
			 //create
			 addCameraInfo(areaList,false);
		 }else {
			 for(CameraInfoDto dto : res) {
				 JSONObject msg = areaMap.get(dto.getCameraCode());
				 JSONObject request = generateCameraRequest(msg, false);

				 String url = deviceUrl + "/devices/audit/"+dto.getId();
				 log.info("update device request URL: {}, request:{}", url, request.toJSONString());
				 String responseStr = RestTemplateUtil.request(url, HttpMethod.PUT, request, "");
				 log.info("update device response: {}", responseStr);
			 }
		 }
	 }
	 
	 
	 private JSONObject generateCameraRequest(JSONObject msg, Boolean addFlag) {
		 JSONObject request = new JSONObject();
		 if(!ObjectUtils.isEmpty(msg.get("name"))) {
			 request.put("name", msg.getString("name"));
			 request.put("viidId", msg.getString("name"));
		 }
		 JSONObject attributes = msg.getJSONObject("attributes");
		 if(attributes != null) {
			 if(attributes.get("longitude") != null) {
				 request.put("longitude", attributes.getDouble("longitude")); //longitude
			 }
			 if(attributes.get("latitude") != null) {
				 request.put("latitude", attributes.getDouble("latitude"));  //latitude
			 }
			 if(attributes.get("tsiIP") != null) {
				 request.put("ipv4", attributes.getString("tsiIP"));  //"tsiIP"
			 }
		 }
	     request.put("deviceType",Const.LPR_CAMERA_TYPE);


	     JSONObject attr = new JSONObject();
	     //attr.put("cameraCode", msg.getString("id"));  //siteCode
		 if(!ObjectUtils.isEmpty(msg.get("id"))){
			 attr.put("cameraCode", msg.getString("id").replace("-", ""));  //siteCode
		 }
		 // not use
//	     if(!ObjectUtils.isEmpty(msg.get("cameraType"))) {
//	    	 if(NvmsNotifyCameraTypeEnum.getValueByLable(msg.getString("cameraType")) != null) {
//	    		 attr.put("cameraForm", NvmsNotifyCameraTypeEnum.getValueByLable(msg.getString("cameraType")));
//	    	 }
//	     }
		 Map<String,String> relationMap = findDeviceSiteRelation(msg);
		 if(StringUtils.isNotBlank(relationMap.get("siteCode"))){
			 attr.put("siteCode", relationMap.get("siteCode").replace("-", ""));
		 }
		 if(StringUtils.isNotBlank(relationMap.get("cameraSource"))){
			 attr.put("cameraForm", NvmsNotifyCameraSourceEnum.getLabelByValue(relationMap.get("cameraSource")));
		 }

	     //TODO
	     if(StringUtils.isNotBlank(relationMap.get("cameraSource"))){
			 attr.put("cameraSource",NvmsNotifyCameraSourceEnum.getLabelByValue(relationMap.get("cameraSource"))); //CameraSource  //1、Hotel & Mall 2、MCC-LPR  3、Central-VMS(DH)  4、Central-VMS(HW)
	     }else{
			 attr.put("cameraSource","1"); //CameraSource
			 // 1、Hotel & Mall 2、MCC-LPR Grantry 3、Central-VMS(DH)  4、Central-VMS(HW)
	     }
	     

	     
	     if(msg.getJSONArray("endpoints") != null) {
	    	 JSONArray endpoints = msg.getJSONArray("endpoints");
	    	 for(int i =0; i< endpoints.size(); i++) {
	    		 JSONObject obj = endpoints.getJSONObject(i);
				 if(!ObjectUtils.isEmpty(obj.get("protocol")) && !ObjectUtils.isEmpty(obj.get("url"))){
					 if("RTSP".equalsIgnoreCase(obj.getString("protocol"))) {
						 attr.put("StreamURL", obj.getString("url"));
						 //break;
					 }
					 if("Gantry".equalsIgnoreCase(obj.getString("protocol"))) {
						 request.put("viidId", obj.getString("url"));  //TODO Gantry，0807 for update
					 }
				 }

	    	 }
	     }

		 if(msg.getJSONArray("edgeEndpoints") != null) {
			 JSONArray endpoints = msg.getJSONArray("edgeEndpoints");
			 for(int i =0; i< endpoints.size(); i++) {
				 JSONObject obj = endpoints.getJSONObject(i);
				 if(!ObjectUtils.isEmpty(obj.get("protocol")) && !ObjectUtils.isEmpty(obj.get("url"))){
					 if("RTSP".equalsIgnoreCase(obj.getString("protocol"))) {
						 attr.put("StreamURL", obj.getString("url"));
						 //break;
					 }
					 if("Gantry".equalsIgnoreCase(obj.getString("protocol"))) {
						 request.put("viidId", obj.getString("url"));  //TODO Gantry，0807 for update
					 }
				 }

			 }
		 }
	     //TODO
//	     if(StringUtils.isNotBlank(msg.getString("cameralane"))){ //deviceAttripc.Cameralane
//	    	 attr.put("cameralane", msg.getString("cameralane"));
//	     }
	     
	     if(!ObjectUtils.isEmpty(msg.get("areaPath"))) { // TODO   update or  add
	    	 String siteCode = CacheUtils.getAsString(msg.getString("areaPath")+cacheSiteAreaPathSuffix);
		     if(StringUtils.isNoneBlank(siteCode)) {
		    	 attr.put("siteCode", siteCode);
		    	 String siteId = CacheUtils.getAsString(siteCode+cacheSiteIdSuffix); 
		    	 if(StringUtils.isNoneBlank(siteId)) {
		    		 attr.put("subway", siteId); //"subway": "b2d9ce9136ff116251404f40b92b5d91", site id
		    	 }
		     }
	     }
	     
	     //siteCodeFlag  0  camera has site, 1 camera no site
	     if(addFlag) {
	    	 if(!ObjectUtils.isEmpty(msg.get("areaPath")) && CacheUtils.getAsString(msg.getString("areaPath")+cacheSiteAreaPathSuffix) != null) {
	    		 attr.put("siteCodeFlag", 0);
	    	 }else {
	    		 attr.put("siteCodeFlag", 1);
	    	 }
	     }else {
	    	 if(!ObjectUtils.isEmpty(msg.get("areaPath")) && CacheUtils.getAsString(msg.getString("areaPath")+cacheSiteAreaPathSuffix) != null) {
	    		 attr.put("siteCodeFlag", 0);
	    	 }
	     }
	     
	     if(!ObjectUtils.isEmpty(msg.get("areaPath"))) {
	    	 attr.put("areaPath", msg.getString("areaPath"));  //areaPath
	     }
//		 if(attributes != null) {
//			 if(attributes.get("aicenterId") != null){
//				 attr.put("aicenterId", attributes.getString("aicenterId"));  //domain id
//			 }
//		 }
	     //TODO
	     if(StringUtils.isNotBlank(msg.getString("cameraLabels"))){ //deviceAttripcisGpuAnalysis  0 no analysis 1: analysis
			 List<String> labels = JSONObject.parseArray(msg.getString("cameraLabels"),String.class);
			 for(String label : labels) {
				 if (Const.LPR_DEVICE_NEED_ANALYSIS.equals(label)) {
					 attr.put("isGpuAnalysis", Const.IS_GPU_ANALYSIS_YES);
				 }
			 }
	      }
		 if(null == attr.get("isGpuAnalysis")){
			 attr.put("isGpuAnalysis", Const.IS_GPU_ANALYSIS_NO);
		 }
//		 if(!ObjectUtils.isEmpty(msg.get("status"))) {
//			 if(NvmsNotifyCameraStatusEnum.getValueByLable(msg.getString("status")) != null) {
//				 attr.put("cameraStatus", NvmsNotifyCameraStatusEnum.getValueByLable(msg.getString("status")));
//			 }
//		 }

		 //NVMS topic: first add or update camera, set default value; don't use origin status
		 attr.put("cameraStatus", NvmsNotifyCameraStatusEnum.Unknown.getValue());
		 attr.put("licenseStatus", "Other");

	     JSONObject sType = new JSONObject();
	     sType.put(Const.LPR_CAMERA_TYPE.toLowerCase(), attr);
	     request.put("deviceAttr", sType);
	     
	     request.put("civilCode", "100000");  // mandatory fields
	     request.put("accessProtocol", 0);  // mandatory fields
	     request.put("typeCode", "123");  // mandatory fields
	     request.put("deleteFlg", 0);  // mandatory fields
	     
	     return request;
	 }

	private Map<String,String> findDeviceSiteRelation(JSONObject msg){
		 Map<String,String> result = new HashMap<>();
		if(ObjectUtils.isEmpty(msg.get("areaPath"))){
			return result;
		}
		///UAE/Abu Dhabi/Abu Dhabi City/AL EZZAH/
		String areaPath = msg.getString("areaPath");
		List<String> pathList = Arrays.asList(areaPath.split("/"));
		///UAE/Abu Dhabi/Abu Dhabi City/
		StringBuffer newAreaPath = new StringBuffer();
		for(int num = 0; num < pathList.size() - 1 ;num++){
			newAreaPath.append(pathList.get(num)).append("/");
		}
		//AL EZZAH
		String siteName = pathList.get(pathList.size() - 1);

		//find site
		Map<String, String> params = new HashMap<>();
		params.put("pageNo", "0");
		params.put("pageSize", "1000");
		List<String> codes = new ArrayList<String>();
		if(StringUtils.isBlank(siteName)){
			log.warn("site name is empty return");
			return result;
		}
		params.put("f_eq_name", siteName);
		params.put("f_eq_deviceType", Const.LPR_SITE_TYPE);

//		List<CameraInfoDto> res = new ArrayList<>();
//		Boolean hasNextPage = true;
//		while (hasNextPage){
//
//			Page<CameraInfoDto> page = findDevicesList(params);
//			if(page != null && page.getContent() != null && page.getContent().size() == 1000){
//				Integer pg = Integer.parseInt(params.get("pageNo"));
//				params.put("pageNo", String.valueOf(pg+1));
//			}else{
//				hasNextPage = false;
//			}
//			res.addAll(page.getContent());
//		}

		List<SiteinfoDto> sitesListFromCdevice = findSitesListFromCdevice(params);
		if(CollectionUtil.isEmpty(sitesListFromCdevice)){
			return result;
		}
		log.info("find relation num is --->{}",sitesListFromCdevice.size());
		for(SiteinfoDto siteinfoDto : sitesListFromCdevice){
			log.info("newAreaPath.toString() is ->" + newAreaPath.toString() + "siteinfoDto.getAreaPath() is ->" +siteinfoDto.getAreaPath());
			if(newAreaPath.toString().startsWith(siteinfoDto.getAreaPath())){
				log.info("id={},is mapping,site id ={}  ,siteType={}",msg.get("id"),siteinfoDto.getSiteCode(),siteinfoDto.getSiteType());
				result.put("siteCode",siteinfoDto.getSiteCode());
				result.put("cameraSource",siteinfoDto.getSiteType());
				if(NvmsNotifyCameraSourceEnum.Mall.getValue().equals(siteinfoDto.getSiteType())){
					result.put("cameraForm",NvmsNotifyCameraSourceEnum.Mall.getLable());
				}
				return result;
			}
		}
		return result;
	}

//	 private String findDeviceSiteRelation(JSONObject msg){
//		 if(ObjectUtils.isEmpty(msg.get("areaPath"))){
//			 return null;
//		 }
//		 ///UAE/Abu Dhabi/Abu Dhabi City/AL EZZAH/
//		 String areaPath = msg.getString("areaPath");
//		 List<String> pathList = Arrays.asList(areaPath.split("/"));
//		 ///UAE/Abu Dhabi/Abu Dhabi City
//		 StringBuffer newAreaPath = new StringBuffer();
//		 for(int num = 0; num < pathList.size() - 1 ;num++){
//			 newAreaPath.append(pathList.get(num)).append("/");
//		 }
//		 //AL EZZAH
//		 String siteName = pathList.get(pathList.size() - 1);
//
//		//find site
//		 Map<String, String> params = new HashMap<>();
//		 params.put("pageNo", "0");
//		 params.put("pageSize", "1000");
//		 List<String> codes = new ArrayList<String>();
//		 if(StringUtils.isBlank(siteName)){
//			 log.warn("site name is empty return");
//			 return null;
//		 }
//		 params.put("f_eq_name", siteName);
//		 params.put("f_eq_deviceType", Const.LPR_SITE_TYPE);
//
//
//
//		 List<SiteinfoDto> res = findSitesListFromCdevice(params);
//		 if(CollectionUtil.isEmpty(res)){
//			 return null;
//		 }
//
//
//		 log.info("find relation num is --->{}",res.size());
//		for(SiteinfoDto siteinfoDto : res){
//			if(newAreaPath.toString().equals(siteinfoDto.geta)){
//				log.info("id={},is mapping,site id ={}",msg.get("id"),siteinfoDto.getCode());
//				return siteinfoDto.getCode();
//			}
//		}
//		 return null;
//	 }

	 /**
	  * query  camera/site from Cdevice
	  * @param params
	  * @return
	  */
	 private Page<CameraInfoDto> findDevicesList(Map<String, String> params){
	        SearchDTO searchDTO = new SearchDTO();
	        List<CameraInfoDto> list = new ArrayList<>();
	        int total =0;
	        String pageNoKey = "pageNo";
	        String pageSizeKey = "pageSize";

	        if(!params.containsKey(pageNoKey)){
	            params.put(pageNoKey, "0");  //
	        }
	        if(!params.containsKey(pageSizeKey)){
	            params.put(pageSizeKey, "10");  //
	        }

	        JSONObject request = new JSONObject();
	        for(String key : params.keySet()){
	            if(StringUtils.isNotBlank(params.get(key))){
	                if(pageNoKey.equals(key) || pageSizeKey.equals(key)){
	                    request.put(key, Integer.parseInt(params.get(key)));
	                }else{
	                    request.put(key, params.get(key));
	                }
	            }
	        }

	        try {
	            String url = deviceUrl + "/device/extBatch";
	            log.info("search device request URL: {}, request:{}", url, request);
	            String responseStr = RestTemplateUtil.request(url, HttpMethod.POST, request, "");
	            log.debug("search device response: {}", responseStr);
	            JSONObject jsonObject = JSON.parseObject(responseStr).getJSONObject("result");

	            if(jsonObject != null ){
	                total = jsonObject.getIntValue("total");
	                if(jsonObject.containsKey("data")){
	                    JSONArray dataArr = jsonObject.getJSONArray("data");
	                    for(int i=0; i< dataArr.size(); i++){
	                        CameraInfoDto deviceVO = convertToCatalogDeviceVO4CdeviceManage(dataArr.getJSONObject(i));
	                        if(deviceVO != null){
	                            list.add(deviceVO);
	                        }
	                    }
	                }
	            }

	            searchDTO.setPageNo(jsonObject.getIntValue("pageNo"));
	            searchDTO.setPageSize(jsonObject.getIntValue("pageSize"));

	        }catch (Exception e){
	            log.error("search device exception", e);
	            log.error(e.getMessage(), e);
	        }
	        return new PageImpl<CameraInfoDto>(list, searchDTO.toPageable(), total);
	    }
	 
	 private CameraInfoDto convertToCatalogDeviceVO4CdeviceManage(JSONObject obj){
	        CameraInfoDto deviceVo = new CameraInfoDto();
	        deviceVo.setId(obj.getString("id"));
	        deviceVo.setCameraName(obj.getString("name"));
	        
	        //deviceAttr.ipc.siteCode
	        deviceVo.setSiteCode(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getString("siteCode")).orElse(""));

//	        if(StringUtils.isNotBlank(deviceVo.getSiteCode())){
//	            String str = CacheUtils.getAsString(Const.LPR_SITE_CACHE + deviceVo.getSiteCode());
//	            if(StringUtils.isNotBlank(str)){
//	                SiteinfoDto dto = JSONUtil.toBean(str, SiteinfoDto.class);
//	                deviceVo.setSiteName(dto.getSiteName());
//	            }
//	        }

	        deviceVo.setLongitude(obj.getString("longitude"));
	        deviceVo.setLatitude(obj.getString("latitude"));
	        deviceVo.setCameraStatus(obj.getString("status"));
	        deviceVo.setCameraId(obj.getString("gbid")); //gbid
	        //deviceAttripc.cameraCode
	        deviceVo.setCameraCode(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getString("cameraCode")).orElse(""));
	        deviceVo.setDeviceType(obj.getString("deviceType"));
	        //deviceAttr.ipc.Cameralane
	        deviceVo.setLaneId(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getInteger("Cameralane")==null?a.getInteger("cameralane"):a.getInteger("Cameralane")).orElse(0));
	        deviceVo.setViid(obj.getString("viidId"));
	        //deviceAttr.ipc.isGpuAnalysis  0 yes  1 no
	        deviceVo.setIsGpuAnalysis(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getString("isGpuAnalysis")).orElse(""));
	        deviceVo.setCameraSource(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getString("cameraSource")).orElse(""));
	        deviceVo.setCameraType(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getString("cameraForm")).orElse(""));
	        
	        //device type is site
	        deviceVo.setCode(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getString("code")).orElse(""));
	        
	        deviceVo.setAreaPath(Optional.ofNullable(obj.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(obj.getString("deviceType").toLowerCase())).map(a -> a.getString("areaPath")).orElse(""));	        
	        return deviceVo;
	    }
	 
	 
//	 /**
//     *
//     * @param type
//     * @return yyyyMMddHHmmss + 5 serial number
//     */
//    private String genSecondLevelSerialNum(String type){
//        return genSerialNum(type, "yyyyMMddHHmmss", 5);
//    }
//
//    private String genSerialNum(String type, String format, int serialLength){
//        String serial = typeSerialMap.get(type);
//        String time = DateUtils.formatDateTime(new Date(), format);
//
//        String begin = "1";
//        if(StringUtils.isNotBlank(serial)){
//            if(serial.startsWith(time)){
//                int no = Integer.parseInt(serial.substring(format.length()));
//                begin = (no + 1) + "";
//            }
//        }
//
//        serial = time + StringUtils.leftPad(begin, serialLength, "0");
//        typeSerialMap.put(type, serial);
//        return serial;
//    }
	 
	 
	 public void init() {
		 log.info("######quert site info to cache start");
		 Map<String, String> params = new HashMap<>();
	     params.put("pageNo", "0");
	     params.put("pageSize", "1000");
	     params.put("f_eq_deviceType", Const.LPR_SITE_TYPE);
	     Boolean hasNextPage = true;
	     while (hasNextPage){
	    	 Page<CameraInfoDto> page = findDevicesList(params);
	    	 if(page != null && page.getContent() != null) {
	    		 page.getContent().forEach(item ->{
	    			 if(StringUtils.isNoneBlank(item.getAreaPath())){
	    				 CacheUtils.put(item.getAreaPath()+cacheSiteAreaPathSuffix, item.getCode()); //SET the areaPath to redis
		    	    	 CacheUtils.put(item.getCode()+cacheSiteIdSuffix, item.getId()); //SET the id to redis
	    			 }
	    		 });
	    	 } 
	         if(page != null && page.getContent() != null && page.getContent().size() == 1000){
	        	 Integer pg = Integer.parseInt(params.get("pageNo"));
	             params.put("pageNo", String.valueOf(pg+1));
	         }else{
	        	 hasNextPage = false;
	         }
	    }
	    log.info("######quert site info to cache end");
	 }

	/**
	 * process Emirate
	 * @param emirateList
	 */
	private void processEmirate(List<NvmsNotifyInfoDto> emirateList){
		List<NvmsNotifyInfoDto> addList = new ArrayList<NvmsNotifyInfoDto>();
		List<NvmsNotifyInfoDto> deleteList = new ArrayList<NvmsNotifyInfoDto>();
		List<NvmsNotifyInfoDto> updateList = new ArrayList<NvmsNotifyInfoDto>();

		Map<String, List<NvmsNotifyInfoDto>> resultList = emirateList.stream().collect(Collectors.groupingBy(NvmsNotifyInfoDto::getOperation));
		if(!resultList.isEmpty()) {
			addList = resultList.get(NvmsNotifyOperationEnum.ADD.getValue());
			deleteList = resultList.get(NvmsNotifyOperationEnum.DELETE.getValue());
			updateList = resultList.get(NvmsNotifyOperationEnum.UPDATE.getValue());

			if (!CollectionUtil.isEmpty(addList)) {
				addEmirate(addList);
			}

			if (!CollectionUtil.isEmpty(deleteList)) {
				//no need delete
			}
			if (!CollectionUtil.isEmpty(updateList)) {
				updateEmirate(updateList);
			}
		}
	 }

	private void addEmirate(List<NvmsNotifyInfoDto> areaList) {
		if(CollectionUtil.isEmpty(areaList)){
			return;
		}
		String areaPath = areaList.get(0).getArea().getString("areaPath");
		String emirateName = areaList.get(0).getArea().getString("name");
		String nation = areaPath.split("/")[1];
		if(StringUtils.isEmpty(nation) || StringUtils.isEmpty(emirateName) ){
			return;
		}
		List<LprSystemLocationEntity> nationEntityList = lprSystemLocationDao.findByName(nation);
		if(CollectionUtil.isEmpty(nationEntityList)){
			return;
		}
		LprSystemLocationEntity nationEntity = nationEntityList.get(0);
		List<LprSystemLocationEntity> codeLevelEntityList = lprSystemLocationDao.findByCodeLevel(Const.LPR_LOCATION_CODE_LEVEL_2);

		LprSystemLocationEntity entity =new LprSystemLocationEntity();
		if(CollectionUtil.isNotEmpty(codeLevelEntityList)){
			Long sortIndex = codeLevelEntityList.stream().max(Comparator.comparing(LprSystemLocationEntity::getSortIndex)).get().getSortIndex();
			entity.setCode("00000" + (sortIndex + 1));
			entity.setSortIndex(sortIndex + 1);
		}else {
			entity.setCode("000001");
			entity.setSortIndex(1l);
		}
		entity.setName(emirateName);
		entity.setDescription(emirateName);
		entity.setPath(areaPath);
		entity.setStatus(0);
		entity.setParentCode(nationEntity.getCode());
		entity.setCodeLevel(nationEntity.getCodeLevel() + 1);

		entity.setCodeType("location");
		lprSystemLocationDao.save(entity);
	}


	private void updateEmirate(List<NvmsNotifyInfoDto> areaList) {
		if(CollectionUtil.isEmpty(areaList)){
			return;
		}
		String areaPath = areaList.get(0).getArea().getString("areaPath");
		String emirateName = areaList.get(0).getArea().getString("name");
		String nation = areaPath.split("/")[1];
		if(StringUtils.isEmpty(nation) || StringUtils.isEmpty(emirateName) ){
			return;
		}
		List<LprSystemLocationEntity> emirateEntityList = lprSystemLocationDao.findByName(emirateName);
		if(CollectionUtil.isEmpty(emirateEntityList)){
			addEmirate(areaList);
			return;
		}
		//can't update ,so update do nothing
	}



	/**
	 * process City
	 * @param emirateList
	 */
	private void processCity(List<NvmsNotifyInfoDto> emirateList){
		List<NvmsNotifyInfoDto> addList = new ArrayList<NvmsNotifyInfoDto>();
		List<NvmsNotifyInfoDto> deleteList = new ArrayList<NvmsNotifyInfoDto>();
		List<NvmsNotifyInfoDto> updateList = new ArrayList<NvmsNotifyInfoDto>();

		Map<String, List<NvmsNotifyInfoDto>> resultList = emirateList.stream().collect(Collectors.groupingBy(NvmsNotifyInfoDto::getOperation));
		if(!resultList.isEmpty()) {
			addList = resultList.get(NvmsNotifyOperationEnum.ADD.getValue());
			deleteList = resultList.get(NvmsNotifyOperationEnum.DELETE.getValue());
			updateList = resultList.get(NvmsNotifyOperationEnum.UPDATE.getValue());

			if (!CollectionUtil.isEmpty(addList)) {
				addCity(addList);
			}

			if (!CollectionUtil.isEmpty(deleteList)) {
				//no need delete
			}
			if (!CollectionUtil.isEmpty(updateList)) {
				updateCity(updateList);
			}
		}
	}

	private void addCity(List<NvmsNotifyInfoDto> areaList) {
		if(CollectionUtil.isEmpty(areaList)){
			return;
		}
		String areaPath = areaList.get(0).getArea().getString("areaPath");
		String cityName = areaList.get(0).getArea().getString("name");
		String emirateName = areaPath.split("/")[2];
		if(StringUtils.isEmpty(emirateName) || StringUtils.isEmpty(cityName) ){
			return;
		}
		List<LprSystemLocationEntity> emirateEntityList = lprSystemLocationDao.findByName(emirateName);
		if(CollectionUtil.isEmpty(emirateEntityList)){
			return;
		}
		LprSystemLocationEntity emirateEntity = emirateEntityList.get(0);
		List<LprSystemLocationEntity> codeLevelEntityList = lprSystemLocationDao.findByCodeLevelAndParentCode(Const.LPR_LOCATION_CODE_LEVEL_3,emirateEntity.getCode());

		LprSystemLocationEntity entity =new LprSystemLocationEntity();
		if(CollectionUtil.isNotEmpty(codeLevelEntityList)){
			Long sortIndex = codeLevelEntityList.stream().max(Comparator.comparing(LprSystemLocationEntity::getSortIndex)).get().getSortIndex();
			entity.setCode(emirateEntity.getCode()  + (sortIndex + 1));
			entity.setSortIndex(sortIndex + 1);
		}else {
			entity.setCode(emirateEntity.getCode() + "1");
			entity.setSortIndex(1l);
		}
		entity.setName(cityName);
		entity.setDescription(cityName);
		entity.setPath(areaPath);
		entity.setStatus(0);
		entity.setParentCode(emirateEntity.getCode());
		entity.setCodeLevel(emirateEntity.getCodeLevel() + 1);

		entity.setCodeType("location");
		lprSystemLocationDao.save(entity);
	}


	private void updateCity(List<NvmsNotifyInfoDto> areaList) {
		if(CollectionUtil.isEmpty(areaList)){
			return;
		}
		String areaPath = areaList.get(0).getArea().getString("areaPath");
		String emirateName = areaList.get(0).getArea().getString("name");
		String nation = areaPath.split("/")[1];
		if(StringUtils.isEmpty(nation) || StringUtils.isEmpty(emirateName) ){
			return;
		}
		List<LprSystemLocationEntity> emirateEntityList = lprSystemLocationDao.findByName(emirateName);
		if(CollectionUtil.isEmpty(emirateEntityList)){
			addCity(areaList);
			return;
		}
		//can't update ,so update do nothing
	}

	/**
	 * query  site info  from  cdevice manage
	 * @param params
	 * @return
	 */
	public List<SiteinfoDto> findSitesListFromCdevice(Map<String, String> params){
		List<SiteinfoDto> list = new ArrayList<>();
		String pageNoKey = "pageNo";
		String pageSizeKey = "pageSize";

		if(!params.containsKey(pageNoKey)){
			params.put(pageNoKey, "0");  //
		}
		if(!params.containsKey(pageSizeKey)){
			params.put(pageSizeKey, "1000");  //
		}
		JSONObject request = new JSONObject();
		for(String key : params.keySet()){
			if(org.apache.commons.lang3.StringUtils.isNotBlank(params.get(key))){
				if(pageNoKey.equals(key) || pageSizeKey.equals(key)){
					request.put(key, Integer.parseInt(params.get(key)));
				}else{
					request.put(key, params.get(key));
				}
			}
		}

		try {
			String url = deviceUrl + "/device/extBatch";
			log.info("search site type cdevice manage request URL: {}, request:{}", url, request);
			String responseStr = RestTemplateUtil.request(url, HttpMethod.POST, request, "");

			log.debug("search site type cdevice manage response: {}", responseStr);
			JSONObject jsonObject = JSON.parseObject(responseStr).getJSONObject("result");

			if(jsonObject != null ){
				//total = jsonObject.getIntValue("total");
				if(jsonObject.containsKey("data")){
					JSONArray dataArr = jsonObject.getJSONArray("data");
					for(int i=0; i< dataArr.size(); i++){
						SiteinfoDto deviceVO = convertToSiteInfoDto(dataArr.getJSONObject(i), null);
						if(deviceVO != null){
							list.add(deviceVO);
						}
					}
				}
			}
		}catch (Exception e){
			log.error("search site exception", e);
			//throw new ServiceException("search site exception."); //TODO
		}
		return list;
	}

	public SiteinfoDto convertToSiteInfoDto(JSONObject jsobSource, JSONObject obj){
		SiteinfoDto deviceVo = new SiteinfoDto();
		if(obj != null) {
			deviceVo.setId(obj.getString("id"));
			deviceVo.setSiteName(obj.getString("deviceName"));
		}else {
			deviceVo.setId(jsobSource.getString("id"));
			deviceVo.setSiteName(jsobSource.getString("deviceName"));
		}

		deviceVo.setSiteCode(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("code")).orElse(""));
		deviceVo.setSiteType(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("siteType")).orElse(""));
		deviceVo.setLongitude(jsobSource.getString("longitude"));
		deviceVo.setLatitude(jsobSource.getString("latitude"));
		deviceVo.setRegion(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("region")).orElse(""));
		deviceVo.setCity(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("city")).orElse(""));
		deviceVo.setGantryId(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("gantryId")).orElse(""));
		//deviceVo.setCivilCode(jsobSource.getString("civilCode"));
		//deviceVo.setDistrict(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("district")).orElse(""));
		deviceVo.setEmirate(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("emirate")).orElse(""));
		deviceVo.setAreaPath(Optional.ofNullable(jsobSource.getJSONObject("deviceAttr")).map(a -> a.getJSONObject(jsobSource.getString("deviceType").toLowerCase())).map(a -> a.getString("areaPath")).orElse(""));
		return deviceVo;
	}


	private void checkNeedSendAutoAnalysis(List<NvmsNotifyInfoDto> cameraList,boolean isDelete){
		if(CollectionUtil.isEmpty(cameraList)){
			return;
		}
		try {
			for(NvmsNotifyInfoDto nvmsNotifyInfoDto : cameraList){
				JSONObject msg = nvmsNotifyInfoDto.getCamera();
				if(msg == null) {
					continue;
				}
				if(CollectionUtil.isEmpty(msg.getJSONArray("cameraLabels"))){
					stopAutoAnalysisByNvmsId(msg.getString("id"));
					continue;
				}
				List<String> labels = JSONObject.parseArray(msg.getString("cameraLabels"),String.class);
				boolean isAnalysis = false;
				for(String label : labels){
					if(Const.LPR_DEVICE_NEED_ANALYSIS.equals(label)){
						isAnalysis = true;
						if(isDelete){
							stopAutoAnalysisByNvmsId(msg.getString("id"));
						}else {
							String rtspUrl = getRtspByNvmsId(msg.getString("id"));
							if(StringUtils.isEmpty(rtspUrl)){
								continue;
							}
							sendAutoAnalysisDevice(msg.getString("name"),rtspUrl,msg.getString("id"));
							checkNeedUpdateCameraStatus(msg.getString("id"));
						}
					}
				}
				if(!isAnalysis){
					//stop if have no flag
					stopAutoAnalysisByNvmsId(msg.getString("id"));
				}
			}
		}catch (Exception e){
			log.error("checkNeedSendAutoAnalysis error msg is ->{}",e.getMessage());
		}
	}


	/**
	 * send device analysis device
	 * @param deviceId
	 */
	private void sendAutoAnalysisDevice(String deviceId,String rtspUrl,String nvmsId){
		log.info("sendAutoAnalysisDevice deviceId is " + deviceId + ",rtspUrl is " + rtspUrl + ",NvmsId is " + nvmsId);
		GpuLprTaskSaveDto gpuLprTaskSaveDto = new GpuLprTaskSaveDto();
		gpuLprTaskSaveDto.setTaskName("Auto Task " + new Date().getTime());
		gpuLprTaskSaveDto.setDeviceId(deviceId);
		gpuLprTaskSaveDto.setRtspUrl(rtspUrl);
		gpuLprTaskSaveDto.setNvmsId(nvmsId);
		if(StringUtils.isEmpty(deviceId) || StringUtils.isEmpty(rtspUrl)){
			return;
		}
		ResponseMessage responseMessage = lprBackFegin.sendAnalysisTask(gpuLprTaskSaveDto);
		log.info("sendAutoAnalysisDevice response is " + JSONObject.toJSONString(responseMessage));
	}

	private void stopAutoAnalysisByNvmsId(String nvmsId){
		log.info("stopAutoAnalysisByNvmsId NvmsId is  " + nvmsId);
		GpuLprTaskSaveDto gpuLprTaskSaveDto = new GpuLprTaskSaveDto();
		gpuLprTaskSaveDto.setNvmsId(nvmsId);
		ResponseMessage responseMessage = lprBackFegin.stopAnalysisTask(gpuLprTaskSaveDto);
		log.info("stopAutoAnalysisByNvmsId response is " + JSONObject.toJSONString(responseMessage));
	}
	private String getRtspByNvmsId(String nvmsId){
		NvmsGetRtspReq nvmsGetRtspReq = new NvmsGetRtspReq();
		nvmsGetRtspReq.setCameraId(nvmsId);
		nvmsGetRtspReq.setProtocol(Const.NVMS_PROTOCOL);
		nvmsGetRtspReq.setLocation(Const.NVMS_LOCATION);
		//find rtsp
		String rtspUrl = nvmsFegin.getRtspByNvmsId(nvmsGetRtspReq);
		return rtspUrl;
	}

	public void updateRtspUrl(NvmsIdDeviceIdDTO nvmsIdDeviceIdDTO){
		if(StringUtils.isEmpty(nvmsIdDeviceIdDTO.getDeviceId()) || StringUtils.isEmpty(nvmsIdDeviceIdDTO.getNvmsId())){
			return;
		}
		String rtspUrl = getRtspByNvmsId(nvmsIdDeviceIdDTO.getNvmsId());
		if(StringUtils.isEmpty(rtspUrl)){
			log.error("updateRtspUrl error, no rtsp");
			return;
		}
		sendAutoAnalysisDevice(nvmsIdDeviceIdDTO.getDeviceId(),rtspUrl,nvmsIdDeviceIdDTO.getNvmsId());

	}
}
