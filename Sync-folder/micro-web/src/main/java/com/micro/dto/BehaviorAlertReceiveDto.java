package com.micro.dto;

import lombok.Data;

/**
 * demo data is {
 *   "sceneImageUrl": "/image/v1/fusion/storage/eXRrdjEwMTkxOC1mdXNpb24vMTQyLzIwMjEvMDcvMjQvMjAvMjIvaGhycm0tM2YwYmU2YWQtMjQ4MS00MjZlLTkwMzctN2I1ZDQwMGE3M2RhLTE2MjcxMjkzNjY0MjYtMjA3ODk4",
 *   "subjects": {
 *     "perceivingArea": {
 *       "x": 319,
 *       "y": 111,
 *       "w": 361,
 *       "h": 381
 *     }
 *   },
 *   "id": "60fc05b6d5ae14000927cdd2"
 * }
 */
@Data
public class BehaviorAlertReceiveDto {

    private String sceneImageUrl;

    private String id;

    private BehaviorAlertReceiveSubjectsDto subjects;

}
