'use client';

import { useLanguage } from '@/context/language-context';
import type { Language } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language, name: string, fullName: string, flag: string }[] = [
    { code: 'en', name: 'EN', fullName: 'English', flag: '🇺🇸' },
    { code: 'hi', name: 'हिं', fullName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'or', name: 'ଓଡ଼ି', fullName: 'ଓଡ଼ିଆ', flag: '🇮🇳' },
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="language-switcher">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 px-3 py-2 h-auto text-sm font-medium transition-all duration-300 text-white/70 hover:text-white hover:bg-white/10"
            title="Change Language"
          >
            <Globe className="h-4 w-4" />
            <span className="hidden sm:inline">{currentLanguage?.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[180px] dropdown-content">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              'flex items-center gap-3 px-3 py-2 cursor-pointer transition-all duration-200',
              language === lang.code
                ? 'bg-primary/10 text-primary font-medium'
                : 'hover:bg-gray-50'
            )}
          >
            <span className="text-lg">{lang.flag}</span>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{lang.fullName}</span>
              <span className="text-xs text-muted-foreground">{lang.name}</span>
            </div>
            {language === lang.code && (
              <div className="ml-auto w-2 h-2 bg-primary rounded-full" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
