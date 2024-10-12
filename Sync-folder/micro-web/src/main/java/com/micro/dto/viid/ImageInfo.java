package com.micro.dto.viid;

import com.kedacom.kiaf.common.viid.util.ViidJsonConvert;
import lombok.Data;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Data
public class ImageInfo {

    private String imageID;

    private Integer infoKind;

    private String imageSource;

    private String sourceVideoID;

    private String originImageID;

    private Integer eventSort;

    private String deviceID;

    private String storagePath;

    private String fileHash;

    private String fileFormat;

    private Date shotTime;
    private String title;

    private String titleNote;

    private String specialIName;

    private String keyword;

    private String contentDescription;

    private String subjectCharacter;

    private String shotPlaceCode;

    private String shotPlaceFullAdress;

    private String shotPlaceLongitude;

    private String shotPlaceLatitude;

    private String horizontalShotDirection;

    private String verticalShotDirection;

    private String securityLevel;

    private Integer width;

    private Integer height;

    private String cameraManufacturer;

    private String cameraVersion;

    private Integer apertureValue;

    private Integer iSOSensitivity;

    private Integer focalLength;

    private String qualityGrade;
    private String collectorName;

    private String collectorOrg;

    private String collectorIDType;

    private String collectorID;

    private String entryClerk;

    private String entryClerkOrg;

    private String entryClerkIDType;

    private String entryClerkID;

    private Date entryTime;

    private Integer imageProcFlag;

    private long fileSize;

    public ImageInfo() {
    }

    private ImageInfo(Builder builder) {
        setImageID(builder.imageID);
        setInfoKind(builder.infoKind);
        setImageSource(builder.imageSource);
        setSourceVideoID(builder.sourceVideoID);
        setOriginImageID(builder.originImageID);
        setEventSort(builder.eventSort);
        setDeviceID(builder.deviceID);
        setStoragePath(builder.storagePath);
        setFileHash(builder.fileHash);
        setFileFormat(builder.fileFormat);
        setShotTime(builder.shotTime);
        setTitle(builder.title);
        setTitleNote(builder.titleNote);
        setSpecialIName(builder.specialIName);
        setKeyword(builder.keyword);
        setContentDescription(builder.contentDescription);
        setSubjectCharacter(builder.subjectCharacter);
        setShotPlaceCode(builder.shotPlaceCode);
        setShotPlaceFullAdress(builder.shotPlaceFullAdress);
        setShotPlaceLongitude(builder.shotPlaceLongitude);
        setShotPlaceLatitude(builder.shotPlaceLatitude);
        setHorizontalShotDirection(builder.horizontalShotDirection);
        setVerticalShotDirection(builder.verticalShotDirection);
        setSecurityLevel(builder.securityLevel);
        setWidth(builder.width);
        setHeight(builder.height);
        setCameraManufacturer(builder.cameraManufacturer);
        setCameraVersion(builder.cameraVersion);
        setApertureValue(builder.apertureValue);
        iSOSensitivity = builder.iSOSensitivity;
        setFocalLength(builder.focalLength);
        setQualityGrade(builder.qualityGrade);
        setCollectorName(builder.collectorName);
        setCollectorOrg(builder.collectorOrg);
        setCollectorIDType(builder.collectorIDType);
        setCollectorID(builder.collectorID);
        setEntryClerk(builder.entryClerk);
        setEntryClerkOrg(builder.entryClerkOrg);
        setEntryClerkIDType(builder.entryClerkIDType);
        setEntryClerkID(builder.entryClerkID);
        setEntryTime(builder.entryTime);
        setImageProcFlag(builder.imageProcFlag);
        setFileSize(builder.fileSize);
    }

    public static String buildOneToJson(ImageInfo imageInfo) {
        if (imageInfo != null) {
            Map<String, Object> objectMap = new HashMap<>(1);
            objectMap.put("imageInfoObject", imageInfo);
            return ViidJsonConvert.convertToViidJson(objectMap);
        }
        return "";
    }

