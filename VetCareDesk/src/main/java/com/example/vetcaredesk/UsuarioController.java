package com.example.vetcaredesk;

package com.example.auladesk;

import javafx.event.ActionEvent;
import javafx.fxml.FXML;
import javafx.fxml.FXMLLoader;
import javafx.scene.Node;
import javafx.scene.Scene;
import javafx.scene.control.Alert;
import javafx.scene.control.PasswordField;
import javafx.scene.control.TextField;
import javafx.stage.Stage;

import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import static com.example.auladesk.LoginController.showMenssage;

public class UsuarioController {


    @FXML
    private TextField txtNome;

    @FXML
    private TextField txtEmail;

    @FXML
    private PasswordField txtSenha;

    @FXML
    private void onVoltarButtonClick(ActionEvent event) throws IOException {

        FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
        Scene scene = new Scene(loader.load());
        Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
        stage.setScene(scene);
    }

    @FXML
    private void onSalvarButtonClick(ActionEvent event)  throws IOException{


        URL url = new URL("http://localhost:8080/usuarioAdm");

        HttpURLConnection conn =(HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-type","application/json");

        conn.setDoOutput(true);

        String json = "{\n" +
                "  \"nome\": \""+txtNome.getText()+"\",\n" +
                "  \"email\": \""+txtEmail.getText()+"\",\n" +
                "  \"senha\": \""+txtSenha.getText()+"\"\n" +
                "}";

        try(OutputStream os = conn.getOutputStream()){
            os.write(json.getBytes());
        }

        var code = conn.getResponseCode();
        if (code ==200){

            showMenssage("Sucesso ao salvar! ", Alert.AlertType.INFORMATION);

            FXMLLoader loader = new FXMLLoader(getClass().getResource("menu-view.fxml"));
            Scene scene = new Scene(loader.load());
            Stage stage = (Stage) ((Node) event.getSource()).getScene().getWindow();
            stage.setScene(scene);

        }else {
            showMenssage("Erro ao salvar! ", Alert.AlertType.ERROR);
        }

        conn.disconnect();

    }
}