import { useMemo, useState } from "react";
import "./App.css";

const images = {
  pickup:
    "https://jmc.com.co/wp-content/uploads/2026/08/plata-metalizado.webp",
  chr:
    "https://jmc.com.co/wp-content/uploads/2025/01/CHR-ADAPT-FNL.png",
  cqr:
    "https://jmc.com.co/wp-content/uploads/2024/10/camion-cqr.png",
};

const vehicles = [
  {
    id: "chr",
    number: "01",
    category: "CAMIÓN LIVIANO",
    name: "CHR",
    claim: "AGILIDAD PARA TU OPERACIÓN",
    description:
      "Pensado para distribución, reparto urbano y operaciones que necesitan eficiencia todos los días.",
    image: images.chr,
    imageClass: "vehicle-image-chr",
    tags: ["Distribución", "Carga urbana", "Versatilidad"],
    uses: [
      "Reparto urbano",
      "Distribución comercial",
      "Última milla",
      "Operaciones de alta frecuencia",
    ],
    concept:
      "Una alternativa conceptual para negocios que priorizan maniobrabilidad, frecuencia de entrega y operación urbana.",
  },
  {
    id: "cqr",
    number: "02",
    category: "CAMIÓN",
    name: "CQR",
    claim: "CUANDO EL TRABAJO EXIGE MÁS",
    description:
      "Una plataforma de trabajo para empresas que necesitan mayor capacidad y una operación comercial exigente.",
    image: images.cqr,
    imageClass: "vehicle-image-cqr",
    tags: ["Mayor capacidad", "Trabajo pesado", "Negocio"],
    uses: [
      "Construcción",
      "Carga comercial",
      "Distribución de mayor volumen",
      "Operaciones empresariales",
    ],
    concept:
      "Pensado conceptualmente para clientes cuya operación necesita crecer en capacidad sin perder enfoque comercial.",
  },
  {
    id: "grand",
    number: "03",
    category: "PICK-UP 4×4",
    name: "GRAND AVENUE PRO",
    claim: "TRABAJO. CARRETERA. AVENTURA.",
    description:
      "Una pick-up que combina presencia, desempeño y tecnología para quienes necesitan más que un vehículo.",
    image: images.pickup,
    imageClass: "vehicle-image-grand",
    tags: ["4×4", "Alto desempeño", "Tecnología"],
    uses: [
      "Trabajo mixto",
      "Carretera",
      "Terreno exigente",
      "Uso personal + empresarial",
    ],
    concept:
      "Una propuesta conceptual para quien necesita combinar productividad, movilidad y capacidad para distintos escenarios.",
  },
];

const questions = [
  {
    key: "operation",
    preface: "Primero quiero entender tu operación.",
    title: "¿Para qué necesitás el vehículo?",
    options: [
      { value: "distribution", label: "Distribución y reparto" },
      { value: "construction", label: "Construcción / materiales" },
      { value: "pickup", label: "Trabajo mixto / pick-up" },
      { value: "unknown", label: "Todavía no estoy seguro" },
    ],
  },
  {
    key: "load",
    preface: "Perfecto. Ahora necesito dimensionar el trabajo.",
    title: "¿Qué nivel de carga manejás?",
    options: [
      { value: "light", label: "Carga ligera" },
      { value: "medium", label: "Carga media" },
      { value: "heavy", label: "Carga alta" },
      { value: "variable", label: "Varía según el trabajo" },
    ],
  },
  {
    key: "terrain",
    preface: "Ya tengo una idea bastante clara.",
    title: "¿Dónde trabajará principalmente?",
    options: [
      { value: "city", label: "Ciudad" },
      { value: "road", label: "Carretera" },
      { value: "rough", label: "Terreno difícil" },
      { value: "mixed", label: "Uso mixto" },
    ],
  },
];

