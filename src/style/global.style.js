import styled, { keyframes } from 'styled-components';

// Matrix Theme Tokens
const colors = {
  background: '#020603', // Obsidian black-green
  terminalBg: 'rgba(2, 12, 4, 0.82)', // Translucent dark terminal
  primary: '#00ff41', // Intense Matrix neon green
  secondary: '#008f11', // Mid-tone command green
  darkGreen: '#003b00', // Deep border green
  amber: '#ffb000', // Alert/highlight amber
  text: '#d2f8d2', // Soft minty green text
  mutedText: '#005e0d', // Muted green text
  glassBorder: 'rgba(0, 255, 65, 0.25)',
  glow: 'rgba(0, 255, 65, 0.4)',
};

const fontSizes = {
  h1: '2.2em',
  h2: '1.6em',
  h3: '1.2em',
  body: '1em',
  small: '0.85em',
};

// Keyframes for cyber effects

const crtFlicker = keyframes`
  0% { opacity: 0.985; }
  50% { opacity: 0.995; }
  100% { opacity: 0.985; }
`;

const textGlow = keyframes`
  0% { text-shadow: 0 0 4px rgba(0, 255, 65, 0.3); }
  50% { text-shadow: 0 0 10px rgba(0, 255, 65, 0.6), 0 0 20px rgba(0, 255, 65, 0.2); }
  100% { text-shadow: 0 0 4px rgba(0, 255, 65, 0.3); }
`;

export const Scanlines = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(18, 16, 16, 0) 50%, 
    rgba(0, 0, 0, 0.25) 50%
  ), linear-gradient(
    90deg,
    rgba(255, 0, 0, 0.06),
    rgba(0, 255, 0, 0.02),
    rgba(0, 0, 255, 0.06)
  );
  background-size: 100% 4px, 6px 100%;
  z-index: 9999;
  pointer-events: none;
  opacity: 0.8;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${colors.background};
  color: ${colors.text};
  font-family: 'Share Tech Mono', 'Fira Code', monospace;
  position: relative;
  overflow-x: hidden;
  animation: ${crtFlicker} 0.15s infinite;

  &::before {
    content: " ";
    display: block;
    position: absolute;
    top: 0; left: 0; bottom: 0; right: 0;
    background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.12) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.03), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.03));
    background-size: 100% 3px, 3px 100%;
    z-index: 2;
    pointer-events: none;
  }
`;

export const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 24px;
  background-color: rgba(2, 8, 3, 0.95);
  border-bottom: 1px solid ${colors.glassBorder};
  box-shadow: 0 4px 20px rgba(0, 255, 65, 0.1);
  z-index: 10;
  position: relative;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
    padding: 16px;
  }

  .techs {
    display: flex;
    align-items: center;
    background: ${colors.background};
    border: 1px solid ${colors.glassBorder};
    padding: 6px 12px;
    border-radius: 4px;
    box-shadow: inset 0 0 10px rgba(0, 255, 65, 0.05);

    svg {
      margin: 0 8px;
      font-size: 1.3em;
      color: ${colors.secondary};
      transition: all 0.25s ease;
      cursor: pointer;

      &:hover {
        color: ${colors.primary};
        transform: scale(1.2) translateY(-2px);
        filter: drop-shadow(0 0 5px ${colors.primary});
      }
    }
  }

  .github-hint {
    font-size: ${fontSizes.small};
    color: ${colors.mutedText};
    display: flex;
    align-items: center;
    margin-top: 2px;

    svg {
      color: ${colors.secondary};
      margin: 0 4px;
    }
  }
`;

export const Gitinfo = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const Avatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 4px;
  border: 1px solid ${colors.primary};
  box-shadow: 0 0 10px ${colors.glassBorder};
  background-color: #000;
  transition: all 0.3s ease;

  &:hover {
    transform: rotate(3deg) scale(1.05);
    box-shadow: 0 0 15px ${colors.primary};
  }
`;

export const Username = styled.h1`
  font-size: ${fontSizes.h2};
  margin: 0;
  
  a {
    color: ${colors.primary};
    text-decoration: none;
    animation: ${textGlow} 3s infinite ease-in-out;
    letter-spacing: 1px;
    font-weight: 700;

    &:hover {
      color: #fff;
      text-shadow: 0 0 15px ${colors.primary}, 0 0 30px ${colors.primary};
    }
  }
`;

export const Contact = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: ${fontSizes.small};

  @media (max-width: 768px) {
    align-items: center;
  }

  p {
    margin: 2px 0;
    color: ${colors.text};
    display: flex;
    align-items: center;

    b {
      color: ${colors.secondary};
      margin-right: 6px;
    }
  }

  a {
    color: ${colors.background};
    background: ${colors.primary};
    text-decoration: none;
    padding: 2px 8px;
    border-radius: 2px;
    font-weight: bold;
    margin-left: 6px;
    box-shadow: 0 0 5px ${colors.glassBorder};
    transition: all 0.2s ease;

    &:hover {
      background: #fff;
      color: ${colors.background};
      box-shadow: 0 0 15px ${colors.primary};
    }
  }
`;

