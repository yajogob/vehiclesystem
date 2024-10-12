package com.micro.listener;

import com.alibaba.fastjson.JSONObject;
import com.micro.enums.FakeVehiclePlateAnalyseTypeEnum;
import com.micro.model.common.DeckModel;
import com.micro.model.common.DeckRelatedModel;
import com.micro.model.common.PropModel;
import com.micro.model.fake.MotorVehicleListOut;
import com.micro.service.FakeAlgService;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 */
@Service
@Slf4j
public class FakeConsumerListener {

    @Autowired
    private FakeAlgService fakeAlgUtil;

    private String latestSnapshotTime = "1970-01-01 00:00:00";
    private static long veryStartTime = System.currentTimeMillis();
    private static AtomicLong count = new AtomicLong(0);
    private static AtomicLong countCase = new AtomicLong(0);

    @KafkaListener(containerFactory = "batchNoByteFactory",topics = {"#{'${spring.kafka.fake.plate.topic}'.split(',')}"})
    public void listener(List<ConsumerRecord<?, ?>> list){
        List<String> messages = new ArrayList<>();
        for (ConsumerRecord<?, ?> record : list) {
            Optional<?> kafkaMessage = Optional.ofNullable(record.value());
            kafkaMessage.ifPresent(o -> messages.add(o.toString()));
        }
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try{
            long pollStartTime = System.currentTimeMillis();
            //distance
            Map<String, PropModel> distanceMap = new HashMap<String, PropModel>();
            //brand
            Map<String, PropModel> logoMap = new HashMap<String, PropModel>();
            Map<String,PropModel> cgkMap = new HashMap<>();
            List<Map<String,String>> updateModels = new ArrayList<Map<String, String>>();
            List<String> logoKeys = new ArrayList<String>();
            List<String> distanceKeys = new ArrayList<String>();
            MotorVehicleListOut proto = null;
            for(String message : messages){
                proto = JSONObject.parseObject(message,MotorVehicleListOut.class);
                count.incrementAndGet();
                if(count.longValue()%1000 == 0){
                    double lastTimeSec = (double)(pollStartTime - veryStartTime)/(double)(1000);
                    double processSpeed = (double)count.longValue()/lastTimeSec;
                    log.info("Thread:" + Thread.currentThread().getId() + "-Total Records Processed:" + count.longValue() + ",Total processing time of threads：" +fakeAlgUtil.formatDouble(lastTimeSec) +
                            "Seconds, processing speed：" +fakeAlgUtil.formatDouble(processSpeed) + "Bar/second, latest timestamp：" + latestSnapshotTime);
                }
                List<MotorVehicleListOut.MotorVehicleListDTO.MotorVehicleObjectDTO> kdMotorVehicles = proto.getMotorVehicleListDTO().getMotorVehicleObject();
                if(kdMotorVehicles == null || kdMotorVehicles.isEmpty()){
                    continue;
                }
                transform(kdMotorVehicles,sdf,cgkMap,logoMap,distanceMap,updateModels,logoKeys,distanceKeys);
            }

            dataProcess(cgkMap,logoMap,distanceMap,updateModels,logoKeys,distanceKeys);
            if(!messages.isEmpty()){
                long pollEndTime = System.currentTimeMillis();
                log.debug("Single poll message processing time: {} ms Number of records pulled this time: {}" ,(pollEndTime - pollStartTime), messages.size());
            }
        }catch(Exception e){
            log.info("ConsumerListener listener is error:"+e.getMessage());
            e.printStackTrace();
        }
    }