function getRecommendation(answers) {
  const scores = {
    CHR: 0,
    CQR: 0,
    "GRAND AVENUE PRO": 0,
  };

  if (answers.operation === "distribution") scores.CHR += 5;
  if (answers.operation === "construction") scores.CQR += 5;
  if (answers.operation === "pickup") scores["GRAND AVENUE PRO"] += 5;

  if (answers.operation === "unknown") {
    scores.CHR += 1;
    scores.CQR += 1;
    scores["GRAND AVENUE PRO"] += 1;
  }

  if (answers.load === "light") scores.CHR += 3;

  if (answers.load === "medium") {
    scores.CHR += 2;
    scores["GRAND AVENUE PRO"] += 1;
  }

  if (answers.load === "heavy") scores.CQR += 4;

  if (answers.load === "variable") {
    scores.CQR += 2;
    scores["GRAND AVENUE PRO"] += 2;
  }

  if (answers.terrain === "city") scores.CHR += 3;

  if (answers.terrain === "road") {
    scores.CHR += 1;
    scores["GRAND AVENUE PRO"] += 2;
  }

  if (answers.terrain === "rough") {
    scores["GRAND AVENUE PRO"] += 5;
  }

  if (answers.terrain === "mixed") {
    scores["GRAND AVENUE PRO"] += 3;
    scores.CQR += 1;
  }

  return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
}

function getReasons(answers, recommendation) {
  const reasons = [];

  if (recommendation === "CHR") {
    if (answers.operation === "distribution") {
      reasons.push("Tu prioridad está en distribución y reparto.");
    }
    if (answers.load === "light" || answers.load === "medium") {
      reasons.push("El nivel de carga indicado apunta a una solución ágil.");
    }
    if (answers.terrain === "city") {
      reasons.push("La operación urbana favorece maniobrabilidad y frecuencia.");
    }
  }

  if (recommendation === "CQR") {
    if (answers.operation === "construction") {
      reasons.push("Tu operación está relacionada con materiales o construcción.");
    }
    if (answers.load === "heavy") {
      reasons.push("Indicás una necesidad de carga alta.");
    }
    if (answers.load === "variable") {
      reasons.push("Tu volumen cambia y necesitás mayor margen operativo.");
    }
  }

  if (recommendation === "GRAND AVENUE PRO") {
    if (answers.operation === "pickup") {
      reasons.push("Buscás una solución de trabajo mixto.");
    }
    if (answers.terrain === "rough") {
      reasons.push("El terreno difícil pesa mucho en la recomendación.");
    }
    if (answers.terrain === "mixed") {
      reasons.push("Necesitás flexibilidad entre diferentes tipos de terreno.");
    }
  }

  if (reasons.length < 2) {
    reasons.push("La combinación de tus respuestas reduce las opciones posibles.");
  }

  if (reasons.length < 3) {
    reasons.push("La recomendación es un punto de partida para una asesoría comercial.");
  }

  return reasons.slice(0, 3);
}

