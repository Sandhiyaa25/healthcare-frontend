import React, { useEffect, useState, useCallback } from 'react';
import usePrescriptions from '../../hooks/usePrescriptions';
import { normalizeError } from '../../utils/errorNormalizer';
import Badge from '../../components/ui/Badge/Badge';
import Spinner from '../../components/ui/Spinner/Spinner';
import PrescriptionForm from './components/PrescriptionForm';
import {
    MedicineBoxOutlined, SearchOutlined, ReloadOutlined
} from '@ant-design/icons';
import {
    Wrap, TopBar, Title, Controls,
    SearchBox, SearchInp, IconBtn, AddBtn,
    Card, TableWrap, Table, Thead, Tbody, Tr, Th, Td,
    EmptyState, ErrMsg
} from './PrescriptionsListPage.styled';

const STATUS_VARIANT = {
    active: 'success', expired: 'danger', pending: 'warning', completed: 'default',
};

const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
};

const PrescriptionsListPage = () => {
    const { prescriptions, loading, saving, error, fetchPrescriptions, createPrescription } = usePrescriptions();
    const [search, setSearch] = useState('');
    const [localError, setLocalError] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const loadData = useCallback(() => {
        setLocalError(null);
        try {
            fetchPrescriptions();
        } catch (e) {
            setLocalError(normalizeError(e).message);
        }
    }, [fetchPrescriptions]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const filtered = Array.isArray(prescriptions) ? prescriptions.filter((p) =>
        !search ||
        (p.medication_name || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.patient_name || '').toLowerCase().includes(search.toLowerCase())
    ) : [];

    const displayError = error || localError;

    const handleFormSuccess = (newPrescription) => {
        createPrescription(newPrescription);
        setShowForm(false);
    };

    return (
        <Wrap>
            <TopBar>
                <Title>Prescriptions Management</Title>
                <Controls>
                    <SearchBox>
                        <SearchOutlined style={{ color: '#94A3B8' }} />
                        <SearchInp
                            placeholder="Search medication or patient..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </SearchBox>
                    <IconBtn onClick={loadData} title="Refresh"><ReloadOutlined /></IconBtn>
                    <AddBtn onClick={() => setShowForm(true)}><MedicineBoxOutlined /> Add Prescription</AddBtn>
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
                                        <Th>Medication</Th>
                                        <Th>Dosage</Th>
                                        <Th>Frequency</Th>
                                        <Th>Date Issued</Th>
                                        <Th>Status</Th>
                                    </Tr>
                                </Thead>
                                <Tbody>
                                    {filtered.length === 0 ? (
                                        <Tr>
                                            <Td colSpan={6}>
                                                <EmptyState>No prescriptions found.</EmptyState>
                                            </Td>
                                        </Tr>
                                    ) : filtered.map((p) => (
                                        <Tr key={p.id}>
                                            <Td style={{ fontWeight: 500 }}>{p.patient_name || '—'}</Td>
                                            <Td style={{ color: '#0F172A', fontWeight: 600 }}>{p.medication_name}</Td>
                                            <Td>{p.dosage || '—'}</Td>
                                            <Td>{p.frequency || '—'}</Td>
                                            <Td>{formatDate(p.date_issued || p.created_at)}</Td>
                                            <Td>
                                                <Badge variant={STATUS_VARIANT[p.status] || 'default'}>
                                                    {p.status || 'Active'}
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

            <PrescriptionForm
                open={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={handleFormSuccess}
                saving={saving}
            />
        </Wrap>
    );
};

export default PrescriptionsListPage;
