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
  FaUserTie,
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
  TerminalAsciiBackground,
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
  ProjectShowcase,
  ProjectTitle,
  ProjectTag,
  ProjectBadgeList,
  ProjectBadge,
  ProjectFeatureList,
  ProjectButtonList,
  ProjectButton,
  HeaderTechs,
  PosterSimulatorWindow,
  PosterSimulatorHeader,
  PosterSimulatorBody,
  PosterControls,
  PosterGridBtnGroup,
  PosterGridBtn,
  PosterGridArea,
  PosterTile,
  PosterStatusBar,
  ContributionsWrapper,
  ContributionsTitle,
  CalendarContainer,
  CalendarGrid,
  WeekdayLabels,
  MonthLabelsContainer,
  CalendarCell,
  CalendarLegend,
  ModeSwitchContainer,
  ModeSwitchButton,
  LanguagePill,
} from './style/global.style';

import NormalResume from './components/NormalResume';
import API from './services/api';
import techsData from './services/techs.json';
import contributionsData from './services/contributions.json';
import { version } from '../package.json';

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

function PosterGridSimulator({ language }) {
  const [gridSize, setGridSize] = useState({ rows: 2, cols: 2 });
  const [activeTile, setActiveTile] = useState(null);

  const totalPages = gridSize.rows * gridSize.cols;
  const rowLabels = ['A', 'B', 'C'];
  const tiles = [];

  let pageIndex = 1;
  for (let r = 0; r < gridSize.rows; r++) {
    for (let c = 0; c < gridSize.cols; c++) {
      tiles.push({
        id: `${rowLabels[r]}${c + 1}`,
        page: pageIndex,
        row: r,
        col: c
      });
      pageIndex++;
    }
  }

  return (
    <PosterSimulatorWindow>
      <PosterSimulatorHeader>
        <div className="title-group">
          <span>PRINT_MY_POSTER_SLICER_NODE</span>
        </div>
        <span style={{ fontSize: '0.75em', color: '#ffb000' }}>
          {language === 'pt' ? 'GRADE CLIENT-SIDE' : 'CLIENT-SIDE GRID'}
        </span>
      </PosterSimulatorHeader>
      <PosterSimulatorBody>
        <PosterControls>
          <div style={{ fontSize: '0.75em', color: '#d2f8d2' }}>
            {language === 'pt' ? 'Formato: ' : 'Format: '}
            <strong style={{ color: '#00ff41' }}>{totalPages}x A4 ({gridSize.cols}x{gridSize.rows})</strong>
          </div>
          <PosterGridBtnGroup>
            <PosterGridBtn
              type="button"
              $active={gridSize.rows === 2 && gridSize.cols === 2}
              onClick={() => setGridSize({ rows: 2, cols: 2 })}
            >
              2x2 (4 A4)
            </PosterGridBtn>
            <PosterGridBtn
              type="button"
              $active={gridSize.rows === 2 && gridSize.cols === 3}
              onClick={() => setGridSize({ rows: 2, cols: 3 })}
            >
              3x2 (6 A4)
            </PosterGridBtn>
            <PosterGridBtn
              type="button"
              $active={gridSize.rows === 3 && gridSize.cols === 3}
              onClick={() => setGridSize({ rows: 3, cols: 3 })}
            >
              3x3 (9 A4)
            </PosterGridBtn>
          </PosterGridBtnGroup>
        </PosterControls>

        <PosterGridArea $cols={gridSize.cols} $rows={gridSize.rows}>
          {tiles.map((tile) => (
            <PosterTile
              key={tile.id}
              onMouseEnter={() => setActiveTile(tile.id)}
              onMouseLeave={() => setActiveTile(null)}
              style={{
                borderColor: activeTile === tile.id ? '#00ff41' : undefined,
                boxShadow: activeTile === tile.id ? 'inset 0 0 10px rgba(0, 255, 65, 0.4)' : undefined,
              }}
            >
              <span className="crop-tl">┌</span>
              <span className="crop-br">┘</span>
              <div className="tile-content">
                {tile.id}
              </div>
              <div className="tile-sub">
                {tile.page}/{totalPages}
              </div>
            </PosterTile>
          ))}
        </PosterGridArea>

        <PosterStatusBar>
          <div>
            <span className="status-highlight">ENGINE:</span> CANVAS 100% LOCAL
          </div>
          <div>
            <span className="status-highlight">PDF:</span> 300 DPI READY
          </div>
          <div>
            <span className="status-highlight">CROP:</span> {language === 'pt' ? 'GUIAS ATIVAS' : 'GUIDES ON'}
          </div>
        </PosterStatusBar>
      </PosterSimulatorBody>
    </PosterSimulatorWindow>
  );
}

