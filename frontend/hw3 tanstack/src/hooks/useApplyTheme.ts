import { useEffect } from 'react';
import { useThemeStore } from '../store/themeStore';

export default function useApplyTheme() {
  const dark = useThemeStore((s) => s.dark);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
}
