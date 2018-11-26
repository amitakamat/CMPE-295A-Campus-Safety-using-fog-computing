DATE=$(date +"%Y-%m-%d_%H%M%S")
for i in {0..1}
do
  imageUrl=$DATE$i".jpg"
  data="{"\"imageUrl\"" : "\"$imageUrl\"", "\"personGroupId\"" : "\"criminals\""}"
  echo $data
  curl --header "Content-Type: application/json" --request POST --data "$data" http://localhost:9999/v1/detect
done
