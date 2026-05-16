import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱  Seeding database…");

  // Admin user
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
  console.log("  ✓ admin user:", admin.email, "/ Admin12345!");

  // Demo client
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

  // Services
  const services = [
    { slug: "consulting",   icon: "Compass",       category: "CONSULTING" as const,  title_fr: "Conseil & Transformation",     title_en: "Consulting & Transformation",      description_fr: "Audit, stratégie digitale et conduite du changement.", description_en: "Audits, digital strategy and change management.",        order: 1 },
    { slug: "it-security",  icon: "ShieldCheck",   category: "IT_SECURITY" as const, title_fr: "IT, Cybersécurité & Maintenance",title_en: "IT, Cybersecurity & Maintenance", description_fr: "Supervision, hardening, sauvegarde et continuité.",   description_en: "Monitoring, hardening, backups and continuity.",          order: 2 },
    { slug: "software",     icon: "Code2",         category: "SOFTWARE" as const,    title_fr: "Solutions sur mesure",          title_en: "Custom software",                  description_fr: "Apps web/mobile, APIs et intégrations métier.",        description_en: "Web/mobile apps, APIs and business integrations.",        order: 3 },
    { slug: "elearning",    icon: "GraduationCap", category: "ELEARNING" as const,   title_fr: "E-learning & Ingénierie péd.",  title_en: "E-learning & Pedagogy",            description_fr: "LMS, modules SCORM/xAPI, vidéos pédagogiques.",        description_en: "LMS, SCORM/xAPI modules, learning videos.",               order: 4 },
    { slug: "media",        icon: "Clapperboard",  category: "MEDIA" as const,       title_fr: "Production audiovisuelle",     title_en: "Media production",                 description_fr: "Films corporate, motion design, photo, podcasts.",     description_en: "Corporate films, motion design, photo, podcasts.",        order: 5 },
    { slug: "web",          icon: "Globe",         category: "WEB" as const,         title_fr: "Sites & Plateformes web",      title_en: "Web & Portals",                    description_fr: "Sites vitrines, e-commerce, portails clients.",        description_en: "Marketing sites, e-commerce, client portals.",            order: 6 },
  ];
  for (const s of services) {
    await prisma.service.upsert({ where: { slug: s.slug }, update: s, create: s });
  }
  console.log(`  ✓ ${services.length} services`);

  // Team
  const team = [
    { slug: "k-adjogan",   name: "K. Adjogan",   role_fr: "CEO & Stratège",      role_en: "CEO & Strategist", order: 1 },
    { slug: "f-dossou",    name: "F. Dossou",    role_fr: "CTO",                 role_en: "CTO",              order: 2 },
    { slug: "a-hounkpati", name: "A. Hounkpati", role_fr: "Lead Designer",       role_en: "Lead Designer",    order: 3 },
    { slug: "m-bocco",     name: "M. Bocco",     role_fr: "Lead Dev Web",        role_en: "Web Lead",         order: 4 },
    { slug: "s-yovo",      name: "S. Yovo",      role_fr: "Productrice AV",      role_en: "Media producer",   order: 5 },
    { slug: "t-kone",      name: "T. Kone",      role_fr: "Cyber-sécurité",      role_en: "Cybersecurity",    order: 6 },
  ];
  for (const m of team) {
    await prisma.teamMember.upsert({ where: { slug: m.slug }, update: m, create: m });
  }
  console.log(`  ✓ ${team.length} team members`);

  // === PROJECTS WITH FULL DOUBLE DIAMOND NARRATIVE ===
  const projects = [
    {
      slug: "lms-min-edu",
      category: "ELEARNING" as const,
      title_fr: "Plateforme LMS pour le Ministère de l'Éducation",
      title_en: "LMS platform for the Ministry of Education",
      client: "Ministère de l'Éducation",
      duration: "6 mois",
      teamSize: 7,
      coverImage: "linear-gradient(135deg,#06b6d4 0%,#6366f1 50%,#d946ef 100%)",
      summary_fr: "Une plateforme LMS clé en main pour 50 000 apprenants, 800 enseignants, 12 régions.",
      summary_en: "A turn-key LMS for 50,000 learners, 800 teachers across 12 regions.",
      content_fr:
        "Le Ministère souhaitait centraliser la formation continue de ses enseignants tout en offrant des parcours certifiants aux élèves du secondaire. Le défi : un déploiement national, des connexions intermittentes, des publics aux niveaux d'équipement très hétérogènes.",
      content_en:
        "The Ministry wanted to centralize teacher continuing education while offering certified learning paths to secondary students. The challenge: national rollout, intermittent connectivity, audiences with very heterogeneous equipment levels.",
      challenge_fr:
        "Comment garantir un accès équitable à la formation pour 50k apprenants répartis sur 12 régions, sans dépendre d'une bande passante stable, ni d'équipements modernes ?",
      challenge_en:
        "How can we guarantee equitable access to learning for 50k students across 12 regions, without relying on stable bandwidth or modern devices?",

      discover_fr:
        "10 immersions terrain dans 4 régions (centre urbain et zones rurales). 47 entretiens semi-directifs avec enseignants, élèves, directeurs d'établissement, parents. Cartographie des usages numériques existants, audit des infrastructures réseau, benchmark de 6 LMS (Moodle, Open edX, TalentLMS, etc.).",
      discover_en:
        "10 field immersions across 4 regions (urban hubs and rural areas). 47 semi-structured interviews with teachers, students, headmasters and parents. Mapping of existing digital practices, network infrastructure audit, benchmark of 6 LMS solutions (Moodle, Open edX, TalentLMS, etc.).",

      define_fr:
        "Trois insights clés : (1) la connectivité est l'obstacle n°1, le mode offline est non négociable ; (2) les enseignants veulent garder la main sur le contenu, pas un système descendant ; (3) la motivation des élèves dépend de la reconnaissance — badges, certificats et restitution publique. Problématique reformulée : « Concevoir un LMS qui fonctionne d'abord hors-ligne, qui rend les enseignants auteurs et les élèves fiers. »",
      define_en:
        "Three key insights: (1) connectivity is the #1 blocker, offline-first is non-negotiable; (2) teachers want to own the content, not a top-down system; (3) student motivation hinges on recognition — badges, certificates, public showcase. Reframed: \"Design an LMS that works offline first, makes teachers authors, and makes students proud.\"",

      develop_fr:
        "5 ateliers de co-conception avec enseignants pilotes. Architecture progressive web app (PWA) avec synchronisation différée. 3 itérations de prototypage Figma, 2 tests utilisateurs guidés (n=24). Choix techniques : Next.js + IndexedDB côté client, Moodle modulaire côté serveur, SCORM 2004 et xAPI pour la portabilité.",
      develop_en:
        "5 co-design workshops with pilot teachers. Progressive web app (PWA) architecture with deferred sync. 3 Figma prototype iterations, 2 moderated user tests (n=24). Tech choices: Next.js + IndexedDB client-side, modular Moodle backend, SCORM 2004 and xAPI for portability.",

      deliver_fr:
        "Déploiement progressif sur 12 régions en 4 vagues (3 mois). Programme de formation des formateurs (28 sessions, 142 enseignants certifiés). 1 200 modules pédagogiques mis en ligne en 6 mois. Système de monitoring temps réel pour l'équipe ministérielle. Taux d'adoption : 87% des enseignants actifs au mois 6.",
      deliver_en:
        "Progressive rollout across 12 regions in 4 waves (3 months). Train-the-trainer program (28 sessions, 142 certified teachers). 1,200 learning modules online within 6 months. Real-time monitoring dashboard for the ministry team. Adoption rate: 87% of teachers active by month 6.",

      featured: true,
    },

    {
      slug: "ecom-distrib",
      category: "WEB" as const,
      title_fr: "Refonte e-commerce omnicanal",
      title_en: "Omnichannel e-commerce redesign",
      client: "Distributeur ouest-africain",
      duration: "5 mois",
      teamSize: 6,
      coverImage: "linear-gradient(135deg,#f97316 0%,#ec4899 50%,#8b5cf6 100%)",
      summary_fr: "Refonte complète d'une boutique multi-pays avec gestion stock temps réel et click & collect.",
      summary_en: "Full redesign of a multi-country store with real-time stock and click & collect.",
      content_fr:
        "Un distributeur opérant dans 4 pays voulait unifier ses canaux de vente (boutiques physiques, site web, marketplaces) autour d'une plateforme unique, performante, et capable de tenir les pics de Black Friday.",
      content_en:
        "A distributor operating in 4 countries wanted to unify its sales channels (physical stores, web, marketplaces) around a single, performant platform able to handle Black Friday peaks.",
      challenge_fr:
        "Unifier 4 systèmes de caisse, 18 entrepôts et 3 marketplaces sous une seule plateforme — sans interruption de service pendant la bascule.",
      challenge_en:
        "Unify 4 POS systems, 18 warehouses and 3 marketplaces into one platform — with zero service interruption during cutover.",

      discover_fr:
        "Shadowing de 5 jours en boutique et en entrepôt. Analyse de 18 mois de données de ventes (panier moyen, taux de retour, ruptures). 22 entretiens clients, 9 entretiens vendeurs. Audit Lighthouse de l'ancien site : score 28/100 sur mobile.",
      discover_en:
        "5-day shadowing in stores and warehouses. 18-month sales data analysis (basket size, return rate, stockouts). 22 customer interviews, 9 staff interviews. Lighthouse audit of the legacy site: 28/100 mobile score.",

      define_fr:
        "Découverte clé : 64% des paniers étaient abandonnés à l'étape « livraison » car la disponibilité affichée n'était pas fiable. Reformulation : « Faire de la promesse de disponibilité un avantage compétitif. » Trois quick wins identifiés, trois chantiers structurants (catalogue unifié, stock temps réel, checkout 2 étapes).",
      define_en:
        "Key finding: 64% of carts were abandoned at the \"shipping\" step because displayed availability was unreliable. Reframed: \"Turn the availability promise into a competitive edge.\" Three quick wins, three structural workstreams (unified catalog, real-time stock, 2-step checkout).",

      develop_fr:
        "Stack headless : Next.js 16 (front), Commerce backend custom (PHP/Symfony existant conservé), bus d'événements Kafka pour la synchro stock, Stripe + Wave + cash-on-delivery côté paiement. Design system rebrandé. A/B test sur 3 variantes de checkout (n=14 000 visiteurs).",
      develop_en:
        "Headless stack: Next.js 16 (front), custom commerce backend (existing PHP/Symfony preserved), Kafka event bus for stock sync, Stripe + Wave + cash-on-delivery payments. Rebranded design system. A/B test on 3 checkout variants (n=14,000 visitors).",

      deliver_fr:
        "Bascule progressive sur 6 semaines, 0 minute d'interruption. Lighthouse mobile : 92/100. Taux de conversion +38%, panier moyen +21%, taux d'abandon checkout divisé par 2,4. Black Friday tenu sans incident (pic à 3 200 commandes/h).",
      deliver_en:
        "Progressive cutover over 6 weeks, zero downtime. Lighthouse mobile: 92/100. Conversion +38%, basket size +21%, checkout abandonment divided by 2.4. Black Friday handled flawlessly (peak 3,200 orders/h).",

      featured: true,
    },

    {
      slug: "mobility-app",
      category: "SOFTWARE" as const,
      title_fr: "Application de mobilité urbaine partagée",
      title_en: "Shared urban mobility application",
      client: "Ville de Cotonou",
      duration: "8 mois",
      teamSize: 9,
      coverImage: "linear-gradient(135deg,#10b981 0%,#06b6d4 50%,#3b82f6 100%)",
      summary_fr: "Une app multimodale (zems, taxis collectifs, vélos) pour faciliter les déplacements à Cotonou.",
      summary_en: "A multimodal app (motorcycle taxis, shared taxis, bikes) to ease travel in Cotonou.",
      content_fr:
        "La municipalité voulait offrir aux habitants une alternative numérique fiable à la négociation rue par rue, et structurer un secteur informel autour d'un standard tarifaire transparent.",
      content_en:
        "The city wanted to give residents a reliable digital alternative to street-by-street price negotiation, and structure an informal sector around a transparent fare standard.",
      challenge_fr:
        "Numériser une mobilité largement informelle, sans exclure les conducteurs non équipés en smartphone, ni les usagers sans compte bancaire.",
      challenge_en:
        "Digitize a largely informal mobility ecosystem — without excluding drivers without smartphones, or users without bank accounts.",

      discover_fr:
        "30 jours d'observation participante (4 chercheurs, plus de 200 trajets). Cartographie des 9 grands axes de la ville. Entretiens avec 38 conducteurs zem, 22 usagers réguliers, 4 syndicats, 2 régulateurs. Analyse comparée des modèles Uber, Yango, Heetch en Afrique de l'Ouest.",
      discover_en:
        "30 days of participant observation (4 researchers, 200+ trips). Mapping of the city's 9 main axes. Interviews with 38 motorcycle taxi drivers, 22 regular users, 4 unions, 2 regulators. Comparative analysis of Uber, Yango, Heetch models in West Africa.",

      define_fr:
        "Constat fort : un quart des conducteurs n'a pas de smartphone Android compatible. Insight : tout pivote sur la confiance — sur le prix annoncé, sur la sécurité, sur l'identité du conducteur. Reformulation : « Concevoir une app qui rassure d'abord, qui négocie ensuite. »",
      define_en:
        "Hard fact: a quarter of drivers don't own a compatible Android smartphone. Insight: everything hinges on trust — on the quoted fare, on safety, on driver identity. Reframed: \"Design an app that reassures first, negotiates second.\"",

      develop_fr:
        "Double interface : app passager (React Native) + interface USSD pour les conducteurs non équipés. Système de prix transparent calculé géographiquement (PostGIS). Paiements via Mobile Money (MTN, Moov) + cash. 3 cycles de prototype testés sur le terrain, dont un pilote de 4 semaines avec 80 conducteurs.",
      develop_en:
        "Dual interface: passenger app (React Native) + USSD interface for drivers without smartphones. Transparent fare engine computed geographically (PostGIS). Payments via Mobile Money (MTN, Moov) + cash. 3 prototype cycles tested in the field, including a 4-week pilot with 80 drivers.",

      deliver_fr:
        "Lancement public en 2 phases. 12 000 téléchargements au mois 1, 41 000 au mois 3. 600 conducteurs onboardés, dont 180 via USSD. Note moyenne 4,6/5. La municipalité a fait évoluer son cadre réglementaire en s'appuyant sur les données anonymisées de la plateforme.",
      deliver_en:
        "Two-phase public launch. 12,000 downloads in month 1, 41,000 by month 3. 600 drivers onboarded, including 180 via USSD. Average rating 4.6/5. The city evolved its regulatory framework using anonymized platform data.",

      featured: false,
    },
  ];

  for (const p of projects) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      update: p,
      create: { ...p, clientUserId: client.id },
    });
  }
  console.log(`  ✓ ${projects.length} projects with full double-diamond narratives`);

  // Sample job openings
  const jobs = [
    { slug: "fullstack-engineer", department: "Engineering", location: "Cotonou", type: "FULL_TIME" as const, remote: true,  title_fr: "Ingénieur·e Full-stack senior", title_en: "Senior Full-stack Engineer", description_fr: "Vous rejoindrez l'équipe…", description_en: "You will join…" },
    { slug: "ux-designer",        department: "Design",      location: "Cotonou", type: "FULL_TIME" as const, remote: true,  title_fr: "UX/UI Designer",                 title_en: "UX/UI Designer",              description_fr: "Vous concevrez les…", description_en: "You'll design…" },
    { slug: "pedagogy-lead",      department: "E-learning",  location: "Cotonou", type: "FULL_TIME" as const, remote: false, title_fr: "Lead ingénierie pédagogique",    title_en: "Pedagogy Lead",               description_fr: "Vous structurerez les…", description_en: "You'll structure…" },
  ];
  for (const j of jobs) {
    await prisma.jobOpening.upsert({ where: { slug: j.slug }, update: j, create: j });
  }
  console.log(`  ✓ ${jobs.length} job openings`);

  // Demo invoices
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
      description: "Acompte projet LMS",
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
      description: "Solde projet LMS",
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
