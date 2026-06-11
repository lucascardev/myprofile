import React, { useEffect, useState, useRef } from 'react';
import Pacman3D from './components/Pacman3D';
import MatrixRain3D from './components/MatrixRain3D';
import { AsciiArt } from './components/ui/ascii-art';

import {
  FaGithub,
  FaInstagram,
  FaLinkedin,
  FaHtml5,
  FaCss3,
  FaReact,
  FaNodeJs,
  FaDocker,
  FaJsSquare,
  FaGit,
  FaTerminal,
  FaGlobe,
  FaWhatsapp,
  FaBrain,
  FaRobot,
  FaRocket,
} from 'react-icons/fa';

import { 
  SiTypescript,
  SiKubernetes,
  SiGooglecloud,
  SiDigitalocean,
  SiOracle,
} from 'react-icons/si';

import {
  Container,
  Header,
  Avatar,
  Username,
  Main,
  Contact,
  Footer,
  PageHolder,
  Gitinfo,
  Scanlines,
  SidePanel,
  TerminalWrapper,
  CommandHistory,
  LinkHolder,
  CyberButton,
  CommandRow,
  PromptLabel,
  TerminalInputLine,
  CustomInput,
  TechsMarqueeContainer,
  TechsTrack,
  TechItem,
  TechTooltip,
  FloatingWhatsApp,
  TechExperienceDisplay,
  BlinkingCursor,
  ClaraShowcase,
  ClaraTitle,
  ClaraTag,
  ClaraBadgeList,
  ClaraBadge,
  ClaraFeatureList,
  ClaraButtonList,
  ClaraButton,
  ProjectShowcase,
  ProjectTitle,
  ProjectTag,
  ProjectBadgeList,
  ProjectBadge,
  ProjectFeatureList,
  ProjectButtonList,
  ProjectButton,
  HeaderTechs,
  ClaraChatWindow,
  ClaraChatHeader,
  ClaraChatBody,
  ClaraChatMessage,
  ContributionsWrapper,
  ContributionsTitle,
  CalendarContainer,
  CalendarGrid,
  WeekdayLabels,
  MonthLabelsContainer,
  CalendarCell,
  CalendarLegend,
} from './style/global.style';

import API from './services/api';
import techsData from './services/techs.json';
import contributionsData from './services/contributions.json';

const ICON_MAP = {
  typescript: SiTypescript,
  css3: FaCss3,
  docker: FaDocker,
  html5: FaHtml5,
  react: FaReact,
  nodejs: FaNodeJs,
  javascript: FaJsSquare,
  git: FaGit,
  kubernetes: SiKubernetes,
  oraclecloud: SiOracle,
  gcp: SiGooglecloud,
  digitalocean: SiDigitalocean,
  antigravity: FaRocket,
  iadeveloper: FaBrain,
  automation: FaRobot,
};

