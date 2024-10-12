package com.micro.dto;

import com.alibaba.fastjson.JSONArray;
import com.kedacom.kidp.base.data.common.dto.SearchDTO;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class BaseSearchDto  extends SearchDTO implements Serializable {
    private static final long serialVersionUID = 7529489189977591861L;
    //private List<SiteDto> sites;
    private JSONArray sites;

}
