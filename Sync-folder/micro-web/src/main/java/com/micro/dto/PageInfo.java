package com.micro.dto;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.io.Serializable;
import java.util.List;

/**
 * Reference {@link Page} generated class<br/>
 * The main purpose of this class is to return structural consistency for compatibility <br/>
 * The main guarantee is that the return structure is consistent, and there is no guarantee that every parameter has a value <br/>
 */
@Data
public class PageInfo<T> implements Serializable {
    private static final long serialVersionUID = -6437843098300882951L;
    /**
     * returned content
     */
    private List<T> content;
    /**
     * Whether it's the first page or not, there may not be data
     */
    private Boolean first;
    /**
     * Whether it's the last page or not, it doesn't necessarily have data
     */
    private Boolean last;
    /**
     * current page
     */
    private Integer number;
    /**
     * The number of current pages
     */
    private Integer numberOfElements;
    /**
     * quantity per page
     */
    private Integer size;
    /**
     * sum
     */
    private Integer totalElements;
    /**
     * total pages
     */
    private Integer totalPages;

    private String scollId;
}
