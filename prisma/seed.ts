import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding Drwintech database…");

  // ============================================================
  // USERS
  // ============================================================
  const adminPwd = await bcrypt.hash("Admin12345!", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@drwintech.com" },
    update: {},
    create: {
      email: "admin@drwintech.com",
      name: "Admin Drwintech",
      password: adminPwd,
      role: "ADMIN",
    },
  });
  console.log("  ✓ admin:", admin.email, "/ Admin12345!");

  const clientPwd = await bcrypt.hash("Client12345!", 12);
  const client = await prisma.user.upsert({
    where: { email: "client@demo.com" },
    update: {},
    create: {
      email: "client@demo.com",
      name: "Client Démo",
      company: "Démo SARL",
      password: clientPwd,
      role: "CLIENT",
    },
  });
  console.log("  ✓ demo client:", client.email, "/ Client12345!");

  // ============================================================
  // SERVICES — 5 réels (Drwintech)
  // ============================================================
  // Mapping vers l'enum ServiceCategory existante :
  // web-mobile → WEB, custom → SOFTWARE, transformation → CONSULTING,
  // ai-data → SOFTWARE (pas d'enum AI dispo), security → IT_SECURITY
  const services = [
    {
      slug: "web-mobile",
      icon: "Smartphone",
      category: "WEB" as const,
      title_fr: "Développement Web & Mobile",
      title_en: "Web & Mobile Development",
      description_fr: "Conception et développement de sites web, plateformes et applications mobiles modernes, performantes et sécurisées.",
      description_en: "Design and development of modern, high-performance and secure websites, platforms and mobile applications.",
      order: 1,
    },
    {
      slug: "custom",
      icon: "Settings2",
      category: "SOFTWARE" as const,
      title_fr: "Solutions digitales sur mesure",
      title_en: "Custom digital solutions",
      description_fr: "Développement de solutions numériques adaptées aux besoins spécifiques de chaque organisation.",
      description_en: "Development of digital solutions tailored to the specific needs of each organization.",
      order: 2,
    },
    {
      slug: "transformation",
      icon: "Workflow",
      category: "CONSULTING" as const,
      title_fr: "Transformation digitale & automatisation",
      title_en: "Digital transformation & automation",
      description_fr: "Digitalisation et automatisation des processus métiers afin d'optimiser les performances opérationnelles.",
      description_en: "Digitization and automation of business processes to optimize operational performance.",
      order: 3,
    },
    {
      slug: "ai-data",
      icon: "Brain",
      category: "SOFTWARE" as const,
      title_fr: "Intelligence artificielle & data",
      title_en: "Artificial intelligence & data",
      description_fr: "Exploitation des données et de l'intelligence artificielle pour améliorer la prise de décision et la performance.",
      description_en: "Leveraging data and AI to improve decision-making and performance.",
      order: 4,
    },
    {
      slug: "security",
      icon: "ShieldCheck",
      category: "IT_SECURITY" as const,
      title_fr: "Cybersécurité & infrastructure IT",
      title_en: "Cybersecurity & IT infrastructure",
      description_fr: "Sécurisation, gestion et optimisation des infrastructures informatiques et systèmes d'information.",
      description_en: "Securing, managing and optimizing IT infrastructures and information systems.",
      order: 5,
    },
  ];

  // Nettoyer les anciens services qui ne sont plus dans la liste
  const newSlugs = services.map((s) => s.slug);
  await prisma.service.deleteMany({ where: { slug: { notIn: newSlugs } } });

  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
  console.log(`  ✓ ${services.length} services`);

  // ============================================================
  // TEAM — auteurs réels du blog Drwintech
  // ============================================================
  const team = [
    { slug: "nadia-dossa",         name: "Nadia A. Dossa",         role_fr: "Product Strategist",   role_en: "Product Strategist",   order: 1 },
    { slug: "wilfried-houngbedji", name: "Wilfried K. Houngbedji", role_fr: "Lead Data Architect",  role_en: "Lead Data Architect",  order: 2 },
    { slug: "cyrille-kossi",       name: "Cyrille A. Kossi",       role_fr: "Fullstack Engineer",   role_en: "Fullstack Engineer",   order: 3 },
  ];
  await prisma.teamMember.deleteMany({ where: { slug: { notIn: team.map((t) => t.slug) } } });
  for (const m of team) {
    await prisma.teamMember.upsert({ where: { slug: m.slug }, update: m, create: m });
  }
  console.log(`  ✓ ${team.length} team members`);

  // ============================================================
  // PORTFOLIO — 8 projets réels Drwintech, avec narration double diamant
  // ============================================================
  const projects = [
    {
      slug: "zetcha",
      category: "WEB" as const,
      title_fr: "ZETCHA — Cartes de visite numériques",
      title_en: "ZETCHA — Digital business cards",
      client: "Client privé",
      duration: "4 mois",
      teamSize: 5,
      coverImage: "linear-gradient(135deg,#06b6d4 0%,#6366f1 50%,#d946ef 100%)",
      liveUrl: "https://zetcha.com",
      featured: true,
      summary_fr: "Une solution innovante pour créer et partager facilement une carte de visite numérique professionnelle.",
      summary_en: "An innovative solution to create and share digital business cards effortlessly.",
      content_fr:
        "ZETCHA est une application web innovante conçue pour simplifier la création et le partage de cartes de visite numériques professionnelles. Cette solution répond aux besoins modernes des professionnels qui cherchent à améliorer leur visibilité digitale tout en adoptant une approche écologique. La plateforme offre une alternative moderne aux cartes en papier, accessible depuis n'importe quel appareil.",
      content_en:
        "ZETCHA is an innovative web application designed to simplify the creation and sharing of professional digital business cards. The platform offers a modern, eco-friendly alternative to paper cards, accessible from any device.",
      challenge_fr:
        "Comment offrir aux professionnels une carte de visite vraiment moderne, partageable en un geste, sans renoncer à la personnalisation ni à la sécurité des données ?",
      challenge_en:
        "How do we give professionals a truly modern business card — shareable in one gesture — without sacrificing personalization or data security?",
      discover_fr:
        "Entretiens avec 18 professionnels (commerciaux, consultants, freelances). Analyse des solutions existantes (Linq, Popl, HiHello). Cartographie des moments d'usage : événements, rendez-vous client, networking digital. Étude des contraintes écologiques et économiques des cartes papier.",
      discover_en:
        "18 interviews with professionals (salespeople, consultants, freelancers). Competitive analysis (Linq, Popl, HiHello). Mapping of usage moments: events, client meetings, digital networking. Study of environmental and economic constraints of paper cards.",
      define_fr:
        "Trois insights clés : (1) la rapidité de partage est plus importante que la richesse du contenu ; (2) un QR code seul suffit dans 80% des cas ; (3) la personnalisation visuelle est le marqueur de statut le plus important. Reformulation : « Concevoir le format de carte le plus rapide à partager au monde, avec une marge de personnalisation visuelle premium. »",
      define_en:
        "Three key insights: (1) sharing speed beats content richness; (2) a QR code alone suffices in 80% of cases; (3) visual customization is the strongest status marker. Reframed: \"Design the fastest business-card sharing format in the world, with premium visual customization.\"",
      develop_fr:
        "Stack : React + Node.js + PostgreSQL. 3 itérations de prototypes Figma testés avec 12 utilisateurs cibles. Génération QR dynamique, lien court personnalisé, mode offline. Pipeline d'export vCard. Tests A/B sur 2 variantes d'onboarding.",
      develop_en:
        "Stack: React + Node.js + PostgreSQL. 3 Figma prototype iterations tested with 12 target users. Dynamic QR generation, branded short links, offline mode. vCard export pipeline. A/B tests on 2 onboarding variants.",
      deliver_fr:
        "Lancement progressif sur invitation. Tableau de bord d'analytics intégré (vues, scans, conversions). Onboarding < 90 secondes mesuré. Plateforme scalable prête pour passer du B2C au B2B (équipes/entreprises).",
      deliver_en:
        "Progressive invite-only rollout. Built-in analytics dashboard (views, scans, conversions). Onboarding measured at < 90 seconds. Platform ready to scale from B2C to B2B (teams/companies).",
    },
    {
      slug: "hrh-semca",
      category: "SOFTWARE" as const,
      title_fr: "HRH SEMCA — Gestion RH santé",
      title_en: "HRH SEMCA — Healthcare HR system",
      client: "Secteur santé",
      duration: "7 mois",
      teamSize: 6,
      coverImage: "linear-gradient(135deg,#10b981 0%,#06b6d4 50%,#3b82f6 100%)",
      featured: true,
      summary_fr: "Système de gestion des ressources humaines pour les établissements de santé et médicaux.",
      summary_en: "Human resources management system for healthcare and medical facilities.",
      content_fr:
        "HRH SEMCA facilite la gestion du personnel médical et administratif dans les établissements de santé : plannings, congés, rotations, formations continues, paie.",
      content_en:
        "HRH SEMCA simplifies the management of medical and administrative staff in healthcare facilities: scheduling, leaves, rotations, continuing education, payroll.",
      challenge_fr:
        "Comment unifier la gestion RH d'un groupe hospitalier multi-sites où chaque service garde ses spécificités (urgences, bloc, ambulatoire, administratif) ?",
      challenge_en:
        "How do we unify HR across a multi-site hospital group while each unit (ER, OR, ambulatory, admin) keeps its specifics?",
      discover_fr:
        "Immersions dans 3 établissements, observation des cycles de planning sur 4 semaines. Entretiens avec DRH, cadres infirmiers, agents administratifs, médecins. Cartographie de 14 typologies de rotations différentes.",
      discover_en:
        "Immersions in 3 facilities, 4-week scheduling cycle observation. Interviews with HR directors, nursing supervisors, admin staff, physicians. Mapping of 14 different rotation patterns.",
      define_fr:
        "Le problème n'est pas la complexité des règles, mais la *visibilité* en temps réel sur les couvertures de service. Reformulation : « Un seul écran qui dit, à tout instant, qui couvre quoi — et qui alerte quand un trou apparaît. »",
      define_en:
        "The real problem isn't rule complexity — it's real-time *visibility* on shift coverage. Reframed: \"A single screen showing, at any moment, who covers what — and alerting whenever a gap appears.\"",
      develop_fr:
        "Architecture Django + PostgreSQL + Vue.js. Moteur de règles métier extensible. Module mobile pour les agents (changements de garde, demandes de congés). Intégration paie locale.",
      develop_en:
        "Django + PostgreSQL + Vue.js architecture. Extensible business-rules engine. Mobile module for staff (shift swaps, leave requests). Local payroll integration.",
      deliver_fr:
        "Déploiement en 3 vagues sur les sites pilotes. Formation des cadres en 8 sessions. Réduction des incidents de couverture observée dès le 2ème mois. Module reporting réglementaire (DPAE, DUE).",
      deliver_en:
        "Rollout in 3 waves across pilot sites. Supervisor training in 8 sessions. Coverage-incident reduction observed by month 2. Regulatory reporting module.",
    },
    {
      slug: "beeloyalty",
      category: "SOFTWARE" as const,
      title_fr: "Beeloyalty — Fidélisation mobile",
      title_en: "Beeloyalty — Mobile loyalty app",
      client: "E-commerce",
      duration: "5 mois",
      teamSize: 5,
      coverImage: "linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%)",
      featured: true,
      summary_fr: "Application mobile de fidélisation client avec système de points et récompenses personnalisées.",
      summary_en: "Mobile loyalty app with points and personalized rewards.",
      content_fr:
        "Beeloyalty transforme l'expérience client grâce à un programme de fidélité innovant et engageant, qui combine points, badges, défis et récompenses physiques ou digitales.",
      content_en:
        "Beeloyalty transforms customer experience through an innovative loyalty program combining points, badges, challenges and physical or digital rewards.",
      challenge_fr:
        "Comment passer d'une carte de fidélité oubliée au fond du portefeuille à un compagnon mobile que les clients ouvrent volontairement ?",
      challenge_en:
        "How do we move from a loyalty card forgotten in a wallet to a mobile companion customers willingly open?",
      discover_fr:
        "Étude qualitative de 24 clients fidèles et 12 churnés. Analyse de 9 mois d'historique d'achats. Benchmark de 7 apps de fidélité (Starbucks, Sephora, Decathlon, etc.). Identification des moments de frustration récurrents.",
      discover_en:
        "Qualitative study of 24 loyal customers and 12 churned ones. 9-month purchase history analysis. Benchmark of 7 loyalty apps (Starbucks, Sephora, Decathlon, etc.). Identification of recurring frustration moments.",
      define_fr:
        "La fidélité ne se gagne pas avec des points — elle se gagne en faisant gagner du *temps*. Reformulation : « L'app doit récompenser non pas l'achat, mais l'engagement quotidien (visite, partage, parrainage). »",
      define_en:
        "Loyalty isn't earned through points — it's earned by saving *time*. Reframed: \"The app must reward not the purchase, but the daily engagement (visits, sharing, referrals).\"",
      develop_fr:
        "React Native + Firebase + Node.js. 4 cycles de tests utilisateurs. Système de notifications contextuelles (géofencing). Gamification douce : streaks, défis hebdomadaires, leaderboards optionnels.",
      develop_en:
        "React Native + Firebase + Node.js. 4 user-testing cycles. Contextual notifications (geofencing). Soft gamification: streaks, weekly challenges, optional leaderboards.",
      deliver_fr:
        "Lancement multi-enseignes. Dashboard merchand pour suivre l'engagement par segment. Intégration avec les caisses pour scan immédiat. Taux d'usage hebdomadaire mesuré dès la première semaine.",
      deliver_en:
        "Multi-brand launch. Merchant dashboard to track engagement per segment. POS integration for instant scan. Weekly usage rate measured from week one.",
    },
    {
      slug: "adsgenious",
      category: "SOFTWARE" as const,
      title_fr: "Adsgenious — Plateforme campagnes",
      title_en: "Adsgenious — Campaign platform",
      client: "Agence marketing",
      duration: "6 mois",
      teamSize: 7,
      coverImage: "linear-gradient(135deg,#0ea5e9 0%,#7c3aed 50%,#ec4899 100%)",
      featured: true,
      summary_fr: "Plateforme intelligente de création et gestion de campagnes publicitaires multi-canaux.",
      summary_en: "Smart platform to create and manage multi-channel advertising campaigns.",
      content_fr:
        "Adsgenious permet aux entreprises de créer, gérer et optimiser leurs campagnes publicitaires en un seul endroit, avec recommandations basées sur l'historique de performance.",
      content_en:
        "Adsgenious lets companies create, manage and optimize advertising campaigns in one place, with AI-powered recommendations based on performance history.",
      challenge_fr:
        "Comment réduire le temps passé par les marketeurs à jongler entre Meta Ads, Google Ads, TikTok et LinkedIn — sans masquer la finesse de chaque plateforme ?",
      challenge_en:
        "How do we cut the time marketers spend juggling between Meta Ads, Google Ads, TikTok and LinkedIn — without hiding the finesse of each platform?",
      discover_fr:
        "Shadowing de 6 marketeurs pendant 2 jours chacun. Mesure des temps morts entre plateformes (en moyenne 38% du temps perdu en switching). Audit de 12 campagnes représentatives.",
      discover_en:
        "Shadowing 6 marketers for 2 days each. Measurement of platform-switching dead time (38% of time wasted on average). Audit of 12 representative campaigns.",
      define_fr:
        "Le copilote idéal n'est pas un orchestre, c'est un *chef d'orchestre*. L'app doit *recommander* et *préparer*, pas remplacer les interfaces natives. Reformulation : « Une couche d'orchestration au-dessus des plateformes, pas un substitut. »",
      define_en:
        "The ideal copilot isn't an orchestra — it's a *conductor*. The app must *recommend* and *prepare*, not replace native UIs. Reframed: \"An orchestration layer above the platforms, not a substitute.\"",
      develop_fr:
        "Next.js + TypeScript + MongoDB. Connecteurs API natives à chaque plateforme. Moteur de recommandations basé sur l'historique. UI conçue pour passer en un clic de la vision macro au paramètre fin.",
      develop_en:
        "Next.js + TypeScript + MongoDB. Native API connectors per platform. History-based recommendation engine. UI designed to switch in one click between macro view and fine parameter.",
      deliver_fr:
        "Onboarding agence en 30 minutes mesuré. Module d'A/B testing automatisé. Reporting clients en marque blanche. Gains de productivité documentés sur 4 agences pilotes.",
      deliver_en:
        "Agency onboarding measured at 30 minutes. Automated A/B testing module. White-label client reporting. Productivity gains documented across 4 pilot agencies.",
    },
    {
      slug: "afropostmedia",
      category: "MEDIA" as const,
      title_fr: "Afropostmedia — Hub média africain",
      title_en: "Afropostmedia — African media hub",
      client: "Média",
      duration: "3 mois",
      teamSize: 4,
      coverImage: "linear-gradient(135deg,#ea580c 0%,#dc2626 50%,#7c2d12 100%)",
      summary_fr: "Plateforme média digitale pour la promotion et le partage de contenus culturels africains.",
      summary_en: "Digital media platform promoting and sharing African cultural content.",
      content_fr:
        "Afropostmedia est un hub médiatique dédié à la culture africaine et à sa promotion mondiale, avec rédaction multilingue et distribution multi-formats.",
      content_en:
        "Afropostmedia is a media hub dedicated to African culture and its global promotion, with multilingual editorial and multi-format distribution.",
      challenge_fr:
        "Donner aux contenus culturels africains une vitrine éditoriale digne, sans tomber dans le folklore ni dans le journalisme générique.",
      challenge_en:
        "Give African cultural content an editorial showcase worthy of it — without falling into folklore or generic journalism.",
      discover_fr:
        "Entretiens avec 9 journalistes culturels, 4 rédacteurs en chef africains, 11 lecteurs réguliers. Cartographie des sujets sous-représentés. Analyse des canaux de diffusion (Web, Instagram, podcast).",
      discover_en:
        "Interviews with 9 cultural journalists, 4 African editors-in-chief, 11 regular readers. Mapping of under-represented topics. Distribution channel analysis (Web, Instagram, podcast).",
      define_fr:
        "Le problème n'est pas la production de contenu, mais sa *mise en scène*. Reformulation : « Construire le système éditorial le plus respectueux possible des récits africains, et le moins distrayant possible pour le lecteur. »",
      define_en:
        "The problem isn't content production — it's *staging*. Reframed: \"Build the editorial system most respectful of African narratives, and least distracting for the reader.\"",
      develop_fr:
        "Stack WordPress + PHP + MySQL, headless front Next.js sur les rubriques phares. Design system éditorial dédié (typo, photo, citations). Workflow rédactionnel allégé. Mode lecture sans tracker.",
      develop_en:
        "WordPress + PHP + MySQL stack, headless Next.js front for flagship sections. Dedicated editorial design system (typography, photography, quotes). Lightweight editorial workflow. Tracker-free reading mode.",
      deliver_fr:
        "Migration de l'archive en 6 semaines. Plateforme d'abonnements intégrée. Module podcast natif. Lancement public avec 40 articles d'amorce.",
      deliver_en:
        "6-week archive migration. Integrated subscription platform. Native podcast module. Public launch with 40 seed articles.",
    },
    {
      slug: "fewuproducts",
      category: "WEB" as const,
      title_fr: "FEWUPRODUCTS — Marketplace artisanale",
      title_en: "FEWUPRODUCTS — Artisan marketplace",
      client: "Commerce local",
      duration: "4 mois",
      teamSize: 5,
      coverImage: "linear-gradient(135deg,#16a34a 0%,#0ea5e9 50%,#a855f7 100%)",
      featured: true,
      summary_fr: "Marketplace e-commerce pour la vente et l'achat de produits locaux et artisanaux.",
      summary_en: "E-commerce marketplace for buying and selling local and artisan products.",
      content_fr:
        "FEWUPRODUCTS connecte les artisans locaux avec les consommateurs à la recherche de produits authentiques, avec gestion logistique adaptée au contexte ouest-africain.",
      content_en:
        "FEWUPRODUCTS connects local artisans with consumers seeking authentic products, with logistics tailored to the West African context.",
      challenge_fr:
        "Comment construire une marketplace authentique quand 70% des artisans ne maîtrisent pas la photo produit ni la gestion de stock ?",
      challenge_en:
        "How do we build an authentic marketplace when 70% of artisans don't master product photography or stock management?",
      discover_fr:
        "Visites de 22 ateliers artisanaux. Entretiens avec 14 consommateurs cibles. Analyse de la chaîne logistique (collecte, conditionnement, livraison dernier kilomètre).",
      discover_en:
        "Visits to 22 artisan workshops. Interviews with 14 target consumers. Logistics chain analysis (pickup, packaging, last-mile delivery).",
      define_fr:
        "Le frein n°1 n'est pas la demande, c'est la *présentation*. Reformulation : « Concevoir l'outil le plus simple possible pour qu'un artisan puisse mettre en vente un produit en moins de 3 minutes, depuis son téléphone, sans formation. »",
      define_en:
        "The #1 blocker isn't demand — it's *presentation*. Reframed: \"Design the simplest possible tool for an artisan to list a product in under 3 minutes, from their phone, with no training.\"",
      develop_fr:
        "Shopify + React + Stripe + Mobile Money. Studio photo simplifié intégré (recadrage auto, fond neutre). Onboarding artisan en présentiel pour les 50 premiers vendeurs.",
      develop_en:
        "Shopify + React + Stripe + Mobile Money. Built-in simplified photo studio (auto-crop, neutral background). In-person artisan onboarding for the first 50 sellers.",
      deliver_fr:
        "Lancement avec 120 artisans, 800+ références. Mode livraison locale + collecte centralisée. Programme d'éducation à la photo produit. Croissance organique mesurée mois après mois.",
      deliver_en:
        "Launched with 120 artisans, 800+ items. Local delivery mode + centralized pickup. Product-photo education program. Organic growth measured month over month.",
    },
    {
      slug: "juristouch",
      category: "SOFTWARE" as const,
      title_fr: "JURISTOUCH — Gestion juridique",
      title_en: "JURISTOUCH — Legal case management",
      client: "Cabinet juridique",
      duration: "5 mois",
      teamSize: 5,
      coverImage: "linear-gradient(135deg,#1e3a8a 0%,#0ea5e9 50%,#22d3ee 100%)",
      summary_fr: "Application web de gestion juridique et de suivi des dossiers pour les cabinets d'avocats.",
      summary_en: "Web application for legal case management and tracking for law firms.",
      content_fr:
        "JURISTOUCH simplifie la gestion des dossiers juridiques et améliore la productivité des cabinets d'avocats, avec coffre-fort numérique, calendrier des échéances et facturation au temps passé.",
      content_en:
        "JURISTOUCH simplifies legal case management and improves law firm productivity, with secure document vault, deadline calendar and time-based billing.",
      challenge_fr:
        "Réduire le temps administratif des avocats — souvent 40% de leur semaine — pour qu'ils se concentrent sur le conseil juridique.",
      challenge_en:
        "Cut the admin time of lawyers — often 40% of their week — so they focus on legal counsel.",
      discover_fr:
        "Entretiens avec 8 avocats, 3 secrétaires juridiques, 2 associés. Analyse de la circulation des dossiers physiques et numériques. Cartographie des points de fuite (emails, classement, suivi des délais).",
      discover_en:
        "Interviews with 8 lawyers, 3 legal secretaries, 2 partners. Analysis of physical and digital file flow. Mapping of leakage points (emails, filing, deadline tracking).",
      define_fr:
        "Le vrai gain n'est pas dans la digitalisation des dossiers (déjà partielle) mais dans la *centralisation des échéances*. Reformulation : « Un calendrier unique, opposable, qui alerte 7 jours avant chaque échéance critique. »",
      define_en:
        "The real gain isn't in digitizing files (already partial) but in *centralizing deadlines*. Reframed: \"A single, authoritative calendar that alerts 7 days before each critical deadline.\"",
      develop_fr:
        "Angular + Java + PostgreSQL. Coffre-fort chiffré côté serveur. OCR pour indexation auto des actes. Notifications multi-canaux. Audit trail complet pour la traçabilité.",
      develop_en:
        "Angular + Java + PostgreSQL. Server-side encrypted vault. OCR for auto-indexing of legal documents. Multi-channel notifications. Full audit trail for traceability.",
      deliver_fr:
        "Déploiement en 2 cabinets pilotes. Module facturation au temps. Connecteur RPVA et signatures électroniques eIDAS. Formation utilisateurs en demi-journée.",
      deliver_en:
        "Rollout in 2 pilot firms. Time-based billing module. RPVA connector and eIDAS e-signatures. Half-day user training.",
    },
    {
      slug: "hcbe-usa-c",
      category: "SOFTWARE" as const,
      title_fr: "HCBE USA-C — Gestion hospitalière IA",
      title_en: "HCBE USA-C — AI-powered hospital system",
      client: "Hôpital",
      duration: "8 mois",
      teamSize: 8,
      coverImage: "linear-gradient(135deg,#0891b2 0%,#7c3aed 50%,#db2777 100%)",
      featured: true,
      summary_fr: "Système de gestion hospitalière avec intégration de l'intelligence artificielle pour le diagnostic assisté.",
      summary_en: "Hospital management system with AI integration for diagnostic assistance.",
      content_fr:
        "HCBE USA-C combine gestion hospitalière et IA pour améliorer les soins aux patients, en assistant les praticiens dans la lecture d'imagerie et la priorisation des dossiers.",
      content_en:
        "HCBE USA-C combines hospital management and AI to improve patient care, assisting clinicians in imaging interpretation and case prioritization.",
      challenge_fr:
        "Intégrer l'IA dans un workflow hospitalier sans alourdir la charge mentale du praticien et en gardant la décision médicale entièrement humaine.",
      challenge_en:
        "Integrate AI into a hospital workflow without adding cognitive load on clinicians, and keeping the medical decision entirely human.",
      discover_fr:
        "30 entretiens cliniques (radiologues, urgentistes, médecins traitants). Observation en salle de lecture sur 5 jours. Revue de la littérature sur l'adoption de l'IA en imagerie. Cartographie des risques cliniques.",
      discover_en:
        "30 clinical interviews (radiologists, ER doctors, GPs). 5-day reading-room observation. Literature review on AI adoption in imaging. Clinical risk mapping.",
      define_fr:
        "L'IA ne doit jamais *diagnostiquer*, elle doit *attirer l'attention*. Reformulation : « Construire un assistant qui hiérarchise et signale, mais ne juge jamais à la place du praticien. »",
      define_en:
        "AI must never *diagnose* — it must *flag attention*. Reframed: \"Build an assistant that prioritizes and signals, but never judges in place of the clinician.\"",
      develop_fr:
        "Python + TensorFlow + FastAPI. Modèles pré-entraînés affinés sur la base anonymisée du partenaire. Interface conçue pour ne jamais cacher l'image source. Logs explicables pour chaque suggestion IA.",
      develop_en:
        "Python + TensorFlow + FastAPI. Pre-trained models fine-tuned on the partner's anonymized dataset. UI designed to never hide the source image. Explainable logs for every AI suggestion.",
      deliver_fr:
        "Déploiement progressif en 3 services. Gouvernance IA documentée (sources, biais, limites). Cycle de revue mensuelle des suggestions. Audit clinique de la qualité d'usage.",
      deliver_en:
        "Progressive rollout across 3 departments. Documented AI governance (sources, biases, limits). Monthly suggestion review cycle. Clinical audit of usage quality.",
    },
  ];

  const newProjectSlugs = projects.map((p) => p.slug);
  // Garder les anciens projets si l'admin en a créé. On supprime seulement les seeds anciens connus :
  const oldSlugs = ["lms-min-edu", "ecom-distrib", "mobility-app"];
  await prisma.project.deleteMany({
    where: { slug: { in: oldSlugs, notIn: newProjectSlugs } },
  });

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, clientUserId: client.id },
    });
  }
  console.log(`  ✓ ${projects.length} projects (avec narration double diamant)`);

  // ============================================================
  // INTERNAL DASHBOARD — rôle STAFF, suivi, ressources, accès, notes
  // ============================================================
  const staffPwd = await bcrypt.hash("Staff12345!", 12);
  const staff = await prisma.user.upsert({
    where: { email: "staff@drwintech.com" },
    update: { role: "STAFF" },
    create: {
      email: "staff@drwintech.com",
      name: "Membre Équipe",
      password: staffPwd,
      role: "STAFF",
    },
  });
  console.log("  ✓ staff:", staff.email, "/ Staff12345!");

  // Suivi projet : statut / avancement / priorité / dates (variés)
  const tracking: Record<
    string,
    { status: "PROSPECT" | "ACTIVE" | "ON_HOLD" | "COMPLETED" | "ARCHIVED";
      priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
      progress: number; startMonthsAgo: number; durationMonths: number }
  > = {
    zetcha:        { status: "COMPLETED", priority: "HIGH",     progress: 100, startMonthsAgo: 8, durationMonths: 4 },
    "hcbe-usa-c":  { status: "ACTIVE",    priority: "CRITICAL", progress: 65,  startMonthsAgo: 5, durationMonths: 7 },
    adsgenious:    { status: "ACTIVE",    priority: "HIGH",     progress: 40,  startMonthsAgo: 3, durationMonths: 6 },
    "hrh-semca":   { status: "ON_HOLD",   priority: "MEDIUM",   progress: 55,  startMonthsAgo: 6, durationMonths: 8 },
    beeloyalty:    { status: "COMPLETED", priority: "MEDIUM",   progress: 100, startMonthsAgo: 12, durationMonths: 5 },
    fewuproducts:  { status: "ACTIVE",    priority: "MEDIUM",   progress: 25,  startMonthsAgo: 2, durationMonths: 5 },
    juristouch:    { status: "PROSPECT",  priority: "LOW",      progress: 5,   startMonthsAgo: 0, durationMonths: 6 },
    afropostmedia: { status: "ARCHIVED",  priority: "LOW",      progress: 100, startMonthsAgo: 18, durationMonths: 4 },
  };

  const MONTH = 30 * 86400000;
  for (const p of projects) {
    const t = tracking[p.slug];
    if (!t) continue;
    const start = new Date(Date.now() - t.startMonthsAgo * MONTH);
    const end = new Date(start.getTime() + t.durationMonths * MONTH);
    await prisma.project.update({
      where: { slug: p.slug },
      data: {
        status: t.status,
        priority: t.priority,
        progress: t.progress,
        startDate: start,
        endDate: end,
      },
    });
  }
  console.log(`  ✓ suivi interne sur ${Object.keys(tracking).length} projets`);

  // Ressources, accès & notes — exemples sur 3 projets clés
  const seedProject = await prisma.project.findUnique({ where: { slug: "hcbe-usa-c" } });
  if (seedProject) {
    await prisma.projectResource.deleteMany({ where: { projectId: seedProject.id } });
    await prisma.projectAccess.deleteMany({ where: { projectId: seedProject.id } });
    await prisma.projectNote.deleteMany({ where: { projectId: seedProject.id } });

    await prisma.projectResource.createMany({
      data: [
        { projectId: seedProject.id, kind: "LINK", category: "SPEC",   label: "Cahier des charges fonctionnel", url: "https://docs.google.com/document/d/exemple-cdc" },
        { projectId: seedProject.id, kind: "LINK", category: "DESIGN", label: "Maquettes Figma — parcours imagerie", url: "https://figma.com/file/exemple-hcbe" },
        { projectId: seedProject.id, kind: "LINK", category: "DOC",    label: "Documentation API (Swagger)", url: "https://api.hcbe.example/docs" },
        { projectId: seedProject.id, kind: "LINK", category: "REPORT", label: "Compte-rendu atelier de cadrage", url: "https://notion.so/exemple-cr-cadrage" },
      ],
    });
    await prisma.projectAccess.createMany({
      data: [
        { projectId: seedProject.id, environment: "REPOSITORY",   label: "Dépôt GitHub", url: "https://github.com/drwintech/hcbe-usa-c", credentialHint: "Accès via l'organisation GitHub Drwintech" },
        { projectId: seedProject.id, environment: "STAGING",      label: "Préproduction", url: "https://staging.hcbe.example", credentialHint: "Identifiants dans le coffre Bitwarden — dossier HCBE" },
        { projectId: seedProject.id, environment: "PROJECT_MGMT", label: "Espace Notion projet", url: "https://notion.so/drwintech/hcbe" },
      ],
    });
    await prisma.projectNote.createMany({
      data: [
        { projectId: seedProject.id, authorId: admin.id, pinned: true,
          title: "Points de vigilance — gouvernance IA",
          body: "Documenter systématiquement les sources de données, les biais identifiés et les limites du modèle d'imagerie. Revue clinique mensuelle obligatoire avant toute mise en production d'une nouvelle suggestion." },
        { projectId: seedProject.id, authorId: staff.id, pinned: false,
          title: "CR réunion hebdo — semaine en cours",
          body: "Avancement intégration du module DICOM à 65%. Prochaine étape : tests de charge sur le pipeline d'inférence. Bloquant levé côté infrastructure GPU." },
      ],
    });
    console.log("  ✓ ressources / accès / notes d'exemple (projet HCBE USA-C)");
  }

  // ============================================================
  // JOBS — 5 postes Drwintech
  // ============================================================
  const jobs = [
    { slug: "chef-projet-digital",  department: "Management",   location: "Cotonou", type: "FULL_TIME" as const, remote: true,
      title_fr: "Chef·fe de projet digital",      title_en: "Digital Project Manager",
      description_fr: "Drwintech offre un cadre professionnel structuré, avec une vraie culture de l'excellence et du travail d'équipe. Vous pilotez la livraison de projets digitaux complexes, en lien direct avec les clients et l'équipe technique.",
      description_en: "Drwintech offers a structured professional setting with a real culture of excellence and teamwork. You drive the delivery of complex digital projects, working directly with clients and the tech team." },
    { slug: "data-analyst",         department: "Data",         location: "Cotonou", type: "FULL_TIME" as const, remote: true,
      title_fr: "Data Analyst",                    title_en: "Data Analyst",
      description_fr: "L'entreprise encourage l'évolution professionnelle et l'acquisition de nouvelles compétences. Vous travaillerez sur des problématiques data variées pour nos clients de tous secteurs.",
      description_en: "The company encourages professional growth and skill building. You'll work on diverse data problems for our clients across sectors." },
    { slug: "developpeur-mobile",   department: "Engineering",  location: "Cotonou", type: "FULL_TIME" as const, remote: true,
      title_fr: "Développeur·se Mobile",           title_en: "Mobile Developer",
      description_fr: "L'esprit d'équipe et la qualité de l'accompagnement font réellement la différence. Vous concevrez des applications mobiles natives ou cross-platform (React Native, Flutter).",
      description_en: "Team spirit and quality of mentoring truly make a difference. You'll design native or cross-platform mobile applications (React Native, Flutter)." },
    { slug: "ingenieur-logiciel",   department: "Engineering",  location: "Cotonou", type: "FULL_TIME" as const, remote: true,
      title_fr: "Ingénieur·e Logiciel",            title_en: "Software Engineer",
      description_fr: "Chez Drwintech, nous valorisons l'innovation et la prise d'initiative. Vous travaillerez sur des solutions techniques complexes dans un environnement stimulant.",
      description_en: "At Drwintech, we value innovation and initiative. You'll work on complex technical solutions in a stimulating environment." },
    { slug: "devops-engineer",      department: "Infrastructure", location: "Cotonou", type: "FULL_TIME" as const, remote: true,
      title_fr: "DevOps Engineer",                 title_en: "DevOps Engineer",
      description_fr: "L'automatisation et la rigueur sont au cœur de nos processus. C'est un plaisir de travailler sur des infrastructures modernes et scalables : CI/CD, cloud, monitoring.",
      description_en: "Automation and rigor are at the core of our processes. You'll work on modern, scalable infrastructures: CI/CD, cloud, monitoring." },
  ];

  await prisma.jobOpening.deleteMany({ where: { slug: { notIn: jobs.map((j) => j.slug) } } });
  for (const j of jobs) {
    await prisma.jobOpening.upsert({ where: { slug: j.slug }, update: j, create: j });
  }
  console.log(`  ✓ ${jobs.length} job openings`);

  // ============================================================
  // INVOICES DEMO
  // ============================================================
  await prisma.invoice.upsert({
    where: { number: "INV-2026-0001" },
    update: {},
    create: {
      number: "INV-2026-0001",
      userId: client.id,
      amount: "1250000",
      currency: "XOF",
      status: "PAID",
      paidAt: new Date(),
      description: "Acompte projet ZETCHA",
    },
  });
  await prisma.invoice.upsert({
    where: { number: "INV-2026-0002" },
    update: {},
    create: {
      number: "INV-2026-0002",
      userId: client.id,
      amount: "2400000",
      currency: "XOF",
      status: "SENT",
      dueAt: new Date(Date.now() + 30 * 86400000),
      description: "Solde projet ZETCHA",
    },
  });

  console.log("✅  Seed terminé.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
