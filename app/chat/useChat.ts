import { useEffect, useState } from 'react';
import { supabase } from '@/shared/lib/supabase';
import { Message } from '@/shared/lib/types';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          setError(error.message);
        } else {
          setMessages(data || []);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  return { messages, loading, error };
};