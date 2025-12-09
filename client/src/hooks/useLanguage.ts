import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { languages, type LanguageCode } from '../i18n';

export function useLanguage() {
  const { i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const pathLang = location.pathname.split('/')[1];
  const validLang = languages.find(l => l.code === pathLang);
  
  const currentLanguage = languages.find(l => l.code === i18n.language) || languages[0];
  const isRTL = currentLanguage.dir === 'rtl';

  useEffect(() => {
    if (validLang && validLang.code !== i18n.language) {
      i18n.changeLanguage(validLang.code);
    } else if (!validLang && location.pathname === '/' && i18n.language !== 'en') {
      i18n.changeLanguage('en');
    }
  }, [pathLang, validLang, i18n, location.pathname]);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLanguage.code;
  }, [isRTL, currentLanguage.code]);

  const changeLanguage = (code: LanguageCode) => {
    i18n.changeLanguage(code);
    if (code === 'en') {
      navigate('/');
    } else {
      navigate(`/${code}`);
    }
  };

  return {
    currentLanguage,
    languages,
    changeLanguage,
    isRTL,
  };
}
