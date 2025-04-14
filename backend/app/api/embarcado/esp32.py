# #include <WiFi.h>
# #include <HTTPClient.h>

# const char* ssid = "EDUARDO_2.4G"; //IVONE & JOSE
# const char* password = "22edpa12"; //19601976
# const char* serverUrl = "http://192.168.1.13:8000/distance";  // URL do FastAPI
# //const char* serverUrl = "http://192.168.1.13:8000/embarcado/distance";

# int SonarTrigger = 5;
# int SonarEcho = 18;
# long tempo;
# int distancia;

# void setup() {
#     Serial.begin(115200);
#     pinMode(SonarTrigger, OUTPUT);
#     pinMode(SonarEcho, INPUT);

#     // Conectar ao Wi-Fi
#     WiFi.begin(ssid, password);
#     while (WiFi.status() != WL_CONNECTED) {
#         delay(1000);
#         Serial.print(".");
#     }
#     Serial.println("Conectado ao Wi-Fi!");
# }

# void loop() {
#     // Emitir pulso
#     digitalWrite(SonarTrigger, LOW);
#     delayMicroseconds(2);
#     digitalWrite(SonarTrigger, HIGH);
#     delayMicroseconds(10);
#     digitalWrite(SonarTrigger, LOW);

#     // Medir tempo do eco
#     tempo = pulseIn(SonarEcho, HIGH);
#     Serial.print("Tempo: ");
#     Serial.println(tempo);

#     distancia = tempo / 58.2;

#     Serial.print("Distancia: ");
#     Serial.print(distancia);
#     Serial.println(" cm");

#     // Enviar dados para o backend
#     if (WiFi.status() == WL_CONNECTED) {
#         HTTPClient http;
#         http.begin(serverUrl);
#         http.addHeader("Content-Type", "application/json");

#         String payload = "{\"distance\": " + String(distancia) + "}";

#         int httpResponseCode = http.POST(payload);

#         Serial.print("Resposta do servidor: ");
#         Serial.println(httpResponseCode);  // Exibe o código de resposta HTTP

#         if (httpResponseCode > 0) {
#             String response = http.getString();  // Pega o corpo da resposta
#             Serial.println("Resposta do servidor:");
#             Serial.println(response);
#         } else {
#             Serial.println("Erro ao enviar dados.");
#             Serial.print("Código de erro HTTP: ");
#             Serial.println(httpResponseCode);  // Código de erro HTTP
#         }

#         http.end();
#     } else {
#         Serial.println("Não conectado ao Wi-Fi");
#     }


#     delay(1000);
# }
