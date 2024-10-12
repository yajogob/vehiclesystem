package com.micro.common;



import com.google.common.collect.Lists;
import com.kedacom.ctsp.lang.mapper.BeanMapper;
import com.kedacom.ctsp.orm.param.QueryParam;
import com.kedacom.ctsp.web.entity.Entity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import org.apache.commons.collections.CollectionUtils;

import java.util.Collections;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * @author lrj
 */
@ApiModel(description = "")
@Data
public class DispositionPage<E> implements Entity {
    private static final long serialVersionUID = -6171751136953308027L;

    public static <E> com.kedacom.ctsp.web.entity.page.PagerResult<E> empty() {
        return new com.kedacom.ctsp.web.entity.page.PagerResult<>(0, Collections.emptyList());
    }

    public static <E> com.kedacom.ctsp.web.entity.page.PagerResult<E> of(int total, List<E> list) {
        return new com.kedacom.ctsp.web.entity.page.PagerResult<>(total, list);
    }

    public DispositionPage() {
    }

    private long total = 0;

    private long totalPages = 0;

    private int pages = 0;

    private int size = 0;

    private List<E> records;

    public DispositionPage(long total, List<E> data) {
        this.total = total;
        this.records = data;
    }

    public void setPage(QueryParam param) {
        this.pages = param.getPageNo();
        this.size = param.getPageSize();
        if (this.size > 0) {
            this.totalPages = this.total % this.size == 0 ? this.total / this.size : this.total / this.size + 1;
        }
    }

    public void setTotal(long total) {
        this.total = total;
        if (this.size > 0) {
            this.totalPages = this.total % this.size == 0 ? this.total / this.size : this.total / this.size + 1;
        }
    }

    public <T> List<T> getData(Class<T> clazz) {
        if (CollectionUtils.isEmpty(this.records)) {
            return Lists.newArrayList();
        } else {
            return records.stream().map(e -> BeanMapper.deepMap(e, clazz)).collect(Collectors.toList());
        }
    }
}
