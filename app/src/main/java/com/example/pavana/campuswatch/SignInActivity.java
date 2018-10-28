package com.example.pavana.campuswatch;

import com.firebase.ui.auth.AuthUI;
import com.firebase.ui.auth.IdpResponse;
import android.content.Intent;
import android.support.annotation.NonNull;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.TextUtils;
import android.view.View;
import android.widget.EditText;
import android.widget.Toast;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseUser;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class SignInActivity extends AppCompatActivity {
    //TODO update firebase auth here
    private static final int RC_SIGN_IN = 123;
    private EditText emailText,passText;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_sign_in);
        emailText = (EditText) findViewById(R.id.username);
        passText = (EditText) findViewById(R.id.password);
        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();
    }

    public void createAccount(View view){
        Intent intent=new Intent(getApplicationContext(),SignUpActivity.class);
        startActivity(intent);
    }

    public void loginButton(View view){
        String email= emailText.getText().toString().trim();
        String pass = passText.getText().toString().trim();
        if (TextUtils.isEmpty(email) || TextUtils.isEmpty(pass) ){
            Toast.makeText(this,"Enter both values",Toast.LENGTH_LONG).show();
        }
        else
        {
            if(email.equals("admin") && pass.equals("admin")){
                Toast.makeText(getApplicationContext(),
                        "Redirecting...",Toast.LENGTH_SHORT).show();

                //correcct password
            }else{
                //wrong password
                Toast.makeText(getApplicationContext(),
                        "Wrong Credentials",Toast.LENGTH_SHORT).show();

            }
        }

    }

}
