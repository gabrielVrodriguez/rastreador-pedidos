package com.food.rastreador_pedidos.order;

import com.food.rastreador_pedidos.common.ResourceNotFoundException;
import com.food.rastreador_pedidos.order.dto.CreateOrderRequest;
import com.food.rastreador_pedidos.order.dto.OrderItemRequest;
import com.food.rastreador_pedidos.order.dto.OrderItemResponse;
import com.food.rastreador_pedidos.order.dto.OrderResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    @Transactional
    public OrderResponse criar(CreateOrderRequest request) {
        Order order = Order.builder()
                .nomeCliente(request.nomeCliente())
                .enderecoEntrega(request.enderecoEntrega())
                .status(OrderStatus.RECEBIDO)
                .build();

        for (OrderItemRequest itemRequest : request.itens()) {
            OrderItem item = OrderItem.builder()
                    .descricao(itemRequest.descricao())
                    .quantidade(itemRequest.quantidade())
                    .precoUnitario(itemRequest.precoUnitario())
                    .order(order)
                    .build();
            order.getItens().add(item);
        }

        return toResponse(orderRepository.save(order));
    }

    @Transactional(readOnly = true)
    public List<OrderResponse> listar() {
        return orderRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public OrderResponse buscarPorId(Long id) {
        return toResponse(buscarEntidadePorId(id));
    }

    @Transactional
    public OrderResponse atualizarStatus(Long id, OrderStatus novoStatus) {
        Order order = buscarEntidadePorId(id);
        order.setStatus(novoStatus);
        return toResponse(order);
    }

    private Order buscarEntidadePorId(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido não encontrado: " + id));
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> itens = order.getItens().stream()
                .map(item -> new OrderItemResponse(
                        item.getId(),
                        item.getDescricao(),
                        item.getQuantidade(),
                        item.getPrecoUnitario()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getNomeCliente(),
                order.getEnderecoEntrega(),
                order.getStatus(),
                itens,
                order.getCriadoEm(),
                order.getAtualizadoEm()
        );
    }
}
