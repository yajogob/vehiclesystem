package com.micro.listener;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.serializer.PascalNameFilter;
import com.alibaba.fastjson.serializer.SerializerFeature;
import com.kedacom.kiaf.common.viid.util.JSONUtils;
import com.kedacom.kiaf.common.viid.util.RandomUtil;
import com.kedacom.kidp.base.web.exception.ServiceException;
import com.micro.dto.BehaviorAlertReceiveDto;
import com.micro.dto.BehaviorAlertReceivePerceivingAreaDto;
import com.micro.dto.DictObject;
import com.micro.dto.imageAnalysis.*;
import com.micro.dto.viid.Image;
import com.micro.dto.viid.ImageInfo;
import com.micro.dto.viid.ImageList;
import com.micro.dto.viid.ImageListObject;
import com.micro.enums.RegionEnum;
import com.micro.feign.LprViidFeign;
import com.micro.feign.LprVisualAnalysisFeign;
import com.micro.util.CacheUtils;
import com.micro.util.ViidUtils;
import com.micro.vo.behavior.BehaviorAlertObjectReceiveVo;
import com.micro.vo.behavior.BehaviorAlertReceiveVo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

/**
 */
@Service
@Slf4j
public class BehaviorConsumerListener {

    @Resource
    private LprVisualAnalysisFeign lprVisualAnalysisFeign;

    @Value("${spring.kafka.behavior.reply.topic:TSI_TRAFFIC_EVENT_REPLY}")
    private String behaviorReply;

    private static Base64.Encoder encoder = Base64.getEncoder();

    @Autowired
    private KafkaTemplate kafkaTemplate;

    @Autowired
    private LprViidFeign lprViidFeign;

    @KafkaListener(containerFactory = "batchNoByteFactory",topics = "${spring.kafka.behavior.topic:TSI_TRAFFIC_EVENT_REQUEST}")
    public void listener(List<ConsumerRecord<?, ?>> list){
        List<String> messages = new ArrayList<>();
        for (ConsumerRecord<?, ?> record : list) {
            Optional<?> kafkaMessage = Optional.ofNullable(record.value());
            kafkaMessage.ifPresent(o -> messages.add(o.toString()));
        }

        for(String message : messages){
            try{
                BehaviorAlertReceiveDto behaviorAlertReceiveDto = JSONUtils.jsonToBean(message, BehaviorAlertReceiveDto.class);

                BehaviorAlertReceiveVo behaviorAlertReceiveVo = analysisBehavior(behaviorAlertReceiveDto);
                if(null == behaviorAlertReceiveVo){
                    continue;
                }
                //send kafka
                kafkaTemplate.send(behaviorReply,behaviorAlertReceiveVo.getAlertId(),JSONObject.toJSONString(behaviorAlertReceiveVo));
            }catch(Exception e){
                log.error(e.getMessage());
            }
        }
    }

    private BehaviorAlertReceiveVo analysisBehavior(BehaviorAlertReceiveDto behaviorAlertReceiveDto){
        if(null == behaviorAlertReceiveDto || StringUtils.isEmpty(behaviorAlertReceiveDto.getId())){
            return null;
        }
        JSONObject result = null;
        try {
            ImageAnalysisParam imageAnalysisParam = this.buildAnalysisParams(behaviorAlertReceiveDto);
            log.info("analysisBehavior(), /VIAS/ImageAnalysisSync param --->{}",JSONObject.toJSONString(imageAnalysisParam));
            result = lprVisualAnalysisFeign.imageAnalysisSync(imageAnalysisParam,"keda_petrel");
            log.info("analysisBehavior(), /VIAS/ImageAnalysisSync response --->{}", result);
        }catch (Exception e){
            log.error("analysisBehavior params build failed ---->{}", JSONObject.toJSONString(behaviorAlertReceiveDto));
        }
        if(null == result){
            return null;
        }
        try {
            BehaviorAlertReceiveVo behaviorAlertReceiveVo = convertData(result, behaviorAlertReceiveDto.getId());
            log.info("analysisBehavior success --->{}",JSONObject.toJSONString(behaviorAlertReceiveVo));
            return behaviorAlertReceiveVo;
        }catch (Exception e){
            log.error(e.toString());
            log.error("analysisBehavior convert failed ---->{}", JSONObject.toJSONString(result));
        }
        return null;
    }

