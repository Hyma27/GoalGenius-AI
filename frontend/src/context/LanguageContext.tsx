import React, { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'es' | 'fr' | 'pt' | 'hi' | 'te' | 'ar';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    title: "GoalGenius AI",
    subtitle: "Smarter Stadiums. Better Matchdays. Powered by Generative AI.",
    login: "Login",
    email: "Email",
    password: "Password",
    rememberMe: "Remember me",
    forgotPassword: "Forgot Password?",
    guestLogin: "Continue as Guest",
    googleLogin: "Continue with Google",
    dashboard: "Dashboard",
    digitalTwin: "AI Digital Twin",
    commandCenter: "AI Command Center",
    matchPlanner: "Match Planner",
    navigation: "Navigation",
    crowdAI: "Crowd AI",
    travel: "Travel",
    accessibility: "Accessibility",
    sustainability: "Sustainability",
    operations: "Operations",
    reports: "Reports",
    settings: "Settings",
    searchPlaceholder: "Ask GoalGenius AI...",
    notifications: "Notifications",
    welcome: "Welcome to GoalGenius AI",
    livePlatform: "Real-time AI Stadium Intelligence Platform",
    overallRisk: "Overall Risk",
    low: "Low",
    medium: "Medium",
    high: "High",
    critical: "Critical",
    confidenceTitle: "AI Decision Confidence",
    fanExpTitle: "AI Fan Experience Score",
    susPredictorTitle: "AI Sustainability Predictor"
  },
  es: {
    title: "GoalGenius AI",
    subtitle: "Estadios más inteligentes. Mejores jornadas. Impulsado por IA generativa.",
    login: "Iniciar sesión",
    email: "Correo electrónico",
    password: "Contraseña",
    rememberMe: "Recordarme",
    forgotPassword: "¿Olvidaste tu contraseña?",
    guestLogin: "Continuar como invitado",
    googleLogin: "Continuar con Google",
    dashboard: "Panel",
    digitalTwin: "Gemelo Digital IA",
    commandCenter: "Centro de Comando",
    matchPlanner: "Planificador de Partidos",
    navigation: "Navegación",
    crowdAI: "IA de Multitud",
    travel: "Viaje",
    accessibility: "Accesibilidad",
    sustainability: "Sostenibilidad",
    operations: "Operaciones",
    reports: "Informes",
    settings: "Configuración",
    searchPlaceholder: "Preguntar a GoalGenius AI...",
    notifications: "Notificaciones",
    welcome: "Bienvenido a GoalGenius AI",
    livePlatform: "Plataforma de Inteligencia de Estadios en Tiempo Real",
    overallRisk: "Riesgo General",
    low: "Bajo",
    medium: "Medio",
    high: "Alto",
    critical: "Crítico",
    confidenceTitle: "Confianza en Decisiones IA",
    fanExpTitle: "Puntuación de Experiencia de Aficionados IA",
    susPredictorTitle: "Predictor de Sostenibilidad IA"
  },
  fr: {
    title: "GoalGenius AI",
    subtitle: "Stades plus intelligents. Meilleures journées. Propulsé par l'IA générative.",
    login: "Connexion",
    email: "E-mail",
    password: "Mot de passe",
    rememberMe: "Se souvenir de moi",
    forgotPassword: "Mot de passe oublié ?",
    guestLogin: "Continuer en tant qu'invité",
    googleLogin: "Continuer avec Google",
    dashboard: "Tableau de bord",
    digitalTwin: "Jumeau Numérique IA",
    commandCenter: "Centre de Commande",
    matchPlanner: "Planificateur de Match",
    navigation: "Navigation",
    crowdAI: "IA de Foule",
    travel: "Voyage",
    accessibility: "Accessibilité",
    sustainability: "Durabilité",
    operations: "Opérations",
    reports: "Rapports",
    settings: "Paramètres",
    searchPlaceholder: "Demander à GoalGenius AI...",
    notifications: "Notifications",
    welcome: "Bienvenue sur GoalGenius AI",
    livePlatform: "Plateforme d'Intelligence de Stade IA en Temps Réel",
    overallRisk: "Risque Global",
    low: "Faible",
    medium: "Moyen",
    high: "Élevé",
    critical: "Critique",
    confidenceTitle: "Confiance Décisionnelle IA",
    fanExpTitle: "Score d'Expérience Supporter IA",
    susPredictorTitle: "Prédicteur de durabilité IA"
  },
  pt: {
    title: "GoalGenius AI",
    subtitle: "Estádios mais inteligentes. Melhores dias de jogo. Impulsionado por IA generativa.",
    login: "Entrar",
    email: "E-mail",
    password: "Senha",
    rememberMe: "Lembrar-me",
    forgotPassword: "Esqueceu a senha?",
    guestLogin: "Continuar como convidado",
    googleLogin: "Continuar com o Google",
    dashboard: "Painel de controle",
    digitalTwin: "Gêmeo Digital IA",
    commandCenter: "Centro de Comando",
    matchPlanner: "Planejador de Jogos",
    navigation: "Navegação",
    crowdAI: "IA de Multidão",
    travel: "Viagem",
    accessibility: "Acessibilidade",
    sustainability: "Sustentabilidade",
    operations: "Operações",
    reports: "Relatórios",
    settings: "Configurações",
    searchPlaceholder: "Pergunte ao GoalGenius AI...",
    notifications: "Notificações",
    welcome: "Bem-vindo ao GoalGenius AI",
    livePlatform: "Plataforma de Inteligência do Estádio IA em Tempo Real",
    overallRisk: "Risco Geral",
    low: "Baixo",
    medium: "Médio",
    high: "Alto",
    critical: "Crítico",
    confidenceTitle: "Confiança nas Decisões IA",
    fanExpTitle: "Pontuação da Experiência dos Fãs IA",
    susPredictorTitle: "Preditor de Sustentabilidade IA"
  },
  hi: {
    title: "GoalGenius AI",
    subtitle: "स्मार्ट स्टेडियम। बेहतर मैचडे। जनरेटिव एआई द्वारा संचालित।",
    login: "लॉगिन",
    email: "ईमेल",
    password: "पासवर्ड",
    rememberMe: "याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    guestLogin: "अतिथि के रूप में जारी रखें",
    googleLogin: "गूगल के साथ जारी रखें",
    dashboard: "डैशबोर्ड",
    digitalTwin: "एआई डिजिटल ट्विन",
    commandCenter: "एआई कमांड सेंटर",
    matchPlanner: "मैच प्लानर",
    navigation: "नेविगेशन",
    crowdAI: "भीड़ एआई",
    travel: "यात्रा",
    accessibility: "सुलभता",
    sustainability: "सस्टेनेबिलिटी",
    operations: "संचालन",
    reports: "रिपोर्ट्स",
    settings: "सेटिंग्स",
    searchPlaceholder: "GoalGenius AI से पूछें...",
    notifications: "अधिसूचनाएं",
    welcome: "GoalGenius AI में आपका स्वागत है",
    livePlatform: "वास्तविक समय एआई स्टेडियम इंटेलिजेंस प्लेटफॉर्म",
    overallRisk: "समग्र जोखिम",
    low: "कम",
    medium: "मध्यम",
    high: "उच्च",
    critical: "गंभीर",
    confidenceTitle: "एआई निर्णय सटीकता",
    fanExpTitle: "एआई प्रशंसक अनुभव स्कोर",
    susPredictorTitle: "एआई स्थिरता संकेतक"
  },
  te: {
    title: "GoalGenius AI",
    subtitle: "స్మార్ట్ స్టేడియాలు. మెరుగైన మ్యాచ్‌డేలు. జనరేటివ్ AI ద్వారా నడుస్తుంది.",
    login: "లాగిన్",
    email: "ఈమెయిల్",
    password: "పాస్‌వర్డ్",
    rememberMe: "గుర్తుంచుకో",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    guestLogin: "గెస్ట్‌గా కొనసాగండి",
    googleLogin: "గూగుల్‌తో కొనసాగండి",
    dashboard: "డాష్‌బోర్డ్",
    digitalTwin: "AI డిజిటల్ ట్విన్",
    commandCenter: "AI కమాండ్ సెంటర్",
    matchPlanner: "మ్యాచ్ ప్లానర్",
    navigation: "నావిగేషన్",
    crowdAI: "క్రౌడ్ AI",
    travel: "ప్రయాణం",
    accessibility: "అందుబాటు",
    sustainability: "సస్టైనబిలిటీ",
    operations: "ఆపరేషన్స్",
    reports: "రిపోర్టులు",
    settings: "సెట్టింగ్స్",
    searchPlaceholder: "GoalGenius AIని అడగండి...",
    notifications: "నోటిఫికేషన్లు",
    welcome: "GoalGenius AI కి స్వాగతం",
    livePlatform: "రియల్ టైమ్ AI స్టేడియం ఇంటెలిజెన్స్ ప్లాట్‌ఫారమ్",
    overallRisk: "మొత్తం రిస్క్",
    low: "తక్కువ",
    medium: "మధ్యస్థం",
    high: "ఎక్కువ",
    critical: "తీవ్రమైనది",
    confidenceTitle: "AI నిర్ణయ విశ్వసనీయత",
    fanExpTitle: "AI ఫ్యాన్ అనుభవ స్కోర్",
    susPredictorTitle: "AI సస్టైనబిలిటీ ప్రిడిక్టర్"
  },
  ar: {
    title: "GoalGenius AI",
    subtitle: "ملاعب أذكى. أيام مباريات أفضل. مدعوم بالذكاء الاصطناعي التوليدي.",
    login: "تسجيل الدخول",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    rememberMe: "تذكرني",
    forgotPassword: "هل نسيت كلمة المرور؟",
    guestLogin: "متابعة كضيف",
    googleLogin: "متابعة باستخدام Google",
    dashboard: "لوحة التحكم",
    digitalTwin: "التوأم الرقمي بالذكاء الاصطناعي",
    commandCenter: "مركز التحكم بالذكاء الاصطناعي",
    matchPlanner: "مخطط المباريات",
    navigation: "الملاحة داخل الاستاد",
    crowdAI: "ذكاء الحشود",
    travel: "مساعد السفر",
    accessibility: "مساعدة ذوي الاحتياجات",
    sustainability: "الاستدامة والبيئة",
    operations: "مركز العمليات",
    reports: "التقارير",
    settings: "الإعدادات",
    searchPlaceholder: "اسأل GoalGenius AI...",
    notifications: "الإشعارات",
    welcome: "مرحباً بكم في GoalGenius AI",
    livePlatform: "منصة ذكاء الملاعب الفورية بالذكاء الاصطناعي",
    overallRisk: "مستوى الخطر العام",
    low: "منخفض",
    medium: "متوسط",
    high: "مرتفع",
    critical: "خطير",
    confidenceTitle: "مستوى ثقة القرارات",
    fanExpTitle: "تقييم تجربة الجمهور",
    susPredictorTitle: "مؤشر الاستدامة المتوقع"
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('gg_language');
    return (saved as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('gg_language', lang);
    // Standard translation handling for document direction
    document.dir = lang === 'ar' ? 'rtl' : 'ltr';
  };

  useEffect(() => {
    document.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string): string => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
