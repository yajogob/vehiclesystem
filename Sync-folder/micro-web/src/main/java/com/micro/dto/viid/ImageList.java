package com.micro.dto.viid;

import lombok.Data;

import java.util.List;

/**
 * @author chenxiaolei
 * @date 2019/12/12
 */
@Data
public class ImageList {

    private List<Image> image;

    private ImageList(Builder builder) {
        setImage(builder.image);
    }


    public static final class Builder {
        private List<Image> image;

        public Builder() {
        }

        public Builder image(List<Image> val) {
            image = val;
            return this;
        }

        public ImageList build() {
            return new ImageList(this);
        }
    }
}
