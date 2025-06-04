import { useThemeStore } from "../../store/themeStore";

export default function ThemeToggle() {
  const { dark, toggle } = useThemeStore();

  return (
    <div className="px-4 py-3 border-t border-border-color dark:border-dark-border">
      <label className="flex items-center gap-2 cursor-pointer select-none">
        
        <input
          type="checkbox"
          checked={dark}
          onChange={toggle}
          className="peer sr-only"
        />

       
        <div className="w-10 h-5 rounded-full bg-border-color dark:bg-dark-border
                        relative transition-colors peer-checked:bg-primary">
          <div className="absolute left-1 top-1 h-3 w-3 bg-white rounded-full
                          transition-transform peer-checked:translate-x-5" />
        </div>

        <span className="text-sm text-text-secondary dark:text-dark-text-secondary">
          Тёмная тема
        </span>
      </label>
    </div>
  );
}
