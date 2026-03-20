import React, { useState, useEffect, useRef } from 'react';
import { Input, notification } from 'antd';
import { SendOutlined } from '@ant-design/icons';
import useMessages from '../../../hooks/useMessages';
import { InputWrap, SendButton } from './MessageInput.styled';

const MessageInput = ({ appointmentId, messageType }) => {
  const [inputText, setInputText] = useState('');
  const { sendMessage, sending, sendError, getMessages } = useMessages();
  const prevSendingRef = useRef(false);

  // Show error notification when send fails
  useEffect(() => {
    if (sendError && prevSendingRef.current && !sending) {
      notification.error({
        message:     'Failed to send',
        description: sendError,
      });
    }
    prevSendingRef.current = sending;
  }, [sending, sendError]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage({
      appointment_id: appointmentId,
      message:        inputText.trim(),
      message_type:   messageType || 'note',
    });
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <InputWrap>
      <Input.TextArea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message... (Enter to send, Shift+Enter for new line)"
        autoSize={{ minRows: 1, maxRows: 4 }}
        disabled={sending}
        style={{ flex: 1, borderRadius: 8, fontSize: 13 }}
      />
      <SendButton
        onClick={handleSend}
        disabled={!inputText.trim() || sending}
      >
        {sending ? (
          <span>Sending...</span>
        ) : (
          <>
            <SendOutlined />
            Send
          </>
        )}
      </SendButton>
    </InputWrap>
  );
};

export default MessageInput;
