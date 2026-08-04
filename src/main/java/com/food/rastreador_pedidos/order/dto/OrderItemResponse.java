package com.food.rastreador_pedidos.order.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long id,
        String descricao,
        Integer quantidade,
        BigDecimal precoUnitario
) {
}
