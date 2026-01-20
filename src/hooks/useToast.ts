import { useState, useCallback } from 'react';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface ToastState {
  visible: boolean;
  message: string;
  type: ToastType;
}

export const useToast = () => {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    type: 'success',
  });

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({
      visible: true,
      message,
      type,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  return {
    toast,
    showToast,
    hideToast,
  };
};