    public static final class Builder {
        private String imageID;
        private Integer infoKind;
        private String imageSource;
        private String sourceVideoID;
        private String originImageID;
        private Integer eventSort;
        private String deviceID;
        private String storagePath;
        private String fileHash;
        private String fileFormat;
        private Date shotTime;
        private String title;
        private String titleNote;
        private String specialIName;
        private String keyword;
        private String contentDescription;
        private String subjectCharacter;
        private String shotPlaceCode;
        private String shotPlaceFullAdress;
        private String shotPlaceLongitude;
        private String shotPlaceLatitude;
        private String horizontalShotDirection;
        private String verticalShotDirection;
        private String securityLevel;
        private Integer width;
        private Integer height;
        private String cameraManufacturer;
        private String cameraVersion;
        private Integer apertureValue;
        private Integer iSOSensitivity;
        private Integer focalLength;
        private String qualityGrade;
        private String collectorName;
        private String collectorOrg;
        private String collectorIDType;
        private String collectorID;
        private String entryClerk;
        private String entryClerkOrg;
        private String entryClerkIDType;
        private String entryClerkID;
        private Date entryTime;
        private Integer imageProcFlag;
        private long fileSize;

        public Builder() {
        }

        public Builder imageID(String val) {
            imageID = val;
            return this;
        }

        public Builder infoKind(Integer val) {
            infoKind = val;
            return this;
        }

        public Builder imageSource(String val) {
            imageSource = val;
            return this;
        }

        public Builder sourceVideoID(String val) {
            sourceVideoID = val;
            return this;
        }

        public Builder originImageID(String val) {
            originImageID = val;
            return this;
        }

        public Builder eventSort(Integer val) {
            eventSort = val;
            return this;
        }

        public Builder deviceID(String val) {
            deviceID = val;
            return this;
        }

        public Builder storagePath(String val) {
            storagePath = val;
            return this;
        }

        public Builder fileHash(String val) {
            fileHash = val;
            return this;
        }

        public Builder fileFormat(String val) {
            fileFormat = val;
            return this;
        }

        public Builder shotTime(Date val) {
            shotTime = val;
            return this;
        }

        public Builder title(String val) {
            title = val;
            return this;
        }

        public Builder titleNote(String val) {
            titleNote = val;
            return this;
        }

        public Builder specialIName(String val) {
            specialIName = val;
            return this;
        }

        public Builder keyword(String val) {
            keyword = val;
            return this;
        }

        public Builder contentDescription(String val) {
            contentDescription = val;
            return this;
        }

        public Builder subjectCharacter(String val) {
            subjectCharacter = val;
            return this;
        }

        public Builder shotPlaceCode(String val) {
            shotPlaceCode = val;
            return this;
        }

        public Builder shotPlaceFullAdress(String val) {
            shotPlaceFullAdress = val;
            return this;
        }

        public Builder shotPlaceLongitude(String val) {
            shotPlaceLongitude = val;
            return this;
        }

        public Builder shotPlaceLatitude(String val) {
            shotPlaceLatitude = val;
            return this;
        }

        public Builder horizontalShotDirection(String val) {
            horizontalShotDirection = val;
            return this;
        }

        public Builder verticalShotDirection(String val) {
            verticalShotDirection = val;
            return this;
        }

        public Builder securityLevel(String val) {
            securityLevel = val;
            return this;
        }

        public Builder width(Integer val) {
            width = val;
            return this;
        }

        public Builder height(Integer val) {
            height = val;
            return this;
        }

        public Builder cameraManufacturer(String val) {
            cameraManufacturer = val;
            return this;
        }

        public Builder cameraVersion(String val) {
            cameraVersion = val;
            return this;
        }

        public Builder apertureValue(Integer val) {
            apertureValue = val;
            return this;
        }

        public Builder iSOSensitivity(Integer val) {
            iSOSensitivity = val;
            return this;
        }

        public Builder focalLength(Integer val) {
            focalLength = val;
            return this;
        }

        public Builder qualityGrade(String val) {
            qualityGrade = val;
            return this;
        }

        public Builder collectorName(String val) {
            collectorName = val;
            return this;
        }

        public Builder collectorOrg(String val) {
            collectorOrg = val;
            return this;
        }

        public Builder collectorIDType(String val) {
            collectorIDType = val;
            return this;
        }

        public Builder collectorID(String val) {
            collectorID = val;
            return this;
        }

        public Builder entryClerk(String val) {
            entryClerk = val;
            return this;
        }

        public Builder entryClerkOrg(String val) {
            entryClerkOrg = val;
            return this;
        }

        public Builder entryClerkIDType(String val) {
            entryClerkIDType = val;
            return this;
        }

        public Builder entryClerkID(String val) {
            entryClerkID = val;
            return this;
        }

        public Builder entryTime(Date val) {
            entryTime = val;
            return this;
        }

        public Builder imageProcFlag(Integer val) {
            imageProcFlag = val;
            return this;
        }

        public Builder fileSize(long val) {
            fileSize = val;
            return this;
        }

        public ImageInfo build() {
            return new ImageInfo(this);
        }
    }

}