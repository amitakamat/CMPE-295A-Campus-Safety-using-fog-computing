#!/bin/bash
DATE=$(date +"%Y-%m-%d_%H%M%S")
#raspistill -o /home/pi/timelapse/$DATE.jpg
#raspistill -o /mnt/picam/$DATE.jpg -tl 0 -t 60000
raspistill -o $(pwd)/images/$DATE%01d.jpg -t 60000 -tl 10000
for imagenumber in {0..7}
do
imageUrl=$(pwd)"/images/"$DATE$imagenumber".jpg"
echo $imageUrl
data="{"\"imageUrl\"" : "\"$imageUrl\"", "\"personGroupId\"" : "\"students\""}"
curl --header "Content-Type: application/json" --request POST --data "$data" http://localhost:9999/v1/detect
done
