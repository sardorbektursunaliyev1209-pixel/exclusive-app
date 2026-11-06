export function initTelegram() {
  const tg = window.Telegram?.WebApp;
  if (!tg) return;
  tg.ready();
  tg.expand();
}

export function useTelegram() {
  const tg = window.Telegram?.WebApp;
  const user = tg?.initDataUnsafe?.user;
  return {
    user,
    name: user?.first_name || user?.username || 'Mehmon',
    photo: user?.photo_url || null,
    haptic: () => tg?.HapticFeedback?.impactOccurred('light'),
  };
}