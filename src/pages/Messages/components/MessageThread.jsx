import React, { useEffect, useRef, useState } from 'react';
import { Select } from 'antd';
import useMessages from '../../../hooks/useMessages';
import useAuth from '../../../hooks/useAuth';
import Spinner from '../../../components/ui/Spinner/Spinner';
import MessageInput from './MessageInput';
import {
  ThreadWrap,
  ThreadHeader,
  ThreadTitle,
  MessageList,
  MessageBubble,
  BubbleHeader,
  SenderName,
  MessageTypeTag,
  Timestamp,
  BubbleText,
  EmptyMessages,
} from './MessageThread.styled';

const MESSAGE_TYPE_LABELS = {
  note:        'Note',
  message:     'Message',
  instruction: 'Instruction',
};

const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth()    === now.getMonth() &&
    d.getDate()     === now.getDate()
  );
};

const formatTime = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  if (isToday(dateStr)) {
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const MessageThread = ({ appointmentId }) => {
  const [messageType, setMessageType] = useState('note');
  const { getMessages, loading, fetchThread } = useMessages();
  const { user } = useAuth();
  const bottomRef = useRef(null);
  const messages = getMessages(appointmentId);

  useEffect(() => {
    if (appointmentId) {
      fetchThread(appointmentId);
    }
  }, [appointmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <ThreadWrap>
      <ThreadHeader>
        <ThreadTitle>Messages</ThreadTitle>
        <Select
          value={messageType}
          onChange={setMessageType}
          size="small"
          style={{ width: 130 }}
          options={[
            { value: 'note',        label: 'Note' },
            { value: 'message',     label: 'Message' },
            { value: 'instruction', label: 'Instruction' },
          ]}
        />
      </ThreadHeader>

      <MessageList>
        {loading && messages.length === 0 && <Spinner size="md" />}
        {messages.map((msg) => {
          const isMine = msg.sender_id === user?.id;
          return (
            <MessageBubble key={msg.id} $isMine={isMine}>
              <BubbleHeader>
                <SenderName $isMine={isMine}>{msg.sender_name}</SenderName>
                <MessageTypeTag $type={msg.message_type}>
                  {MESSAGE_TYPE_LABELS[msg.message_type] || msg.message_type}
                </MessageTypeTag>
                <Timestamp>{formatTime(msg.created_at)}</Timestamp>
              </BubbleHeader>
              <BubbleText>{msg.message}</BubbleText>
            </MessageBubble>
          );
        })}
        {messages.length === 0 && !loading && (
          <EmptyMessages>No messages yet. Start the conversation.</EmptyMessages>
        )}
        <div ref={bottomRef} />
      </MessageList>

      <MessageInput appointmentId={appointmentId} messageType={messageType} />
    </ThreadWrap>
  );
};

export default MessageThread;
