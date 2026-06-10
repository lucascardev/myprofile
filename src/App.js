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
} from './style/global.style';

import API from './services/api';
import techsData from './services/techs.json';

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

function App() {
  const [avatarimg] = useState('https://i.ibb.co/XkvSFmbh/E2-B95-B01-6545-426-C-9850-B00-D20-F701-E3.jpg');
  const [username, setUsername] = useState('lucascardev');
  const [repos, setRepos] = useState([]);
  const [language, setLanguage] = useState('en');
  const [terminalInput, setTerminalInput] = useState('');
  const [history, setHistory] = useState([]);
  const [showPacman, setShowPacman] = useState(false);
  const [hoveredTech, setHoveredTech] = useState(null);

  const historyEndRef = useRef(null);

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
      
    if (language === 'pt') {
      return `DECRIPTANDO: ${hoveredTech.name.toUpperCase()} -> ${yearsText} DE EXPERIENCIA`;
    }
    return `DECRYPTING: ${hoveredTech.name.toUpperCase()} -> ${yearsText} OF EXPERIENCE`;
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
      outputLines = language === 'pt' ? [
        'Nome: Lucas Matheus Cardoso',
        'Grau: Bacharel em Sistemas de Informação - Estácio de Sá',
        'Experiência: +6 anos de desenvolvimento web',
        'Biografia:',
        '  Sou um programador apaixonado por resolver desafios complexos e projetar',
        '  arquiteturas robustas. Crio soluções completas do front ao back-end,',
        '  seguindo sempre as melhores práticas de Clean Code, Git Flow e DevOps.',
        '  Com olhar crítico para design e usabilidade, foco em criar interfaces',
        '  limpas, fluidas e de alta performance.'
      ] : [
        'Name: Lucas Matheus Cardoso',
        'Degree: Bachelor of Information Systems - Estácio University',
        'Experience: +6 years of professional web development',
        'Biography:',
        '  I am a software engineering enthusiast dedicated to solving complex problems',
        '  and structuring robust software architectures. I design modern applications',
        '  from UI components to backend services, matching clean code principles.',
        '  With a critical eye for design and usability, I focus on creating clean,',
        '  fluid, and high-performance user interfaces.'
      ];
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

        <div className="techs" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', padding: 0, border: 'none', background: 'transparent' }}>
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
                        {tech.name}: {tech.experience}
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
        </div>
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
            
            {showPacman && (
              <div style={{ marginTop: '15px', border: '1px solid #00ff41', padding: '10px', borderRadius: '4px', background: '#000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8em', color: '#00ff41' }}>
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
            
            <div ref={historyEndRef} />
          </CommandHistory>

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
            </ClaraShowcase>
          </TerminalWrapper>

          <TerminalWrapper title="SOCIAL_LINKS">
            <div className="linkholder" style={{ margin: 0 }}>
              <a href="https://github.com/lucascardev" target="_blank" rel="noreferrer" title="GitHub">
                <FaGithub />
              </a>
              <a href="https://www.linkedin.com/in/lucascardev" target="_blank" rel="noreferrer" title="LinkedIn">
                <FaLinkedin />
              </a>
              <a href="https://www.instagram.com/lucas_mtheus/" target="_blank" rel="noreferrer" title="Instagram Developer">
                <FaInstagram />
              </a>
            </div>
          </TerminalWrapper>
        </SidePanel>
      </PageHolder>

      <Footer>
        <p>
          SYSTEM CONSOLE {'//'} COMPILED VIA{' '}
          <a href="https://pages.github.com/" target="_blank" rel="noreferrer">
            GITHUB PAGES SERVER
          </a>{' '}
          {'//'} ALL RIGHTS RESERVED
        </p>
      </Footer>
      
      <FloatingWhatsApp 
        href="https://wa.me/5571992931330?text=Olá!%20Achei%20seu%20contato%20através%20do%20seu%20portfólio." 
        target="_blank" 
        rel="noreferrer"
        title={language === 'pt' ? 'Fale Comigo no WhatsApp' : 'Chat with me on WhatsApp'}
      >
        <FaWhatsapp />
      </FloatingWhatsApp>

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