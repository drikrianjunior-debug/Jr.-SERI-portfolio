import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from "jspdf";
import emailjs from '@emailjs/browser';

// --- STYLES ---
const inputStyle = { 
  background: 'rgba(255,255,255,0.02)', 
  border: '1px solid rgba(255,255,255,0.08)', 
  padding: '1rem', 
  color: '#fff', 
  fontFamily: 'monospace', 
  fontSize: '0.75rem', 
  borderRadius: '4px', 
  outline: 'none', 
  appearance: 'none',
  WebkitAppearance: 'none',
  MozAppearance: 'none'
};

const buttonStyle = { 
  background: '#c5a059', 
  border: 'none', 
  padding: '1rem', 
  color: '#000', 
  fontFamily: '"Syne", sans-serif', 
  fontWeight: '600', 
  fontSize: '0.85rem', 
  borderRadius: '4px', 
  cursor: 'pointer' 
};

const sectionStyle = {
  width: '100%',
  minHeight: '100vh',
  padding: '0 10%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  position: 'relative',
  boxSizing: 'border-box',
  scrollSnapAlign: 'start',
  overflow: 'hidden'
};

// --- COMPOSANTS INTERNES ---
function FadeInSection({ id, children }) {
  return (
    <section id={id} style={sectionStyle}>
      <motion.div
        initial={{ opacity: 0, y: 40, filter: 'blur(4px)' }}
        whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        style={{ pointerEvents: 'auto' }}
      >
        {children}
      </motion.div>
    </section>
  );
}