    private ImageAnalysisParam buildAnalysisParams(BehaviorAlertReceiveDto behaviorAlertReceiveDto){
        AnalysisImage analysisImage = new AnalysisImage();
        List<AnalysisType> analysisTypeList = new ArrayList<>();
        AnalysisType analysisType1 = new AnalysisType();
        analysisType1.setType(2);
        analysisTypeList.add(analysisType1);

        List<AnalysisTarget> analysisTargetList = new ArrayList<>();
        AnalysisTarget analysisTargetType = new AnalysisTarget();
        analysisTargetType.setType(2);

        analysisImage.setAnalysisTargetList(analysisTargetList);

        analysisImage.setStoragePath(behaviorAlertReceiveDto.getSceneImageUrl());
//        analysisImage.setData(httpToBase64(behaviorAlertReceiveDto.getSceneImageUrl()));
        analysisImage.setImageId(behaviorAlertReceiveDto.getId());

        //area
        BehaviorAlertReceivePerceivingAreaDto perceivingArea = behaviorAlertReceiveDto.getSubjects().getPerceivingArea();
        Position areaPosition = new Position();
        areaPosition.setLeftTopX(perceivingArea.getX());
        areaPosition.setLeftTopY(perceivingArea.getY());
        areaPosition.setRightBtmX(perceivingArea.getX() + perceivingArea.getW());
        areaPosition.setRightBtmY(perceivingArea.getY() + perceivingArea.getH());
//        analysisImage.setAnalysisAreaList(Arrays.asList(areaPosition));

        analysisTargetType.setPosition(areaPosition);
        analysisTargetList.add(analysisTargetType);
        ImageAnalysisParam imageAnalysisParam = new ImageAnalysisParam();
        ImageAnalysisObject imageAnalysisObject = new ImageAnalysisObject();
        imageAnalysisObject.setAnalysisImageList(Arrays.asList(analysisImage));
        imageAnalysisObject.setAnalysisTypeList(analysisTypeList);
        imageAnalysisParam.setImageAnalysisObject(imageAnalysisObject);
        return imageAnalysisParam;
    }




    private int dealLeftPoint(int point){
        int result = point - 30;
        if(result<0){
            return 0;
        }else {
            return result;
        }
    }

    private int dealRightPoint(int point){
        int result = point + 30;
        return result;
    }

    private String httpToBase64(String url){
        if(com.kedacom.kiaf.common.util.StringUtils.isBlank(url)){
            return url;
        }
        try {
            HttpURLConnection httpUrl = (HttpURLConnection) new URL(url).openConnection();
            httpUrl.connect();
            return encodeToString(inputStreamToFile(httpUrl.getInputStream()));
        } catch (Exception e) {
            throw new ServiceException("get base64 failed");
        }
    }
    private static String encodeToString(byte[] data) {
        return encoder.encodeToString(data);
    }

    private byte[] inputStreamToFile(InputStream ins) throws Exception{
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        int bytesRead;
        int len = 8192;
        byte[] buffer = new byte[len];
        while ((bytesRead = ins.read(buffer, 0, len)) != -1) {
            out.write(buffer, 0, bytesRead);
        }
        byte[] data = out.toByteArray();
        out.close();
        ins.close();
        return data;
    }


    private BehaviorAlertReceiveVo convertData(JSONObject jsonObject,String id){
        BehaviorAlertReceiveVo behaviorAlertReceiveVo = new BehaviorAlertReceiveVo();
        JSONObject motorObjectOut = jsonObject.getJSONObject("ImageListObject").getJSONArray("Image").getJSONObject(0);
        JSONObject motorObject = motorObjectOut.getJSONObject("KedaMotorVehicleList").getJSONArray("KedaMotorVehicleObject").getJSONObject(0);
        BehaviorAlertObjectReceiveVo behaviorAlertObjectReceiveVo = new BehaviorAlertObjectReceiveVo();
        behaviorAlertObjectReceiveVo.setPlateNo(motorObject.getString("PlateNo"));
        if(StringUtils.isNotBlank(motorObject.getString("PlaceCode")) || StringUtils.isNotBlank(motorObject.getString("NationalityCode"))){
            behaviorAlertObjectReceiveVo.setCountry(RegionEnum.getRegionByPlaceCodeOrNationCode(motorObject.getString("NationalityCode"),motorObject.getString("PlaceCode")));
        }
        behaviorAlertObjectReceiveVo.setPlateColor(getPlateColorDesc(motorObject.getString("PlateColor")));
        if(null != motorObject.getJSONObject("KedaSubImageList") && !CollectionUtils.isEmpty(motorObject.getJSONObject("KedaSubImageList").getJSONArray("KedaSubImageInfoObject"))){
            for(Object j : motorObject.getJSONObject("KedaSubImageList").getJSONArray("KedaSubImageInfoObject")){
                JSONObject jsonObject1 = JSONObject.parseObject(JSONObject.toJSONString(j));
                if("02".equals(jsonObject1.get("Type"))){
                    //save base64 to viid
                    String path = saveBase64ToViid(jsonObject1.getString("Data"));
                    behaviorAlertObjectReceiveVo.setPlateCapture(path);
                }
            }
        }
        behaviorAlertObjectReceiveVo.setVehicleColor(getVehicleColorDesc(motorObject.getString("VehicleColor")));
        behaviorAlertObjectReceiveVo.setVehicleMake(getVehicleBrandDesc(motorObject.getString("VehicleBrand")));
        behaviorAlertObjectReceiveVo.setVehicleModel(motorObject.getString("VehicleModel"));
        behaviorAlertObjectReceiveVo.setPlateType(motorObject.getString("PlateType"));
        behaviorAlertReceiveVo.setAlertId(id);
        behaviorAlertReceiveVo.setAnalysisType("behavior");
        log.info(JSONObject.toJSONString(behaviorAlertObjectReceiveVo));
        behaviorAlertReceiveVo.setBehaviorObject(Arrays.asList(behaviorAlertObjectReceiveVo));
        return behaviorAlertReceiveVo;
    }


