package com.micro.util;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Iterator;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.util.Assert;

/**
 * A chunk of data restricted by the configured {@link Pageable}.
 *
 * @author Oliver Gierke
 * @author Christoph Strobl
 * @since 1.8
 */
abstract class MicroChunk<T> implements Slice<T>, Serializable {

    private static final long serialVersionUID = 867755909294344406L;

    private final List<T> content = new ArrayList<>();
    private final Pageable pageable;

    /**
     *
     * @param content must not be {@literal null}.
     * @param pageable must not be {@literal null}.
     */
    public MicroChunk(List<T> content, Pageable pageable) {

        Assert.notNull(content, "Content must not be null");
        Assert.notNull(pageable, "Pageable must not be null");

        this.content.addAll(content);
        this.pageable = pageable;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#getNumber()
     */
    public int getNumber() {
        return pageable.isPaged() ? pageable.getPageNumber() : 0;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#getSize()
     */
    public int getSize() {
        return pageable.isPaged() ? pageable.getPageSize() : content.size();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#getNumberOfElements()
     */
    public int getNumberOfElements() {
        return content.size();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#hasPrevious()
     */
    public boolean hasPrevious() {
        return getNumber() > 0;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#isFirst()
     */
    public boolean isFirst() {
        return !hasPrevious();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#isLast()
     */
    public boolean isLast() {
        return !hasNext();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#nextPageable()
     */
    public Pageable nextPageable() {
        return hasNext() ? pageable.next() : Pageable.unpaged();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#previousPageable()
     */
    public Pageable previousPageable() {
        return hasPrevious() ? pageable.previousOrFirst() : Pageable.unpaged();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#hasContent()
     */
    public boolean hasContent() {
        return !content.isEmpty();
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#getContent()
     */
    public List<T> getContent() {
        return Collections.unmodifiableList(content);
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#getPageable()
     */
    @Override
    public Pageable getPageable() {
        return pageable;
    }

    /*
     * (non-Javadoc)
     * @see org.springframework.data.domain.Slice#getSort()
     */
    @Override
    public Sort getSort() {
        return pageable.getSort();
    }

    /*
     * (non-Javadoc)
     * @see java.lang.Iterable#iterator()
     */
    public Iterator<T> iterator() {
        return content.iterator();
    }

    /**
     * Applies the given {@link Function} to the content of the {@link MicroChunk}.
     *
     * @param converter must not be {@literal null}.
     * @return
     */
    protected <U> List<U> getConvertedContent(Function<? super T, ? extends U> converter) {

        Assert.notNull(converter, "Function must not be null");

        return this.stream().map(converter::apply).collect(Collectors.toList());
    }

    /*
     * (non-Javadoc)
     * @see java.lang.Object#equals(java.lang.Object)
     */
    @Override
    public boolean equals(Object obj) {

        if (this == obj) {
            return true;
        }

        if (!(obj instanceof MicroChunk<?>)) {
            return false;
        }

        MicroChunk<?> that = (MicroChunk<?>) obj;

        boolean contentEqual = this.content.equals(that.content);
        boolean pageableEqual = this.pageable.equals(that.pageable);

        return contentEqual && pageableEqual;
    }

    /*
     * (non-Javadoc)
     * @see java.lang.Object#hashCode()
     */
    @Override
    public int hashCode() {

        int result = 17;

        result += 31 * pageable.hashCode();
        result += 31 * content.hashCode();

        return result;
    }
}
