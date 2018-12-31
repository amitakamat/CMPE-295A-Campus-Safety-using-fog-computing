# Campus Safety Assistance using Fog Computing

Campus Safety Assistance (CSA) aims at providing campus safety to the students through a shift of paradigm from dispatching law enforcement authorities in response to crime events towards a proactive way of preventing crimes. This is achieved using surveillance cameras to perform facial recognition and weapon detection to monitor and analyze activities in the campus and sending alert notifications in real-time. This approach is fast enough to predict a potential crime and initiate actions in a timely manner.
In order to determine a potential criminal, we have designed a crime prediction API which runs a facial recognition model to match face of the person in the image with the criminal database of San Jose police incident reports and uses the behavioral analysis model which detects objects and predicts the likelihood of committing a crime.  
  

APIs used:  
https://github.com/Microsoft/Cognitive-Face-Python  
https://github.com/Microsoft/Cognitive-Vision-Python  
https://cloud.google.com/vision/  
 
 
## This repository contains:  
1. Script to start capturing images using Raspberry Pi 3.  
2. Facial Detection and Recognition module.  
3. Object detection module.  
4. Web Application.  
5. Mobile Application.  
