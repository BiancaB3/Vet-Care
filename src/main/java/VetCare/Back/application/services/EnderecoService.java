package VetCare.Back.application.services;

import VetCare.Back.application.DTO.EnderecoResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.NoSuchElementException;

@Service
public class EnderecoService {

    private final RestClient restClient;

    public EnderecoService() {
        this.restClient = RestClient.builder()
                .baseUrl("https://viacep.com.br/ws")
                .build();
    }

    public EnderecoResponse buscarPorCep(String cep) {
        String cepNormalizado = normalizarCep(cep);

        try {
            ViaCepResponse response = restClient.get()
                    .uri("/{cep}/json/", cepNormalizado)
                    .retrieve()
                    .body(ViaCepResponse.class);

            if (response == null || Boolean.TRUE.equals(response.erro())) {
                throw new NoSuchElementException("CEP nao encontrado.");
            }

            return new EnderecoResponse(
                    response.cep(),
                    response.logradouro(),
                    response.complemento(),
                    response.bairro(),
                    response.localidade(),
                    response.uf(),
                    response.estado(),
                    response.regiao(),
                    response.ibge(),
                    response.gia(),
                    response.ddd(),
                    response.siafi()
            );
        } catch (RestClientException ex) {
            throw new IllegalStateException("Nao foi possivel consultar o CEP informado.", ex);
        }
    }

    private String normalizarCep(String cep) {
        if (cep == null) {
            throw new IllegalArgumentException("CEP invalido.");
        }

        String cepNormalizado = cep.replaceAll("\\D", "");
        if (cepNormalizado.length() != 8) {
            throw new IllegalArgumentException("CEP invalido.");
        }

        return cepNormalizado;
    }

    private record ViaCepResponse(
            String cep,
            String logradouro,
            String complemento,
            String bairro,
            String localidade,
            String uf,
            String estado,
            String regiao,
            String ibge,
            String gia,
            String ddd,
            String siafi,
            Boolean erro
    ) {
    }
}