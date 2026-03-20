import React, { useEffect, useState } from 'react';
import { Input, Select } from 'antd';
import useMessages from '../../../hooks/useMessages';
import Spinner from '../../../components/ui/Spinner/Spinner';
import {
  NotesWrap,
  NotesHeader,
  NotesTitle,
  NotesList,
  NoteItem,
  NoteTop,
  NoteSender,
  NoteType,
  NoteTime,
  NoteText,
  EmptyNotes,
  AddNoteRow,
  AddNoteBtn,
} from './AppointmentNotes.styled';

const NOTE_TYPE_LABELS = {
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

const formatNoteTime = (dateStr) => {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const time = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  if (isToday(dateStr)) {
    return `Today ${time}`;
  }
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${date}, ${time}`;
};

const AppointmentNotes = ({ appointmentId }) => {
  const [noteText, setNoteText]     = useState('');
  const [messageType, setMessageType] = useState('note');

  const { getMessages, loading, sending, fetchThread, sendMessage } = useMessages();
  const notes = getMessages(appointmentId);

  useEffect(() => {
    if (appointmentId) {
      fetchThread(appointmentId);
    }
  }, [appointmentId]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    sendMessage({
      appointment_id: appointmentId,
      message:        noteText.trim(),
      message_type:   messageType,
    });
    setNoteText('');
  };

  return (
    <NotesWrap>
      <NotesHeader>
        <NotesTitle>Notes &amp; Messages</NotesTitle>
        <Select
          value={messageType}
          onChange={setMessageType}
          size="small"
          style={{ width: 120 }}
          options={[
            { value: 'note',        label: 'Note' },
            { value: 'message',     label: 'Message' },
            { value: 'instruction', label: 'Instruction' },
          ]}
        />
      </NotesHeader>

      <NotesList>
        {loading && notes.length === 0 && <Spinner size="sm" />}
        {notes.map((note) => (
          <NoteItem key={note.id}>
            <NoteTop>
              <NoteSender>{note.sender_name}</NoteSender>
              <NoteType type={note.message_type}>
                {NOTE_TYPE_LABELS[note.message_type] || note.message_type}
              </NoteType>
              <NoteTime>{formatNoteTime(note.created_at)}</NoteTime>
            </NoteTop>
            <NoteText>{note.message}</NoteText>
          </NoteItem>
        ))}
        {notes.length === 0 && !loading && (
          <EmptyNotes>No notes yet for this appointment.</EmptyNotes>
        )}
      </NotesList>

      <AddNoteRow>
        <Input.TextArea
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Add a note..."
          autoSize={{ minRows: 2, maxRows: 5 }}
          style={{ borderRadius: 8, fontSize: 13 }}
        />
        <AddNoteBtn
          onClick={handleAddNote}
          disabled={!noteText.trim() || sending}
        >
          {sending ? 'Adding...' : 'Add Note'}
        </AddNoteBtn>
      </AddNoteRow>
    </NotesWrap>
  );
};

export default AppointmentNotes;
