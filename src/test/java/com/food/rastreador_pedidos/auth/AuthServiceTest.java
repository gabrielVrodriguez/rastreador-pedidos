package com.food.rastreador_pedidos.auth;

import com.food.rastreador_pedidos.auth.dto.AuthResponse;
import com.food.rastreador_pedidos.auth.dto.LoginRequest;
import com.food.rastreador_pedidos.auth.dto.RegisterRequest;
import com.food.rastreador_pedidos.common.BusinessException;
import com.food.rastreador_pedidos.security.JwtService;
import com.food.rastreador_pedidos.user.User;
import com.food.rastreador_pedidos.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    void deveCadastrarUsuarioComSucesso() {
        RegisterRequest request = new RegisterRequest("Ana", "ana@email.com", "senha123");

        when(userRepository.existsByEmail("ana@email.com")).thenReturn(false);
        when(passwordEncoder.encode("senha123")).thenReturn("senha-hash");
        when(jwtService.gerarToken("ana@email.com")).thenReturn("token-fake");

        AuthResponse response = authService.cadastrar(request);

        assertThat(response.token()).isEqualTo("token-fake");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void deveLancarExcecaoAoCadastrarComEmailDuplicado() {
        RegisterRequest request = new RegisterRequest("Ana", "ana@email.com", "senha123");

        when(userRepository.existsByEmail("ana@email.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.cadastrar(request))
                .isInstanceOf(BusinessException.class);

        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void deveGerarTokenAoLogarComCredenciaisValidas() {
        LoginRequest request = new LoginRequest("ana@email.com", "senha123");

        when(jwtService.gerarToken("ana@email.com")).thenReturn("token-fake");

        AuthResponse response = authService.login(request);

        assertThat(response.token()).isEqualTo("token-fake");
        verify(authenticationManager).authenticate(any());
    }
}
