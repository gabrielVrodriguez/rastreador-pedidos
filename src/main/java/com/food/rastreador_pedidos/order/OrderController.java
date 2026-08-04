package com.food.rastreador_pedidos.order;

import com.food.rastreador_pedidos.order.dto.CreateOrderRequest;
import com.food.rastreador_pedidos.order.dto.OrderResponse;
import com.food.rastreador_pedidos.order.dto.UpdateOrderStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public OrderResponse criar(@Valid @RequestBody CreateOrderRequest request) {
        return orderService.criar(request);
    }

    @GetMapping
    public List<OrderResponse> listar() {
        return orderService.listar();
    }

    @GetMapping("/{id}")
    public OrderResponse buscarPorId(@PathVariable Long id) {
        return orderService.buscarPorId(id);
    }

    @PatchMapping("/{id}/status")
    public OrderResponse atualizarStatus(@PathVariable Long id, @Valid @RequestBody UpdateOrderStatusRequest request) {
        return orderService.atualizarStatus(id, request.status());
    }
}
