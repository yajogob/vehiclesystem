package com.micro.service;

import cn.hutool.core.util.ObjectUtil;
import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.micro.config.FakePlateConfig;
import com.micro.enums.CriterionEnum;
import com.micro.enums.FakeVehiclePlateAnalyseTypeEnum;
import com.micro.enums.SuspectEnum;
import com.micro.model.common.*;
import com.micro.model.fake.MotorVehicleListOut;
import com.micro.util.CacheManager;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataAccessException;
import org.springframework.data.redis.connection.RedisConnection;
import org.springframework.data.redis.connection.StringRedisConnection;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisCallback;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowCallbackHandler;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.text.NumberFormat;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

@Slf4j
@Component
public class FakeAlgService {
    private Logger logger = LoggerFactory.getLogger(FakeAlgService.class);
    @Autowired
    private StringRedisTemplate redisTemplate;
    @Autowired
    private FakePlateConfig fakePlateConfig;
    @Autowired
    private KafkaTemplate<String, String> kafkaTemplate;
    @Autowired
    private DeckPlateService deckPlateService;
    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${fakeplateConf.enableJudge}")
    private String enableJudge;
    @Value("${fakeplateConf.compareFeature}")
    private Boolean compareFeature;
    @Value("${fakeplateConf.enableRecordOnlyOneEveryDay}")
    private String enableRecordOnlyOneEveryDay;

    @Value("${fakeplateConf.fakePlateVehicleByFeature}")
    private String fakePlateVehicleByFeature;

    public static final String DEVICE_LIST = "hy:devices";
    public static final String redisValuePre = "hy:fp";
    public static final String redisValueTowPre = "hy:fp:tow";
    public static final String fakeConfirmRedisKey = "hy:fp:con";
    private static final DateTimeFormatter DATE_TIME_FORMATE = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static String deckKey = "hy:fp:th";
    private Double minLatitude = null;
    private Double maxLatitude = null;
    private Double minLongitude = null;
    private Double maxLongitude = null;

    @Value("${fakeplateConf.samedevice.interval:300}")
    private Integer sameDeviceInterval;

    /**
     * logo and brand
     * @param map
     * @param logoKeys
     * @param saveDeckModelMap
     * @param saveDeckRelatedModelMap
     */
    public void judgeLogoDiffCriterion(Map<String, PropModel> map, final List<String> logoKeys, Map<String, DeckModel> saveDeckModelMap, Map<String, List<DeckRelatedModel>> saveDeckRelatedModelMap) {
        if ("true".equals(fakePlateConfig.getEnableCompare())) {
            try {
                long startTime = System.currentTimeMillis();
                Map<String, String> models = getObjects(redisValueTowPre, logoKeys);
                logger.info("get redis time:" + (System.currentTimeMillis() - startTime) + "ms");
                Map<String, String> updateMap = new HashMap<String, String>();

                for (Map.Entry<String, PropModel> entry : map.entrySet()) {
                    String plateKey = entry.getKey().substring(0, entry.getKey().lastIndexOf("_")).split(":")[2];
                    logger.debug("plateKey={}"+ plateKey);
                    PropModel propModel = entry.getValue();
                    if (models.containsKey(plateKey)) {
                        logger.debug("models.containsKey={true}");
                        RedisValueModel oldModel = JSON.parseObject(models.get(plateKey), RedisValueModel.class);
                        if (!isNotEmpty(oldModel.getPb()) ||
                                !isNotEmpty(oldModel.getHb())
                                || !isNotEmpty(oldModel.getPqc())) {
                            continue;
                        }
                        if (isNotEmpty(fakePlateConfig.getVehicleType()) && isNotEmpty(oldModel.getVt())) {
                            String[] types = fakePlateConfig.getVehicleType().split(",");
                            boolean flag = false;
                            for (String type : types) {
                                if (type.equals(String.valueOf(oldModel.getVt()))) {
                                    flag = true;
                                    break;
                                }
                            }
                            if (flag) {
                                logger.info("vehicleType filter:" + oldModel.getVt());
                                continue;
                            }
                        }
                        String[] basedReason = new String[1];
                        boolean compareFlag = isCompareDeck(propModel, oldModel);
                        logger.debug("compareFlag = {}" ,compareFlag);
                        if (compareFlag) {
                            logger.info(propModel.getVehicleLogo() + "_" + oldModel.getVb() + ",model:" + propModel.getVehicleSubLogo() + "_" + oldModel.getXh());
                            startTime = System.currentTimeMillis();
                            float similar = 0;
                            double diff = (double) Math.abs(propModel.getPassTime() - oldModel.getPt()) / (double) (1000 * 60 * 60);
                            if (diff > Double.parseDouble(fakePlateConfig.getRedisDelRecordByHour())) {
                                continue;
                            }
                            if (isNotEmpty(fakePlateConfig.getEnableVehicleSubBrand()) &&
                                    "true".equals(fakePlateConfig.getEnableVehicleSubBrand())) {
                                if ("NULL".equals(oldModel.getVsl())) {
                                    continue;
                                }
                            }
                            logger.info(Thread.currentThread().getName() + ":create result," + propModel.getPlateNumber() + " : " + basedReason[0]);
                            DeckModel deckModel = transformVehicleDeck(propModel, CriterionEnum.COMPARE, SuspectEnum.DECK_RECORD,oldModel);
                            deckModel.setBaseReason(basedReason[0]);
                            saveDeckModelMap.put(deckModel.getId(), deckModel);
                            DeckRelatedModel deckRelatedModel1 = transformVehicleRelatedDeckMain(deckModel.getId(), propModel);
                            DeckRelatedModel deckRelatedModel2 = transformVehicleRelatedDeckVice(deckModel.getId(), oldModel);
                            if (deckRelatedModel1 != null && deckRelatedModel2 != null) {
                                saveDeckRelatedModelMap.put(deckModel.getId(), Arrays.asList(deckRelatedModel1, deckRelatedModel2));
                            }
                        }
                    }
                }

                for (Map.Entry<String, PropModel> entry : map.entrySet()) {
                    RedisValueModel redisValueModel = transform(entry.getValue());
                    String plateKey = entry.getKey().substring(0, entry.getKey().lastIndexOf("_")).split(":")[2];
                    String compress = gzip(JSON.toJSONString(redisValueModel));
                    if (compress != null) {
                        updateMap.put(plateKey, compress);
                    }
                }
                startTime = System.currentTimeMillis();
                updateRedis(updateMap, redisValueTowPre);
                logger.info("update redis time:" + (System.currentTimeMillis() - startTime));
            } catch (Exception e) {
                e.printStackTrace();
                logger.info("judgeLogoDiffCriterion error:" + e.getMessage());
            }
        }
    }