    /**
     * transform
     * @param kdMotorVehicles
     * @param sdf
     * @param cgkMap
     * @param logoMap
     * @param distanceMap
     * @param updateModels
     * @param logoKeys
     * @param distanceKeys
     */
    public void transform(List<MotorVehicleListOut.MotorVehicleListDTO.MotorVehicleObjectDTO> kdMotorVehicles,SimpleDateFormat sdf,Map<String,PropModel> cgkMap,Map<String, PropModel> logoMap,Map<String,PropModel> distanceMap,
                          List<Map<String,String>> updateModels,List<String> logoKeys,List<String> distanceKeys){
        for(int i = 0;i < kdMotorVehicles.size();i++){
            MotorVehicleListOut.MotorVehicleListDTO.MotorVehicleObjectDTO kdMotorVehicle = kdMotorVehicles.get(i);
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMddHHmmss");
            Date passDate = null;
            try {
                passDate = simpleDateFormat.parse(kdMotorVehicle.getPassTime());
            } catch (ParseException e) {
                passDate = new Date();
                e.printStackTrace();
            }
            Long timestamp = passDate.getTime();
            PropModel model = fakeAlgUtil.transformRedisModelFromKafka(kdMotorVehicle);
            if(fakeAlgUtil.needFilterAllRecord(model)){
                continue;
            }
            if("********".equals(model.getPlateNumber()) || "00000000".equals(model.getPlateNumber()) ){
                continue;
            }
            if(StringUtils.isEmpty(model.getVehicleSubLogo()) || StringUtils.isEmpty(model.getVehicleLogo())){
                continue;
            }
            String key = FakeAlgService.redisValuePre+":"+model.getPlateNumber()+"_"+model.getPlateColor() +"_" + model.getNationalityCode()+"_"+model.getPlaceCode()+ "_" + model.getPlateType() + "_"+timestamp;
            Map<String,String> map = new HashMap<String, String>();
            map.put("plateNumber",model.getPlateNumber());
            map.put("plateColor",model.getPlateColor());
            updateModels.add(map);
            cgkMap.put(key,model);
            logoMap.put(key,model);
            logoKeys.add(model.getPlateNumber()+"_"+model.getPlateColor() + "_" + model.getNationalityCode()+"_"+model.getPlaceCode()+ "_" + model.getPlateType());
            if(!fakeAlgUtil.needFilterDeviceRecord(model)){
                distanceMap.put(key,model);
                distanceKeys.add(model.getPlateNumber()+"_"+model.getPlateColor() + "_" + model.getNationalityCode()+"_"+model.getPlaceCode()+ "_" + model.getPlateType());
            }
        }
    }



    /**
     * dataProcess
     * @param cgkMap
     * @param logoMap
     * @param distanceMap
     * @param updateModels
     * @param logoKeys
     * @param distanceKeys
     */
    public void dataProcess(Map<String,PropModel> cgkMap,Map<String, PropModel> logoMap,Map<String,PropModel> distanceMap,
                            List<Map<String,String>> updateModels,List<String> logoKeys,List<String> distanceKeys){
        Map<String, DeckModel> saveDeckModelMap = new HashMap<>();
        Map<String, List<DeckRelatedModel>> saveDeckRelatedModelMap = new HashMap<>();
        Map<String, PropModel> plateMap = new HashMap<>();
        log.info("logoMap--->{}",logoMap.toString());
        log.info("distanceMap--->{}",distanceMap.toString());
        log.info("logoKeys--->{}",logoKeys.toString());
        log.info("distanceKeys--->{}",distanceKeys.toString());
        if(cgkMap.size() > 0){
//            fakeAlgUtil.judgeVehicleAdmin(updateModels,cgkMap, saveDeckModelMap);
//            plateMap.putAll(cgkMap);
            cgkMap.clear();
            updateModels.clear();
        }
        if(logoMap.size() > 0){
            fakeAlgUtil.judgeLogoDiffCriterion(logoMap,logoKeys, saveDeckModelMap, saveDeckRelatedModelMap);
            plateMap.putAll(logoMap);
            logoMap.clear();
            logoKeys.clear();
        }
        if(distanceMap.size() > 0){
            fakeAlgUtil.judgeDistanceDiffCriterion(distanceMap,distanceKeys, saveDeckModelMap, saveDeckRelatedModelMap);
            plateMap.putAll(distanceMap);
            distanceMap.clear();
            distanceKeys.clear();
        }

        if (Objects.nonNull(saveDeckModelMap) && saveDeckModelMap.size() > 0) {
            fakeAlgUtil.batchSaveData(FakeVehiclePlateAnalyseTypeEnum.KDMOTOR_VEHICLE, saveDeckModelMap, saveDeckRelatedModelMap, plateMap);
        }
    }




}
