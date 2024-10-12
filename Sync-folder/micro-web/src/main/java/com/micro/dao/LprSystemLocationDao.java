package com.micro.dao;


import com.kedacom.kidp.base.data.common.repository.BaseJpaRepository;
import com.micro.entity.LprSystemLocationEntity;

import java.util.List;
import java.util.Optional;

/**
 *  DAO
 * @author 
 * @time   2023-07-16 21:07:47
 */
public interface LprSystemLocationDao extends BaseJpaRepository<LprSystemLocationEntity> {

	/**
	 * find By Id
	 */
	Optional<LprSystemLocationEntity> findById(Long id);

	/**
	 * find by name
	 * @param name
	 * @return
	 */
	List<LprSystemLocationEntity> findByName(String name);

	/**
	 * find by code level
	 * @param codeLevel
	 * @return
	 */
	List<LprSystemLocationEntity> findByCodeLevel(Integer codeLevel);

	/**
	 * find by code level
	 * @param codeLevel
	 * @return
	 */
	List<LprSystemLocationEntity> findByCodeLevelAndParentCode(Integer codeLevel,String parentCode);
	/**
	 * find by code level
	 * @param codeLevel
	 * @return
	 */
	List<LprSystemLocationEntity> findByCodeLevelAndName(Integer codeLevel,String name);


	/**
	 * find by code level
	 * @param parentCode
	 * @param parentCode
	 * @return
	 */
	List<LprSystemLocationEntity> findByParentCodeAndName(String parentCode,String name);

	/**
	 * find by code
	 * @return
	 */
	LprSystemLocationEntity findByCode(String code);

	/**
	 * find by code
	 * @return
	 */
	LprSystemLocationEntity findByPathAndName(String path,String name);
}