export const PageHolder = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  padding: 24px;
  flex: 1;
  z-index: 5;
  position: relative;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    padding: 16px;
  }
`;

export const Main = styled.main`
  display: flex;
  flex-direction: column;
  background: ${colors.terminalBg};
  border: 1px solid ${colors.glassBorder};
  border-radius: 4px;
  padding: 24px;
  box-shadow: 0 0 30px rgba(0, 255, 65, 0.15), inset 0 0 20px rgba(0, 255, 65, 0.05);
  position: relative;
  min-height: 550px;

  &::before {
    content: "CONSOLE // SESSION_ACTIVE";
    position: absolute;
    top: -10px;
    left: 20px;
    background: ${colors.background};
    color: ${colors.primary};
    font-size: 0.75em;
    padding: 0 8px;
    border: 1px solid ${colors.glassBorder};
    border-radius: 2px;
  }

  h1 {
    color: ${colors.primary};
    font-size: ${fontSizes.h1};
    margin-top: 0;
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    border-bottom: 1px dashed ${colors.glassBorder};
    padding-bottom: 10px;
    letter-spacing: 1px;
    text-shadow: 0 0 8px ${colors.glow};
  }

  h2 {
    color: ${colors.amber};
    font-size: ${fontSizes.h2};
    margin-top: 24px;
    margin-bottom: 12px;
    border-bottom: 1px solid rgba(255, 176, 0, 0.2);
    padding-bottom: 4px;
  }

  h3 {
    color: ${colors.primary};
    font-size: ${fontSizes.h3};
    margin: 12px 0 6px 0;
  }

  p {
    line-height: 1.6;
    margin-bottom: 16px;
    color: ${colors.text};

    strong {
      color: ${colors.amber};
      font-weight: normal;
    }

    a {
      color: ${colors.primary};
      text-decoration: underline;
      
      &:hover {
        color: #fff;
        text-shadow: 0 0 5px ${colors.primary};
      }
    }
  }

  hr {
    border: none;
    border-top: 1px solid ${colors.glassBorder};
    margin: 20px 0;
  }

  .linkholder {
    display: flex;
    gap: 16px;
    margin: 12px 0 24px 0;
    justify-content: flex-start;

    a {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 45px;
      height: 45px;
      border: 1px solid ${colors.glassBorder};
      background: rgba(0, 0, 0, 0.4);
      color: ${colors.primary};
      font-size: 1.5em;
      border-radius: 4px;
      transition: all 0.25s ease;

      &:hover {
        background: ${colors.primary};
        color: ${colors.background};
        box-shadow: 0 0 15px ${colors.primary};
        transform: translateY(-3px);
      }
    }
  }
`;

export const Repos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

export const Repo = styled.div`
  background: rgba(0, 15, 2, 0.6);
  border: 1px solid ${colors.glassBorder};
  border-radius: 4px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);

  &:hover {
    transform: translateY(-4px);
    border-color: ${colors.primary};
    box-shadow: 0 5px 15px rgba(0, 255, 65, 0.2);
  }

  h3 {
    margin-top: 0;
    color: ${colors.primary};
    font-size: 1.1em;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  p {
    font-size: 0.9em;
    color: ${colors.text};
    margin: 8px 0;
    line-height: 1.4;

    a {
      color: ${colors.amber};
      text-decoration: none;

      &:hover {
        text-decoration: underline;
        color: #fff;
      }
    }
  }
`;

export const Info = styled.div`
  display: flex;
  gap: 12px;
  border-top: 1px solid rgba(0, 255, 65, 0.1);
  padding-top: 8px;
  margin-top: auto;
  font-size: 0.85em;
`;

export const Count = styled.div`
  display: flex;
  align-items: center;
  color: ${colors.mutedText};
  gap: 4px;

  svg {
    color: ${colors.secondary};
  }
`;

export const Footer = styled.footer`
  padding: 24px;
  background-color: rgba(2, 8, 3, 0.95);
  border-top: 1px solid ${colors.glassBorder};
  text-align: center;
  z-index: 10;
  position: relative;
  font-size: ${fontSizes.small};
  color: ${colors.mutedText};

  a {
    color: ${colors.primary};
    text-decoration: none;
    font-weight: bold;

    &:hover {
      text-decoration: underline;
      text-shadow: 0 0 5px ${colors.primary};
    }
  }
`;

// Additional Cyber-Terminal components
export const SidePanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const TerminalWrapper = styled.div`
  border: 1px solid ${colors.glassBorder};
  background: ${colors.terminalBg};
  border-radius: 4px;
  padding: 16px;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.1);
  position: relative;

  &::before {
    content: "${props => props.title || 'TERMINAL'}";
    position: absolute;
    top: -10px;
    left: 20px;
    background: ${colors.background};
    color: ${colors.primary};
    font-size: 0.75em;
    padding: 0 8px;
    border: 1px solid ${colors.glassBorder};
    border-radius: 2px;
  }
