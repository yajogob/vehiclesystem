package com.micro.entity;

import com.kedacom.kidp.base.data.common.entity.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.io.Serializable;

/**
 *  Entity
 * @author 
 * @time   2023-07-16 21:07:47
 */
@Data
@Entity
@Table(name = "lpr_system_location")
public class LprSystemLocationEntity extends BaseEntity implements Serializable {

private static final long serialVersionUID = 1L;
	
	/**
     * comment:  
     * length：255
     */
    @Column(name = "code")
    private String code;

	/**
     * comment:  
     * length：255
     */
    @Column(name = "name")
    private String name;

	/**
     * comment:  
     * length：255
     */
    @Column(name = "description")
    private String description;

	/**
     * comment:  
     * length：100
     */
    @Column(name = "path")
    private String path;

	/**
     * comment:  
     * length：
     */
    @Column(name = "status")
    private Integer status;

	/**
     * comment:  
     * length：255
     */
    @Column(name = "parent_code")
    private String parentCode;

	/**
     * comment:  
     * length：
     */
    @Column(name = "code_level")
    private Integer codeLevel;

	/**
     * comment:  
     * length：
     */
    @Column(name = "sort_index")
    private Long sortIndex;

	/**
     * comment:  
     * length：255
     */
    @Column(name = "code_type")
    private String codeType;

	/**
     * comment:  
     * length：255
     */
    @Column(name = "reserve1")
    private String reserve1;

	/**
     * comment:  
     * length：255
     */
    @Column(name = "reserve2")
    private String reserve2;

	/**
     * comment:  
     * length：255
     */
    @Column(name = "reserve3")
    private String reserve3;

    @Column(name = "area_type")
    private int areaType;

    public LprSystemLocationEntity() {
    }

    public LprSystemLocationEntity(String code, String name, String description, String path, Integer status, String parentCode, Integer codeLevel, Long sortIndex, String codeType, String reserve1, String reserve2, String reserve3 ,int areaType) {
            this.code = code;
            this.name = name;
            this.description = description;
            this.path = path;
            this.status = status;
            this.parentCode = parentCode;
            this.codeLevel = codeLevel;
            this.sortIndex = sortIndex;
            this.codeType = codeType;
            this.reserve1 = reserve1;
            this.reserve2 = reserve2;
            this.reserve3 = reserve3;
            this.areaType = areaType;
    }
}