    private Map<String, String> getObjects(final String preKey, final List<String> keys) {
        Map<String, String> result = new HashMap<String, String>();
        List<Object> objects = redisTemplate.execute(new RedisCallback<List<Object>>() {
            @Override
            public List<Object> doInRedis(RedisConnection connection) throws DataAccessException {
                StringRedisConnection redisConnection = (StringRedisConnection) connection;
                redisConnection.openPipeline();
                for (String key : keys) {
                    redisConnection.get(preKey + ":" + key);
                }
                return redisConnection.closePipeline();
            }
        });
        if (objects != null && objects.size() > 0) {
            for (int i = 0; i < keys.size(); i++) {
                if (objects.get(i) != null) {
                    byte[] bytes = (byte[]) objects.get(i);
                    if (bytes.length > 0) {
                        String value = new String((byte[]) objects.get(i), StandardCharsets.UTF_8);
                        result.put(keys.get(i), gunzip(value));
                    }
                }
            }
        }
        return result;
    }

    public String gzip(String str) {
        if (null == str || str.length() <= 0) {
            return str;
        }
        String compress = null;
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            GZIPOutputStream gzip = new GZIPOutputStream(out);
            gzip.write(str.getBytes(StandardCharsets.UTF_8));
            gzip.close();
            compress = Base64.encodeBase64String(out.toByteArray());
        } catch (Exception e) {
        }
        return compress;
    }

    public static String gunzip(String compressedStr) {
        if (compressedStr == null) {
            return null;
        }
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        ByteArrayInputStream in = null;
        GZIPInputStream ginzip = null;
        byte[] compressed = null;
        String decompressed = null;
        try {
            compressed = Base64.decodeBase64(compressedStr);
            in = new ByteArrayInputStream(compressed);
            ginzip = new GZIPInputStream(in);

            byte[] buffer = new byte[1024];
            int offset = -1;
            while ((offset = ginzip.read(buffer)) != -1) {
                out.write(buffer, 0, offset);
            }
            decompressed = new String(out.toByteArray(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (ginzip != null) {
                try {
                    ginzip.close();
                } catch (IOException e) {
                }
            }
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e) {
                }
            }
            if (out != null) {
                try {
                    out.close();
                } catch (IOException e) {
                }
            }
        }
        return decompressed;
    }

    private RedisValueModel transform(PropModel propModel) {
        RedisValueModel model = new RedisValueModel();
        model.setDi(propModel.getTollNO());
        model.setMi(propModel.getTollRecID());
        model.setPt(propModel.getPassTime());
        model.setPu(propModel.getVehcURL());
        model.setVb(propModel.getVehicleLogo());
        model.setFb(propModel.getFrontBack());
        model.setAi(propModel.getAnalysisObjID());
        model.setPb(propModel.getPicBrightness());
        model.setHb(propModel.getVehBrightness());
        if(StringUtils.isEmpty(propModel.getVehicleType())){
            propModel.setVehicleType("-1");
        }
        model.setVt(Long.parseLong(propModel.getVehicleType()));
        model.setPqc(propModel.getPlateConf());
        model.setXh(propModel.getVehicleSubLogo());
        model.setPlateNo(propModel.getPlateNumber());
        model.setPlateType(propModel.getPlateType());
        model.setNationalityCode(propModel.getNationalityCode());
        model.setPlaceCode(propModel.getPlaceCode());

        model.setPfc(propModel.getPlateFirstCharConf());
        model.setBr(propModel.getLogoConf());
        model.setVsl(propModel.getVehicleSubLogo());
        model.setIs(propModel.getIsStained());
        DeckRelatedModel deckRelatedModel = new DeckRelatedModel();
        SimpleDateFormat sdf2 = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        deckRelatedModel.setId(UUID.randomUUID().toString().replaceAll("-", ""));
        deckRelatedModel.setCarThroughId(propModel.getTollRecID());
        deckRelatedModel.setDeviceCode(propModel.getTollNO());

        deckRelatedModel.setHatStatus(Integer.parseInt(propModel.getHatStatus() + ""));
        deckRelatedModel.setHatStatusConf(propModel.getHatConf());
        deckRelatedModel.setSunVisorStatus(Integer.parseInt(propModel.getSunvisorStatus() + ""));
//        deckRelatedModel.setSunVisorConf(Integer.parseInt(propModel.getSunvisorConf() + ""));
        deckRelatedModel.setSunGlassStatus(Integer.parseInt(propModel.getSunglassStatus() + ""));
        deckRelatedModel.setSunGlassConf(propModel.getSunglassConf());
        deckRelatedModel.setMaskFaceStatus(Integer.parseInt(propModel.getMaskFaceStatus() + ""));
        deckRelatedModel.setMaskConf(propModel.getMaskFaceConf());
        deckRelatedModel.setImageUrl(propModel.getVehcURL());
        deckRelatedModel.setPlateNo(propModel.getPlateNumber());
        deckRelatedModel.setPlateColor(Integer.parseInt(propModel.getPlateColor()));
        deckRelatedModel.setDeckStatus(0);
        deckRelatedModel.setSubVehicleType(propModel.getVehicleSubLogo());
        deckRelatedModel.setThroughTime(sdf2.format(new Date(propModel.getPassTime())));

        deckRelatedModel.setVehicleColor(StringUtils.isEmpty(propModel.getVehicleColor())?-1:Integer.parseInt(propModel.getVehicleColor()));
        deckRelatedModel.setVehicleType(StringUtils.isEmpty(propModel.getVehicleType())?-1:Integer.parseInt(propModel.getVehicleType()));
        deckRelatedModel.setVehiclePosition(propModel.getVehiclePosition());
        deckRelatedModel.setPlatePosition(propModel.getPlatePosition());
        deckRelatedModel.setVehicleLogo((String.valueOf(propModel.getVehicleLogo())));

        model.setDeckRelatedModel(JSONObject.toJSONString(deckRelatedModel));
        return model;
    }

    private Boolean isNotEmpty(Object obj) {
        if (null != obj && !"".equals(obj) && !"null".equals(obj)) {
            return true;
        }
        return false;
    }

    public String formatDouble(double d) {
        NumberFormat nf = NumberFormat.getNumberInstance();
        nf.setMaximumFractionDigits(2);
        nf.setRoundingMode(RoundingMode.DOWN);
        return nf.format(d);
    }

    private double deg2rad(double degree) {
        return degree / 180 * Math.PI;
    }

    private double rad2deg(double radian) {
        return radian * 180 / Math.PI;
    }

    public double GetDistance(double lat1, double lon1, double lat2, double lon2) {
        double theta = lon1 - lon2;
        double dist = Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2))
                + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2))
                * Math.cos(deg2rad(theta));
        dist = Math.acos(dist);
        dist = rad2deg(dist);
        double miles = dist * 60 * 1.1515;
        return miles * 1.609344;
    }

    public static void main(String args[]){
        FakeAlgService f = new FakeAlgService();
        double v = f.GetDistance(54.3796268, 24.4965059, 54.588128, 24.411191);
        System.out.println(v);
    }


    private boolean isCompareDeck(PropModel newModel, RedisValueModel oldModel) {
        try {
            logger.debug("isCompareDeck,new Model={},oldModel={}",JSONObject.toJSONString(newModel),JSONObject.toJSONString(oldModel));
            String brand1 = String.valueOf(newModel.getVehicleLogo());
            String brand2 = String.valueOf(oldModel.getVb());
//            String newVehicleMode = newModel.getVehicleSubLogo();
//            String oldVehicleMode = oldModel.getXh();
            if(!StringUtils.isEmpty(newModel.getTollNO()) && !StringUtils.isEmpty(oldModel.getDi()) && null != newModel.getPassTime() && null != oldModel.getPt()){
                if(newModel.getTollNO().equals(oldModel.getDi())){
                    Long passTime = newModel.getPassTime();
                    Long oldPassTime = oldModel.getPt();
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
                    LocalDateTime dateTime1 = LocalDateTime.parse(passTime.toString(), formatter);
                    LocalDateTime dateTime2 = LocalDateTime.parse(oldPassTime.toString(), formatter);
                    long secondsBetween = java.time.Duration.between(dateTime1, dateTime2).getSeconds();
                    boolean isMoreThan300Seconds = Math.abs(secondsBetween) <= sameDeviceInterval;
                    if(isMoreThan300Seconds){
                        log.info("isCompareDeck samedevice less than {}",sameDeviceInterval);
                        return false;
                    }
                }
            }
//            if (StringUtils.isEmpty(brand1) || StringUtils.isEmpty(brand2) || StringUtils.isEmpty(newVehicleMode) || StringUtils.isEmpty(oldVehicleMode)) {
//                return false;
//            }
            if (StringUtils.isEmpty(brand1) || StringUtils.isEmpty(brand2)) {
                return false;
            }
            if (!StringUtils.isEmpty(brand1) && !StringUtils.isEmpty(brand2)) {
                if (!brand1.equals(brand2)) {
                    return true;
                }
            }

//            if (!StringUtils.isEmpty(newVehicleMode)&& !StringUtils.isEmpty(oldVehicleMode)) {
//                if (!newVehicleMode.equals(oldVehicleMode)) {
//                    return true;
//                }
//            }
            return false;
        } catch (Exception e) {
            logger.error("compare error{}",e.getMessage());
            return false;
        }
    }

    public DeckModel transformVehicleDeck(PropModel model, CriterionEnum criterionEnum, SuspectEnum suspectEnum, RedisValueModel oldModel) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            DeckModel deckModel = new DeckModel();
            deckModel.setId(UUID.randomUUID().toString().replaceAll("-", ""));
            deckModel.setDeviceCode(model.getTollNO());
            deckModel.setPlateNo(model.getPlateNumber());
            deckModel.setPlateColor(Integer.parseInt(model.getPlateColor()));
            deckModel.setVehicleLogo(String.valueOf(model.getVehicleLogo()));
            if(StringUtils.isEmpty(model.getVehicleType())){
                deckModel.setVehicleType(-1);
            }else {
                deckModel.setVehicleType(Integer.parseInt(model.getVehicleType()));
            }

            deckModel.setVehicleColor(StringUtils.isNotBlank(model.getVehicleColor())?Integer.parseInt(model.getVehicleColor()):-1);
            deckModel.setSubVehicleType(model.getVehicleSubLogo());
            deckModel.setImageUrl(model.getVehcURL());
            deckModel.setCriterion(criterionEnum.toString());
            deckModel.setVehiclePosition(model.getVehiclePosition());
            deckModel.setPlatePosition(model.getPlatePosition());
            deckModel.setCarThroughId(model.getTollRecID());

            deckModel.setMaskFaceStatus(Integer.parseInt(model.getMaskFaceStatus() + ""));
            deckModel.setMaskConf(model.getMaskFaceConf());
            deckModel.setSunVisorStatus(Integer.parseInt(model.getSunvisorStatus() + ""));
