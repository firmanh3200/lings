
import React from 'react';
import { THEMES } from '../themes';
import type { Theme } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ currentTheme, setTheme }) => {
  return (
    <div className="flex items-center gap-3 justify-center">
      <div className="flex items-center gap-3">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => setTheme(theme)}
            aria-label={`Switch to ${theme.name} theme`}
            className={`w-6 h-6 rounded-full transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 ${
              theme.id === 'cyan' ? 'bg-cyan-500' :
              theme.id === 'rose' ? 'bg-rose-500' :
              theme.id === 'emerald' ? 'bg-emerald-500' :
              'bg-violet-500'
            } ${currentTheme.id === theme.id ? `ring-2 ring-offset-2 ring-offset-gray-900 ${theme.themeSelectorRing}` : ''}`}
          />
        ))}
      </div>
    </div>
  );
};
