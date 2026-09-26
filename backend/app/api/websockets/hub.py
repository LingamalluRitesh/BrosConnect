from typing import Dict, List, Set
from fastapi import WebSocket

class ConnectionManager:
    def __init__(self):
        # Maps user_id -> List of active WebSocket connections
        self.active_user_connections: Dict[int, List[WebSocket]] = {}
        # Maps topic (e.g. "channel:1" or "conv:5") -> Set of WebSockets
        self.topic_subscribers: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, user_id: int):
        await websocket.accept()
        if user_id not in self.active_user_connections:
            self.active_user_connections[user_id] = []
        self.active_user_connections[user_id].append(websocket)

    def disconnect(self, websocket: WebSocket, user_id: int):
        if user_id in self.active_user_connections:
            if websocket in self.active_user_connections[user_id]:
                self.active_user_connections[user_id].remove(websocket)
            if not self.active_user_connections[user_id]:
                del self.active_user_connections[user_id]

        for topic, sockets in list(self.topic_subscribers.items()):
            sockets.discard(websocket)
            if not sockets:
                del self.topic_subscribers[topic]

    def subscribe(self, websocket: WebSocket, topic: str):
        if topic not in self.topic_subscribers:
            self.topic_subscribers[topic] = set()
        self.topic_subscribers[topic].add(websocket)

    def unsubscribe(self, websocket: WebSocket, topic: str):
        if topic in self.topic_subscribers:
            self.topic_subscribers[topic].discard(websocket)

    async def send_personal_message(self, message: dict, user_id: int):
        if user_id in self.active_user_connections:
            for connection in self.active_user_connections[user_id]:
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

    async def broadcast_to_topic(self, topic: str, message: dict):
        if topic in self.topic_subscribers:
            for connection in list(self.topic_subscribers[topic]):
                try:
                    await connection.send_json(message)
                except Exception:
                    pass

manager = ConnectionManager()
