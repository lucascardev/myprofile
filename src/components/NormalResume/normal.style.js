import styled from 'styled-components';

export const NormalContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #f8fafc;
  color: #0f172a;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6;
  padding: 0;
  margin: 0;
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
`;

export const ResumeWrapper = styled.div`
  max-width: 1160px;
  margin: 0 auto;
  padding: 32px 24px 80px 24px;

  @media (max-width: 768px) {
    padding: 20px 16px 60px 16px;
  }
`;

export const HeroCard = styled.section`
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  padding: 40px;
  box-shadow: 0 4px 20px -2px rgba(15, 23, 42, 0.05);
  display: flex;
  gap: 36px;
  align-items: flex-start;
  margin-bottom: 32px;

  @media (max-width: 860px) {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 28px 20px;
    gap: 24px;
  }
`;

export const AvatarWrapper = styled.div`
  position: relative;
  flex-shrink: 0;

  img {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    object-fit: cover;
    border: 4px solid #ffffff;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.12);
  }

  .status-badge {
    position: absolute;
    bottom: 4px;
    right: 4px;
    background: #10b981;
    color: #ffffff;
    font-size: 0.72rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 9999px;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
    display: flex;
    align-items: center;
    gap: 4px;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    img {
      width: 120px;
      height: 120px;
    }
  }
`;

export const HeroInfo = styled.div`
  flex: 1;

  .name-row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;

    @media (max-width: 860px) {
      justify-content: center;
    }
  }

  h1 {
    font-size: 2.1rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.025em;

    @media (max-width: 768px) {
      font-size: 1.7rem;
    }
  }

  .experience-badge {
    background: #eff6ff;
    color: #1d4ed8;
    font-size: 0.8rem;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 9999px;
    border: 1px solid #bfdbfe;
  }

  .headline {
    font-size: 1.15rem;
    font-weight: 600;
    color: #2563eb;
    margin: 8px 0 16px 0;
    line-height: 1.4;

    @media (max-width: 768px) {
      font-size: 1rem;
    }
  }

  .location-row {
    display: flex;
    align-items: center;
    gap: 18px;
    color: #64748b;
    font-size: 0.9rem;
    margin-bottom: 20px;
    flex-wrap: wrap;

    span {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    @media (max-width: 860px) {
      justify-content: center;
      gap: 12px;
    }
  }
`;

export const ActionButtonsRow = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 860px) {
    justify-content: center;
  }
`;

export const PrimaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #2563eb;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 10px 18px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(37, 99, 235, 0.25);
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
  }

  svg {
    font-size: 1.1rem;
  }
`;

export const SecondaryButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #ffffff;
  color: #334155 !important;
  font-weight: 600;
  font-size: 0.92rem;
  padding: 10px 16px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #f1f5f9;
    border-color: #94a3b8;
    color: #0f172a !important;
    transform: translateY(-1px);
  }

  svg {
    font-size: 1.1rem;
    color: #475569;
  }
`;

export const ContactChipsList = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 18px;

  @media (max-width: 860px) {
    justify-content: center;
  }
`;

export const ContactChip = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  color: #475569;
  font-size: 0.85rem;
  padding: 6px 12px;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    border-color: #2563eb;
    color: #2563eb;
    background: #ffffff;
    box-shadow: 0 2px 6px rgba(37, 99, 235, 0.1);
  }

  svg {
    font-size: 0.95rem;
  }
`;

export const Section = styled.section`
  margin-bottom: 40px;
`;

export const SectionHeader = styled.div`
  margin-bottom: 24px;

  .subtitle {
    font-size: 0.82rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #2563eb;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 800;
    color: #0f172a;
    margin: 0;
    letter-spacing: -0.02em;
    display: flex;
    align-items: center;
    gap: 10px;

    @media (max-width: 768px) {
      font-size: 1.35rem;
    }
  }

  p {
    color: #64748b;
    font-size: 0.95rem;
    margin: 6px 0 0 0;
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 28px;
  box-shadow: 0 2px 12px -2px rgba(15, 23, 42, 0.04);
  transition: all 0.25s ease;

  &:hover {
    border-color: #cbd5e1;
    box-shadow: 0 8px 24px -4px rgba(15, 23, 42, 0.08);
  }

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

export const AboutContent = styled.div`
  font-size: 1.02rem;
  color: #334155;
  line-height: 1.75;

  p {
    margin: 0 0 16px 0;
    &:last-child {
      margin-bottom: 0;
    }
  }

  strong {
    color: #0f172a;
  }
