type Theme = {
  bg: string
  fg: string
  primary: string
  'primary-dark': string
  'primary-contrast': string
  base: string
  'base-dark': string
  'base-darker': string
  'issue-1': string
  'issue-2': string
  'idea-1': string
  'idea-2': string
  'other-1': string
  'success-1': string
  'success-2': string
}

export const presets: Record<string, Theme> = {
  Default: {
    bg: '#ffffff',
    fg: '#000000',
    primary: '#a78bfa',
    'primary-dark': '#8b5cf6',
    'primary-contrast': '#ffffff',
    base: '#e5e7eb',
    'base-dark': '#d1d5db',
    'base-darker': '#9ca3af',
    'issue-1': '#fcd34d',
    'issue-2': '#78350f',
    'idea-1': '#fcd34d',
    'idea-2': '#78350f',
    'other-1': '#78350f',
    'success-1': '#22db69',
    'success-2': '#ffffff',
  },
  Dracula: {
    bg: '#282a36',
    fg: '#f8f8f2',
    primary: '#ff79c6',
    'primary-dark': '#bd93f9',
    'primary-contrast': '#f8f8f2',
    base: '#44475a',
    'base-dark': '#535D7F',
    'base-darker': '#6272a4',
    'issue-1': '#ff5555',
    'issue-2': '#f8f8f2',
    'idea-1': '#ffb86c',
    'idea-2': '#f1fa8c',
    'other-1': '#8be9fd',
    'success-1': '#50fa7b',
    'success-2': '#f8f8f2',
  },
  'Horizon Dark': {
    bg: '#16161C',
    fg: '#FDF0ED',
    primary: '#F09383',
    'primary-dark': '#F43E5C',
    'primary-contrast': '#FDF0ED',
    base: '#232530',
    'base-dark': '#2E303E',
    'base-darker': '#6C6F93',
    'issue-1': '#F43E5C',
    'issue-2': '#FAB795',
    'idea-1': '#FAB28E',
    'idea-2': '#F09383',
    'other-1': '#25B2BC',
    'success-1': '#09F7A0',
    'success-2': '#FDF0ED',
  },
  'Horizon Light': {
    bg: '#FDF0E',
    fg: '#16161C',
    primary: '#F09383',
    'primary-dark': '#F43E5C',
    'primary-contrast': '#ffffff',
    base: '#FADAD1',
    'base-dark': '#F9CBBE',
    'base-darker': '#F9CEC3',
    'issue-1': '#F43E5C',
    'issue-2': '#FAB795',
    'idea-1': '#FAB28E',
    'idea-2': '#F09383',
    'other-1': '#25B2BC',
    'success-1': '#09F7A0',
    'success-2': '#16161C',
  },
  Nord: {
    bg: '#2E3440',
    fg: '#ECEFF4',
    primary: '#88C0D0',
    'primary-dark': '#81A1C1',
    'primary-contrast': '#ECEFF4',
    base: '#3B4252',
    'base-dark': '#434C5E',
    'base-darker': '#4C566A',
    'issue-1': '#BF616A',
    'issue-2': '#D8DEE9',
    'idea-1': '#EBCB8B',
    'idea-2': '#D08770',
    'other-1': '#B48EAD',
    'success-1': '#A3BE8C',
    'success-2': '#ECEFF4',
  },
}

export const DEFAULT_COLORS: Theme = presets.Default
