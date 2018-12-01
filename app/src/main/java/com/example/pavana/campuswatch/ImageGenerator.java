package com.example.pavana.campuswatch;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;
import android.widget.ImageView;

import com.mongodb.DBObject;
import com.mongodb.MongoClientURI;
import com.mongodb.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;

import org.bson.Document;
import org.bson.types.ObjectId;
import com.mongodb.BasicDBObject;
import static com.mongodb.client.model.Filters.eq;
import com.android.volley.toolbox.Volley;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.JsonRequest;
import com.android.volley.Request;
import com.android.volley.Response;
import org.json.JSONObject;
import com.android.volley.VolleyError;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class ImageGenerator {

    private String url = "http://35.185.202.31:5000/record?id=";

    public ImageGenerator(){
        Log.d("Image Generator const", "New Obj created");
    }

    public String getImageFromDB(String id) {
        String new_url = url + id;
        String resp;
        StringBuffer response = new StringBuffer();
        try {
            URL url_1 = new URL(new_url);
            HttpURLConnection conn = (HttpURLConnection) url_1.openConnection();
            conn.setRequestMethod("GET");
            int responseCode = conn.getResponseCode();
            Log.d("Sending 'GET' req to: " , url);
            Log.d("Response Code : " , Integer.toString(responseCode));

            BufferedReader in = new BufferedReader(
                    new InputStreamReader(conn.getInputStream()));
            String inputLine;

            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();

        } catch (MalformedURLException me){
            Log.d("Exception from HTTP", me.toString());

        } catch (IOException ioe){
            Log.d("IOException from HTTP ", ioe.toString());

        }
        return response.toString();
    }
}
//        JsonObjectRequest jsonObjectRequest = new JsonObjectRequest
//                (Request.Method.GET, new_url, null, new Response.Listener<JSONObject>() {
//
//                    @Override
//                    public void onResponse(JSONObject response) {
//                        resp =  response.toString();
//                    }
//                }, new Response.ErrorListener() {
//
//                    @Override
//                    public void onErrorResponse(VolleyError error) {
//                        // TODO: Handle error
//
//                    }
//                });
//    }
//    private boolean inited = false;
//    private MongoDatabase db;
//    private MongoCollection<Document> collection;
//
//    private void init()
//    {
//        MongoClientURI uri = new MongoClientURI( "mongodb+srv://cluster0-h7uii.mongodb.net/CriminalDB" );
//        MongoClient mongoClient = new MongoClient(uri);
//        db = mongoClient.getDatabase(uri.getDatabase());
//        collection = db.getCollection("alerts");
//        inited=true;
//    }
//
//    public String getImageFromDB(String oid) {
//        String base64String = "";
//        if (!inited) {
//            init();
//        }
//        ObjectId _id = new ObjectId(oid);
//        Document document = collection.find(eq("_id", new ObjectId(oid))).first();
//        if (document == null) {
//            //Handle this later
//        } else {
//            base64String = (String) document.get("imageData");
//        }
//        return base64String;
//    }
//}