function Objective({ title, items }) {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} style={{ cursor: 'pointer', marginBottom: '2rem' }}>
      <motion.h2 animate={{ color: isHovered ? '#c5a059' : '#fff' }} style={{ fontFamily: '"Syne", sans-serif', fontSize: '3rem', fontWeight: '500', marginBottom: '1.5rem' }}>
        {title}
      </motion.h2>
      <AnimatePresence>
        {isHovered && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            {items.map((item, index) => (
              <p key={index} style={{ fontWeight: '350', fontFamily: 'monospace', fontSize: '0.8rem', lineHeight: '1.6', marginBottom: '1rem' }}>
                <strong>{item.label}</strong><br />{item.text}
              </p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Définissez le tableau ici, juste au-dessus de la fonction du composant
const services = [
  { value: "web", label: "Développement Web" },
  { value: "mobile", label: "Développement Mobile" },
  { value: "design", label: "UI/UX Design" }
];
// --- COMPOSANT PRINCIPAL ---
export default function SectionsContainer() {
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [formData, setFormData] = useState({
    service: "",
    ecrans: "Mobile",
    delai: "",
    profil: "Institution"
  });

  const [visibleFields, setVisibleFields] = useState({
  email: false,
  telephone: false,
  service: false,
  date: false,
  message: false,
  // Ajouts pour l'estimation
  ecrans: false,
  delai: false,
  profil: false
});

// Fonction pour gérer l'affichage au fur et à mesure
const handleFieldChange = (e, nextField) => {
  if (e.target.value.trim() !== "") {
    setVisibleFields(prev => ({ ...prev, [nextField]: true }));
  }
};

  const services = [
    { value: "site-landing", label: "Site Vitrine (Landing page)", basePrice: 228.67 },
    { value: "site-pages", label: "Site Vitrine (Plusieurs pages)", basePrice: 304.89 },
    { value: "maquette", label: "Maquette site & app web", basePrice: 609.79 },
    { value: "ecommerce", label: "E-commerce Web", basePrice: 609.79 },
    { value: "app-vitrine", label: "App Web (Vitrine)", basePrice: 304.89 },
    { value: "app-ecommerce", label: "App Web (E-commerce)", basePrice: 762.24 },
    { value: "app-mobile", label: "App Mobile", basePrice: 1295.81 }
  ];

const calculatePrice = (data) => {
  const service = services.find(s => s.value === data.service);
  if (!service) return 0;
  
  let total = service.basePrice;

  // Définition des coûts par écran
  const coutMobile = 50;
  const coutOrdinateur = 100;
  const coutTablettes = 75;

  // Logique de calcul
  if (data.ecrans === "Mobile") {
    total += coutMobile;
  } else if (data.ecrans === "Ordinateur") {
    total += coutOrdinateur;
  } else if (data.ecrans === "Tablettes") {
    total += coutTablettes;
  } else if (data.ecrans === "Tous les écrans") {
    // Somme de tous les écrans
    total += (coutMobile + coutOrdinateur + coutTablettes);
  }

  // Ajout du surcoût profil (Institution)
  if (data.profil === "Institution") total += 200;

  // Logique de délai (inchangée)
  if (data.delai) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(data.delai);
    const diffDays = Math.ceil((selectedDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) total += 400;
    else if (diffDays <= 7) total += 200;
    else if (diffDays <= 14) total += 100;
    else if (diffDays <= 21) total += 80;
  }

  return total.toFixed(2);
};


  const updateForm = (key, value) => {
    const newData = { ...formData, [key]: value };
    setFormData(newData);
    setSelectedPrice(calculatePrice(newData));
  };

const downloadPDF = () => {
  const doc = new jsPDF();

  // 1. En-tête
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text("Jr. SERI by H&Dev", 20, 20);
  
  doc.setFontSize(16);
  doc.text("Estimation de Service", 20, 30);
  doc.line(20, 35, 190, 35);

  // 2. Détails du projet
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  let y = 50;
  const details = [
    { label: "Service", value: formData.service },
    { label: "Écrans", value: formData.ecrans },
    { label: "Type d'entreprise", value: formData.profil },
    { label: "Date cible (délai)", value: formData.delai }
  ];

  details.forEach((item) => {
    doc.text(`${item.label} : ${item.value || 'Non spécifié'}`, 20, y);
    y += 10;
  });

  // 3. Prix total
  y += 10;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(197, 160, 89);
  doc.text(`Estimation totale : ${selectedPrice} EUR`, 20, y);

  // 4. Bloc Contact (Nouveau)
  y += 30;
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text("Pour valider ou discuter de ce projet :", 20, y);
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  y += 8;
  doc.text("Téléphone : +225 07 59 12 80 35", 20, y);
  y += 6;
  doc.text("Email : junser700@gmail.com", 20, y);

  // 5. Pied de page
  doc.setFontSize(10);
  doc.text("Document généré le " + new Date().toLocaleDateString(), 20, 280);

  doc.save(`Estimation_${formData.service || 'projet'}.pdf`);
};

  const handleSubmit = (e) => {
  e.preventDefault();

  // Remplacez par vos vrais ID (ne les mettez pas en dur dans une prod réelle, utilisez des variables d'environnement)
  emailjs.sendForm('service_3pl4k3d', 'template_lgoxvur', e.target, 'iBw2dzjTQExbW6XXh')
    .then((result) => {
        alert("Message envoyé avec succès !");
        e.target.reset(); // Réinitialise le formulaire
    }, (error) => {
        alert("Erreur lors de l'envoi : " + error.text);
    });
};



  return (
    <div id="principes-objectifs" style={{ position: 'relative', width: '100%' }}>
      
      {/* Première section mise à jour avec le composant interactif */}
      <FadeInSection id="principes-objectifs">
  <Objective 
    title="Principes & Objectifs" 
    items={[
      { label: "~ L'esthétique du code ~", text: "Dépasser la simple fonctionnalité pour transformer le code en un vecteur d'émotion." },
      { label: "~ L'interface liquide ~", text: "Les standards du web (menus fixes, scrolls linéaires) sont efficaces, mais parfois prévisibles. L'objectif est de réinventer la navigation pour qu'elle devienne une exploration." },
      { label: "~ Le luxe technique ~", text: "Dans un monde où tout est rapide, l'originalité consiste à créer des expériences extrêmement lourdes visuellement (3D temps réel, shaders complexes) qui restent imperceptiblement légères. L'objectif est de pousser l'optimisation à son paroxysme pour que la technologie disparaisse totalement derrière une expérience fluide, créant un sentiment de magie pure pour l'utilisateur final." },
      { label: "~ Le design narratif ~", text: "Le développeur original ne se contente pas de traduire une maquette, il raconte une histoire à travers la structure même de son code." },
      { label: "~ La résilience créative ~", text: "L'originalité se trouve aussi dans la gestion des problèmes. S' orienter vers l'originalité pour toujours chercher la solution la plus élégante plutôt que la plus rapide. L'objectif est de concevoir des systèmes modulaires et innovants, capables d'évoluer, qui prouvent qu'un problème technique complexe peut être résolu avec une simplicité surprenante et une clarté de structure exemplaire." }
    ]}
  />
</FadeInSection>

      {/* Les autres sections restent inchangées */}
      <FadeInSection id="diplomes-formations">
        <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '3rem', fontWeight: '500', marginBottom: '1.5rem' }}>Diplômes + Formations</h2>
        <p style={{ fontFamily: 'monospace', fontSize: '1rem', lineHeight: '1.8', maxWidth: '650px', opacity: 1, fontWeight: '400', color : '#fff' }}>
          <u style={{color : '#c5a059'}}>[BACCALAUREAT D]</u><br />
          Cours Secondaire Méthodiste de Koumassi : 2016 - 2017.<br />
          <u style={{color : '#c5a059'}}>[LICENCE PROFESSIONNELLE 1, 2 et 3]</u><br />
          Université Tertiaire et Technologique LOKO - Marcory : 2017 - 2020. <br />
          <u style={{color : '#c5a059'}}>[FORMATION WINDEV]</u><br />
          Formation en programmation avec le logiciel WINDEV : 2020. <br />
          <u style={{color : '#c5a059'}}>[FORMATION LANGUE ALLEMANDE]</u><br />
          Formation en Allemand au German Center (Abidjan, Cocody Angré, les OSCARS) : 2025 - 2026. 
        </p>
      </FadeInSection>

<FadeInSection id="experience-realisations">
  <div style={{
  display: 'flex',
  flexDirection: window.innerWidth < 1025 ? 'column' : 'row',
  gap: '2rem'
}}>
    
    {/* COLONNE GAUCHE : EXPÉRIENCES */}
    <div>
      <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '3rem', fontWeight: '500', marginBottom: '2rem' }}>Expériences •</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {[
          { title: "DÉVELOPPEUR WEB", company: "BIN LENOIR", desc: "Développeur du site de BIN LENOIR - ABIDJAN, COCODY ANGRE 7E TRANCHE (2022- 2023)" },
          { title: "DÉVELOPPEUR WEB STAGIAIRE", company: "Société Nouvelle d'exploitation de Marques", desc: "Réalisation d'un site web vitrine pour la SNEM - KOUMASSI RUE DES SCIENCES, ZONE INDUSTRIELLE (2021 - 2022)" },
          { title: "DÉVELOPPEUR WEB", company: "H&Dev", desc: "Co-fondateur, gestion de projets, développeur web, app et mobile - ABIDJAN, COCODY (2019 - Aujourd'hui)" }
        ].map((exp, i) => (
          <div key={i} style={{ borderLeft: '1px solid #c5a059', paddingLeft: '1rem' }}>
            <h4 style={{ margin: 0, color: '#c5a059' }}>{exp.title}</h4>
            <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{exp.company}</span>
            <p style={{ fontSize: '0.8rem', opacity: 0.8, marginTop: '0.5rem' }}>{exp.desc}</p>
          </div>
        ))}
      </div>
    </div>

    {/* COLONNE DROITE : RÉALISATIONS AVEC QR CODES RÉELS */}
<div>
  <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '3rem', fontWeight: '500', marginBottom: '2rem' }}>• Réalisations</h2>
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
    {[
      { name: "BIN LENOIR", url: "https://www.binlenoir.com" },
      { name: "BIENTÔT", url: "https://votre-site-2.com" },
      { name: "BERYL INTERNATIONAL", url: "https://optinter.byethost9.com/?i=1" },
      { name: "BIENTÔT", url: "https://votre-site-4.com" }
    ].map((projet, i) => (
      <motion.a 
        key={i}
        href={projet.url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        style={{ textDecoration: 'none', color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}
      >
        {/* Placeholder Logo */}
        <div style={{ width: '60px', height: '60px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: '0.5rem', opacity: 0.3 }}>LOGO</span>
        </div>
        
        {/* VRAI QR CODE GÉNÉRÉ DYNAMIQUEMENT */}
        <img 
          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(projet.url)}`}
          alt={`QR Code pour ${projet.name}`}
          style={{ width: '80px', height: '80px', background: 'white', padding: '5px', borderRadius: '4px' }}
        />
        
        <span style={{ fontSize: '0.6rem', letterSpacing: '2px', opacity: 0.5 }}>{projet.name}</span>
      </motion.a>
    ))}
  </div>
</div>

  </div>
</FadeInSection>

      <FadeInSection id="contact-devis">
  <div style={{
  display: 'flex',
  flexDirection: window.innerWidth < 1025 ? 'column' : 'row',
  gap: '2rem'
}}>
    
{/* COLONNE GAUCHE : FORMULAIRE DEVIS */}
<div>
  <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '2.5rem', marginBottom: '2rem' }}>..Estimation ♦</h2>
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    
    {/* 1. Sélection Service (Toujours visible) */}
    <select onChange={(e) => { updateForm('service', e.target.value); setVisibleFields(prev => ({...prev, ecrans: true})) }} 
            style={{ ...inputStyle, background: '#090810', cursor: 'pointer' }}>
      <option value="">SÉLECTIONNEZ UN SERVICE</option>
      {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
    </select>

    {/* 2. Écrans (Visible après choix service) */}
    {visibleFields.ecrans && (
      <select onChange={(e) => { updateForm('ecrans', e.target.value); setVisibleFields(prev => ({...prev, delai: true})) }} style={inputStyle}>
        <option value="">Ecrans</option>
        <option value="Mobile">Mobile</option>
        <option value="Ordinateur">Ordinateur</option>
        <option value="Tablettes">Tablettes</option>
        <option value="Tous les écrans">Tous les écrans</option>
      </select>
    )}

    {/* 3. Délai (Visible après choix écrans) */}
    {visibleFields.delai && (
      <input type="date" onChange={(e) => { updateForm('delai', e.target.value); setVisibleFields(prev => ({...prev, profil: true})) }} style={inputStyle} />
    )}

    {/* 4. Type profil (Visible après choix date) */}
    {visibleFields.profil && (
      <select onChange={(e) => updateForm('profil', e.target.value)} style={inputStyle}>
        <option value="">Type d'entreprise</option>
        <option value="Institution">Institution (Grande/GE, Intermédiaire/ETI)</option>
        <option value="Indépendante">Indépendante (Micro/TPE, Petites et Moyennes/PME)</option>
      </select>
    )}

    {/* Résultat (Affiché uniquement si tout est rempli) */}
    {selectedPrice > 0 && (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={{ color: '#c5a059', fontSize: '1.2rem', marginBottom: '1rem' }}>Estimation : {selectedPrice} EUR</div>
        <button onClick={downloadPDF} style={buttonStyle}>Télécharger l'estimation (PDF)</button>
      </motion.div>
    )}
  </div>
          </div>

   {/* COLONNE DROITE : RENDEZ-VOUS */}
<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
  <h2 style={{ fontFamily: '"Syne", sans-serif', fontSize: '2.5rem', fontWeight: '500', color: '#c5a059' }}>♦ Contact...</h2>
  <p style={{ fontFamily: 'monospace', fontSize: '0.8rem', opacity: 0.6, lineHeight: '1.6' }}>
    Planifiez un échange direct pour discuter de la faisabilité technique de votre projet.
  </p>
  
  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
    
    {/* Champ Nom (Toujours visible) */}
    <input type="text" name="nom" required placeholder="NOM & PRÉNOMS" onChange={(e) => handleFieldChange(e, 'email')} style={inputStyle} />

    {/* Champ Email (Affiché seulement si visibleFields.email est vrai) */}
    {visibleFields.email && (
      <input type="email" name="email" required placeholder="ADRESSE EMAIL" onChange={(e) => handleFieldChange(e, 'telephone')} style={inputStyle} />
    )}

    {/* Champ Téléphone */}
    {visibleFields.telephone && (
      <input type="tel" name="telephone" required placeholder="NUMÉRO DE TÉLÉPHONE" onChange={(e) => handleFieldChange(e, 'service')} style={inputStyle} />
    )}

    {/* Champ Service */}
    {visibleFields.service && (
      <select name="service" required onChange={(e) => handleFieldChange(e, 'date')} 
              style={{ ...inputStyle, background: '#090810', cursor: 'pointer' }}>
        <option value="">SÉLECTIONNEZ UN SERVICE</option>
        {services.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
      </select>
    )}

    {/* Champ Date */}
    {visibleFields.date && (
      <input type="date" name="date" required onChange={(e) => handleFieldChange(e, 'message')} style={inputStyle} />
    )}

    {/* Champ Message */}
    {visibleFields.message && (
      <textarea name="message" rows="4" placeholder="DÉTAILS DU PROJET..." style={{ ...inputStyle, resize: 'none' }} />
    )}

    {/* Bouton soumis seulement si le dernier champ est visible */}
    {visibleFields.message && (
      <button type="submit" style={buttonStyle}>
        PLANIFIER L'ENTRETIEN
      </button>
    )}
  </form>
</div>

  </div>
</FadeInSection>

    </div>
  );
}