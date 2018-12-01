package com.example.pavana.campuswatch;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.support.design.widget.FloatingActionButton;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.Toolbar;
import android.util.Base64;
import android.view.View;
import android.content.Intent;
import android.widget.ImageView;
import android.widget.TextView;
import android.os.StrictMode;

public class NavigationActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_navigation);
        Toolbar toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);

        FloatingActionButton fab = (FloatingActionButton) findViewById(R.id.fab);

        StrictMode.ThreadPolicy policy = new StrictMode.ThreadPolicy.Builder().permitAll().build();
        StrictMode.setThreadPolicy(policy);
        // Get the Intent that started this activity and extract the string
        Intent intent = getIntent();
        String message = intent.getStringExtra(MyFirebaseMessagingService.EXTRA_MESSAGE);
        String image_id = intent.getStringExtra(MyFirebaseMessagingService.IMAGE_CODE);

        // Capture the layout's TextView and set the string as its text
        TextView textView = findViewById(R.id.info_text);
        textView.setText(message);
        ImageGenerator imageGenerator = new ImageGenerator();
        String = imageGenerator.getImageFromDB(image_id);
        // Capture the layout's ImageView and set its image recieved from the Database
        if(imageCode != ""){
            ImageView imageView = findViewById(R.id.criminal_image);
            byte[] imageBytes = Base64.decode(imageCode, Base64.DEFAULT);
            Bitmap decodedImage = BitmapFactory.decodeByteArray(imageBytes, 0, imageBytes.length);
            imageView.setImageBitmap(decodedImage);
        }
    }
}