function App() {
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('lucascardev_view_mode') || 'normal';
  });

  const handleModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('lucascardev_view_mode', mode);
    } catch (e) {
      console.warn('Failed to save view mode in localStorage', e);
    }
  };

  const linkedinHeaderPhoto = `${process.env.PUBLIC_URL}/assets/linkedin-profile.jpg`;
  const githubLocalPhoto = `${process.env.PUBLIC_URL}/assets/github_avatar.jpg`;
  const [headerAvatar, setHeaderAvatar] = useState(linkedinHeaderPhoto);

  const handleHeaderAvatarError = () => {
    if (headerAvatar === linkedinHeaderPhoto) {
      setHeaderAvatar(githubLocalPhoto);
    } else if (headerAvatar === githubLocalPhoto) {
      setHeaderAvatar(githubAvatar);
    }
  };

  const localAvatar = `${process.env.PUBLIC_URL}/assets/lucasphoto.jpeg`;
  const [avatarimg] = useState(localAvatar);
  const [githubAvatar, setGithubAvatar] = useState('https://avatars.githubusercontent.com/u/35515714?v=4');
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
        'Formação: Pós-Graduação em Desenvolvimento Full Stack (Descomplica) | ADS (Estácio)',
        `Projetos Públicos no GitHub: ${totalRepos} repositórios`,
        `Foco Tecnológico: TypeScript (${tsRepos} projetos) & JavaScript (${jsRepos} projetos)`,
        'Biografia:',
        '  Desenvolvedor Fullstack com +6 anos de experiência consolidada criando aplicações',
        '  web escaláveis e de alta performance. Especialista no ecossistema JavaScript/TypeScript,',
        '  com foco em arquiteturas robustas em React/Next.js no frontend e Node.js no backend.',
        '  Proficiente em modelagem de APIs multi-tenant, integração de microsserviços e',
        '  aplicações modernas de alta performance como o PrintMyPoster (printmyposter.art). Praticante de',
        '  Clean Code, DevOps (Kubernetes/Cloud) e metodologias ágeis.',
        '  Atualmente direciona estudos avançados em arquitetura e engenharia de software,',
        '  reconhecendo o papel fundamental de bases estruturais sólidas na era do desenvolvimento impulsionado por IA.'
      ];
    }
    return [
      'Name: Lucas Matheus Cardoso',
      'Education: Postgraduate in Full Stack Development (Descomplica) | Systems Analysis (Estácio)',
      `Public GitHub Projects: ${totalRepos} repositories`,
      `Core Tech Stack: TypeScript (${tsRepos} projects) & JavaScript (${jsRepos} projects)`,
      'Biography:',
      '  Fullstack Software Engineer with +6 years of professional experience building',
      '  scalable, high-performance web applications. Specialized in the JavaScript/TypeScript',
      '  ecosystem, designing robust architectures with React/Next.js on the frontend',
      '  and Node.js on the backend. Experienced in multi-tenant system design, microservices',
      '  integration, and modern applications like PrintMyPoster (printmyposter.art).',
      '  Dedicated to Clean Code principles, DevOps, and agile practices.',
      '  Currently advancing studies in software architecture and systems engineering,',
      '  emphasizing robust structural design in an AI-assisted development era.'
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
        if (response.data.avatar_url) {
          setGithubAvatar(response.data.avatar_url);
        }
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
        '  poster | printmyposter - Detalhes do PrintMyPoster (printmyposter.art).',
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
        '  poster | printmyposter - Show specs of PrintMyPoster (printmyposter.art).',
        '  projects | ls      - List GitHub repositories & stars.',
        '  projects -a        - List all available repositories.',
        '  contact | contato  - Display contact channels and email.',
        '  pacman | play      - Boot up the interactive 3D Pacman game.',
        '  specs | sistema    - Display application technical specs.',
        '  clear | limpar     - Clear the terminal console.'
      ];
    } else if (cleaned === 'bio' || cleaned === 'sobre') {
      outputLines = getDynamicBio(language);
    } else if (cleaned === 'poster' || cleaned === 'printmyposter' || cleaned === 'print-my-poster' || cleaned === 'clara' || cleaned === 'clara-ia') {
      outputLines = language === 'pt' ? [
        'PROJETO DESTACADO: PRINT MY POSTER (printmyposter.art)',
        '------------------------------------------------------------',
        'Descrição: Transforme qualquer imagem em um pôster gigante impresso em casa.',
        'Funcionalidades Principais:',
        '  * Processamento 100% client-side: fotos fatiadas localmente sem envio para servidores.',
        '  * Grade personalizável em folhas A4 com ajuste fino de margens da impressora.',
        '  * Marcas de corte (crop marks) e guias com abas de sobreposição para colagem perfeita.',
        '  * Geração instantânea de PDF de alta fidelidade (300 DPI) para impressão caseira.',
        'Ações Disponíveis:',
        { type: 'output', text: (
          <span>
            * Abrir Aplicação Web: <a href="https://www.printmyposter.art/" target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>https://www.printmyposter.art/</a>
          </span>
        )},
        { type: 'output', text: (
          <span>
            * Repositório no GitHub: <a href="https://github.com/lucascardev/Image-to-Poster" target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>github.com/lucascardev/Image-to-Poster</a>
          </span>
        )}
      ] : [
        'FEATURED PROJECT: PRINT MY POSTER (printmyposter.art)',
        '------------------------------------------------------------',
        'Description: Turn any image into a giant wall poster ready for home printing.',
        'Core Features:',
        '  * 100% Client-Side Processing: all image slicing done in-browser for complete privacy.',
        '  * Customizable A4 grid layout and precise printer margin controls.',
        '  * Dashed crop marks and overlap alignment tabs for seamless assembly.',
        '  * Instant high-resolution print-ready PDF export (300 DPI).',
        'Available Actions:',
        { type: 'output', text: (
          <span>
            * Open Web App: <a href="https://www.printmyposter.art/" target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>https://www.printmyposter.art/</a>
          </span>
        )},
        { type: 'output', text: (
          <span>
            * GitHub Repository: <a href="https://github.com/lucascardev/Image-to-Poster" target="_blank" rel="noreferrer" style={{ color: '#ffb000', textDecoration: 'underline' }}>github.com/lucascardev/Image-to-Poster</a>
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
    <Container $viewMode={viewMode}>
      {viewMode === 'dev' && <Scanlines />}
      {viewMode === 'dev' && <MatrixRain3D />}

      <Header $viewMode={viewMode}>
        {viewMode === 'normal' ? (
          <Gitinfo>
            <Avatar
              $viewMode="normal"
              src={headerAvatar}
              alt="Lucas Matheus Cardoso"
              onError={handleHeaderAvatarError}
            />
            <div>
              <Username $viewMode="normal">
                <a href="https://www.linkedin.com/in/lucascardev" target="_blank" rel="noreferrer">
                  Lucas Matheus Cardoso
                </a>
              </Username>
              <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, marginTop: '2px' }}>
                {language === 'pt' ? 'Engenheiro de Software Fullstack' : 'Fullstack Software Engineer'}
              </div>
            </div>
          </Gitinfo>
        ) : (
          <Gitinfo>
            <Avatar src={githubAvatar} alt="Lucas Cardoso" />
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
        )}

        {/* Segmented Mode Switch in Header */}
        <ModeSwitchContainer $viewMode={viewMode}>
          <ModeSwitchButton
            type="button"
            $viewMode={viewMode}
            $active={viewMode === 'normal'}
            onClick={() => handleModeChange('normal')}
            title={language === 'pt' ? 'Mudar para o Perfil Profissional Executivo' : 'Switch to Professional Resume'}
          >
            <FaUserTie />
            <span>{language === 'pt' ? 'Perfil Profissional' : 'Executive Resume'}</span>
          </ModeSwitchButton>
          <ModeSwitchButton
            type="button"
            $viewMode={viewMode}
            $active={viewMode === 'dev'}
            onClick={() => handleModeChange('dev')}
            title={language === 'pt' ? 'Mudar para o Modo Dev Matrix' : 'Switch to Dev Mode'}
          >
            <FaTerminal />
            <span>{language === 'pt' ? 'Modo Dev' : 'Dev Mode'}</span>
          </ModeSwitchButton>
        </ModeSwitchContainer>

        {viewMode === 'normal' ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="https://wa.me/5571992931330?text=Ol%C3%A1%20Lucas!%20Encontrei%20seu%20perfil%20profissional%20e%20gostaria%20de%20conversar."
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                color: '#059669',
                backgroundColor: '#ecfdf5',
                border: '1px solid #a7f3d0',
                padding: '6px 14px',
                borderRadius: '6px',
                fontSize: '0.84rem',
                fontWeight: '600',
                textDecoration: 'none',
                transition: 'all 0.2s ease'
              }}
            >
              <FaWhatsapp style={{ fontSize: '1rem' }} />
              <span>WhatsApp</span>
            </a>

            <LanguagePill
              type="button"
              $viewMode="normal"
              onClick={toggleLanguage}
              title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            >
              <FaGlobe />
              <span>{language === 'pt' ? 'EN' : 'PT'}</span>
            </LanguagePill>
          </div>
        ) : (
          <>
            <Contact>
              <p>
                <b>WPP:</b> <a href="https://wa.me/5571992931330?text=Olá!%20Achei%20seu%20contato%20através%20do%20seu%20portfólio." target="_blank" rel="noreferrer">+55 (71) 99293-1330</a>
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
          </>
        )}
      </Header>

      {/* BODY CONTENT: NORMAL RESUME OR DEV TERMINAL */}
      {viewMode === 'normal' ? (
        <NormalResume
          language={language}
          repos={repos}
          contributions={contributions}
          totalContributions={totalContributions}
          githubAvatar={githubAvatar}
          username={username}
          onSwitchToDev={() => handleModeChange('dev')}
        />
      ) : (
        <>
          <PageHolder>
            {/* Left Side: Hacker Terminal Console with Holographic Living ASCII Background */}
            <Main>
              <TerminalAsciiBackground>
                <AsciiArt
                  src={avatarimg}
                  fallbackSrc="https://avatars.githubusercontent.com/u/35515714?v=4"
                  resolution={150}
                  mobileResolution={80}
                  color="#00ff41"
                  animationStyle="matrix"
                  inverted={false}
                  transparent={true}
                  scale={0.96}
                  faceCenter={{ x: 0.48, y: 0.36 }}
                  style={{ width: '100%', height: '100%' }}
                />
              </TerminalAsciiBackground>

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

            {/* Right Side: Projects and Links */}
            <SidePanel>
              <TerminalWrapper title="FEATURED_PROJECT: PRINT_MY_POSTER">
                <ProjectShowcase>
                  <ProjectTitle>
                    PRINT MY POSTER
                    <ProjectTag>{language === 'pt' ? 'ATIVO' : 'ONLINE'}</ProjectTag>
                  </ProjectTitle>
                  <p style={{ margin: '4px 0 8px 0', fontSize: '0.85em', color: '#d2f8d2', lineHeight: '1.4' }}>
                    {language === 'pt' 
                      ? 'Aplicação web moderna para transformar qualquer imagem em um pôster gigante impresso em casa. Divide fotos em grade A4 personalizada com marcas de corte e guias de sobreposição, com processamento 100% no navegador.' 
                      : 'Modern web application to turn any image into a giant wall poster ready for home printing. Splits photos into custom A4 grids with crop marks and overlap guides, processed 100% client-side.'}
                  </p>
                  <ProjectBadgeList>
                    <ProjectBadge>React 19</ProjectBadge>
                    <ProjectBadge>TypeScript</ProjectBadge>
                    <ProjectBadge>Three.js</ProjectBadge>
                    <ProjectBadge>jsPDF</ProjectBadge>
                    <ProjectBadge>Tailwind CSS</ProjectBadge>
                    <ProjectBadge>Canvas API</ProjectBadge>
                  </ProjectBadgeList>
                  <ProjectFeatureList>
                    <li>
                      {language === 'pt' 
                        ? 'Processamento 100% client-side (máxima privacidade sem envio de arquivos)' 
                        : '100% client-side processing (complete privacy, zero server uploads)'}
                    </li>
                    <li>
                      {language === 'pt' 
                        ? 'Grade e margens de impressão customizáveis (linhas x colunas A4)' 
                        : 'Customizable grid size and margins (rows x columns in A4)'}
                    </li>
                    <li>
                      {language === 'pt' 
                        ? 'Marcas de corte pontilhadas e abas de sobreposição para alinhamento' 
                        : 'Dashed crop lines and overlap alignment tabs for easy assembly'}
                    </li>
                    <li>
                      {language === 'pt' 
                        ? 'Exportação instantânea em PDF de alta qualidade para impressão caseira' 
                        : 'High-resolution PDF generation ready for direct home printing'}
                    </li>
                  </ProjectFeatureList>
                  <ProjectButtonList>
                    <ProjectButton 
                      href="https://www.printmyposter.art/" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="primary"
                    >
                      {language === 'pt' ? 'Acessar Site' : 'Open App'}
                    </ProjectButton>
                    <ProjectButton 
                      href="https://github.com/lucascardev/Image-to-Poster" 
                      target="_blank" 
                      rel="noreferrer" 
                      className="secondary"
                    >
                      GitHub
                    </ProjectButton>
                  </ProjectButtonList>
                  
                  <PosterGridSimulator language={language} />
                </ProjectShowcase>
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
            <p style={{ marginTop: '8px', fontSize: '0.85em', color: '#008f11' }}>
              SYSTEM_RELEASE: <span style={{ color: '#00ff41', fontWeight: 'bold' }}>v{version}</span> {'//'}{' '}
              <span style={{ color: '#ffb000' }}>BUILD_CHANNEL: STABLE</span>
            </p>
          </Footer>
        </>
      )}
      
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

      {viewMode === 'dev' && (
        <style>{`
          @keyframes scanline {
            0% { top: 0%; }
            100% { top: 100%; }
          }
        `}</style>
      )}
    </Container>
  );
}

export default App;