package com.micro.dto.viid;

import com.kedacom.kiaf.common.viid.util.ViidJsonConvert;
import lombok.Data;
import org.apache.commons.collections.CollectionUtils;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Data
public class Image {

    private ImageInfo imageInfo;
    /*@Valid
    private List<Person> personList;
    @Valid
    private List<Face> faceList;
    @Valid
    private List<MotorVehicle> motorVehicleList;
    @Valid
    private List<NonMotorVehicle> nonMotorVehicleList;
    @Valid
    private List<Thing> thingList;
    @Valid
    private List<Scene> sceneList;*/
    private String data;

    public Image() {
    }

    private Image(Builder builder) {
        setImageInfo(builder.imageInfo);
        /*setPersonList(builder.personList);
        setFaceList(builder.faceList);
        setMotorVehicleList(builder.motorVehicleList);
        setNonMotorVehicleList(builder.nonMotorVehicleList);
        setThingList(builder.thingList);
        setSceneList(builder.sceneList);*/
        setData(builder.data);
    }

    public static String buildListToJson(List<Image> images) {
        Map<String, Object> objectMap = buildListToMap(images);
        Map<String, Object> listMap = new HashMap<>();
        listMap.put("imageListObject", objectMap);
        return ViidJsonConvert.convertToViidJson(listMap);
    }

    public static String buildOneToJson(Image image) {
        Map<String, Object> imageMap = buildOneToMap(image);
        Map<String, Object> objectMap = new HashMap<>();
        objectMap.put("image", imageMap);
        return ViidJsonConvert.convertToViidJson(objectMap);
    }

    public static Map<String, Object> buildListToMap(List<Image> images) {
        Map<String, Object> objectMap = null;
        if (!CollectionUtils.isEmpty(images)) {
            objectMap = new HashMap<>();
            List<Map<String, Object>> imageMaps = new ArrayList<>();
            for (Image image:images) {
                Map<String, Object> imageMap = buildOneToMap(image);
                imageMaps.add(imageMap);
            }
            objectMap.put("image", imageMaps);
        }
        return objectMap;
    }

    private static Map<String, Object> buildOneToMap(Image image) {
        Map<String, Object> imageMap = new HashMap<>(8);
        imageMap.put("imageInfo", image.getImageInfo());
        /*imageMap.put("personList", Person.buildListToMap(image.getPersonList()));
        imageMap.put("faceList", Face.buildListToMap(image.getFaceList()));
        imageMap.put("motorVehicleList", MotorVehicle.buildListToMap(image.getMotorVehicleList()));
        imageMap.put("nonMotorVehicleList", NonMotorVehicle.buildListToMap(image.getNonMotorVehicleList()));
        imageMap.put("thingList", Thing.buildListToMap(image.getThingList()));
        imageMap.put("sceneList", Scene.buildListToMap(image.getSceneList()));*/
        imageMap.put("data", image.getData());
        return imageMap;
    }

    public static final class Builder {
        private ImageInfo imageInfo;
        /*private List<Person> personList;
        private List<Face> faceList;
        private List<MotorVehicle> motorVehicleList;
        private List<NonMotorVehicle> nonMotorVehicleList;
        private List<Thing> thingList;
        private List<Scene> sceneList;*/
        private String data;

        public Builder() {
        }

        public Builder imageInfo(ImageInfo val) {
            imageInfo = val;
            return this;
        }

        /*public Builder personList(List<Person> val) {
            personList = val;
            return this;
        }

        public Builder faceList(List<Face> val) {
            faceList = val;
            return this;
        }

        public Builder motorVehicleList(List<MotorVehicle> val) {
            motorVehicleList = val;
            return this;
        }

        public Builder nonMotorVehicleList(List<NonMotorVehicle> val) {
            nonMotorVehicleList = val;
            return this;
        }

        public Builder thingList(List<Thing> val) {
            thingList = val;
            return this;
        }

        public Builder sceneList(List<Scene> val) {
            sceneList = val;
            return this;
        }*/

        public Builder data(String val) {
            data = val;
            return this;
        }

        public Image build() {
            return new Image(this);
        }
    }

}
