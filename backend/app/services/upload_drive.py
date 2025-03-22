# from googleapiclient.discovery import build
# from google.oauth2 import service_account
# from googleapiclient.http import MediaIoBaseUpload
# import os
# import io

# # Defina as credenciais para autenticação
# SERVICE_ACCOUNT_FILE = 'credenciais/credenciais.json'

# # Defina os escopos
# SCOPES = ['https://www.googleapis.com/auth/drive.file']

# # Função para autenticação com Google Drive
# def authenticate_google_drive():
#     creds = service_account.Credentials.from_service_account_file(
#         SERVICE_ACCOUNT_FILE, scopes=SCOPES)
#     service = build('drive', 'v3', credentials=creds)
#     return service

# # Função para fazer upload de arquivos na pasta do Google Drive
# def upload_file_to_drive(service, folder_id, file):
#     file_metadata = {
#         'name': file.filename,
#         'parents': [folder_id]
#     }
    
#     media = MediaIoBaseUpload(io.BytesIO(file.file.read()), mimetype=file.content_type)
#     uploaded_file = service.files().create(body=file_metadata, media_body=media, fields='id, webContentLink').execute()
    
#     return uploaded_file['webContentLink']

# # Função principal para fazer upload dos arquivos
# async def organize_and_upload_files(folder_id, files):
#     service = authenticate_google_drive()
    
#     file_links = {"imagem": [], "audio": [], "video": []}
    
#     for file in files:
#         file_type = file.content_type.split('/')[0]  # Obtém o tipo de arquivo (imagem, áudio, vídeo)
        
#         if file_type == "image":
#             file_links["imagem"].append(upload_file_to_drive(service, folder_id, file))
#         elif file_type == "audio":
#             file_links["audio"].append(upload_file_to_drive(service, folder_id, file))
#         elif file_type == "video":
#             file_links["video"].append(upload_file_to_drive(service, folder_id, file))
    
#     return file_links