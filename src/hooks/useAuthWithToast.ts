import { useAuth as useOriginalAuth } from './useAuth';
import { useToast } from '../contexts/ToastContext';
import { useCallback } from 'react';

export const useAuthWithToast = () => {
  const originalAuth = useOriginalAuth();
  const { showSuccess, showError, showInfo } = useToast();

  const login = useCallback(async (email: string, password: string) => {
    try {
      await originalAuth.login(email, password);
      // If login succeeds, the user context will handle the redirect
      // We can show a success message here if needed
    } catch (error) {
      // Error handling is already done in the original login function
      // But we can add toast notifications here if needed
    }
  }, [originalAuth]);

  const register = useCallback(async (name: string, username: string, email: string, password: string) => {
    try {
      await originalAuth.register(name, username, email, password);
      showSuccess('Conta criada com sucesso!');
    } catch (error) {
      showError('Erro ao criar conta. Tente novamente.');
    }
  }, [originalAuth, showSuccess, showError]);

  const logout = useCallback(() => {
    originalAuth.logout();
    showInfo('Você foi desconectado com sucesso.');
  }, [originalAuth]);

  return {
    ...originalAuth,
    login,
    register,
    logout,
  };
};