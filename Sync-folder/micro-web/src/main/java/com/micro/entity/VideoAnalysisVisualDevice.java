package com.micro.entity;


import com.kedacom.kidp.base.data.common.entity.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Basic;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

/**
 * @date 2019-10-18
 */
@Entity
@Data
@Table(name = "video_analysis_device")
@EntityListeners(AuditingEntityListener.class)
public class VideoAnalysisVisualDevice extends BaseEntity {

    @Basic
    private Long taskId;

    @Basic
    private String deviceId;

    @Basic
    private String deviceName;

    @Basic
    private String beginTime;

    @Basic
    private String endTime;

    @Basic
    private String stopTime;

    @Basic
    private String percent;

    private String status;

    private String nmediaId;

    private String videoUrl;

    private String convertId;

    private String videoId;

    private String callId;

    private String callIds;


    private String timeConcentrate;

    private String deviceGroupName;

    private String remark;

    private String videoType;

    private String dataAnalysis;

    private Long faceCount;
    private Long motorCount;
    private Long personCount;
    private Long nonMotorCount;

    private Long fileSize;

    private Long videoLen;

    private String ffPic;

    private String deviceLocation;
    private String devicePosition;

    private String density;

    private String taskSource;


    private String longitude;

    private String latitude;

    private int priority;

    private int sliceNum;

    private String nvmsId;

}