`;

export const ProjectsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 20px;
  }
`;

export const ProjectCard = styled(Card)`
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
  border-top: 4px solid #2563eb;

  .project-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
    gap: 12px;
  }

  .project-title {
    font-size: 1.3rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .project-status {
    font-size: 0.75rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 9999px;
    background: #ecfdf5;
    color: #059669;
    border: 1px solid #a7f3d0;
    white-space: nowrap;
  }

  .project-tagline {
    font-size: 0.95rem;
    font-weight: 500;
    color: #1e293b;
    margin: 0 0 16px 0;
    line-height: 1.5;
  }

  .inteli-block {
    background: #f8fafc;
    border-radius: 8px;
    border-left: 3px solid #3b82f6;
    padding: 12px 14px;
    margin-bottom: 14px;
    font-size: 0.88rem;

    .label {
      font-weight: 700;
      color: #1e40af;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.04em;
    }

    .desc {
      color: #334155;
      line-height: 1.5;
      margin: 0;
    }
  }

  .highlights-title {
    font-size: 0.82rem;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    margin: 12px 0 8px 0;
  }

  ul.highlights-list {
    margin: 0 0 18px 0;
    padding-left: 20px;
    color: #334155;
    font-size: 0.88rem;
    line-height: 1.55;

    li {
      margin-bottom: 6px;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .tech-pills {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: auto;
    padding-top: 14px;
    border-top: 1px solid #f1f5f9;
    margin-bottom: 16px;
  }

  .tech-pill {
    background: #f1f5f9;
    color: #334155;
    font-size: 0.76rem;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 4px;
    border: 1px solid #e2e8f0;
  }

  .card-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }
`;

export const SkillsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 580px) {
    grid-template-columns: 1fr;
  }
`;

export const SkillCategoryCard = styled(Card)`
  padding: 22px;
  height: 100%;
  display: flex;
  flex-direction: column;

  .category-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 16px;

    .icon-box {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: #eff6ff;
      color: #2563eb;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    }

    h3 {
      font-size: 1.05rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
    }
  }

  .skill-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .skill-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.88rem;
    color: #334155;
    padding: 4px 0;
    border-bottom: 1px dashed #f1f5f9;

    &:last-child {
      border-bottom: none;
    }

    .skill-name {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;

      svg {
        color: #2563eb;
      }
    }

    .skill-exp {
      font-size: 0.75rem;
      color: #64748b;
      font-weight: 600;
      background: #f8fafc;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #e2e8f0;
    }
  }
`;

export const EducationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EducationCard = styled(Card)`
  display: flex;
  gap: 16px;
  align-items: flex-start;

  .edu-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #eff6ff;
    color: #2563eb;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    flex-shrink: 0;
  }

  .edu-info {
    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0 0 4px 0;
    }

    .institution {
      color: #2563eb;
      font-weight: 600;
      font-size: 0.92rem;
      margin: 0 0 4px 0;
    }

    .period {
      color: #64748b;
      font-size: 0.82rem;
      margin: 0 0 8px 0;
    }

    .details {
      color: #475569;
      font-size: 0.88rem;
      line-height: 1.5;
      margin: 0;
    }
  }
`;

export const ProfessionalContributions = styled(Card)`
  padding: 24px;
  margin-top: 24px;

  .contrib-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    flex-wrap: wrap;
    gap: 12px;

    h3 {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .count-badge {
      background: #eff6ff;
      color: #1d4ed8;
      font-size: 0.82rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 9999px;
      border: 1px solid #bfdbfe;
    }
  }

  .calendar-wrapper {
    overflow-x: auto;
    padding-bottom: 8px;
  }
`;

export const NormalFooter = styled.footer`
  border-top: 1px solid #e2e8f0;
  padding: 36px 0 20px 0;
  margin-top: 48px;
  text-align: center;
  color: #64748b;
  font-size: 0.88rem;

  .footer-links {
    display: flex;
    justify-content: center;
    gap: 20px;
    margin-bottom: 16px;

    a {
      color: #475569;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease;

      &:hover {
        color: #2563eb;
      }
    }
  }

  p {
    margin: 4px 0;
  }
`;
