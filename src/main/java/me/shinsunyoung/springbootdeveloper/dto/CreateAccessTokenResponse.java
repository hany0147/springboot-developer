package me.shinsunyoung.springbootdeveloper.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class CreateAccessTokenResponse {
    private String accessToken;
}
