package VetCare.Back.controllers;


import VetCare.Back.model.DTO.LoginRequest;
import VetCare.Back.model.DTO.LoginResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest){


        if(loginRequest.email().equals("String@s") &&  loginRequest.senha().equals("String")){
            return ResponseEntity.ok(new LoginResponse("Sasdasdas123"));
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }


}

