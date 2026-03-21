import React, { useEffect, useState } from 'react';
import { MessageOutlined } from '@ant-design/icons';
import axiosInstance from '../../api/axiosInstance';
import useMessages from '../../hooks/useMessages';
import AppointmentSelector from './components/AppointmentSelector';
import MessageThread from './components/MessageThread';
import {
  PageWrap,
  LeftPanel,
  PanelHeader,
  PanelTitle,
  SearchInput,
  AppointmentList,
  RightPanel,
  EmptyPrompt,
} from './MessagesPage.styled';

const MessagesPage = () => {
  const [appointments, setAppointments]     = useState([]);
  const [apptLoading, setApptLoading]       = useState(false);
  const [selectedApptId, setSelectedApptId] = useState(null);
  const [search, setSearch]                 = useState('');

  const { fetchThread, setActive } = useMessages();

  useEffect(() => {
    setApptLoading(true);
    axiosInstance
      .get('/api/appointments')
      .then((res) => {
        const data = res.data?.data;
        const list = Array.isArray(data)
          ? data
          : data?.appointments ?? data?.data ?? [];
        setAppointments(list);
      })
      .catch(() => setAppointments([]))
      .finally(() => setApptLoading(false));
  }, []);

  const filteredAppointments = appointments.filter((appt) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (appt.patient_name || '').toLowerCase();
    const date = (appt.appointment_date || appt.date || '').toLowerCase();
    return name.includes(q) || date.includes(q);
  });

  const handleSelect = (id) => {
    setSelectedApptId(id);
    fetchThread(id);
    setActive(id);
  };

  return (
    <PageWrap>
      <LeftPanel>
        <PanelHeader>
          <PanelTitle>Appointments</PanelTitle>
          <SearchInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient or date..."
          />
        </PanelHeader>
        <AppointmentList>
          <AppointmentSelector
            appointments={filteredAppointments}
            selectedId={selectedApptId}
            loading={apptLoading}
            onSelect={handleSelect}
          />
        </AppointmentList>
      </LeftPanel>

      <RightPanel>
        {selectedApptId ? (
          <MessageThread appointmentId={selectedApptId} />
        ) : (
          <EmptyPrompt>
            <MessageOutlined style={{ fontSize: 32, opacity: 0.3 }} />
            <span>Select an appointment to view messages</span>
          </EmptyPrompt>
        )}
      </RightPanel>
    </PageWrap>
  );
};

export default MessagesPage;
