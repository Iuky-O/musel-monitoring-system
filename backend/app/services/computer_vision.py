# backend/app/services/computer_vision.py
import numpy as np
import cv2
from tensorflow.keras.models import load_model
import base64
import gdown
import os

class ComputerVisionService:  # Rename the class here
    def __init__(self):
        self.model = self._load_model()
        self.class_names = ['obra_1', 'obra_2', 'obra_3']  # Substitua pelas suas obras
        self.class_names_pt = ['Obra 1', 'Obra 2', 'Obra 3']  # Nomes em português

    def _load_model(self):
        MODEL_URL = 'https://drive.google.com/uc?id=1J5h9BfADV2c8Sw7KOkHh0tBqU3j_bvlW'
        if not os.path.exists("model.h5"):
            print("Baixando o modelo do Google Drive...")
            gdown.download(MODEL_URL, "model.h5", quiet=False)
            print("Modelo baixado com sucesso.")
        return load_model('model.h5')

    def predict(self, image_data):
        img_data = base64.b64decode(image_data)
        np_arr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (244, 244))
        img_array = np.expand_dims(img, axis=0)
        img_array = img_array / 255.0

        preds = self.model.predict(img_array)
        predicted_class = np.argmax(preds, axis=1)
        predicted_label = self.class_names[predicted_class[0]]
        predicted_label_pt = self.class_names_pt[predicted_class[0]]

        return {
            "prediction_en": predicted_label,
            "prediction_pt": predicted_label_pt
        }