import json
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chat_id = self.scope['url_route']['kwargs']['chat_id']
        self.room_group_name = f'chat_{self.chat_id}'

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        textmassage = text_data_json['textmassage']
        username = text_data_json['username']

        # Optional: Du könntest hier auch das aktuelle Datum und die Uhrzeit hinzufügen
        created_at = timezone.now().isoformat()  # ISO 8601 format

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'textmassage': textmassage,
                'username': username,
                'created_at': created_at
            }
        )

    async def chat_message(self, event):
        textmassage = event['textmassage']
        username = event['username']
        created_at = event['created_at']  # Empfang von created_at

        await self.send(text_data=json.dumps({
            'textmassage': textmassage,
            'username': username,
            'created_at': created_at  # Füge created_at zu den gesendeten Daten hinzu
        }))
