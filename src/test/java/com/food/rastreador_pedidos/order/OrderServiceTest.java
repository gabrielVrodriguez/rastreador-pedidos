package com.food.rastreador_pedidos.order;

import com.food.rastreador_pedidos.common.BusinessException;
import com.food.rastreador_pedidos.common.ResourceNotFoundException;
import com.food.rastreador_pedidos.order.dto.CreateOrderRequest;
import com.food.rastreador_pedidos.order.dto.OrderItemRequest;
import com.food.rastreador_pedidos.order.dto.OrderResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order pedidoRecebido;

    @BeforeEach
    void setUp() {
        pedidoRecebido = Order.builder()
                .id(1L)
                .nomeCliente("Maria")
                .enderecoEntrega("Rua das Flores, 123")
                .status(OrderStatus.RECEBIDO)
                .build();
    }

    @Test
    void deveCriarPedidoComStatusRecebido() {
        CreateOrderRequest request = new CreateOrderRequest(
                "João",
                "Av. Brasil, 500",
                List.of(new OrderItemRequest("Pizza", 1, new BigDecimal("39.90")))
        );

        when(orderRepository.save(any(Order.class))).thenAnswer(invocation -> invocation.getArgument(0));

        OrderResponse response = orderService.criar(request);

        assertThat(response.status()).isEqualTo(OrderStatus.RECEBIDO);
        assertThat(response.itens()).hasSize(1);
        verify(orderRepository).save(any(Order.class));
    }

    @Test
    void deveBuscarPedidoPorId() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pedidoRecebido));

        OrderResponse response = orderService.buscarPorId(1L);

        assertThat(response.id()).isEqualTo(1L);
        assertThat(response.nomeCliente()).isEqualTo("Maria");
    }

    @Test
    void deveLancarExcecaoAoBuscarPedidoComIdInexistente() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.buscarPorId(99L))
                .isInstanceOf(ResourceNotFoundException.class);
    }

    @Test
    void deveAtualizarStatusQuandoTransicaoForValida() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pedidoRecebido));

        OrderResponse response = orderService.atualizarStatus(1L, OrderStatus.EM_PREPARO);

        assertThat(response.status()).isEqualTo(OrderStatus.EM_PREPARO);
    }

    @Test
    void deveLancarExcecaoAoTentarAlterarStatusDePedidoEntregue() {
        pedidoRecebido.setStatus(OrderStatus.ENTREGUE);
        when(orderRepository.findById(1L)).thenReturn(Optional.of(pedidoRecebido));

        assertThatThrownBy(() -> orderService.atualizarStatus(1L, OrderStatus.EM_PREPARO))
                .isInstanceOf(BusinessException.class)
                .hasMessageContaining("ENTREGUE");
    }
}
