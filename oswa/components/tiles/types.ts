export type TileAccentColor = 'olive' | 'gold' | 'sand' | 'sage' | 'clay';
export type TileSize = 'sm' | 'md' | 'lg';

export interface LocalizedString {
  ar: string;
  en: string;
}

export interface TileData {
  id: string | number;
  position?: string;
  badge?: string | LocalizedString;
  title: string | LocalizedString;
  content: string | LocalizedString;
  placement?: string;
  accent_color?: TileAccentColor;
  size?: TileSize;
  is_sharia_text?: boolean;
  source_book?: string | LocalizedString;
  source_ref?: string;
  narrator?: string | LocalizedString;
  grade?: string | LocalizedString;
  lesson?: string | LocalizedString;
  prophetic_method?: string | LocalizedString;
  status?: 'approved' | 'demo' | 'pending' | 'rejected';
  sort_order?: number;
}

export function getLocalizedText(
  value: string | LocalizedString | undefined | null,
  lang: 'ar' | 'en' = 'ar'
): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[lang] || value.ar || '';
}
