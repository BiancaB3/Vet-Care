package VetCare.Back.infra.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDateTime;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleBadRequest(IllegalArgumentException ex, HttpServletRequest request) {
        return build(HttpStatus.BAD_REQUEST, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiErrorResponse> handleNotFound(NoSuchElementException ex, HttpServletRequest request) {
        return build(HttpStatus.NOT_FOUND, ex.getMessage(), request.getRequestURI());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatus(ResponseStatusException ex, HttpServletRequest request) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        return build(status, ex.getReason() != null ? ex.getReason() : "Erro na requisição.", request.getRequestURI());
    }

    @ExceptionHandler({AuthenticationCredentialsNotFoundException.class, UsernameNotFoundException.class})
    public ResponseEntity<ApiErrorResponse> handleAuth(Exception ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Nao autenticado.", request.getRequestURI());
    }

    @ExceptionHandler(ClassCastException.class)
    public ResponseEntity<ApiErrorResponse> handlePrincipalCast(ClassCastException ex, HttpServletRequest request) {
        return build(HttpStatus.UNAUTHORIZED, "Token invalido para o recurso solicitado.", request.getRequestURI());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String mensagem = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> error.getDefaultMessage() != null ? error.getDefaultMessage() : "Campo invalido.")
                .collect(Collectors.joining(" | "));

        if (mensagem.isBlank()) {
            mensagem = "Dados invalidos na requisicao.";
        }

        return build(HttpStatus.BAD_REQUEST, mensagem, request.getRequestURI());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String mensagem = ex.getMostSpecificCause() != null && ex.getMostSpecificCause().getMessage() != null
                ? ex.getMostSpecificCause().getMessage().toLowerCase()
                : "";

        HttpStatus status = mensagem.contains("duplicate") || mensagem.contains("unique")
                ? HttpStatus.CONFLICT
                : HttpStatus.BAD_REQUEST;

        String resposta = status == HttpStatus.CONFLICT
                ? "Ja existe um registro com estes dados."
                : "Nao foi possivel concluir a operacao.";

        if (status != HttpStatus.CONFLICT) {
            if (mensagem.contains("veterinario_id") && mensagem.contains("null")) {
                resposta = "Sessao invalida para cadastrar tutor. Faca login novamente.";
            } else if (mensagem.contains("status") && (mensagem.contains("character varying") || mensagem.contains("smallint"))) {
                resposta = "Inconsistencia no campo de status do tutor. Tente novamente apos atualizar o backend.";
            } else if (mensagem.contains("violates foreign key") && mensagem.contains("veterinario")) {
                resposta = "Veterinario invalido para o cadastro do tutor.";
            }
        }

        return build(status, resposta, request.getRequestURI());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleGeneric(Exception ex, HttpServletRequest request) {
        log.error("Erro nao tratado em {} {}", request.getMethod(), request.getRequestURI(), ex);
        return build(HttpStatus.INTERNAL_SERVER_ERROR, "Erro interno inesperado.", request.getRequestURI());
    }

    private ResponseEntity<ApiErrorResponse> build(HttpStatus status, String mensagem, String path) {
        ApiErrorResponse payload = new ApiErrorResponse(
                LocalDateTime.now(),
                status.value(),
                mensagem,
                path
        );
        return ResponseEntity.status(status).body(payload);
    }
}