    /**
     * saveBase64ToVIID
     * @param base64
     * @return
     */
    public String saveBase64ToViid(String base64){
        if(com.kedacom.kiaf.common.util.StringUtils.isBlank(base64)){
            return base64;
        }
        String imageId = ViidUtils.generateImageID("10000000000211","0", new Date().getTime());
        ImageInfo imageInfo = new ImageInfo.Builder()
                .imageID(imageId).infoKind(0).imageSource("99").deviceID(RandomUtil.getRandomInt(20))
                .fileFormat("Jpeg").shotTime(new Date()).title("originFileName").contentDescription("ezview image")
                .shotPlaceFullAdress("unkonw").securityLevel("9").width(0).height(0)
                .build();
        Image image = new Image.Builder()
                .imageInfo(imageInfo).data(base64)
                .build();
        return addAndSearch(image);
    }

    private String addAndSearch(Image image) {
        ImageList imageList = new ImageList.Builder()
                .image(Arrays.asList(image))
                .build();
        ImageListObject imageListObject = ImageListObject.builder().imageListObject(imageList).build();
        String json = convertToViidJson(imageListObject);
        JSONObject jsonObject = lprViidFeign.saveImage(JSONObject.parseObject(json));
        JSONArray array = jsonObject.getJSONObject("ResponseStatusListObject").getJSONArray("ResponseStatusObject");
        JSONObject obj;
        String url1 = null;
        for (int i = 0; i < array.size(); i++) {
            obj = array.getJSONObject(i);
            url1 = obj.getJSONObject("ImageInfo").getString("StoragePath");
        }
        if(null != url1){
            return url1;
        }
        return "";
    }

    public static String convertToViidJson(Object object) {
        JSONObject.DEFFAULT_DATE_FORMAT = "yyyyMMddHHmmss";
        return JSON.toJSONString(object, new PascalNameFilter(), SerializerFeature.WriteDateUseDateFormat);
    }

    private String getPlateColorDesc(String plateColor){
        if(StringUtils.isEmpty(plateColor)){
            return plateColor;
        }
        Object o = CacheUtils.get("LPR_DICT_KEY_LprPlateColor");
        if(null == o){
            return plateColor;
        }
        List<DictObject> dictObjects = JSONArray.parseArray(o.toString(),DictObject.class);
        if(CollectionUtils.isEmpty(dictObjects)){
            return plateColor;
        }

        for(DictObject d: dictObjects){
            if(plateColor.equals(d.getCodeItemValue())){
                return d.getEnglishItemName();
            }
        }
        return plateColor;
    }

    private String getVehicleColorDesc(String vehicleColor){
        if(StringUtils.isEmpty(vehicleColor)){
            return vehicleColor;
        }
        Object o = CacheUtils.get("LPR_DICT_KEY_LprVehicleColor");
        if(null == o){
            return vehicleColor;
        }
        List<DictObject> dictObjects = JSONArray.parseArray(o.toString(),DictObject.class);
        if(CollectionUtils.isEmpty(dictObjects)){
            return vehicleColor;
        }

        for(DictObject d: dictObjects){
            if(vehicleColor.equals(d.getCodeItemValue())){
                return d.getEnglishItemName();
            }
        }
        return vehicleColor;
    }

    private String getVehicleBrandDesc(String vehicleBrand){
        if(StringUtils.isEmpty(vehicleBrand)){
            return vehicleBrand;
        }
        Object o = CacheUtils.get("LPR_DICT_KEY_LprVehicleBrandType");
        if(null == o){
            return vehicleBrand;
        }
        List<DictObject> dictObjects = JSONArray.parseArray(o.toString(),DictObject.class);
        if(CollectionUtils.isEmpty(dictObjects)){
            return vehicleBrand;
        }

        for(DictObject d: dictObjects){
            if(vehicleBrand.equals(d.getCodeItemValue())){
                return d.getEnglishItemName();
            }
        }
        return vehicleBrand;
    }
}
