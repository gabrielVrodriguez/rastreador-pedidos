package com.food.rastreador_pedidos.common;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
        LocalDateTime timestamp,
        int status,
        String message,
        Map<String, String> fields
) {

    public static ErrorResponse of(int status, String message) {
        return new ErrorResponse(LocalDateTime.now(), status, message, Map.of());
    }

    public static ErrorResponse of(int status, String message, Map<String, String> fields) {
        return new ErrorResponse(LocalDateTime.now(), status, message, fields);
    }
}