//            deckModel.setSunVisorConf(Integer.parseInt(model.getSunvisorConf() + ""));
            deckModel.setHatStatus(Integer.parseInt(model.getHatStatus() + ""));
            deckModel.setHatStatusConf(model.getHatConf());
            deckModel.setDeckStatus(0);
            deckModel.setSunGlassStatus(Integer.parseInt(model.getSunglassStatus() + ""));
            deckModel.setSunGlassConf(model.getSunglassConf());
            deckModel.setSuspected(Integer.parseInt(suspectEnum.toString()));
            deckModel.setThroughTime(sdf.format(new Date(new SimpleDateFormat("yyyyMMddHHmmss").parse(String.valueOf(model.getPassTime())).getTime())));
            deckModel.setUpdateTime(sdf.format(new Date()));

            deckModel.setVehicleYear(model.getVehicleYear());
            deckModel.setVehicleMake(model.getVehicleLogo());
            deckModel.setVehicleModel(model.getVehicleSubLogo());
            deckModel.setPlaceCode(model.getPlaceCode());
            deckModel.setNationalityCode(model.getNationalityCode());
            deckModel.setPlateType(model.getPlateType());

            deckModel.setLastVehicleMake(null!=oldModel.getVb()?String.valueOf(oldModel.getVb()):"");
            deckModel.setLastVehicleModel(oldModel.getXh());
            deckModel.setLastVehicleImage(oldModel.getPu());
            deckModel.setLastPlateNumber(oldModel.getPlateNo());
            deckModel.setLastCameraId(oldModel.getDi());
            deckModel.setLastCaptureDateTime(null!=oldModel.getPt()?oldModel.getPt().toString():"");
            deckModel.setLastPlateType(oldModel.getPlateType());
            deckModel.setLastNationalityCode(oldModel.getNationalityCode());
            deckModel.setLastPlaceCode(oldModel.getPlaceCode());

            return deckModel;
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("transformVehicleDeck error:" + e.getMessage());
        }
        return null;
    }

    private DeckRelatedModel transformVehicleRelatedDeckMain(String id, PropModel model) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        try {
            DeckRelatedModel relatedModel = new DeckRelatedModel();
            relatedModel.setId(UUID.randomUUID().toString().replaceAll("-", ""));
            relatedModel.setCarThroughId(model.getTollRecID());
            relatedModel.setDeckRecordId(id);
            relatedModel.setDeviceCode(model.getTollNO());

            relatedModel.setHatStatus(Integer.parseInt(model.getHatStatus() + ""));
            relatedModel.setHatStatusConf(model.getHatConf());
            relatedModel.setSunVisorStatus(Integer.parseInt(model.getSunvisorStatus() + ""));
//            relatedModel.setSunVisorConf(Integer.parseInt(model.getSunvisorConf() + ""));
            relatedModel.setSunGlassStatus(Integer.parseInt(model.getSunglassStatus() + ""));
            relatedModel.setSunGlassConf(model.getSunglassConf());
            relatedModel.setMaskFaceStatus(Integer.parseInt(model.getMaskFaceStatus() + ""));
            relatedModel.setMaskConf(model.getMaskFaceConf());
            relatedModel.setImageUrl(model.getVehcURL());
            relatedModel.setPlateNo(model.getPlateNumber());
            relatedModel.setPlateColor(Integer.parseInt(model.getPlateColor()));
            relatedModel.setDeckStatus(0);
            relatedModel.setSubVehicleType(model.getVehicleSubLogo());
            relatedModel.setThroughTime(sdf.format(new Date(model.getPassTime())));
            relatedModel.setVehicleColor(StringUtils.isEmpty(model.getVehicleColor())?-1:Integer.parseInt(model.getVehicleColor()));
            relatedModel.setVehicleType(StringUtils.isEmpty(model.getVehicleType())?-1:Integer.parseInt(model.getVehicleType()));
            relatedModel.setVehiclePosition(model.getVehiclePosition());
            relatedModel.setVehicleLogo(String.valueOf(model.getVehicleLogo()));
            relatedModel.setPlatePosition(model.getPlatePosition());
            return relatedModel;
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    private DeckRelatedModel transformVehicleRelatedDeckVice(String id, RedisValueModel model) {
        try {
            DeckRelatedModel redisValueModel = JSONObject.parseObject(model.getDeckRelatedModel(), DeckRelatedModel.class);
            redisValueModel.setDeckRecordId(id);
            return redisValueModel;
        } catch (Exception e) {
            e.printStackTrace();
            logger.info("error:" + e.getMessage());
        }
        return null;
    }

    private void updateRedis(final Map<String, String> models, final String preKey) {
        redisTemplate.execute(new RedisCallback<Object>() {
            @Override
            public Object doInRedis(RedisConnection connection) throws DataAccessException {
                StringRedisConnection redisConnection = (StringRedisConnection) connection;
                redisConnection.openPipeline();
                for (Map.Entry<String, String> entry : models.entrySet()) {
                    redisConnection.set(preKey + ":" + entry.getKey(), entry.getValue());
                    redisConnection.expire(preKey + ":" + entry.getKey(), Integer.parseInt(fakePlateConfig.getRedisDelRecordByHour()) * 60 * 60);
                }
                redisConnection.closePipeline();
                return null;
            }
        });
    }

    /**
     * distance
     * @param map
     * @param distanceKeys
     * @param saveDeckModelMap
     * @param saveDeckRelatedModelMap
     */
    public void judgeDistanceDiffCriterion(Map<String, PropModel> map, List<String> distanceKeys, Map<String, DeckModel> saveDeckModelMap, Map<String, List<DeckRelatedModel>> saveDeckRelatedModelMap) {
        if ("true".equals(fakePlateConfig.getEnableDistance())) {
            long startTime = System.currentTimeMillis();
            Map<String, String> models = getObjects(redisValuePre, distanceKeys);
            logger.debug("judgeDistanceDiffCriterion reids key {} , {}", redisValuePre, distanceKeys);
            logger.info("judgeDistanceDiffCriterion get redis time:" + (System.currentTimeMillis() - startTime));
            Map<String, String> updateMap = new HashMap<String, String>();
            List<String> distanceDeviceFilter = CacheManager.getData("distanceDeviceFilter");
            try {
                for (Map.Entry<String, PropModel> entry : map.entrySet()) {
                    String plateKey = entry.getKey().substring(0, entry.getKey().lastIndexOf("_")).split(":")[2];
                    PropModel propModel = entry.getValue();
                    if (models.containsKey(plateKey)) {
                        RedisValueModel oldModel = JSON.parseObject(models.get(plateKey), RedisValueModel.class);
                        if (distanceDeviceFilter != null
                                && distanceDeviceFilter.contains(propModel.getTollNO())) {
                            continue;
                        }
                        if (!isNotEmpty(CacheManager.getData(propModel.getTollNO()))) {
                            continue;
                        }
                        if (distanceDeviceFilter != null
                                && distanceDeviceFilter.contains(oldModel.getDi())) {
                            continue;
                        }
                        if (!isNotEmpty(CacheManager.getData(oldModel.getDi()))) {
                            continue;
                        }
                        DeviceModel newDeviceModel = CacheManager.getData(propModel.getTollNO());
                        if(null != newDeviceModel){
                            logger.debug("judgeDistanceDiffCriterion oleValue={} ",JSONObject.toJSONString(newDeviceModel));
                        }

                        double newLatitude = newDeviceModel.getLatitude();
                        double newLongitude = newDeviceModel.getLongitude();
                        long newPassTime = propModel.getPassTime();
                        DeviceModel oldDeviceModel = CacheManager.getData(oldModel.getDi());
                        double oldLatitude = oldDeviceModel.getLatitude();
                        double oldLongitude = oldDeviceModel.getLongitude();
                        long oldPassTime = oldModel.getPt();
                        String[] basedReason = new String[1];
                        if (isDistanceDeck(propModel.getPlateNumber(), oldLatitude, oldLongitude, oldPassTime,
                                newLatitude, newLongitude, newPassTime, basedReason)) {
                            if (isNotEmpty(fakePlateConfig.getEnableFrontOrBack()) &&
                                    "true".equals(fakePlateConfig.getEnableFrontOrBack())) {
                                if (propModel.getFrontBack() != 0 ||
                                        oldModel.getFb() != 0) {
                                    continue;
                                }
                                if (!isNotEmpty(oldModel.getPqc())) {
                                    continue;
                                }
                                if (isNotEmpty(fakePlateConfig.getPlateConf())
                                        && isNotEmpty(oldModel.getPqc())) {
                                    if (oldModel.getPqc() < Double.parseDouble(fakePlateConfig.getPlateConf())) {
                                        continue;
                                    }
                                }
                            }
                            logger.debug("judgeDistanceDiffCriterion 666666666 ");
                            DeckModel deckModel = transformVehicleDeck(propModel, CriterionEnum.DISTANCE, SuspectEnum.DECK_RECORD,oldModel);
                            deckModel.setBaseReason(basedReason[0]);

                            saveDeckModelMap.put(deckModel.getId(), deckModel);
                            DeckRelatedModel deckRelatedModel1 = transformVehicleRelatedDeckMain(deckModel.getId(), propModel);
                            DeckRelatedModel deckRelatedModel2 = transformVehicleRelatedDeckVice(deckModel.getId(), oldModel);
                            if (deckRelatedModel1 != null && deckRelatedModel2 != null) {
                                saveDeckRelatedModelMap.put(deckModel.getId(), Arrays.asList(deckRelatedModel1, deckRelatedModel2));
                            }
                        }
                    }
                }

                for (Map.Entry<String, PropModel> entry : map.entrySet()) {
                    String plateKey = entry.getKey().substring(0, entry.getKey().lastIndexOf("_")).split(":")[2];
                    RedisValueModel redisValueModel = transform(entry.getValue());
                    logger.debug("redis key:{}, val:{}", plateKey, JSON.toJSONString(redisValueModel));

                    String compress = gzip(JSON.toJSONString(redisValueModel));
                    if (compress != null) {
                        updateMap.put(plateKey, compress);
                    }
                }
                startTime = System.currentTimeMillis();
                updateRedis(updateMap, redisValuePre);
                logger.info("update redis:" + (System.currentTimeMillis() - startTime) + "ms");
            } catch (Exception e) {
                e.printStackTrace();
                logger.info("judgeDistanceDiffCriterion error:" + e.getMessage());
            }
        }
    }

    private boolean isDistanceDeck(String plateName, Double oldLati, Double oldLongi, Long oldTime,
                                   Double newLati, Double newLongi, Long newTime, String[] basedReason) {
        log.debug("isDistanceDeck in..plateName={},oldLati={},oldLongi={},oldTime={},newLati={},newLongi={},newTime={}",plateName,oldLati,oldLongi,oldTime
        ,newLati,newLongi,newTime);
        double hourTime = (double) Math.abs(oldTime - newTime) / (double) (60 * 60);
        if (Math.abs(oldTime - newTime) <= Integer.parseInt(fakePlateConfig.getMinTimeIntevalBySecond())) {
            logger.debug("new ：{} old{}", newTime, oldTime);
            logger.debug(Thread.currentThread().getName() + ":time interval：" + Math.abs(oldTime - newTime) + ",less than configuration：" +
                    fakePlateConfig.getMinTimeIntevalBySecond() + "second return false!");
            return false;
        }
        if (minLatitude == null) {
            minLatitude = Double.parseDouble(fakePlateConfig.getMinLatitude());
        }
        if (maxLatitude == null) {
            maxLatitude = Double.parseDouble(fakePlateConfig.getMaxLatitude());
        }
        if (minLongitude == null) {
            minLongitude = Double.parseDouble(fakePlateConfig.getMinLongitude());
        }
        if (maxLongitude == null) {
            maxLongitude = Double.parseDouble(fakePlateConfig.getMaxLongitude());
        }
        if (oldLati < minLatitude || oldLati > maxLatitude || newLati < minLatitude || newLati > maxLatitude ||
                oldLongi < minLongitude || oldLongi > maxLongitude || newLongi < minLongitude || newLongi > maxLongitude) {
            logger.debug(Thread.currentThread().getName() + ":The latitude and longitude of the bayonet are not within the allowable range！don't compare。");
            return false;
        }
        double distance = GetDistance(oldLati, oldLongi, newLati, newLongi);
        if (distance == 0) {
            logger.debug(Thread.currentThread().getName() + ":If the distance between the checkpoints is the same, it is judged as the same record and return false！");
            return false;
        }
        double realSpeed = distance / hourTime;
        int maxSpeed = Integer.parseInt(fakePlateConfig.getVehicleSpeedByKm());
        if (realSpeed > maxSpeed) {
            basedReason[0] = "distance: " + formatDouble(distance) + "km，time interval: " + formatDouble(hourTime * 60)
                    + "min,speed>" + formatDouble(realSpeed) + "km/h";
            logger.info(Thread.currentThread().getName() + ":Generate a record of simultaneous remote license plate registration, with the following information: " + plateName + "," + basedReason[0]);
            return true;
        } else {
            return false;
        }
    }

    public void batchSaveData(FakeVehiclePlateAnalyseTypeEnum analyseTypeEnum, Map<String, DeckModel> deckModelMap, Map<String, List<DeckRelatedModel>> deckRelatedMap, Map<String, PropModel> plateMap) {
        List<DeckModel> deckModels = deckModelMap.values().stream().filter(data -> Objects.nonNull(data)).collect(Collectors.toList());

        if (CollectionUtils.isEmpty(deckModels)) {
            return;
        }
        logger.info(JSONObject.toJSONString(deckModels));
        List<DeckModel> saveSucessDeckModelDatas = new ArrayList<>();
        if (deckPlateService.saveDecks(deckModels)) {
            saveSucessDeckModelDatas = deckModels;
        } else {
            for (DeckModel deckModel : deckModels) {
                if ("1".equals(deckPlateService.saveDeck(deckModel))) {
                    saveSucessDeckModelDatas.add(deckModel);
                }
            }
        }

        if (Objects.nonNull(deckRelatedMap) && deckRelatedMap.size() > 0) {
            List<DeckRelatedModel> deckRelatedModels = new ArrayList<>();
            for (DeckModel deckModel : saveSucessDeckModelDatas) {
                if (deckRelatedMap.containsKey(deckModel.getId())) {
                    deckRelatedModels.addAll(deckRelatedMap.get(deckModel.getId()));
                }
            }
            if (!deckPlateService.saveDeckRelateds(deckRelatedModels)) {
                for (DeckRelatedModel deckRelatedModel : deckRelatedModels) {
                    if (!deckRelatedMap.containsKey(deckRelatedModel.getDeckRecordId())) {
                        deckRelatedMap.remove(deckRelatedModel.getDeckRecordId());
                    }
                    deckPlateService.saveDeckRelateds(Arrays.asList(deckRelatedModel));
                }
                deckRelatedMap.forEach((deckRecordId, deckRelatedModelsNew) -> {
                    deckPlateService.saveDeckRelateds(deckRelatedModelsNew);
                });
            }
        }
    }


    public PropModel transformRedisModelFromKafka(MotorVehicleListOut.MotorVehicleListDTO.MotorVehicleObjectDTO kdMotorVehicle) {
        PropModel model = new PropModel();
        String plateColor = kdMotorVehicle.getPlateColor();
        if (StringUtils.isEmpty(plateColor)) {
            plateColor = "99";
        }
        model.setTollRecID(kdMotorVehicle.getMotorVehicleID());
        model.setTollNO(kdMotorVehicle.getDeviceID());
        model.setPlateNumber(kdMotorVehicle.getPlateNo());
        model.setPassTime(Long.parseLong(kdMotorVehicle.getPassTime()));
        model.setVehcURL(kdMotorVehicle.getStorageUrl1());
        model.setVehicleColor(kdMotorVehicle.getVehicleColor());
        model.setVehicleType(kdMotorVehicle.getVehicleClass());
        model.setVehicleLogo(StringUtils.isEmpty(kdMotorVehicle.getVehicleBrand())?0:Long.parseLong(kdMotorVehicle.getVehicleBrand()));
        model.setVehicleSubLogo(kdMotorVehicle.getVehicleModel());
        model.setVehicleYear(kdMotorVehicle.getVehicleStyles());
        model.setPlateColor(plateColor);
        model.setPlaceCode(kdMotorVehicle.getPlaceCode());
        model.setNationalityCode(kdMotorVehicle.getNationalityCode());
        model.setPlateType(kdMotorVehicle.getPlateType());
        if(StringUtils.isNotEmpty(kdMotorVehicle.getBrandReliability())){
            model.setLogoConf(Double.parseDouble(kdMotorVehicle.getBrandReliability()));
        }
        if(StringUtils.isNotEmpty(kdMotorVehicle.getPlateReliability())){
            model.setPlateConf(Double.parseDouble(kdMotorVehicle.getPlateReliability()));
        }
        if (isNotEmpty(kdMotorVehicle.getLeftTopX()) &&
                isNotEmpty(kdMotorVehicle.getLeftTopY()) &&
                isNotEmpty(kdMotorVehicle.getRightBtmX()) &&
                isNotEmpty(kdMotorVehicle.getRightBtmY())) {
            RectPosition positionModel = new RectPosition();
            positionModel.setX(kdMotorVehicle.getLeftTopX());
            positionModel.setY(kdMotorVehicle.getLeftTopY());
            positionModel.setW(kdMotorVehicle.getRightBtmX() - kdMotorVehicle.getLeftTopX());
            positionModel.setH(kdMotorVehicle.getRightBtmY() - kdMotorVehicle.getLeftTopY());
            model.setVehiclePosition(JSON.toJSONString(positionModel));
        }
        model.setSunvisorStatus(kdMotorVehicle.getSunvisor());
        if(ObjectUtil.isNotNull(kdMotorVehicle.getSubImageList()) && !CollectionUtils.isEmpty(kdMotorVehicle.getSubImageList().getSubImageInfoObject())){
            kdMotorVehicle.getSubImageList().getSubImageInfoObject().stream().peek(x -> {
                model.setVehcURL(x.getStoragePath());
            });
        }
        return model;
    }

    public Boolean needFilterAllRecord(PropModel model) {
        if (model == null) {
            logger.debug(Thread.currentThread().getName() + ":kafka convert error");
            return true;
        }
        if (StringUtils.isEmpty(model.getPlateNumber())) {
            logger.debug(Thread.currentThread().getName() + ":no plateNo");
            return true;
        }
        return false;
    }

    public Boolean needFilterDeviceRecord(PropModel model) {
        if (!isNotEmpty(CacheManager.getData(model.getTollNO()))) {
            logger.debug(Thread.currentThread().getName() + ":no device");
            return true;
        }
        List<String> distanceDeviceFilter = CacheManager.getData("distanceDeviceFilter");
        if (distanceDeviceFilter != null
                && distanceDeviceFilter.contains(model.getTollNO())) {
            logger.debug(Thread.currentThread().getName() + ":Inaccurate latitude and longitude, filtering");
            return true;
        }
        return false;
    }


    public void setCache() {
        try {
            List<Object> devices = redisTemplate.opsForHash().values(DEVICE_LIST);
            for (Object object : devices) {
                JSONObject resultSet = JSONObject.parseObject(object.toString());
                if (resultSet.getString("viidId") != null &&
                        resultSet.getString("lat") != null &&
                        resultSet.getString("lng") != null) {
                    DeviceModel deviceModel = new DeviceModel();
                    String deviceId = resultSet.getString("viidId");
                    deviceModel.setLatitude(Double.parseDouble(resultSet.getString("lat")));
                    deviceModel.setLongitude(Double.parseDouble(resultSet.getString("lng")));
                    CacheManager.setData(deviceId, deviceModel, -1);
                }
            }
            if(!CollectionUtils.isEmpty(devices)){
                log.info("setCache  device is {} ",devices.size());
            }else {
                log.info("setCache  device is empty ");
            }

        } catch (Exception e) {
            logger.warn("getDeviceByRedis is error：", e);
        }
    }
}
