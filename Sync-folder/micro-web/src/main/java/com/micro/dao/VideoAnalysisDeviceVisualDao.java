package com.micro.dao;

import com.kedacom.kidp.base.data.common.repository.BaseRepository;
import com.micro.entity.VideoAnalysisVisualDevice;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

/**
 * @date 2019-10-18
 */
public interface VideoAnalysisDeviceVisualDao extends BaseRepository<VideoAnalysisVisualDevice> {
    /**
     * @return
     */
    @Modifying
    @Query(value = "SELECT * FROM video_analysis_device WHERE nvms_id = :nvmsId AND status in (:staList) ", nativeQuery = true)
    List<VideoAnalysisVisualDevice> findDeviceByNvmsId(@Param("nvmsId")String nvmsId, @Param("staList")List<String> staList);
}
