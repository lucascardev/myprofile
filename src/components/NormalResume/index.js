import React, { useState, useEffect, useRef } from 'react';
import {
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt,
  FaBriefcase,
  FaGraduationCap,
  FaExternalLinkAlt,
  FaDownload,
  FaLayerGroup,
  FaServer,
  FaCloud,
  FaBrain,
  FaCheckCircle,
  FaCode,
  FaTerminal,
  FaChevronLeft,
  FaChevronRight
} from 'react-icons/fa';

import {
  NormalContainer,
  ResumeWrapper,
  HeroCard,
  AvatarWrapper,
  HeroInfo,
  ActionButtonsRow,
  PrimaryButton,
  SecondaryButton,
  ContactChipsList,
  ContactChip,
  Section,
  SectionHeader,
  Card,
  AboutContent,
  ProjectsHeaderRow,
  CarouselNavControls,
  CarouselCounter,
  CarouselNavBtn,
  CarouselContainer,
  CarouselTrack,
  CarouselSlide,
  CarouselPagination,
  CarouselDot,
  SwipeHint,
  ProjectCard,
  SkillsGrid,
  SkillCategoryCard,
  EducationGrid,
  EducationCard,
  ProfessionalContributions,
  NormalFooter,
} from './normal.style';

import projectsData from '../../services/projects.json';
import { version } from '../../../package.json';

