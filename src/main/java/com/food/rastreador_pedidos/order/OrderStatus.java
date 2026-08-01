package com.food.rastreador_pedidos.order;

public enum OrderStatus {
    RECEBIDO,
    EM_PREPARO,
    SAIU_PARA_ENTREGA,
    ENTREGUE,
    CANCELADO;

    public boolean podeTransicionarPara(OrderStatus novoStatus) {
        return switch (this) {
            case RECEBIDO -> novoStatus == EM_PREPARO || novoStatus == CANCELADO;
            case EM_PREPARO -> novoStatus == SAIU_PARA_ENTREGA || novoStatus == CANCELADO;
            case SAIU_PARA_ENTREGA -> novoStatus == ENTREGUE || novoStatus == CANCELADO;
            case ENTREGUE, CANCELADO -> false;
        };
    }
}
