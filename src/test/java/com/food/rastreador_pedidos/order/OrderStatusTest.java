package com.food.rastreador_pedidos.order;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

class OrderStatusTest {

    @ParameterizedTest(name = "{0} pode transicionar para {1}")
    @MethodSource("transicoesValidas")
    void devePermitirTransicoesValidas(OrderStatus atual, OrderStatus novo) {
        assertThat(atual.podeTransicionarPara(novo)).isTrue();
    }

    static Stream<Arguments> transicoesValidas() {
        return Stream.of(
                Arguments.of(OrderStatus.RECEBIDO, OrderStatus.EM_PREPARO),
                Arguments.of(OrderStatus.RECEBIDO, OrderStatus.CANCELADO),
                Arguments.of(OrderStatus.EM_PREPARO, OrderStatus.SAIU_PARA_ENTREGA),
                Arguments.of(OrderStatus.EM_PREPARO, OrderStatus.CANCELADO),
                Arguments.of(OrderStatus.SAIU_PARA_ENTREGA, OrderStatus.ENTREGUE),
                Arguments.of(OrderStatus.SAIU_PARA_ENTREGA, OrderStatus.CANCELADO)
        );
    }

    @ParameterizedTest(name = "{0} NÃO pode transicionar para {1}")
    @MethodSource("transicoesInvalidas")
    void deveBloquearTransicoesInvalidas(OrderStatus atual, OrderStatus novo) {
        assertThat(atual.podeTransicionarPara(novo)).isFalse();
    }

    static Stream<Arguments> transicoesInvalidas() {
        return Stream.of(
                Arguments.of(OrderStatus.RECEBIDO, OrderStatus.SAIU_PARA_ENTREGA),
                Arguments.of(OrderStatus.RECEBIDO, OrderStatus.ENTREGUE),
                Arguments.of(OrderStatus.EM_PREPARO, OrderStatus.RECEBIDO),
                Arguments.of(OrderStatus.SAIU_PARA_ENTREGA, OrderStatus.EM_PREPARO),
                Arguments.of(OrderStatus.ENTREGUE, OrderStatus.RECEBIDO),
                Arguments.of(OrderStatus.ENTREGUE, OrderStatus.CANCELADO),
                Arguments.of(OrderStatus.CANCELADO, OrderStatus.RECEBIDO)
        );
    }
}
