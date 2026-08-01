package com.food.rastreador_pedidos.order.dto;

import com.food.rastreador_pedidos.order.OrderStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateOrderStatusRequest(
        @NotNull(message = "Novo status é obrigatório")
        OrderStatus status
) {
}
