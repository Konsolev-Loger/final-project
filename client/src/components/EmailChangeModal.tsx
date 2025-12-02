import React, { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/shared/hooks/useReduxHook';
import { updateUserThunk } from '@/entities/user/api/UserApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle, XCircle, MessageSquare } from 'lucide-react';
import axios from 'axios';

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailChangeModal: React.FC<EmailChangeModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();

  const [newEmail, setNewEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [step, setStep] = useState<'check' | 'form' | 'code'>('check');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [telegramLinked, setTelegramLinked] = useState(false);
  const [telegramInfo, setTelegramInfo] = useState<any>(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      checkTelegramLink();
    }
  }, [isOpen, user?.id]);

  const checkTelegramLink = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/email-verification/check-link/${user?.id}`,
      );

      if (response.data.success) {
        setTelegramLinked(response.data.isLinked);
        setTelegramInfo(response.data.userLink);
        setStep(response.data.isLinked ? 'form' : 'check');
      }
    } catch (err) {
      console.error('Ошибка проверки привязки:', err);
    }
  };

  const handleSendCode = async () => {
    if (!newEmail) {
      setError('Введите новый email');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:3000/api/email-verification/send-code', {
        userId: user?.id,
        newEmail,
      });

      if (response.data.success) {
        setStep('code');
      } else {
        setError(response.data.error);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ошибка отправки кода');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      setError('Введите 6-значный код');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        'http://localhost:3000/api/email-verification/verify-code',
        { code: verificationCode },
      );

      if (response.data.success) {
        await dispatch(
          updateUserThunk({
            id: response.data.userId,
            data: { email: response.data.email },
          }),
        ).unwrap();

        resetForm();
        onClose();
      } else {
        setError(response.data.error);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Неверный код');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setNewEmail('');
    setVerificationCode('');
    setStep('check');
    setError('');
    setLoading(false);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white rounded-lg shadow-lg w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()} // Предотвращаем закрытие при клике внутри модалки
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">
            {step === 'check'
              ? 'Привязка Telegram'
              : step === 'form'
              ? 'Смена email'
              : 'Подтверждение кода'}
          </h3>

          {step === 'check' ? (
            <div className="space-y-4">
              {telegramLinked ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-green-800">Telegram привязан</h4>
                      <p className="text-sm text-green-700">
                        @{telegramInfo?.username || 'Пользователь'}
                      </p>
                    </div>
                  </div>
                  <Button onClick={() => setStep('form')} className="w-full">
                    Продолжить
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-3 mb-3">
                      <MessageSquare className="h-6 w-6 text-blue-600" />
                      <div>
                        <h4 className="font-semibold text-blue-800">Привяжите Telegram</h4>
                        <p className="text-sm text-blue-700">
                          Для смены email нужна привязка Telegram
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <h5 className="font-medium">Инструкция:</h5>
                        <ol className="list-decimal pl-5 text-sm space-y-1">
                          <li>
                            Найдите бота в Telegram:{' '}
                            <strong>
                              <a href="https://t.me/code_super_bot" target="_blank">
                                перейти по ссылке
                              </a>
                            </strong>
                          </li>
                          <li>Напишите команду:</li>
                          <div className="bg-gray-800 text-white p-2 rounded font-mono text-sm flex items-center justify-between">
                            <span>/link {user?.id}</span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigator.clipboard.writeText(String(`/link ${user?.id}`))
                              }
                              className="text-black"
                            >
                              Копировать
                            </Button>
                          </div>
                          <li>Вернитесь на сайт и нажмите "Проверить"</li>
                        </ol>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={checkTelegramLink} className="flex-1" disabled={loading}>
                      {loading ? 'Проверка...' : 'Проверить привязку'}
                    </Button>
                    <Button onClick={onClose} variant="outline" disabled={loading}>
                      Отмена
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : step === 'form' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Новый email</label>
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  disabled={loading}
                />
              </div>

              {telegramLinked && telegramInfo && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Код подтверждения будет отправлен в привязанный Telegram:
                  </p>
                  <p className="font-medium mt-1">@{telegramInfo.username || 'Пользователь'}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Код из Telegram</label>
                <Input
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  disabled={loading}
                  className="text-center text-xl tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-1">Проверьте сообщение от бота в Telegram</p>
              </div>

              <div className="text-sm p-3 bg-gray-50 rounded">
                <p>
                  Новый email: <span className="font-medium">{newEmail}</span>
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg whitespace-pre-line">
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 mt-0.5 shrink-0" />
                <div>{error}</div>
              </div>
            </div>
          )}

          {step !== 'check' && (
            <div className="flex gap-2 mt-6">
              {step === 'form' ? (
                <>
                  <Button
                    onClick={handleSendCode}
                    disabled={loading || !newEmail}
                    className="flex-1"
                  >
                    {loading ? 'Отправка...' : 'Получить код'}
                  </Button>
                  <Button onClick={() => setStep('check')} variant="outline" disabled={loading}>
                    Назад
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    onClick={handleVerifyCode}
                    disabled={loading || !verificationCode}
                    className="flex-1"
                  >
                    {loading ? 'Проверка...' : 'Подтвердить'}
                  </Button>
                  <Button onClick={() => setStep('form')} variant="outline" disabled={loading}>
                    Назад
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
