import json
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Query
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.core.security import decode_access_token
from app.core.database import AsyncSessionLocal
from app.models import User, CommunityMessage, Message, Conversation, ConversationMember
from app.schemas import UserBrief
from app.api.websockets.hub import manager

ws_router = APIRouter()

@ws_router.websocket("/ws")
async def websocket_endpoint(
    websocket: WebSocket,
    token: str = Query(...)
):
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        await websocket.close(code=1008) # Policy Violation
        return

    user_id = int(payload.get("sub"))
    
    # Load user
    async with AsyncSessionLocal() as db:
        user = (await db.execute(select(User).where(User.id == user_id))).scalar_one_or_none()
        if not user or not user.is_active or user.status == "suspended":
            await websocket.close(code=1008)
            return

    await manager.connect(websocket, user_id)
    try:
        while True:
            data_raw = await websocket.receive_text()
            try:
                data = json.loads(data_raw)
            except Exception:
                continue

            action = data.get("action")
            
            if action == "ping":
                await websocket.send_json({"action": "pong"})

            elif action == "subscribe":
                topic = data.get("topic")
                if topic:
                    manager.subscribe(websocket, topic)
                    await websocket.send_json({"action": "subscribed", "topic": topic})

            elif action == "unsubscribe":
                topic = data.get("topic")
                if topic:
                    manager.unsubscribe(websocket, topic)

            elif action == "channel_message":
                channel_id = data.get("channel_id")
                content = data.get("content", "").strip()
                if channel_id and content:
                    async with AsyncSessionLocal() as db:
                        msg = CommunityMessage(
                            channel_id=channel_id,
                            user_id=user_id,
                            content=content
                        )
                        db.add(msg)
                        await db.commit()
                        await db.refresh(msg)
                        
                        stmt = select(CommunityMessage).where(CommunityMessage.id == msg.id).options(selectinload(CommunityMessage.user))
                        full_msg = (await db.execute(stmt)).scalar_one()
                        
                        broadcast_payload = {
                            "action": "new_channel_message",
                            "topic": f"channel:{channel_id}",
                            "message": {
                                "id": full_msg.id,
                                "channel_id": full_msg.channel_id,
                                "user_id": full_msg.user_id,
                                "content": full_msg.content,
                                "created_at": full_msg.created_at.isoformat(),
                                "user": {
                                    "id": full_msg.user.id,
                                    "username": full_msg.user.username,
                                    "full_name": full_msg.user.full_name,
                                    "role": full_msg.user.role,
                                    "avatar_url": full_msg.user.avatar_url,
                                    "is_verified": full_msg.user.is_verified
                                }
                            }
                        }
                        await manager.broadcast_to_topic(f"channel:{channel_id}", broadcast_payload)

            elif action == "dm_message":
                conversation_id = data.get("conversation_id")
                content = data.get("content", "").strip()
                if conversation_id and content:
                    async with AsyncSessionLocal() as db:
                        # Verify membership
                        mem_stmt = select(ConversationMember).where(
                            ConversationMember.conversation_id == conversation_id,
                            ConversationMember.user_id == user_id
                        )
                        is_member = (await db.execute(mem_stmt)).scalar_one_or_none()
                        if not is_member:
                            continue

                        msg = Message(
                            conversation_id=conversation_id,
                            sender_id=user_id,
                            content=content
                        )
                        db.add(msg)
                        await db.commit()
                        await db.refresh(msg)

                        stmt = select(Message).where(Message.id == msg.id).options(selectinload(Message.sender))
                        full_msg = (await db.execute(stmt)).scalar_one()

                        # Get all conversation members to broadcast
                        all_members = (await db.execute(
                            select(ConversationMember.user_id).where(ConversationMember.conversation_id == conversation_id)
                        )).scalars().all()

                        dm_payload = {
                            "action": "new_dm_message",
                            "conversation_id": conversation_id,
                            "message": {
                                "id": full_msg.id,
                                "conversation_id": full_msg.conversation_id,
                                "sender_id": full_msg.sender_id,
                                "content": full_msg.content,
                                "created_at": full_msg.created_at.isoformat(),
                                "sender": {
                                    "id": full_msg.sender.id,
                                    "username": full_msg.sender.username,
                                    "full_name": full_msg.sender.full_name,
                                    "role": full_msg.sender.role,
                                    "avatar_url": full_msg.sender.avatar_url,
                                    "is_verified": full_msg.sender.is_verified
                                }
                            }
                        }
                        for member_id in all_members:
                            await manager.send_personal_message(dm_payload, member_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception:
        manager.disconnect(websocket, user_id)