function App() {
  const [advisorStarted, setAdvisorStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  const [quoteOpen, setQuoteOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [leadSent, setLeadSent] = useState(false);
  const [selectedService, setSelectedService] = useState("");

  const recommendedVehicle = useMemo(() => {
    return vehicles.find((vehicle) => vehicle.name === recommendation);
  }, [recommendation]);

  const recommendationReasons = useMemo(() => {
    if (!recommendation) return [];
    return getReasons(answers, recommendation);
  }, [answers, recommendation]);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  const startAdvisor = () => {
    setAdvisorStarted(true);
    setStep(0);
    setAnswers({});
    setRecommendation(null);

    setTimeout(() => {
      scrollTo("asesor");
    }, 50);
  };

  const selectAnswer = (value) => {
    const currentQuestion = questions[step];

    const nextAnswers = {
      ...answers,
      [currentQuestion.key]: value,
    };

    setAnswers(nextAnswers);

    if (step < questions.length - 1) {
      setStep((current) => current + 1);
      return;
    }

    setRecommendation(getRecommendation(nextAnswers));
  };

  const resetAdvisor = () => {
    setStep(0);
    setAnswers({});
    setRecommendation(null);
  };

  const openQuote = (service = "") => {
    setSelectedService(service);
    setLeadSent(false);
    setQuoteOpen(true);
  };

  const openVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hola. Quiero recibir información comercial sobre vehículos JMC."
    );

    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const submitLead = (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const lead = {
      id: `JMC-${Date.now().toString().slice(-6)}`,
      name: formData.get("name"),
      whatsapp: formData.get("whatsapp"),
      need: formData.get("need"),
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = JSON.parse(
        localStorage.getItem("jmc-concept-leads") || "[]"
      );

      localStorage.setItem(
        "jmc-concept-leads",
        JSON.stringify([...existing, lead])
      );
    } catch {
      // La demo continúa aunque localStorage no esté disponible.
    }

    setLeadSent(lead.id);
  };

  return (
    <div className="site">
      <header className="header">
        <button className="logo" onClick={() => scrollTo("inicio")}>
          <span className="logo-main">JMC</span>
          <span className="logo-small">EL SALVADOR</span>
        </button>

        <nav className="nav">
          <button onClick={() => scrollTo("vehiculos")}>Vehículos</button>
          <button onClick={() => scrollTo("experiencia")}>Experiencia</button>
          <button onClick={() => scrollTo("asesor")}>Asesor IA</button>
          <button onClick={() => scrollTo("servicios")}>Servicios</button>
        </nav>

        <button className="header-cta" onClick={() => openQuote()}>
          COTIZAR
        </button>
      </header>

      <main>
        <section className="hero page-section" id="inicio">
          <div className="hero-light hero-light-one" />
          <div className="hero-light hero-light-two" />

          <div className="hero-copy">
            <div className="eyebrow">
              <i />
              CONCEPTO DIGITAL · JMC EL SALVADOR
            </div>

            <h1>
              TU TRABAJO
              <br />
              <span>NO PUEDE</span>
              <br />
              ESPERAR.
            </h1>

            <p className="hero-description">
              Una experiencia diseñada para encontrar el vehículo adecuado
              según tu operación, tu carga y la forma en que realmente trabajás.
            </p>

            <div className="hero-buttons">
              <button className="primary-button" onClick={startAdvisor}>
                ENCONTRAR MI JMC
                <b>→</b>
              </button>

              <button
                className="secondary-button"
                onClick={() => scrollTo("vehiculos")}
              >
                VER VEHÍCULOS
              </button>
            </div>

            <div className="hero-detail">
              <span>01</span>

              <div>
                <small>UNA NUEVA FORMA DE ELEGIR</small>
                <strong>Necesidad primero. Modelo después.</strong>
              </div>
            </div>
          </div>

          <div className="hero-car">
            <div className="hero-car-label">
              <span>JMC</span>
              <small>WORK / PERFORMANCE / TECHNOLOGY</small>
            </div>

            <img
              src={images.pickup}
              alt="JMC Grand Avenue Pro, referencia visual"
            />

            <div className="vehicle-floor" />

            <div className="hero-model">
              <span>PICK-UP 4×4</span>
              <strong>GRAND AVENUE PRO</strong>
            </div>
          </div>
        </section>

        <section className="feature-strip">
          <div>
            <span>01</span>
            <article>
              <strong>PRODUCTO</strong>
              <p>Vehículos para necesidades reales.</p>
            </article>
          </div>

          <div>
            <span>02</span>
            <article>
              <strong>ASESORÍA</strong>
              <p>Orientación basada en tu operación.</p>
            </article>
          </div>

          <div>
            <span>03</span>
            <article>
              <strong>CONVERSIÓN</strong>
              <p>De una necesidad a una conversación comercial.</p>
            </article>
          </div>
        </section>

        <section className="vehicles section page-section" id="vehiculos">
          <div className="section-title">
            <div>
              <div className="eyebrow">
                <i />
                GAMA DE TRABAJO
              </div>

              <h2>
                EL VEHÍCULO
                <br />
                CORRECTO PARA
                <br />
                <span>TU OPERACIÓN.</span>
              </h2>
            </div>

            <p>
              No empezamos por una lista interminable de especificaciones.
              Empezamos entendiendo para qué necesitás el vehículo.
            </p>
          </div>

          <div className="vehicle-grid">
            {vehicles.map((vehicle) => (
              <article className="vehicle-card" key={vehicle.id}>
                <div className="vehicle-card-top">
                  <span>{vehicle.claim}</span>
                  <strong>{vehicle.number}</strong>
                </div>

                <div className="vehicle-picture">
                  <img
                    className={vehicle.imageClass}
                    src={vehicle.image}
                    alt={vehicle.name}
                  />
                </div>

                <div className="vehicle-info">
                  <small>{vehicle.category}</small>

                  <h3>{vehicle.name}</h3>

                  <p>{vehicle.description}</p>

                  <div className="vehicle-tags">
                    {vehicle.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>

                  <div className="vehicle-actions">
                    <button onClick={() => openVehicle(vehicle)}>
                      VER DETALLE
                      <b>↗</b>
                    </button>

                    <button onClick={startAdvisor}>
                      CONSULTAR
                      <b>→</b>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <p className="legal-reference">
            Imágenes y modelos utilizados como referencia conceptual. Las
            versiones, disponibilidad y especificaciones comerciales para El
            Salvador deberán ser verificadas y autorizadas por JMC antes de una
            implementación oficial.
          </p>
        </section>

        <section className="experience page-section" id="experiencia">
          <div className="experience-number">30</div>

          <div className="experience-main">
            <div className="eyebrow">
              <i />
              EXPERIENCIA COMERCIAL
            </div>

            <h2>
              UN VENDEDOR
              <br />
              NO DEBERÍA
              <br />
              <span>EMPEZAR VENDIENDO.</span>
            </h2>

            <p>
              Primero pregunta. Después entiende la operación. Y solamente
              entonces recomienda una solución.
            </p>
          </div>

          <div className="experience-list">
            <article>
              <span>01</span>
              <div>
                <strong>ESCUCHAR</strong>
                <p>Qué hacés, qué transportás y dónde trabajás.</p>
              </div>
            </article>

            <article>
              <span>02</span>
              <div>
                <strong>ANALIZAR</strong>
                <p>Capacidad, frecuencia, terreno y tipo de operación.</p>
              </div>
            </article>

            <article>
              <span>03</span>
              <div>
                <strong>RECOMENDAR</strong>
                <p>Reducir opciones y orientar la conversación comercial.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="advisor page-section" id="asesor">
          <div className="advisor-copy">
            <div className="eyebrow">
              <i />
              ASESOR COMERCIAL · IA CONCEPTUAL
            </div>

            <h2>
              UN ASESOR
              <br />
              QUE <span>ESCUCHA</span>
              <br />
              ANTES DE VENDER.
            </h2>

            <p>
              Diseñado bajo el enfoque de un asesor automotriz senior:
              identificar la necesidad, filtrar opciones y llevar al cliente
              hacia una conversación comercial útil.
            </p>

            {!advisorStarted && (
              <button className="primary-button" onClick={startAdvisor}>
                HABLAR CON EL ASESOR
                <b>→</b>
              </button>
            )}
          </div>

          <div className="advisor-panel">
            <header className="advisor-header">
              <div className="advisor-identity">
                <div className="advisor-avatar">J</div>

                <div>
                  <strong>ASESOR JMC</strong>
                  <span>ASESOR COMERCIAL DIGITAL</span>
                </div>
              </div>

              <div className="online">
                <i />
                DISPONIBLE
              </div>
            </header>

            <div className="advisor-content">
              {!advisorStarted && (
                <div className="advisor-welcome">
                  <small>ASESOR JMC</small>

                  <h3>Contame qué necesitás hacer.</h3>

                  <p>
                    No necesitás conocer todos los modelos. Empecemos por tu
                    operación y yo reduzco las opciones.
                  </p>

                  <button onClick={startAdvisor}>
                    INICIAR ASESORÍA
                    <b>→</b>
                  </button>
                </div>
              )}

              {advisorStarted && !recommendation && (
                <div className="advisor-question">
                  <small>ASESOR JMC</small>

                  <p className="assistant-message">
                    {questions[step].preface}
                  </p>

                  <h3>{questions[step].title}</h3>

                  <div className="question-options">
                    {questions[step].options.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => selectAnswer(option.value)}
                      >
                        {option.label}
                        <b>→</b>
                      </button>
                    ))}
                  </div>

                  <div className="progress">
                    <span>
                      PREGUNTA {step + 1} DE {questions.length}
                    </span>

                    <div>
                      {questions.map((_, index) => (
                        <i
                          key={index}
                          className={index <= step ? "active" : ""}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {recommendation && recommendedVehicle && (
                <div className="advisor-result">
                  <small>RECOMENDACIÓN INICIAL</small>

                  <h3>
                    Yo empezaría por
                    <br />
                    <span>{recommendedVehicle.name}.</span>
                  </h3>

                  <p>
                    Según lo que me contaste, este aparece como el mejor punto
                    de partida para continuar la conversación.
                  </p>

                  <div className="advisor-reasons">
                    {recommendationReasons.map((reason, index) => (
                      <div key={reason}>
                        <span>0{index + 1}</span>
                        <p>{reason}</p>
                      </div>
                    ))}
                  </div>

                  <div className="recommended-car">
                    <img
                      src={recommendedVehicle.image}
                      alt={recommendedVehicle.name}
                    />

                    <div>
                      <span>{recommendedVehicle.category}</span>
                      <strong>{recommendedVehicle.name}</strong>
                    </div>
                  </div>

                  <div className="result-buttons">
                    <button
                      className="primary-button"
                      onClick={() =>
                        openQuote(`Cotización ${recommendedVehicle.name}`)
                      }
                    >
                      QUIERO COTIZAR
                      <b>→</b>
                    </button>

                    <button
                      className="whatsapp-button"
                      onClick={openWhatsApp}
                    >
                      WHATSAPP
                    </button>

                    <button className="reset-button" onClick={resetAdvisor}>
                      VOLVER A EMPEZAR
                    </button>
                  </div>
                </div>
              )}
            </div>

            <footer className="advisor-panel-footer">
              <span>EXPERIENCIA COMERCIAL SIMULADA</span>
              <span>JMC CONCEPT</span>
            </footer>
          </div>
        </section>

        <section className="services section page-section" id="servicios">
          <div className="section-title services-heading">
            <div>
              <div className="eyebrow">
                <i />
                POSTVENTA
              </div>

              <h2>
                EL VEHÍCULO
                <br />
                ES SOLO EL
                <br />
                <span>COMIENZO.</span>
              </h2>
            </div>

            <p>
              Una experiencia comercial completa también debe hacer visible el
              respaldo que mantiene al cliente trabajando.
            </p>
          </div>

          <div className="services-grid">
            <article>
              <span>01</span>
              <h3>CONCESIONARIOS</h3>

              <p>
                Ubicación, atención comercial y contacto en una misma
                experiencia.
              </p>

              <button onClick={() => openQuote("Información de concesionarios")}>
                SOLICITAR UBICACIÓN →
              </button>
            </article>

            <article>
              <span>02</span>
              <h3>TALLER</h3>

              <p>
                El mantenimiento y la postventa también forman parte de la
                decisión.
              </p>

              <button onClick={() => openQuote("Información de taller")}>
                CONSULTAR SERVICIO →
              </button>
            </article>

            <article>
              <span>03</span>
              <h3>REPUESTOS</h3>

              <p>
                Información y acompañamiento para mantener la operación activa.
              </p>

              <button onClick={() => openQuote("Información de repuestos")}>
                CONSULTAR REPUESTOS →
              </button>
            </article>
          </div>
        </section>

        <section className="closing">
          <div className="closing-light" />

          <div className="eyebrow">
            <i />
            TU PRÓXIMO VEHÍCULO
          </div>

          <h2>
            EL TRABAJO
            <br />
            NO ESPERA.
            <br />
            <span>VOS TAMPOCO.</span>
          </h2>

          <p>
            Encontrá el vehículo que mejor encaje con tu operación.
          </p>

          <div className="closing-buttons">
            <button className="primary-button" onClick={startAdvisor}>
              ENCONTRAR MI JMC
              <b>→</b>
            </button>

            <button className="secondary-button" onClick={openWhatsApp}>
              CONSULTAR POR WHATSAPP
            </button>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-brand">
          <strong>JMC</strong>
          <span>EL SALVADOR · CONCEPTO DIGITAL</span>
        </div>

        <div className="footer-legal">
          <strong>PROYECTO CONCEPTUAL — NORYNET</strong>

          <p>
            Esta experiencia digital ha sido desarrollada por NORYNET con fines
            conceptuales, demostrativos y comerciales. No constituye el sitio
            web oficial de JMC ni implica autorización, afiliación, asociación,
            patrocinio o relación contractual con JMC. Las imágenes,
            especificaciones, funcionalidades y referencias mostradas son
            demostrativas y deberán ser verificadas y autorizadas por JMC antes
            de cualquier implementación comercial.
          </p>
        </div>

        <span className="footer-copy">© 2026 NORYNET</span>
      </footer>

      {selectedVehicle && (
        <div
          className="modal-overlay"
          onMouseDown={() => setSelectedVehicle(null)}
        >
          <div
            className="vehicle-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setSelectedVehicle(null)}
            >
              ×
            </button>

            <div className="vehicle-modal-image">
              <img
                src={selectedVehicle.image}
                alt={selectedVehicle.name}
              />
            </div>

            <div className="vehicle-modal-copy">
              <div className="eyebrow">
                <i />
                {selectedVehicle.category}
              </div>

              <h2>{selectedVehicle.name}</h2>

              <p>{selectedVehicle.concept}</p>

              <div className="vehicle-use-title">
                ESCENARIOS DE USO
              </div>

              <div className="vehicle-use-list">
                {selectedVehicle.uses.map((use) => (
                  <span key={use}>{use}</span>
                ))}
              </div>

              <p className="modal-disclaimer">
                Información conceptual. Versiones, capacidades,
                especificaciones y disponibilidad deben verificarse
                oficialmente.
              </p>

              <div className="vehicle-modal-buttons">
                <button
                  className="primary-button"
                  onClick={() => {
                    setSelectedVehicle(null);
                    startAdvisor();
                  }}
                >
                  EVALUAR MI NECESIDAD →
                </button>

                <button
                  className="secondary-button"
                  onClick={() => {
                    setSelectedVehicle(null);
                    openQuote(`Cotización ${selectedVehicle.name}`);
                  }}
                >
                  COTIZAR
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {quoteOpen && (
        <div
          className="modal-overlay"
          onMouseDown={() => setQuoteOpen(false)}
        >
          <div
            className="quote-modal"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <button
              className="modal-close"
              onClick={() => setQuoteOpen(false)}
            >
              ×
            </button>

            {!leadSent ? (
              <>
                <div className="eyebrow">
                  <i />
                  SOLICITAR INFORMACIÓN
                </div>

                <h2>
                  HABLEMOS DE
                  <br />
                  TU OPERACIÓN.
                </h2>

                <p>
                  Esta demo simula el proceso de captura de una oportunidad
                  comercial. En una implementación real, el lead podría
                  enviarse al CRM o equipo de ventas.
                </p>

                <form onSubmit={submitLead}>
                  <label>
                    NOMBRE
                    <input
                      name="name"
                      required
                      placeholder="Tu nombre"
                    />
                  </label>

                  <label>
                    WHATSAPP
                    <input
                      name="whatsapp"
                      required
                      placeholder="+503 0000-0000"
                    />
                  </label>

                  <label>
                    ¿QUÉ NECESITÁS?
                    <select
                      name="need"
                      required
                      defaultValue={selectedService || ""}
                    >
                      <option value="" disabled>
                        Seleccioná una opción
                      </option>

                      {selectedService && (
                        <option value={selectedService}>
                          {selectedService}
                        </option>
                      )}

                      <option value="Camión para carga">
                        Camión para carga
                      </option>

                      <option value="Pick-up">
                        Pick-up
                      </option>

                      <option value="Vehículo para empresa">
                        Vehículo para empresa
                      </option>

                      <option value="Hablar con un asesor">
                        Hablar con un asesor
                      </option>
                    </select>
                  </label>

                  <button className="primary-button" type="submit">
                    ENVIAR SOLICITUD →
                  </button>
                </form>
              </>
            ) : (
              <div className="lead-success">
                <div className="success-mark">✓</div>

                <small>SOLICITUD REGISTRADA</small>

                <h2>
                  YA TENEMOS
                  <br />
                  TU SOLICITUD.
                </h2>

                <p>
                  Código demostrativo:
                  <strong> {leadSent}</strong>
                </p>

                <p>
                  En una implementación comercial, aquí empezaría el
                  seguimiento del equipo de ventas.
                </p>

                <div className="success-buttons">
                  <button
                    className="primary-button"
                    onClick={openWhatsApp}
                  >
                    CONTINUAR EN WHATSAPP →
                  </button>

                  <button
                    className="secondary-button"
                    onClick={() => setQuoteOpen(false)}
                  >
                    CERRAR
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;