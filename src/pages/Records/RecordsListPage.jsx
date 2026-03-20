import React, { useEffect, useState, useCallback } from 'react';
import useRecords from '../../hooks/useRecords';
import { normalizeError } from '../../utils/errorNormalizer';
import Badge from '../../components/ui/Badge/Badge';
import Spinner from '../../components/ui/Spinner/Spinner';
import RecordForm from './components/RecordForm';
import {
    FileTextOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import {
    Wrap, TopBar, Title, Controls,
    SearchBox, SearchInp, IconBtn, AddBtn,
    Card, TableWrap, Table, Thead, Tbody, Tr, Th, Td,
    EmptyState, ErrMsg
} from './RecordsListPage.styled';

const STATUS_VARIANT = {
    verified: 'success', pending: 'warning', incomplete: 'danger', archived: 'default',
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
};

const RecordsListPage = () => {
    const { records, loading, saving, error, fetchRecords, createRecord } = useRecords();
    const [search, setSearch] = useState('');
    const [localError, setLocalError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadData = useCallback(() => {
        setLocalError(null);
        try {
            fetchRecords();
        } catch (e) {
            setLocalError(normalizeError(e).message);
        }
    }, [fetchRecords]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filtered = Array.isArray(records) ? records.filter((r) =>
        !search ||
        (r.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (r.diagnosis || '').toLowerCase().includes(search.toLowerCase())
    ) : [];

    const displayError = error || localError;

    const handleFormSuccess = (newRecord) => {
        createRecord(newRecord);
        setShowForm(false);
    };

    return (
        <Wrap>
            <TopBar>
                <Title>Medical Records Viewer</Title>
                <Controls>
                    <SearchBox>
                        <SearchOutlined style={{ color: '#94A3B8' }} />
                        <SearchInp
                            placeholder="Search by patient or diagnosis..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </SearchBox>
                    <IconBtn onClick={loadData} title="Refresh"><ReloadOutlined /></IconBtn>
                    <AddBtn onClick={() => setShowForm(true)}><FileTextOutlined /> Upload Record</AddBtn>
                </Controls>
            </TopBar>

            {displayError && <ErrMsg>{displayError}</ErrMsg>}

            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                <TableWrap>
                    <Card>
                        {loading ? (
                            <div style={{ padding: 60, display: 'flex', justifyContent: 'center' }}>
                                <Spinner size="md" />
                            </div>
                        ) : (
                            <Table>
                                <Thead>
                                    <Tr>
                                        <Th>Patient Name</Th>
                                        <Th>Diagnosis</Th>
                                        <Th>Provider (Doctor)</Th>
                                        <Th>Date Recorded</Th>
                                        <Th>Verification Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filtered.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={5}>
                                                <EmptyState>No medical records on file.</EmptyState>
                                            </Td>
                                        </Tr>
                                    ) : filtered.map((r) => (
                                        <Tr key={r.id}>
                                            <Td style={{ fontWeight: 500, color: '#0F172A' }}>{r.patient_name || '—'}</Td>
                                            <Td style={{ fontWeight: 600 }}>{r.diagnosis || '—'}</Td>
                                            <Td>{r.doctor_name || '—'}</Td>
                                            <Td>{formatDate(r.date_recorded || r.created_at)}</Td>
                                            <Td>
                                                <Badge variant={STATUS_VARIANT[r.status] || 'default'}>
                                                    {r.status || 'Verified'}
                                                </Badge>
                                            </Td>
                                        </Tr>
                                    ))}
                                </Tbody>
                            </Table>
                        )}
                    </Card>
                </TableWrap>
            </div>

            <RecordForm
                open={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={handleFormSuccess}
                saving={saving}
            />
        </Wrap>
    );
};

export default RecordsListPage;
