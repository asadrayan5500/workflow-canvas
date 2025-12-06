import { useState, useEffect } from 'react';
import { Automation } from '@/types/workflow';
import { getAutomations } from '@/api/mockApi';

export const useAutomations = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAutomations = async () => {
      try {
        setLoading(true);
        const data = await getAutomations();
        setAutomations(data);
        setError(null);
      } catch (err) {
        setError('Failed to load automations');
      } finally {
        setLoading(false);
      }
    };

    fetchAutomations();
  }, []);

  const getAutomationById = (id: string): Automation | undefined => {
    return automations.find(a => a.id === id);
  };

  return {
    automations,
    loading,
    error,
    getAutomationById,
  };
};