function TypingText({ text, speed = 25 }) {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    let index = 0;
    setDisplayedText('');
    
    const interval = setInterval(() => {
      setDisplayedText((prev) => {
        const nextChar = text.charAt(index);
        index++;
        if (index >= text.length) {
          clearInterval(interval);
        }
        return prev + nextChar;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return <span>{displayedText}</span>;
}

function ClaraChatSimulator({ language }) {
  const [messages, setMessages] = useState([]);
  
  const scriptPT = [
    { sender: 'patient', text: 'Olá! Gostaria de agendar uma consulta com o Dr. Lucas.' },
    { sender: 'clara', text: 'Olá! Claro, posso te ajudar. Temos horários livres nesta quinta às 14h ou sexta às 10h. Qual prefere?' },
    { sender: 'patient', text: 'Quero na sexta às 10h, por favor!' },
    { sender: 'clara', text: 'Perfeito! Agendamento confirmado para sexta às 10:00. Já sincronizei com Clinicorp e enviei seu lembrete. Até logo! 📅' }
  ];

  const scriptEN = [
    { sender: 'patient', text: 'Hello! I would like to book an appointment with Dr. Lucas.' },
    { sender: 'clara', text: 'Hi! Sure, I can help you. We have openings this Thursday at 2 PM or Friday at 10 AM. Which one do you prefer?' },
    { sender: 'patient', text: 'Friday at 10 AM, please!' },
    { sender: 'clara', text: 'Excellent! Appointment confirmed for Friday at 10:00 AM. Synced with Clinicorp and calendar invitation sent. See you soon! 📅' }
  ];

  const script = language === 'pt' ? scriptPT : scriptEN;

  useEffect(() => {
    setMessages([]);
    let currentMsgIndex = 0;
    
    const timer1 = setTimeout(() => {
      setMessages([script[0]]);
      currentMsgIndex = 1;
      
      const interval = setInterval(() => {
        if (currentMsgIndex < script.length) {
          setMessages(prev => [...prev, script[currentMsgIndex]]);
          currentMsgIndex++;
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setMessages([]);
          }, 3000);
        }
      }, 3000);
      
      return () => clearInterval(interval);
    }, 1000);

    return () => clearTimeout(timer1);
  }, [language, script]);

  return (
    <ClaraChatWindow>
      <ClaraChatHeader>
        CLARA_IA_ROUTING_NODE
      </ClaraChatHeader>
      <ClaraChatBody>
        {messages.length === 0 && (
          <div style={{ color: '#005e0d', fontStyle: 'italic', fontSize: '0.85em', textAlign: 'center', margin: 'auto' }}>
            {language === 'pt' ? 'ESTABELECENDO CANAL SEGURO...' : 'ESTABLISHING SECURE CHANNEL...'}
          </div>
        )}
        {messages.map((msg, index) => (
          <ClaraChatMessage key={index} className={msg.sender}>
            <strong>{msg.sender === 'patient' ? (language === 'pt' ? 'Paciente: ' : 'Patient: ') : 'Clara AI: '}</strong>
            {msg.text}
          </ClaraChatMessage>
        ))}
      </ClaraChatBody>
    </ClaraChatWindow>
  );
}

function App() {
  const [avatarimg] = useState('https://i.ibb.co/XkvSFmbh/E2-B95-B01-6545-426-C-9850-B00-D20-F701-E3.jpg');
  const [username, setUsername] = useState('lucascardev');
  const [repos, setRepos] = useState([]);
  const [language, setLanguage] = useState('en');
  const [terminalInput, setTerminalInput] = useState('');
  const [history, setHistory] = useState([]);
  const [showPacman, setShowPacman] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);
  const contributions = contributionsData.contributions || [];
  const totalContributions = contributionsData.total || 0;

  const historyEndRef = useRef(null);

  const techProjectCounts = React.useMemo(() => {
    const counts = {
      typescript: 0,
      javascript: 0,
      html5: 0,
      css3: 0,
      docker: 0,
      react: 0,
      nodejs: 0,
      git: repos.length,
      kubernetes: 0,
      oraclecloud: 0,
      gcp: 0,
      digitalocean: 0,
      antigravity: 0,
      iadeveloper: 0,
      automation: 0
    };

    repos.forEach((r) => {
      const name = (r.name || '').toLowerCase();
      const desc = (r.description || '').toLowerCase();
      const lang = (r.language || '').toLowerCase();

      if (lang === 'typescript') counts.typescript++;
      if (lang === 'javascript') counts.javascript++;
      if (lang === 'html') counts.html5++;
      if (lang === 'css') counts.css3++;

      if (name.includes('docker') || desc.includes('docker') || name.includes('container') || desc.includes('container')) counts.docker++;
      if (name.includes('react') || desc.includes('react') || name.includes('nextjs') || desc.includes('nextjs') || name.includes('next.js') || desc.includes('next.js')) counts.react++;
      if (name.includes('node') || desc.includes('node') || name.includes('backend') || desc.includes('backend') || name.includes('express') || desc.includes('express')) counts.nodejs++;
      if (name.includes('kubernetes') || desc.includes('kubernetes') || name.includes('k8s') || desc.includes('k8s')) counts.kubernetes++;
      if (name.includes('gcp') || desc.includes('gcp') || name.includes('google cloud') || desc.includes('google cloud') || name.includes('firebase') || desc.includes('firebase') || name.includes('vertex') || desc.includes('vertex')) counts.gcp++;
      if (name.includes('oracle') || desc.includes('oracle') || name.includes('oci') || desc.includes('oci')) counts.oraclecloud++;
      if (name.includes('digital') || desc.includes('digital') || name.includes('digitalocean') || desc.includes('digitalocean')) counts.digitalocean++;
      if (name.includes('antigravity') || desc.includes('antigravity') || name.includes('gemini') || desc.includes('gemini') || name.includes('agentic') || desc.includes('agentic')) counts.antigravity++;
      if (name.includes('ai') || desc.includes('ai') || name.includes('ia') || desc.includes('ia') || name.includes('chatbot') || desc.includes('chatbot') || name.includes('clara') || desc.includes('clara') || name.includes('gpt') || desc.includes('gpt') || name.includes('gemini') || desc.includes('gemini') || name.includes('vertex') || desc.includes('vertex')) counts.iadeveloper++;
      if (name.includes('automation') || desc.includes('automation') || name.includes('task') || desc.includes('task') || name.includes('cron') || desc.includes('cron') || name.includes('sync') || desc.includes('sync') || name.includes('script') || desc.includes('script') || name.includes('workflow') || desc.includes('workflow')) counts.automation++;
    });

    return counts;
  }, [repos]);

  const getDynamicBio = (lang) => {
    const totalRepos = repos.length;
    const tsRepos = repos.filter(r => r.language === 'TypeScript').length;
    const jsRepos = repos.filter(r => r.language === 'JavaScript').length;
    
    if (lang === 'pt') {
      return [
        'Nome: Lucas Matheus Cardoso',
        'Grau: Bacharel em Sistemas de Informação - Estácio de Sá',
        `Projetos Públicos no GitHub: ${totalRepos} repositórios`,
        `Foco Tecnológico: TypeScript (${tsRepos} projetos) & JavaScript (${jsRepos} projetos)`,
        'Biografia:',
        '  Desenvolvedor Fullstack com +6 anos de experiência consolidada criando aplicações',
        '  web escaláveis e de alta performance. Especialista no ecossistema JavaScript/TypeScript,',
        '  com foco em arquiteturas robustas em React/Next.js no frontend e Node.js no backend.',
        '  Proficiente em modelagem de APIs multi-tenant, integração de microsserviços e',
        '  sistemas inteligentes como a assistente Clara IA (clara-ia.online). Praticante de',
        '  Clean Code, DevOps (Kubernetes/Cloud) e metodologias ágeis.'
      ];
    }
    return [
      'Name: Lucas Matheus Cardoso',
      'Degree: Bachelor of Information Systems - Estácio University',
      `Public GitHub Projects: ${totalRepos} repositories`,
      `Core Tech Stack: TypeScript (${tsRepos} projects) & JavaScript (${jsRepos} projects)`,
      'Biography:',
      '  Fullstack Software Engineer with +6 years of professional experience building',
      '  scalable, high-performance web applications. Specialized in the JavaScript/TypeScript',
      '  ecosystem, designing robust architectures with React/Next.js on the frontend',
      '  and Node.js on the backend. Experienced in multi-tenant system design, microservices',
      '  integration, and intelligent automation systems like Clara IA (clara-ia.online).',
      '  Dedicated to Clean Code principles, DevOps, and agile practices.'
    ];
  };

  const getStatusText = () => {
    if (!hoveredTech) {
      return language === 'pt'
        ? 'DETECTOR_DE_EXPERIENCIA: AGUARDANDO_SELECAO...'
        : 'EXPERIENCE_DETECTOR: STANDBY_INPUT...';
    }
    const years = parseInt(hoveredTech.experience);
    const yearsText = language === 'pt' 
      ? `${years} ${years === 1 ? 'ANO' : 'ANOS'}`
      : `${years} ${years === 1 ? 'YEAR' : 'YEARS'}`;
    
    const count = techProjectCounts[hoveredTech.id] || 0;
    const projectText = language === 'pt'
      ? `${count} ${count === 1 ? 'PROJETO DETECTADO' : 'PROJETOS DETECTADOS'}`
      : `${count} ${count === 1 ? 'PROJECT DETECTED' : 'PROJECTS DETECTED'}`;
      
    if (language === 'pt') {
      return `DECRIPTANDO: ${hoveredTech.name.toUpperCase()} -> ${yearsText} DE EXP. // ${projectText}`;
    }
    return `DECRYPTING: ${hoveredTech.name.toUpperCase()} -> ${yearsText} OF EXP. // ${projectText}`;
  };

  useEffect(() => {
    async function getmyprofile() {
      try {
        const response = await API.get('users/lucascardev');
        const repos_response = await API.get('users/lucascardev/repos');
        setRepos(repos_response.data);
        setUsername(response.data.login || 'lucascardev');
      } catch (e) {
        console.error('Error fetching data from github API', e);
      }
    }
    getmyprofile();
  }, []);

  const renderContributionsGrid = () => {
    if (!contributions || contributions.length === 0) {
      return (
        <div style={{ color: '#008f11', fontStyle: 'italic', textAlign: 'center', fontSize: '0.9em', padding: '20px 0' }}>
          {language === 'pt' ? 'CARREGANDO DADOS DE CONTRIBUIÇÃO...' : 'LOADING CONTRIBUTION STREAM...'}
        </div>
      );
    }

    let targetLength = 371;
    let sliceConts = contributions;
    if (contributions.length > targetLength) {
      sliceConts = contributions.slice(-targetLength);
    } else if (contributions.length < targetLength) {
      const padding = Array.from({ length: targetLength - contributions.length }, () => ({
        date: '',
        count: 0,
        level: 0
      }));
      sliceConts = [...padding, ...contributions];
    }

    const weeks = [];
    for (let i = 0; i < sliceConts.length; i += 7) {
      weeks.push(sliceConts.slice(i, i + 7));
    }

    const monthHeaders = [];
    let prevMonth = '';
    
    weeks.forEach((week, weekIdx) => {
      const firstDayWithDate = week.find(d => d.date);
      if (firstDayWithDate) {
        const parts = firstDayWithDate.date.split('-');
        if (parts.length === 3) {
          const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
          const monthName = dateObj.toLocaleString(language === 'pt' ? 'pt-BR' : 'en-US', { month: 'short' });
          if (monthName !== prevMonth) {
            monthHeaders.push(
              <div 
                key={weekIdx} 
                style={{ 
                  gridColumnStart: weekIdx + 1, 
                  gridColumnEnd: weekIdx + 3,
                  whiteSpace: 'nowrap'
                }}
              >
                {monthName}
              </div>
            );
            prevMonth = monthName;
          }
        }
      }
    });

    return (
      <CalendarContainer>
        <MonthLabelsContainer>
          {monthHeaders}
        </MonthLabelsContainer>
        
        <CalendarGrid>
          <WeekdayLabels>
            <div></div>
            <div>Mon</div>
            <div></div>
            <div>Wed</div>
            <div></div>
            <div>Fri</div>
            <div></div>
          </WeekdayLabels>
          
          {weeks.map((week, weekIdx) => 
            week.map((day, dayIdx) => {
              const tooltipText = day.date
                ? `${day.count} ${day.count === 1 ? (language === 'pt' ? 'contribuição em' : 'contribution on') : (language === 'pt' ? 'contribuições em' : 'contributions on')} ${day.date}`
                : (language === 'pt' ? 'Sem dados' : 'No data');
                
              return (
                <CalendarCell 
                  key={`${weekIdx}-${dayIdx}`} 
                  level={day.level} 
                  title={tooltipText}
                />
              );
            })
          )}
        </CalendarGrid>
      </CalendarContainer>
    );
  };

  // Detect and set browser language
  useEffect(() => {
    const detectLanguage = () => {
      const userLanguage = navigator.language || navigator.userLanguage;
      const lang = userLanguage.startsWith('pt') ? 'pt' : 'en';
      setLanguage(lang);
      
      // Initialize history with correct language
      setHistory(getInitialHistory(lang));
    };

    detectLanguage();
    window.addEventListener('languagechange', detectLanguage);
    return () => {
      window.removeEventListener('languagechange', detectLanguage);
    };
  }, []);

  // Scroll to bottom of terminal
  useEffect(() => {
    if (historyEndRef.current) {
      historyEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, showPacman]);

  const getInitialHistory = (lang) => {
    return lang === 'pt'
      ? [
          { type: 'info', text: 'INICIANDO PROTOCOLO DE CONEXÃO SYSTEM@LUCASCARDEV...' },
          { type: 'info', text: 'ESTADO: SEGURO // PORTA: 443 // IP: 127.0.0.1' },
          { type: 'info', text: 'Digite "ajuda" para listar os comandos disponíveis.' },
          { type: 'output', text: '------------------------------------------------------------' },
          { type: 'output', text: 'LUCAS MATHEUS // DESENVOLVEDOR FULLSTACK' },
          { type: 'output', text: 'Mais de 6 anos de experiência codificando soluções inovadoras.' },
          { type: 'output', text: '------------------------------------------------------------' },
        ]
      : [
          { type: 'info', text: 'INITIALIZING SYSTEM@LUCASCARDEV CONNECTION PROTOCOL...' },
          { type: 'info', text: 'STATUS: SECURE // PORT: 443 // IP: 127.0.0.1' },
          { type: 'info', text: 'Type "help" to list all available commands.' },
          { type: 'output', text: '------------------------------------------------------------' },
          { type: 'output', text: 'LUCAS MATHEUS // FULLSTACK SOFTWARE DEVELOPER' },
          { type: 'output', text: 'Over 6 years of experience coding innovative digital systems.' },
          { type: 'output', text: '------------------------------------------------------------' },
        ];
  };

  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const command = terminalInput.trim();
    if (!command) return;

    const cleaned = command.toLowerCase();
    const newHistory = [...history, { type: 'input', text: command }];
    let outputLines = [];
    let isError = false;

    if (cleaned === 'help' || cleaned === 'ajuda') {
      outputLines = language === 'pt' ? [
        'Comandos Disponíveis:',
        '  ajuda | help       - Exibe este menu de ajuda.',
        '  sobre | bio        - Imprime minha biografia e trajetória.',
        '  clara | clara-ia   - Detalhes do meu projeto principal, Clara IA.',
        '  projetos | ls      - Lista os projetos e repositórios do GitHub.',
        '  projetos -a        - Lista todos os projetos disponíveis.',
        '  contato | contact  - Mostra meus canais de contato e e-mail.',
        '  jogar | pacman     - Inicia a simulação 3D Pacman.',
        '  sistema | specs    - Exibe informações técnicas da aplicação.',
        '  limpar | clear     - Limpa o console de comando.'
      ] : [
        'Available Commands:',
        '  help | ajuda       - Display this help menu.',
        '  bio | sobre        - Show my professional biography.',
        '  clara | clara-ia   - Show specs of my featured project, Clara IA.',
        '  projects | ls      - List GitHub repositories & stars.',
        '  projects -a        - List all available repositories.',
        '  contact | contato  - Display contact channels and email.',
        '  pacman | play      - Boot up the interactive 3D Pacman game.',
        '  specs | sistema    - Display application technical specs.',
        '  clear | limpar     - Clear the terminal console.'
      ];
    } else if (cleaned === 'bio' || cleaned === 'sobre') {
      outputLines = getDynamicBio(language);
    } else if (cleaned === 'clara' || cleaned === 'clara-ia') {
      outputLines = language === 'pt' ? [
        'PROJETO DESTACADO: CLARA IA (clara-ia.online)',
        '------------------------------------------------------------',
        'Descrição: Recepcionista e Assistente Virtual inteligente com IA para WhatsApp.',
        'Funcionalidades Principais:',
        '  * Atendimento inteligente e agendamentos automáticos 24 horas por dia.',
        '  * Lembretes ativos de presença que reduzem o no-show de pacientes.',
        '  * Sincronização em tempo real com Clinicorp e Google Calendar.',
        'Ações Disponíveis:',
        { type: 'output', text: (
          <span>
            * Abrir Website Oficial: <a href="https://clara-ia.online" target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>https://clara-ia.online</a>
          </span>
        )},
        { type: 'output', text: (
          <span>
            * Testar Clara no WhatsApp: <a href="https://wa.me/5571987632774?text=Olá!%20Gostaria%20de%20testar%20a%20Clara!" target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>wa.me/5571987632774</a>
          </span>
        )}
      ] : [
        'FEATURED PROJECT: CLARA IA (clara-ia.online)',
        '------------------------------------------------------------',
        'Description: Intelligent virtual receptionist and AI scheduling assistant for WhatsApp.',
        'Core Features:',
        '  * Real-time automated scheduling and natural chats 24/7.',
        '  * Active reminders sent on WhatsApp reducing patient no-shows.',
        '  * Secure, real-time sync with Clinicorp and Google Calendar.',
        'Available Actions:',
        { type: 'output', text: (
          <span>
            * Open Official Website: <a href="https://clara-ia.online" target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>https://clara-ia.online</a>
          </span>
        )},
        { type: 'output', text: (
          <span>
            * Demo Clara on WhatsApp: <a href="https://wa.me/5571987632774?text=Hello!%20I%20would%20like%20to%20test%20Clara." target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>wa.me/5571987632774</a>
          </span>
        )}
      ];
    } else if (cleaned === 'projects' || cleaned === 'ls' || cleaned === 'projetos') {
      if (repos.length === 0) {
        outputLines = [
          { type: 'output', text: '[!] Connecting to GitHub servers...' },
          { type: 'output', text: 'No repositories found.' }
        ];
      } else {
        const slicedRepos = repos.slice(0, 8);
        outputLines = [
          { type: 'output', text: `FOUND ${repos.length} REPOSITORIES AT GITHUB://LUCASCARDEV:` },
          { type: 'output', text: '------------------------------------------------------------' },
          ...slicedRepos.map((r) => ({
            type: 'output',
            text: (
              <span>
                * [{r.language || 'HTML/JS'}]{' '}
                <a href={r.html_url} target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>
                  {r.name}
                </a>{' '}
                - ⭐ {r.stargazers_count} | Forks: {r.forks_count}
              </span>
            )
          })),
          repos.length > 8 
            ? { type: 'output', text: `... and ${repos.length - 8} more. Type 'projects -a' to see all.` }
            : null
        ].filter(Boolean);
      }
    } else if (cleaned === 'projects -a' || cleaned === 'projetos -a' || cleaned === 'ls -a') {
      if (repos.length === 0) {
        outputLines = [
          { type: 'output', text: '[!] Connecting to GitHub servers...' },
          { type: 'output', text: 'No repositories found.' }
        ];
      } else {
        outputLines = [
          { type: 'output', text: `FOUND ALL ${repos.length} REPOSITORIES AT GITHUB://LUCASCARDEV:` },
          { type: 'output', text: '------------------------------------------------------------' },
          ...repos.map((r) => ({
            type: 'output',
            text: (
              <span>
                * [{r.language || 'HTML/JS'}]{' '}
                <a href={r.html_url} target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>
                  {r.name}
                </a>{' '}
                - ⭐ {r.stargazers_count} | Forks: {r.forks_count}
              </span>
            )
          }))
        ];
      }
    } else if (cleaned === 'contact' || cleaned === 'contato') {
      outputLines = [
        { type: 'output', text: 'CONTACT_NODES // OPEN CHANNELS:' },
        { type: 'output', text: '---------------------------------------' },
        { type: 'output', text: '  Email:       lucasmatheussc97@gmail.com' },
        {
          type: 'output',
          text: (
            <span>
              {language === 'pt' ? '  WhatsApp:    ' : '  WhatsApp:    '}
              <a href="https://wa.me/5571992931330?text=Olá!%20Achei%20seu%20contato%20através%20do%20seu%20portfólio." target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>
                +55 (71) 99293-1330
              </a>
            </span>
          )
        },
        { type: 'output', text: '  LinkedIn:    https://www.linkedin.com/in/lucascardev' },
        { type: 'output', text: '  Instagram:   @lucas_mtheus' },
        { type: 'output', text: '               @lightup.marketingdigital' }
      ];
    } else if (cleaned === 'pacman' || cleaned === 'play' || cleaned === 'jogar') {
      setShowPacman(true);
      outputLines = language === 'pt' 
        ? ['[SUCCESS] Iniciando Pacman 3D no console...', 'Pressione "pacman -stop" para fechar o simulador.']
        : ['[SUCCESS] Booting 3D Pacman Simulation inside console...', 'Type "pacman -stop" to shut down simulation.'];
    } else if (cleaned === 'pacman -stop') {
      setShowPacman(false);
      outputLines = ['[SUCCESS] Shutting down simulation container.'];
    } else if (cleaned === 'clear' || cleaned === 'limpar') {
      setHistory([]);
      setTerminalInput('');
      return;
    } else if (cleaned === 'neofetch' || cleaned === 'specs' || cleaned === 'sistema') {
      outputLines = [
        '               ,        LUCASCARDEV@PORTFOLIO',
        '              / \\       ---------------------',
        '             /   \\      OS: Linux (Workspace Env)',
        '            /     \\     Host: React SPA Terminal Node',
        '           /       \\    Kernel: React 17.0.2',
        '          /________/\\   Uptime: Active Session',
        '          \\        \\/   Shell: Bash Emulator v1.2',
        '           \\   ()   \\   Resolution: WebGL Responsive',
        '            \\        \\  ThreeJS: v0.139.2',
        '             \\      /   Styled-Components: v5.3.11',
        '              \\    /    Language Node: ' + language.toUpperCase(),
        '               \\  /     ASCII decoder: ACTIVE (res=50)',
        '                \\/      ',
      ];
    } else {
      isError = true;
      outputLines = language === 'pt'
        ? [`Comando não reconhecido: "${command}". Digite "ajuda" para ajuda.` ]
        : [`Command not recognized: "${command}". Type "help" for a list of commands.`];
    }

    // Adapt output to state history array (handles both elements and string structures)
    const formattedOutputs = outputLines.map((line) => {
      if (typeof line === 'object' && line.text !== undefined) {
        return line; // Already formatted { type, text }
      }
      return {
        type: isError ? 'error' : 'output',
        text: line,
      };
    });

    setHistory([...newHistory, ...formattedOutputs]);
    setTerminalInput('');
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'pt' : 'en';
    setLanguage(nextLang);
    setHistory([
      ...history,
      { type: 'info', text: nextLang === 'pt' ? 'ALTERANDO IDIOMA PARA PORTUGUÊS...' : 'SWITCHING LANGUAGE TO ENGLISH...' },
      ...getInitialHistory(nextLang)
    ]);
  };

  return (
    <Container>
      <Scanlines />
      <MatrixRain3D />

      <Header>
        <Gitinfo>
          <Avatar src={avatarimg || 'https://avatars.githubusercontent.com/u/35515714?v=4'} alt="Lucas Cardoso" />
          <div>
            <Username>
              <a href="https://github.com/lucascardev" target="_blank" rel="noreferrer">
                @{username}
              </a>
            </Username>
            <div className="github-hint">
              <FaTerminal /> SECURE PORTFOLIO GATEWAY <FaTerminal />
            </div>
          </div>
        </Gitinfo>

        <Contact>
          <p>
            <b>WPP:</b> <a href="https://wa.me/5571992931330?text=Olá!%20Achei%20seu%20contato%20através%20do%20seu%20portfólio." target="_blank" rel="noreferrer">+55(71)99293-1330</a>
          </p>
          <p>
            <b>EMAIL:</b> <a href="mailto:lucasmatheussc97@gmail.com">lucasmatheussc97@gmail.com</a>
          </p>
        </Contact>

        <HeaderTechs>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TechsMarqueeContainer>
              <TechsTrack>
                {[...techsData, ...techsData].map((tech, index) => {
                  const IconComponent = ICON_MAP[tech.id];
                  if (!IconComponent) return null;
                  return (
                    <TechItem 
                      key={`${tech.id}-${index}`}
                      onMouseEnter={() => setHoveredTech(tech)}
                      onMouseLeave={() => setHoveredTech(null)}
                    >
                      <IconComponent />
                      <TechTooltip className="tech-tooltip">
                        {tech.name}: {tech.experience} ({techProjectCounts[tech.id] || 0} {language === 'pt' ? 'repos' : 'repos'})
                      </TechTooltip>
                    </TechItem>
                  );
                })}
              </TechsTrack>
            </TechsMarqueeContainer>
            <FaGlobe 
              title={language === 'en' ? 'Switch to Portuguese' : 'Mudar para Inglês'} 
              onClick={toggleLanguage} 
              style={{ marginLeft: '16px', color: '#ffb000', cursor: 'pointer', fontSize: '1.3em' }}
            />
          </div>
          <TechExperienceDisplay>
            <TypingText text={getStatusText()} />
            <BlinkingCursor />
          </TechExperienceDisplay>
        </HeaderTechs>
      </Header>

      <PageHolder>
        {/* Left Side: Hacker Terminal Console */}
        <Main>
          <h1>
            <FaTerminal style={{ marginRight: '10px' }} />
            SYSTEM_SHELL_EMULATOR.sh
          </h1>
          
          <CommandHistory>
            {history.map((h, i) => (
              <CommandRow key={i} className={h.type}>
                {h.type === 'input' && <PromptLabel>lucascardev@system:~$</PromptLabel>}
                {h.text}
              </CommandRow>
            ))}
            <div ref={historyEndRef} />
          </CommandHistory>

          {showPacman && (
            <div style={{ marginTop: '15px', border: '1px solid #00ff41', padding: '10px', borderRadius: '4px', background: '#000', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8em', color: '#00ff41', padding: '0 4px' }}>
                <span>SIMULADOR_3D_PACMAN.EXE (MATRIX WIREFRAME EDITION)</span>
                <button 
                  onClick={() => setShowPacman(false)}
                  style={{ background: 'transparent', border: '1px solid #00ff41', color: '#00ff41', fontSize: '0.8em', cursor: 'pointer', padding: '2px 6px' }}
                >
                  STOP
                </button>
              </div>
              <Pacman3D />
            </div>
          )}

          <TerminalInputLine onSubmit={handleCommandSubmit}>
            <PromptLabel>lucascardev@system:~$</PromptLabel>
            <CustomInput
              type="text"
              value={terminalInput}
              onChange={(e) => setTerminalInput(e.target.value)}
              placeholder={language === 'pt' ? 'Digite um comando... (ex: "ajuda")' : 'Type a command... (ex: "help")'}
              autoFocus
            />
          </TerminalInputLine>
        </Main>

        {/* Right Side: ASCII Photo only (toggles and controls removed, photo max-width increased) */}
        <SidePanel>
          <TerminalWrapper title="AVATAR_IMAGE_DECODER">
            <AsciiArt
              src={avatarimg || 'https://avatars.githubusercontent.com/u/35515714?v=4'}
              resolution={50}
              color="#00ff41"
              animationStyle="matrix"
              inverted={false}
              animateOnView={false}
              className="aspect-square w-full mx-auto rounded border border-green-950"
            />
          </TerminalWrapper>

          <TerminalWrapper title="FEATURED_PROJECT: CLARA_IA">
            <ClaraShowcase>
              <ClaraTitle>
                CLARA IA
                <ClaraTag>{language === 'pt' ? 'ATIVO' : 'ONLINE'}</ClaraTag>
              </ClaraTitle>
              <p style={{ margin: '4px 0 8px 0', fontSize: '0.85em', color: '#d2f8d2', lineHeight: '1.4' }}>
                {language === 'pt' 
                  ? 'Recepcionista e Assistente Virtual inteligente integrada ao WhatsApp para Clínicas e Consultórios.' 
                  : 'Intelligent AI-powered virtual receptionist and scheduling assistant integrated with WhatsApp for health clinics.'}
              </p>
              <ClaraBadgeList>
                <ClaraBadge>WhatsApp API</ClaraBadge>
                <ClaraBadge>Clinicorp Sync</ClaraBadge>
                <ClaraBadge>Google Calendar</ClaraBadge>
                <ClaraBadge>AI Scheduling</ClaraBadge>
              </ClaraBadgeList>
              <ClaraFeatureList>
                <li>
                  {language === 'pt' 
                    ? 'Agendamentos inteligentes via WhatsApp 24h' 
                    : 'Smart 24/7 client booking on WhatsApp'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'Confirmação ativa de presença reduz faltas' 
                    : 'Active attendance confirmations reduces no-shows'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'Sincronização Clinicorp e Google Agenda' 
                    : 'Clinicorp and Google Calendar sync'}
                </li>
              </ClaraFeatureList>
              <ClaraButtonList>
                <ClaraButton 
                  href="https://clara-ia.online" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="secondary"
                >
                  {language === 'pt' ? 'Ver Site' : 'View Site'}
                </ClaraButton>
                <ClaraButton 
                  href="https://wa.me/5571987632774?text=Olá!%20Gostaria%20de%20testar%20a%20Clara!" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="primary"
                >
                  {language === 'pt' ? 'Testar IA' : 'Test AI'}
                </ClaraButton>
              </ClaraButtonList>
              
              <ClaraChatSimulator language={language} />
            </ClaraShowcase>
          </TerminalWrapper>

          <TerminalWrapper title="FEATURED_PROJECT: PSY_REPORT">
            <ProjectShowcase>
              <ProjectTitle>
                PSYREPORT AUTO
                <ProjectTag>{language === 'pt' ? 'ATIVO' : 'ONLINE'}</ProjectTag>
              </ProjectTitle>
              <p style={{ margin: '4px 0 8px 0', fontSize: '0.85em', color: '#d2f8d2', lineHeight: '1.4' }}>
                {language === 'pt' 
                  ? 'Sistema completo e ágil para psicólogos gerenciarem relatórios de sessões e emitirem recibos profissionais com assinatura digital, sincronizado com o Google Sheets.' 
                  : 'Complete system for psychologists to manage session reports and professional receipts with digital signatures, synced with Google Sheets.'}
              </p>
              <ProjectBadgeList>
                <ProjectBadge>React (Vite)</ProjectBadge>
                <ProjectBadge>Firebase Auth</ProjectBadge>
                <ProjectBadge>Google Sheets API</ProjectBadge>
                <ProjectBadge>Tailwind CSS</ProjectBadge>
                <ProjectBadge>jsPDF</ProjectBadge>
                <ProjectBadge>driver.js</ProjectBadge>
              </ProjectBadgeList>
              <ProjectFeatureList>
                <li>
                  {language === 'pt' 
                    ? 'Autenticação Google Workspace via Firebase' 
                    : 'Google Workspace Login via Firebase'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'Sincronização bidirecional com Google Sheets' 
                    : 'Two-way sync with Google Sheets'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'Assinatura digital integrada e geração de PDFs' 
                    : 'Integrated digital signatures and PDF export'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'Histórico completo com controle de vouchers/créditos' 
                    : 'Full session history with vouchers/credits system'}
                </li>
              </ProjectFeatureList>
              <ProjectButtonList>
                <ProjectButton 
                  href="https://psy-report.vercel.app/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="primary"
                  style={{ gridColumn: 'span 2' }}
                >
                  {language === 'pt' ? 'Acessar Plataforma' : 'Access Platform'}
                </ProjectButton>
              </ProjectButtonList>
            </ProjectShowcase>
          </TerminalWrapper>

          <TerminalWrapper title="FEATURED_PROJECT: CAPINHAS_BRAZIL">
            <ProjectShowcase>
              <ProjectTitle>
                CONECTALINK
                <ProjectTag>{language === 'pt' ? 'ATIVO' : 'ONLINE'}</ProjectTag>
              </ProjectTitle>
              <p style={{ margin: '4px 0 8px 0', fontSize: '0.85em', color: '#d2f8d2', lineHeight: '1.4' }}>
                {language === 'pt' 
                  ? 'Catálogo comparador de preços de capinhas de celular para marketing de afiliados. Monitora automaticamente preços no Mercado Livre, Shopee e AliExpress.' 
                  : 'Affiliate marketing price comparison catalog for phone cases. Automatically crawls and monitors prices on Mercado Livre, Shopee, and AliExpress.'}
              </p>
              <ProjectBadgeList>
                <ProjectBadge>Next.js</ProjectBadge>
                <ProjectBadge>Supabase (Postgres)</ProjectBadge>
                <ProjectBadge>Clerk Auth</ProjectBadge>
                <ProjectBadge>Playwright</ProjectBadge>
                <ProjectBadge>Browserless.io</ProjectBadge>
                <ProjectBadge>Tailwind CSS</ProjectBadge>
              </ProjectBadgeList>
              <ProjectFeatureList>
                <li>
                  {language === 'pt' 
                    ? 'Agrupamento automático de ofertas idênticas' 
                    : 'Automatic grouping of identical offers'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'Scraper automatizado via Playwright & Browserless.io' 
                    : 'Automated crawler using Playwright & Browserless.io'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'Bypass de anti-bot do Mercado Livre e Shopee' 
                    : 'Mercado Livre & Shopee anti-bot stealth bypass'}
                </li>
                <li>
                  {language === 'pt' 
                    ? 'API Cron no Vercel para atualização em lote' 
                    : 'Vercel Cron API for batch price updates'}
                </li>
              </ProjectFeatureList>
              <ProjectButtonList>
                <ProjectButton 
                  href="https://capinhasbrazil.vercel.app/" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="primary"
                  style={{ gridColumn: 'span 2' }}
                >
                  {language === 'pt' ? 'Acessar Comparador' : 'Access Catalog'}
                </ProjectButton>
              </ProjectButtonList>
            </ProjectShowcase>
          </TerminalWrapper>

          <TerminalWrapper title="LINKS_&_DOWNLOADS">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <LinkHolder style={{ margin: 0 }}>
                <a href="https://github.com/lucascardev" target="_blank" rel="noreferrer" title="GitHub">
                  <FaGithub />
                </a>
                <a href="https://www.linkedin.com/in/lucascardev" target="_blank" rel="noreferrer" title="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="https://www.instagram.com/lucas_mtheus/" target="_blank" rel="noreferrer" title="Instagram Developer">
                  <FaInstagram />
                </a>
              </LinkHolder>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <a 
                  href={`${process.env.PUBLIC_URL}/assets/lucascardev-cv-en.pdf`} 
                  download 
                  style={{ textDecoration: 'none' }}
                >
                  <CyberButton as="span" style={{ display: 'inline-block', fontSize: '0.8em', padding: '8px 12px' }}>
                    {language === 'pt' ? 'Download CV (EN)' : 'Download CV (EN)'}
                  </CyberButton>
                </a>
                <a 
                  href={`${process.env.PUBLIC_URL}/assets/lucascardev-cv-pt.pdf`} 
                  download 
                  style={{ textDecoration: 'none' }}
                >
                  <CyberButton as="span" style={{ display: 'inline-block', fontSize: '0.8em', padding: '8px 12px' }}>
                    {language === 'pt' ? 'Download CV (PT)' : 'Download CV (PT)'}
                  </CyberButton>
                </a>
              </div>
            </div>
          </TerminalWrapper>
        </SidePanel>
      </PageHolder>

      <ContributionsWrapper title="GITHUB_CONTRIBUTIONS_STREAM">
        <ContributionsTitle>
          <span>{totalContributions}</span> {language === 'pt' ? 'contribuições no último ano' : 'contributions in the last year'}
        </ContributionsTitle>
        {renderContributionsGrid()}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px', flexWrap: 'wrap', gap: '8px' }}>
          <a 
            href="https://github.com/lucascardev" 
            target="_blank" 
            rel="noreferrer" 
            style={{ fontSize: '9px', color: '#008f11', textDecoration: 'underline', fontFamily: "'Share Tech Mono', monospace" }}
          >
            {language === 'pt' ? 'Saiba como as contribuições são contadas' : 'Learn how we count contributions'}
          </a>
          <CalendarLegend style={{ margin: 0, padding: 0 }}>
            <span>{language === 'pt' ? 'Menos' : 'Less'}</span>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: 'rgba(0, 255, 65, 0.04)', border: '1px solid rgba(0, 255, 65, 0.03)' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#003b00' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#005e0d' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#008f11' }}></div>
            <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: '#00ff41' }}></div>
            <span>{language === 'pt' ? 'Mais' : 'More'}</span>
          </CalendarLegend>
        </div>
      </ContributionsWrapper>

      <Footer>
        <p>
          SYSTEM CONSOLE {'//'} COMPILED VIA{' '}
          <a href="https://pages.github.com/" target="_blank" rel="noreferrer">
            GITHUB PAGES SERVER
          </a>{' '}
          {'//'} ALL RIGHTS RESERVED
        </p>
      </Footer>
      
      {!showPacman && (
        <FloatingWhatsApp 
          href="https://wa.me/5571992931330?text=Olá!%20Achei%20seu%20contato%20através%20do%20seu%20portfólio." 
          target="_blank" 
          rel="noreferrer"
          title={language === 'pt' ? 'Fale Comigo no WhatsApp' : 'Chat with me on WhatsApp'}
        >
          <FaWhatsapp />
        </FloatingWhatsApp>
      )}

      <style>{`
        @keyframes scanline {
          0% { top: 0%; }
          100% { top: 100%; }
        }
      `}</style>
    </Container>
  );
}

export default App;