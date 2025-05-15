import cv2
import requests
import mediapipe as mp

fastapi_url = "http://127.0.0.1:8000/exibicao/detectar-mao-fechada"

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=False, max_num_hands=1)
mp_draw = mp.solutions.drawing_utils

cap = cv2.VideoCapture(0)

def is_closed_hand(landmarks):
    # Verifica se os dedos estão dobrados (fechando a mão)
    folded_fingers = 0
    finger_tips = [8, 12, 16, 20]  # Pontas dos dedos (excluindo o polegar)
    finger_pips = [6, 10, 14, 18]  # Articulações intermediárias

    for tip, pip in zip(finger_tips, finger_pips):
        if landmarks[tip].y > landmarks[pip].y:
            folded_fingers += 1

    return folded_fingers >= 3

while True:
    success, img = cap.read()
    img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    results = hands.process(img_rgb)

    if results.multi_hand_landmarks:
        for hand_landmarks in results.multi_hand_landmarks:
            mp_draw.draw_landmarks(img, hand_landmarks, mp_hands.HAND_CONNECTIONS)

            if is_closed_hand(hand_landmarks.landmark):
                print("Mão fechada detectada!")
                requests.post(fastapi_url)
                break

    cv2.imshow("Mao", img)
    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
