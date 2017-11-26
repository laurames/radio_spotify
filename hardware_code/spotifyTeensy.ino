

int plistPins [] = {4, 5, 6, 7};

void setup() {
  Serial.begin(57600);
  pinMode(12, OUTPUT);
  pinMode(23, OUTPUT);

  for(int i = 0; i<4; i++){
    pinMode(plistPins[i], OUTPUT);
  }
}

void loop() {
  // put your main code here, to run repeatedly:
  digitalWrite(12, HIGH);
  
  int playlist;
  playlist = analogRead(A0);

//  Serial.print("Playlist: ");
//  Serial.println(playlist);

  int vol;
  vol = analogRead(A1);

//  Serial.print("Volume: ");
//  Serial.println(vol);

  analogWrite(23, vol/4);

  int mappedPlaylist;
  mappedPlaylist = map(playlist, 0, 1024, 0, 1000);

  int mapForLed;
  mapForLed = map(mappedPlaylist, 0, 1000, 1, 4);

  for(int i = 0; i<4; i++){
    if(i<mapForLed){
      digitalWrite(plistPins[i], HIGH);
      } else {
        digitalWrite(plistPins[i], LOW);
      }
  }
  
  int mappedVolume;
  mappedVolume = map(vol, 0, 1024, 1001, 2000);

  Serial.println(mappedPlaylist);
  delay(50);
  Serial.println(mappedVolume);
  delay(50);
  
  delay(100);

}
