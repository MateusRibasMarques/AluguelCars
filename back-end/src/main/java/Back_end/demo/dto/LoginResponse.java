package Back_end.demo.dto;

public record LoginResponse(
        String token,
        String tipo,
        String nome
) {
}