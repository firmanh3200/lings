
import type { ReactElement } from 'react';

export interface Link {
  id: number;
  title: string;
  url: string;
  icon: ReactElement;
  description?: string;
  tags?: string[];
}

export interface Theme {
  id: string;
  name: string;
  background: string;
  headerBg: string;
  linkBg: string;
  linkBorder: string;
  linkHoverBorder: string;
  linkHoverBg: string;
  linkHoverIcon: string;
  linkHoverShadow: string;
  themeSelectorRing: string;
}
