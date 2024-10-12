package com.micro.dto.viid;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class FailedObject {
    private String id;
    private Integer index;
    private String reason;
}
