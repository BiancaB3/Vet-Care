"use client";
import Link from "next/link";
import styles from "./page.module.css";

export default function LandingPage() {
  const scrollToSection = (section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <div className={`${styles.container} ${styles.headerInner}`}>
          <div className={styles.brand}>
            <img src="/LOGOVETCARE.png" alt="VetCare" className={styles.brandLogo} />
            <h1 className={styles.brandTitle}>VetCare</h1>
          </div>
          <div className={styles.headerActions}>
            <button onClick={() => scrollToSection("features")} className={styles.navButton}>Recursos</button>
            <Link href="/login" className={styles.primaryButton}>Acessar</Link>
          </div>
        </div>
      </header>

      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroGrid}>
            <div className={styles.heroContent}>
              <div className={styles.heroText}>
                <h2 className={styles.heroTitle}>Bem-vindo ao VetCare</h2>
                <p className={styles.heroSubtitle}>Sistema completo de gestão veterinária para clínicas e consultórios modernos</p>
              </div>
              <div className={styles.heroActions}>
                <Link href="/login" className={styles.primaryButton}>Comece Agora</Link>
                <button onClick={() => scrollToSection("features")} className={styles.secondaryButton}>Saiba Mais</button>
              </div>
              <div className={styles.stats}>
                <div className={styles.stat}>
                  <p className={styles.statValue}>100%</p>
                  <p className={styles.statLabel}>Digital</p>
                </div>
                <div className={styles.stat}>
                  <p className={styles.statValue}>24/7</p>
                  <p className={styles.statLabel}>Disponível</p>
                </div>
                <div className={styles.stat}>
                  <p className={styles.statValue}>∞</p>
                  <p className={styles.statLabel}>Escalável</p>
                </div>
              </div>
            </div>
            <div className={styles.visualWrap}>
              <div className={styles.visualCard}>
                <svg className={styles.visualSvg} viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="200" cy="200" r="180" fill="none" stroke="#a2d4b8" strokeWidth="2" opacity="0.3"></circle>
                  <circle cx="200" cy="200" r="120" fill="none" stroke="#a2d4b8" strokeWidth="2" opacity="0.5"></circle>
                  <circle cx="200" cy="200" r="60" fill="none" stroke="#a2d4b8" strokeWidth="2"></circle>
                  <rect x="160" y="160" width="80" height="80" rx="8" fill="#a2d4b8" opacity="0.2"></rect>
                  <circle cx="120" cy="120" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                  <circle cx="280" cy="120" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                  <circle cx="120" cy="280" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                  <circle cx="280" cy="280" r="20" fill="#7bc4a1" opacity="0.7"></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className={styles.sectionWhite}>
        <div className={styles.container}>
          <div className={styles.sectionHeading}>
            <h3 className={styles.sectionTitle}>Recursos Poderosos</h3>
            <p className={styles.sectionSubtitle}>Tudo que você precisa para gerenciar sua clínica veterinária</p>
          </div>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path></svg>
              </div>
              <h4 className={styles.featureTitle}>Agenda Inteligente</h4>
              <p className={styles.featureText}>Gerencie consultas com facilidade e nunca perca um agendamento</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><rect width="16" height="20" x="4" y="2" rx="2" /><path d="M8 2v4" /><path d="M16 2v4" /><path d="M12 10h4" /><path d="M12 14h4" /><path d="M8 10h.01" /><path d="M8 14h.01" /></svg>
              </div>
              <h4 className={styles.featureTitle}>Prontuários Digitais</h4>
              <p className={styles.featureText}>Histórico completo de cada paciente ao alcance de um clique</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><path d="M10 12v4" /><path d="M14 12v4" /><path d="M7 16v2a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-2" /><path d="M17 16V7a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v9" /><path d="M3 7h18" /><path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2" /></svg>
              </div>
              <h4 className={styles.featureTitle}>Gestão de Pets</h4>
              <p className={styles.featureText}>Cadastre e acompanhe todos os seus pacientes animais</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" style={{color: 'white'}} stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7" aria-hidden="true"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
              </div>
              <h4 className={styles.featureTitle}>Controle de Tutores</h4>
              <p className={styles.featureText}>Mantenha dados completos e comunicação eficiente com os tutores</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.sectionSoft}>
        <div className={`${styles.container} ${styles.ctaBox}`}>
          <h3 className={styles.sectionTitle}>Pronto para começar?</h3>
          <p className={styles.sectionSubtitle}>Crie sua conta agora e acesse todos os recursos do VetCare</p>
          <div className={styles.ctaActions}>
            <Link href="/login" className={styles.primaryButton}>Acessar Sistema</Link>
            <button
              onClick={scrollToTop}
              className={styles.backToTopButton}
            >
              Voltar ao Topo
            </button>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div>
              <div className={styles.footerBrand}>
                <div className={styles.footerLogoBox}>
                  <svg className="w-6 h-6" viewBox="0 0 140 160" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M70 15 C70 15, 25 35, 25 80 C25 125, 70 155, 70 155 C70 155, 115 125, 115 80 C115 35, 70 15, 70 15 Z" fill="#fefcf4" stroke="#e8e3d8" strokeWidth="1.5" />
                    <rect width="140" height="160" fill="#a2d4b8" opacity="0.7" />
                    <ellipse cx="70" cy="35" rx="20" ry="15" fill="white" opacity="0.25" />
                  </svg>
                </div>
                <h3 className={styles.footerColumnTitle}>VetCare</h3>
              </div>
              <p className={styles.footerText}>Sistema de gestão veterinária moderno e confiável</p>
            </div>
            <div>
              <h4 className={styles.footerColumnTitle}>Produto</h4>
              <ul className={styles.footerLinkList}>
                <li><button onClick={() => scrollToSection("features")} className={styles.footerLinkButton}>Recursos</button></li>
                <li><a href="#" className={styles.footerLink}>Preços</a></li>
                <li><a href="#" className={styles.footerLink}>Segurança</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerColumnTitle}>Empresa</h4>
              <ul className={styles.footerLinkList}>
                <li><a href="#" className={styles.footerLink}>Sobre</a></li>
                <li><a href="#" className={styles.footerLink}>Blog</a></li>
                <li><a href="#" className={styles.footerLink}>Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className={styles.footerColumnTitle}>Legal</h4>
              <ul className={styles.footerLinkList}>
                <li><a href="#" className={styles.footerLink}>Privacidade</a></li>
                <li><a href="#" className={styles.footerLink}>Termos</a></li>
                <li><a href="#" className={styles.footerLink}>Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className={styles.footerBottom}>
            <p>© 2024 VetCare. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