export default function NormalResume({
  language = 'pt',
  repos = [],
  contributions = [],
  totalContributions = 0,
  githubAvatar = 'https://avatars.githubusercontent.com/u/35515714?v=4',
  username = 'lucascardev',
  onSwitchToDev
}) {
  // Support local linkedin photo with graceful fallback chain
  const linkedinPhotoPath = `${process.env.PUBLIC_URL}/assets/linkedin-profile.jpg`;
  const githubLocalPhoto = `${process.env.PUBLIC_URL}/assets/github_avatar.jpg`;
  const [avatarSrc, setAvatarSrc] = useState(linkedinPhotoPath);

  const handleAvatarError = () => {
    if (avatarSrc === linkedinPhotoPath) {
      setAvatarSrc(githubLocalPhoto);
    } else if (avatarSrc === githubLocalPhoto) {
      setAvatarSrc(githubAvatar);
    }
  };

  // Carousel state and responsive navigation logic
  const [currentPage, setCurrentPage] = useState(0);
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined' && typeof window.innerWidth === 'number') {
      return window.innerWidth <= 768;
    }
    return false;
  });
  const trackRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const itemsPerPage = isMobile ? 1 : 2;
  const totalPages = Math.ceil(projectsData.length / itemsPerPage);

  const handleScroll = () => {
    if (!trackRef.current) return;
    const container = trackRef.current;
    const scrollLeft = container.scrollLeft;
    const containerLeft = container.getBoundingClientRect().left;
    const slides = container.children;
    if (!slides || slides.length === 0) return;

    const maxScroll = container.scrollWidth - container.clientWidth;
    if (scrollLeft >= maxScroll - 15) {
      setCurrentPage(totalPages - 1);
      return;
    }

    let closestIndex = 0;
    let minDistance = Infinity;

    for (let i = 0; i < slides.length; i++) {
      const slideLeft = slides[i].getBoundingClientRect().left;
      const distance = Math.abs(slideLeft - containerLeft);
      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    const computedPage = Math.floor(closestIndex / itemsPerPage);
    setCurrentPage(Math.min(computedPage, totalPages - 1));
  };

  const goToPage = (pageIndex) => {
    if (!trackRef.current) return;
    const clampedPage = Math.min(Math.max(0, pageIndex), totalPages - 1);
    const targetSlideIndex = Math.min(clampedPage * itemsPerPage, projectsData.length - 1);
    const targetSlide = trackRef.current.children[targetSlideIndex];
    if (targetSlide) {
      const track = trackRef.current;
      const targetScroll =
        targetSlide.offsetParent === track
          ? targetSlide.offsetLeft
          : targetSlide.offsetLeft - track.offsetLeft;

      track.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
      });
      setCurrentPage(clampedPage);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      goToPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      goToPage(currentPage + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      handlePrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      handleNext();
    }
  };

  const getCounterText = () => {
    const total = projectsData.length;
    if (total === 0) return null;
    if (isMobile) {
      const current = Math.min(currentPage + 1, total);
      return language === 'pt' ? (
        <>
          Projeto <span className="highlight">{current}</span> de {total}
        </>
      ) : (
        <>
          Project <span className="highlight">{current}</span> of {total}
        </>
      );
    }
    const start = currentPage * 2 + 1;
    const end = Math.min((currentPage + 1) * 2, total);
    if (start === end) {
      return language === 'pt' ? (
        <>
          Projeto <span className="highlight">{start}</span> de {total}
        </>
      ) : (
        <>
          Project <span className="highlight">{start}</span> of {total}
        </>
      );
    }
    return language === 'pt' ? (
      <>
        Projetos <span className="highlight">{start}–{end}</span> de {total}
      </>
    ) : (
      <>
        Projects <span className="highlight">{start}–{end}</span> of {total}
      </>
    );
  };

  const renderCleanContributions = () => {
    if (!contributions || contributions.length === 0) {
      return (
        <div style={{ color: '#64748b', fontStyle: 'italic', textAlign: 'center', padding: '16px 0' }}>
          {language === 'pt' ? 'Carregando dados de atividade do GitHub...' : 'Loading GitHub activity stream...'}
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
      const firstDayWithDate = week.find((d) => d.date);
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
                  whiteSpace: 'nowrap',
                  fontSize: '11px',
                  color: '#64748b',
                  fontWeight: 500
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

    const levelColors = [
      '#f1f5f9', // Level 0 (blank/none)
      '#bfdbfe', // Level 1 (soft blue)
      '#60a5fa', // Level 2 (medium blue)
      '#2563eb', // Level 3 (strong blue)
      '#1e40af', // Level 4 (deep navy)
    ];

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(53, 11px)',
            gap: '3px',
            paddingLeft: '28px',
            marginBottom: '4px'
          }}
        >
          {monthHeaders}
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '95px',
              fontSize: '10px',
              color: '#94a3b8',
              paddingRight: '4px',
              fontWeight: 500
            }}
          >
            <span></span>
            <span>Seg</span>
            <span></span>
            <span>Qua</span>
            <span></span>
            <span>Sex</span>
            <span></span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateRows: 'repeat(7, 11px)',
              gridAutoFlow: 'column',
              gap: '3px'
            }}
          >
            {weeks.map((week, wIdx) =>
              week.map((day, dIdx) => {
                const tooltipText = day.date
                  ? `${day.count} ${
                      day.count === 1
                        ? language === 'pt'
                          ? 'contribuição em'
                          : 'contribution on'
                        : language === 'pt'
                        ? 'contribuições em'
                        : 'contributions on'
                    } ${day.date}`
                  : language === 'pt'
                  ? 'Sem dados'
                  : 'No data';

                return (
                  <div
                    key={`${wIdx}-${dIdx}`}
                    title={tooltipText}
                    style={{
                      width: '11px',
                      height: '11px',
                      borderRadius: '2px',
                      backgroundColor: levelColors[day.level] || levelColors[0],
                      border: '1px solid rgba(0,0,0,0.03)',
                      transition: 'transform 0.15s ease'
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: '12px',
            fontSize: '11px',
            color: '#64748b'
          }}
        >
          <a
            href="https://github.com/lucascardev"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#2563eb', textDecoration: 'none', fontWeight: 500 }}
          >
            {language === 'pt' ? 'Ver histórico completo no GitHub' : 'View full history on GitHub'} →
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>{language === 'pt' ? 'Menos' : 'Less'}</span>
            {levelColors.map((color, idx) => (
              <div
                key={idx}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '2px',
                  backgroundColor: color
                }}
              />
            ))}
            <span>{language === 'pt' ? 'Mais' : 'More'}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <NormalContainer>
      <ResumeWrapper>
        {/* HERO / EXECUTIVE PROFILE HEADER */}
        <HeroCard>
          <AvatarWrapper>
            <img
              src={avatarSrc}
              alt="Lucas Matheus Cardoso"
              onError={handleAvatarError}
            />
            <div className="status-badge" title="Disponível para novos projetos e contratação">
              <span style={{ fontSize: '8px' }}>●</span>
              {language === 'pt' ? 'Disponível' : 'Available'}
            </div>
          </AvatarWrapper>

          <HeroInfo>
            <div className="name-row">
              <h1>Lucas Matheus Cardoso</h1>
              <span className="experience-badge">
                {language === 'pt' ? '+7 Anos de Experiência' : '+7 Years Experience'}
              </span>
            </div>

            <div className="headline">
              {language === 'pt'
                ? 'Engenheiro de Software Sênior | B2B SaaS, Fintech, Healthtech & AI'
                : 'Senior Software Engineer | B2B SaaS, Fintech, Healthtech & AI'}
            </div>

            <div className="location-row">
              <span>
                <FaMapMarkerAlt /> Salvador - BA, Brasil
              </span>
              {/* <span>
                <FaBriefcase /> Fullstack & DevOps
              </span>
              <span>
                <FaCode /> {repos.length} {language === 'pt' ? 'Repositórios Públicos' : 'Public Repos'}
              </span> */}
            </div>

            {/* <ActionButtonsRow>
              <PrimaryButton
                href="https://wa.me/5571992931330?text=Ol%C3%A1%20Lucas!%20Encontrei%20seu%20perfil%20profissional%20e%20gostaria%20de%20conversar."
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp />
                {language === 'pt' ? 'Conversar no WhatsApp' : 'Chat on WhatsApp'}
              </PrimaryButton>

            <SecondaryButton
                href={`${process.env.PUBLIC_URL}/assets/lucascardev-cv-pt.pdf`}
                download="LucasCardoso-Curriculo-PT.pdf"
              >
                <FaDownload />
                {language === 'pt' ? 'Baixar CV (Português)' : 'Download CV (PT)'}
              </SecondaryButton>

              <SecondaryButton
                href={`${process.env.PUBLIC_URL}/assets/lucascardev-cv-en.pdf`}
                download="LucasCardoso-Resume-EN.pdf"
              >
                <FaDownload />
                {language === 'pt' ? 'Baixar CV (Inglês)' : 'Download CV (EN)'}
              </SecondaryButton> 
            </ActionButtonsRow> */}

            <ContactChipsList>
              <ContactChip
                href="https://wa.me/5571992931330?text=Ol%C3%A1%20Lucas!%20Encontrei%20seu%20perfil%20profissional%20e%20gostaria%20de%20conversar."
                target="_blank"
                rel="noreferrer"
              >
                <FaWhatsapp style={{ color: '#059669' }} /> WhatsApp: +55 (71) 99293-1330
              </ContactChip>
              <ContactChip href="mailto:lukemattsc@gmail.com">
                <FaEnvelope /> lukemattsc@gmail.com
              </ContactChip>
              <ContactChip href="https://www.linkedin.com/in/lucascardev" target="_blank" rel="noreferrer">
                <FaLinkedin /> LinkedIn: /in/lucascardev
              </ContactChip>
              <ContactChip href="https://github.com/lucascardev" target="_blank" rel="noreferrer">
                <FaGithub /> GitHub: @{username}
              </ContactChip>
            </ContactChipsList>
          </HeroInfo>
        </HeroCard>

        {/* EXECUTIVE SUMMARY */}
        <Section>
          <SectionHeader>
            <div className="subtitle">
              <FaCheckCircle /> {language === 'pt' ? 'Perfil Profissional' : 'Executive Profile'}
            </div>
            <h2>{language === 'pt' ? 'Sobre Mim' : 'About Me'}</h2>
          </SectionHeader>

          <Card>
            <AboutContent>
              {language === 'pt' ? (
                <>
                  <p>
                    Sou <strong>Engenheiro de Software Sênior com mais de 7 anos de experiência em desenvolvimento backend e full-stack</strong>, especializado em aplicações B2B SaaS, Fintech, Healthtech e soluções baseadas em Inteligência Artificial.
                  </p>
                  <p>
                    Minha expertise técnica inclui <strong>TypeScript, JavaScript, Node.js, React, Next.js, Python, PostgreSQL e MongoDB</strong>, além de arquitetura de microsserviços, APIs REST e infraestrutura em nuvem com <strong>AWS, GCP, Docker e Kubernetes</strong>.
                  </p>
                  <p>
                    Meu foco é construir sistemas <strong>escaláveis, seguros e confiáveis</strong>, modernizar aplicações legadas, integrar serviços e otimizar desempenho. Sigo boas práticas de engenharia, incluindo Clean Code, princípios SOLID, testes automatizados e CI/CD. Sou apaixonado por entregar soluções de software de impacto, colaborar com equipes internacionais e melhorar continuamente produtos digitais.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    I'm a <strong>Senior Software Engineer with 7+ years of experience in backend and full-stack development</strong>, specializing in B2B SaaS, Fintech, Healthtech, and AI-powered applications.
                  </p>
                  <p>
                    My technical expertise includes <strong>TypeScript, JavaScript, Node.js, React, Next.js, Python, PostgreSQL, and MongoDB</strong>, along with microservices architecture, REST APIs, and cloud infrastructure using <strong>AWS, GCP, Docker, and Kubernetes</strong>.
                  </p>
                  <p>
                    I focus on building <strong>scalable, secure, and reliable systems</strong>, modernizing legacy applications, integrating services, and optimizing performance. I follow engineering best practices, including Clean Code, SOLID principles, automated testing, and CI/CD. I'm passionate about delivering impactful software solutions, collaborating with international teams, and continuously improving digital products.
                  </p>
                </>
              )}
            </AboutContent>
          </Card>
        </Section>

        {/* PROJECT-BASED PORTFOLIO (INTELI INSPIRATION) */}
        <Section>
          <ProjectsHeaderRow>
            <div className="header-left">
              <SectionHeader style={{ marginBottom: 0 }}>
                <div className="subtitle">
                  <FaLayerGroup /> {language === 'pt' ? 'Aprendizado Baseado em Projetos Reais' : 'Project-Based Engineering'}
                </div>
                <h2>{language === 'pt' ? 'Projetos em Produção' : 'Production Projects'}</h2>
                <p>
                  {language === 'pt'
                    ? 'Sistemas concebidos do zero com foco na resolução de dores reais, arquitetura escalável e entrega de valor em produção.'
                    : 'Systems engineered from concept to production to solve real-world problems with scalable architectures.'}
                </p>
              </SectionHeader>
            </div>

            {totalPages > 1 && (
              <CarouselNavControls>
                <CarouselCounter>
                  {getCounterText()}
                </CarouselCounter>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <CarouselNavBtn
                    type="button"
                    onClick={handlePrev}
                    disabled={currentPage === 0}
                    aria-label={language === 'pt' ? 'Projetos anteriores' : 'Previous projects'}
                    title={language === 'pt' ? 'Projetos anteriores' : 'Previous projects'}
                  >
                    <FaChevronLeft />
                  </CarouselNavBtn>
                  <CarouselNavBtn
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage === totalPages - 1}
                    aria-label={language === 'pt' ? 'Próximos projetos' : 'Next projects'}
                    title={language === 'pt' ? 'Próximos projetos' : 'Next projects'}
                  >
                    <FaChevronRight />
                  </CarouselNavBtn>
                </div>
              </CarouselNavControls>
            )}
          </ProjectsHeaderRow>

          <CarouselContainer
            tabIndex="0"
            onKeyDown={handleKeyDown}
            role="region"
            aria-roledescription="carousel"
            aria-label={language === 'pt' ? 'Carrossel de projetos em produção' : 'Production projects carousel'}
          >
            <CarouselTrack ref={trackRef} onScroll={handleScroll}>
              {projectsData.map((project, index) => {
                const statusText = project.status
                  ? (typeof project.status === 'object' ? (project.status[language] || project.status.pt || project.status.en) : project.status)
                  : (language === 'pt' ? 'Em Produção' : 'Production');
                
                const taglineText = project.tagline
                  ? (typeof project.tagline === 'object' ? (project.tagline[language] || project.tagline.pt || project.tagline.en) : project.tagline)
                  : '';

                const problemText = project.problem
                  ? (typeof project.problem === 'object' ? (project.problem[language] || project.problem.pt || project.problem.en) : project.problem)
                  : null;

                const solutionText = project.solution
                  ? (typeof project.solution === 'object' ? (project.solution[language] || project.solution.pt || project.solution.en) : project.solution)
                  : null;

                const highlights = project.engineeringHighlights
                  ? (Array.isArray(project.engineeringHighlights)
                      ? project.engineeringHighlights
                      : (project.engineeringHighlights[language] || project.engineeringHighlights.pt || project.engineeringHighlights.en || []))
                  : [];

                const techs = project.technologies || [];

                return (
                  <CarouselSlide
                    key={project.id || project.title}
                    role="group"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} / ${projectsData.length}`}
                  >
                    <ProjectCard>
                      <div className="project-header">
                        <h3 className="project-title">{project.title}</h3>
                        <span className="project-status">
                          ● {statusText}
                        </span>
                      </div>

                      {taglineText && <p className="project-tagline">{taglineText}</p>}

                      {/* Inteli Problem & Solution blocks */}
                      {problemText && (
                        <div className="inteli-block">
                          <div className="label">
                            <span>⚡</span> {language === 'pt' ? 'Desafio / Problema Real' : 'Real-World Challenge'}
                          </div>
                          <p className="desc">{problemText}</p>
                        </div>
                      )}

                      {solutionText && (
                        <div className="inteli-block" style={{ borderLeftColor: '#10b981' }}>
                          <div className="label" style={{ color: '#047857' }}>
                            <span>🎯</span> {language === 'pt' ? 'Solução de Engenharia' : 'Engineering Solution'}
                          </div>
                          <p className="desc">{solutionText}</p>
                        </div>
                      )}

                      {highlights.length > 0 && (
                        <>
                          <div className="highlights-title">
                            {language === 'pt' ? 'Destaques Técnicos & Arquitetura:' : 'Technical & Architecture Highlights:'}
                          </div>
                          <ul className="highlights-list">
                            {highlights.map((highlight, hIdx) => (
                              <li key={hIdx}>{highlight}</li>
                            ))}
                          </ul>
                        </>
                      )}

                      {techs.length > 0 && (
                        <div className="tech-pills">
                          {techs.map((tech, tIdx) => (
                            <span key={tIdx} className="tech-pill">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="card-actions">
                        {project.url && (
                          <PrimaryButton href={project.url} target="_blank" rel="noreferrer">
                            <FaExternalLinkAlt />
                            {language === 'pt' ? 'Acessar Aplicação' : 'Open Live App'}
                          </PrimaryButton>
                        )}

                        {project.github && (
                          <SecondaryButton href={project.github} target="_blank" rel="noreferrer">
                            <FaGithub />
                            {language === 'pt' ? 'Código no GitHub' : 'GitHub Repository'}
                          </SecondaryButton>
                        )}
                      </div>
                    </ProjectCard>
                  </CarouselSlide>
                );
              })}
            </CarouselTrack>

            {totalPages > 1 && (
              <>
                <CarouselPagination>
                  {Array.from({ length: totalPages }).map((_, idx) => (
                    <CarouselDot
                      key={idx}
                      $active={currentPage === idx}
                      onClick={() => goToPage(idx)}
                      type="button"
                      aria-label={
                        language === 'pt'
                          ? `Ir para a página ${idx + 1}`
                          : `Go to page ${idx + 1}`
                      }
                      title={
                        language === 'pt'
                          ? `Página ${idx + 1}`
                          : `Page ${idx + 1}`
                      }
                    />
                  ))}
                </CarouselPagination>
                <SwipeHint>
                  {language === 'pt'
                    ? '← Deslize para navegar pelos projetos →'
                    : '← Swipe to browse projects →'}
                </SwipeHint>
              </>
            )}
          </CarouselContainer>
        </Section>

        {/* CORE COMPETENCIES / TECHNICAL SKILLS */}
        <Section>
          <SectionHeader>
            <div className="subtitle">
              <FaCode /> {language === 'pt' ? 'Habilidades & Domínios' : 'Skills & Domains'}
            </div>
            <h2>{language === 'pt' ? 'Competências Técnicas' : 'Core Technical Stack'}</h2>
          </SectionHeader>

          <SkillsGrid>
            {/* Frontend */}
            <SkillCategoryCard>
              <div className="category-header">
                <div className="icon-box">
                  <FaLayerGroup />
                </div>
                <h3>Frontend Moderno</h3>
              </div>
              <div className="skill-items">
                <div className="skill-item">
                  <span className="skill-name">React / Next.js</span>
                  <span className="skill-exp">5 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">TypeScript</span>
                  <span className="skill-exp">4 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">JavaScript (ES6+)</span>
                  <span className="skill-exp">6 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Three.js / Canvas API</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Tailwind CSS / Styled</span>
                  <span className="skill-exp">5 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">React Native</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
              </div>
            </SkillCategoryCard>

            {/* Backend */}
            <SkillCategoryCard>
              <div className="category-header">
                <div className="icon-box">
                  <FaServer />
                </div>
                <h3>Backend & APIs</h3>
              </div>
              <div className="skill-items">
                <div className="skill-item">
                  <span className="skill-name">Node.js</span>
                  <span className="skill-exp">4 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Express / REST APIs</span>
                  <span className="skill-exp">4 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Prisma ORM</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">PostgreSQL / Supabase</span>
                  <span className="skill-exp">4 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">MySQL</span>
                  <span className="skill-exp">5 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Microsserviços / Auth</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
              </div>
            </SkillCategoryCard>

            {/* Cloud & DevOps */}
            <SkillCategoryCard>
              <div className="category-header">
                <div className="icon-box">
                  <FaCloud />
                </div>
                <h3>Cloud & DevOps</h3>
              </div>
              <div className="skill-items">
                <div className="skill-item">
                  <span className="skill-name">Docker & Containers</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Kubernetes (K8s)</span>
                  <span className="skill-exp">2 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">CI/CD & GitHub Actions</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">GCP / DigitalOcean</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Oracle Cloud / OCI</span>
                  <span className="skill-exp">1 {language === 'pt' ? 'ano' : 'yr'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Linux Servers (x86/ARM)</span>
                  <span className="skill-exp">5 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
              </div>
            </SkillCategoryCard>

            {/* AI & Automation */}
            <SkillCategoryCard>
              <div className="category-header">
                <div className="icon-box">
                  <FaBrain />
                </div>
                <h3>IA & Automação</h3>
              </div>
              <div className="skill-items">
                <div className="skill-item">
                  <span className="skill-name">LLM Integration (Gemini/GPT)</span>
                  <span className="skill-exp">2 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Playwright Web Scrapers</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Antigravity Agentic Dev</span>
                  <span className="skill-exp">1 {language === 'pt' ? 'ano' : 'yr'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">WhatsApp Chatbots</span>
                  <span className="skill-exp">3 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Clean Code & Refatoração</span>
                  <span className="skill-exp">6 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
                <div className="skill-item">
                  <span className="skill-name">Monitoramento / Datadog</span>
                  <span className="skill-exp">2 {language === 'pt' ? 'anos' : 'yrs'}</span>
                </div>
              </div>
            </SkillCategoryCard>
          </SkillsGrid>
        </Section>

        {/* ACADEMIC BACKGROUND */}
        <Section>
          <SectionHeader>
            <div className="subtitle">
              <FaGraduationCap /> {language === 'pt' ? 'Trajetória Acadêmica' : 'Education'}
            </div>
            <h2>{language === 'pt' ? 'Formação Acadêmica' : 'Academic Background'}</h2>
          </SectionHeader>

          <EducationGrid>
            <EducationCard>
              <div className="edu-icon">
                <FaGraduationCap />
              </div>
              <div className="edu-info">
                <h3>
                  {language === 'pt'
                    ? 'Pós-Graduação em Desenvolvimento Full Stack'
                    : 'Postgraduate Degree in Full Stack Development'}
                </h3>
                <div className="institution">Centro Universitário União das Américas Descomplica</div>
                <div className="period">
                  {language === 'pt' ? 'Pós-Graduação Lato Sensu' : 'Postgraduate Specialization'}
                </div>
                <p className="details">
                  {language === 'pt'
                    ? 'Especialização avançada focada em arquiteturas escaláveis, desenvolvimento full stack de alta performance, microsserviços, padrões de software modernos e certificação Practitioner Front-End.'
                    : 'Advanced postgraduate specialization focused on scalable software architectures, high-performance full stack development, microservices, and Practitioner Front-End certification.'}
                </p>
              </div>
            </EducationCard>

            <EducationCard>
              <div className="edu-icon">
                <FaGraduationCap />
              </div>
              <div className="edu-info">
                <h3>{language === 'pt' ? 'Ciência da computação' : 'Computer Science'}</h3>
                <div className="institution">USP Universidade de São Paulo</div>
                <div className="period">2015 – 2019 </div>
                <p className="details">
                  {language === 'pt'
                    ? 'Formação com ênfase em engenharia de requisitos, arquitetura de sistemas, estruturas de dados, segurança da informação e desenvolvimento ágil.'
                    : 'Curriculum focused on software requirements engineering, systems architecture, data structures, information security, and agile methodologies.'}
                </p>
              </div>
            </EducationCard>
          </EducationGrid>
        </Section>

        {/* GITHUB PROFESSIONAL METRICS & CONTRIBUTIONS */}
        <Section>
          <SectionHeader>
            <div className="subtitle">
              <FaGithub /> {language === 'pt' ? 'Métricas de Engenharia' : 'Engineering Activity'}
            </div>
            <h2>{language === 'pt' ? 'Atividade no GitHub' : 'GitHub Contributions'}</h2>
            <p>
              {language === 'pt'
                ? 'Histórico de entregas e commits em projetos de código aberto e repositórios em produção.'
                : 'Commit stream and delivery history across open-source and production repositories.'}
            </p>
          </SectionHeader>

          <ProfessionalContributions>
            <div className="contrib-header">
              <h3>
                <FaGithub style={{ color: '#2563eb' }} />
                <span>
                  {language === 'pt' ? 'Contribuições no Último Ano' : 'Contributions in the Last Year'}
                </span>
              </h3>
              <span className="count-badge">
                {totalContributions} {language === 'pt' ? 'contribuições registradas' : 'contributions recorded'}
              </span>
            </div>

            <div className="calendar-wrapper">{renderCleanContributions()}</div>
          </ProfessionalContributions>
        </Section>

        {/* FOOTER */}
        <NormalFooter>
          <div className="footer-links">
            <a href="https://github.com/lucascardev" target="_blank" rel="noreferrer">
              GitHub
            </a>
            <span>•</span>
            <a href="https://www.linkedin.com/in/lucascardev" target="_blank" rel="noreferrer">
              LinkedIn
            </a>
            <span>•</span>
            <a href="https://wa.me/5571992931330" target="_blank" rel="noreferrer">
              WhatsApp
            </a>
            <span>•</span>
            <button
              onClick={onSwitchToDev}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0
              }}
            >
              <FaTerminal /> {language === 'pt' ? 'Acessar Terminal Dev Mode' : 'Switch to Dev Terminal'}
            </button>
          </div>
          <p>
            Lucas Matheus Cardoso &bull; {language === 'pt' ? 'Engenheiro de Software' : 'Software Engineer'}
          </p>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
            Portfólio Profissional v{version} &bull; Hospedado no GitHub Pages &bull; {new Date().getFullYear()}
          </p>
        </NormalFooter>
      </ResumeWrapper>
    </NormalContainer>
  );
}
