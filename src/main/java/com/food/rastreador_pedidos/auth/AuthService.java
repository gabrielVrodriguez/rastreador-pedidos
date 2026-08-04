package com.food.rastreador_pedidos.auth;

import com.food.rastreador_pedidos.auth.dto.AuthResponse;
import com.food.rastreador_pedidos.auth.dto.LoginRequest;
import com.food.rastreador_pedidos.auth.dto.RegisterRequest;
import com.food.rastreador_pedidos.common.BusinessException;
import com.food.rastreador_pedidos.security.JwtService;
import com.food.rastreador_pedidos.user.User;
import com.food.rastreador_pedidos.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    @Transactional
    public AuthResponse cadastrar(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BusinessException("E-mail já cadastrado", HttpStatus.CONFLICT);
        }

        User user = User.builder()
                .nome(request.nome())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .build();

        userRepository.save(user);

        return new AuthResponse(jwtService.gerarToken(user.getEmail()));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.senha())
        );

        return new AuthResponse(jwtService.gerarToken(request.email()));
    }
}