`;

export const CommandHistory = styled.div`
  font-family: 'Fira Code', monospace;
  font-size: 0.9em;
  max-height: 350px;
  overflow-y: auto;
  margin-bottom: 12px;
  padding-right: 8px;
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.3);
  }
  &::-webkit-scrollbar-thumb {
    background: ${colors.secondary};
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${colors.primary};
  }
`;

export const CommandRow = styled.div`
  margin: 2px 0;
  white-space: pre-wrap;
  word-break: break-all;
  
  &.input {
    color: ${colors.primary};
    display: flex;
    align-items: flex-start;
  }
  &.output {
    color: ${colors.text};
    padding-left: 14px;
    border-left: 1px solid ${colors.darkGreen};
  }
  &.error {
    color: #ff5555;
    padding-left: 14px;
    border-left: 1px solid rgba(255, 85, 85, 0.4);
  }
  &.info {
    color: ${colors.amber};
  }
`;

export const PromptLabel = styled.span`
  color: ${colors.primary};
  margin-right: 8px;
  user-select: none;
  font-weight: bold;
`;

export const TerminalInputLine = styled.form`
  display: flex;
  align-items: center;
  width: 100%;
  border-top: 1px dashed rgba(0, 255, 65, 0.15);
  padding-top: 10px;
`;

export const CustomInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-family: 'Fira Code', monospace;
  font-size: 0.95em;
  outline: none;
  caret-color: ${colors.primary};
  text-shadow: 0 0 5px ${colors.primary};
`;

export const ControlPanel = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
  background: rgba(0, 15, 2, 0.5);
  border: 1px solid ${colors.darkGreen};
  padding: 14px;
  border-radius: 4px;

  h4 {
    margin: 0 0 8px 0;
    color: ${colors.amber};
    font-size: 0.95em;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .control-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.85em;

    span {
      color: ${colors.text};
    }
  }

  input[type="range"] {
    width: 60%;
    accent-color: ${colors.primary};
    background: ${colors.darkGreen};
    height: 4px;
    border-radius: 2px;
    outline: none;
  }
`;

export const CyberButton = styled.button`
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid ${colors.primary};
  color: ${colors.primary};
  font-family: 'Share Tech Mono', monospace;
  padding: 6px 12px;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.9em;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 1px;

  &:hover {
    background: ${colors.primary};
    color: ${colors.background};
    box-shadow: 0 0 12px ${colors.primary};
  }

  &.active {
    background: ${colors.primary};
    color: ${colors.background};
    box-shadow: 0 0 10px ${colors.glassBorder};
  }
`;

export const ModeSelector = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`;

const marqueeAnim = keyframes`
  0% { transform: translate3d(0, 0, 0); }
  100% { transform: translate3d(-50%, 0, 0); }
`;

export const TechsMarqueeContainer = styled.div`
  overflow: hidden;
  width: 380px;
  mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, #000 15%, #000 85%, transparent);
  border: 1px solid ${colors.glassBorder};
  background: ${colors.background};
  padding: 8px 0;
  border-radius: 4px;
  display: flex;
  align-items: center;
  position: relative;
  
  @media (max-width: 992px) {
    width: 280px;
    margin: 10px 0;
  }
`;

export const TechsTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${marqueeAnim} 20s linear infinite;

  &:hover {
    animation-play-state: paused;
  }
`;

export const TechItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 16px;
  cursor: pointer;

  svg {
    font-size: 1.4em;
    color: ${colors.secondary};
    transition: all 0.25s ease;

    &:hover {
      color: ${colors.primary};
      transform: scale(1.2) translateY(-2px);
      filter: drop-shadow(0 0 5px ${colors.primary});
    }
  }

  &:hover .tech-tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

export const TechTooltip = styled.div`
  position: absolute;
  bottom: 130%;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: ${colors.background};
  color: ${colors.primary};
  border: 1px solid ${colors.primary};
  box-shadow: 0 0 10px ${colors.glow};
  padding: 4px 8px;
  font-size: 0.75em;
  font-family: 'Share Tech Mono', monospace;
  white-space: nowrap;
  border-radius: 2px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease-in-out;
  pointer-events: none;
  z-index: 1000;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 4px;
    border-style: solid;
    border-color: ${colors.primary} transparent transparent transparent;
  }
`;

export const FloatingWhatsApp = styled.a`
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: #25d366;
  color: #fff !important;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.4);
  z-index: 9999;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.25);
  text-decoration: none;

  &:hover {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 0 25px #25d366, 0 0 40px rgba(37, 211, 102, 0.6);
    filter: brightness(1.1);
  }
`;