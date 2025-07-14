
const malla = [
  {
    semestre: "1er Semestre",
    etapa: "plancomun",
    ramos: [
      { nombre: "Cálculo 1" },  
      { nombre: "Álgebra lineal" },
      { nombre: "Desafíos de la ingeniería" },
      { nombre: "Química para ingeniería" },
      { nombre: "Filosofía ¿Para qué?" }
    ]
  },
  {
    semestre: "2do Semestre",
    etapa: "plancomun",
    ramos: [
      { nombre: "Cálculo 2", requisitos: ["Cálculo 1"] },
      { nombre: "Laboratorio dinámica", requisitos: ["Cálculo 1"], corequisitos: ["Álgebra lineal"] },
      { nombre: "Dinámica", requisitos: ["Cálculo 1"],corequisitos: ["Álgebra lineal", "Laboratorio dinámica"] },
      { nombre: "Introducción a la programación"},
      { nombre: "Exploratorio de major"},
      { nombre: "Teológico"}
    ]
  },
  {
    semestre: "Verano 1",
    etapa: "bachillerato",
    ramos: [
      { nombre: "idk" },
      { nombre: "Práctica 1" }
    ]
  },
  {
    semestre: "3er Semestre",
    etapa: "plancomun",
    ramos: [
      { nombre: "Cálculo 3", requisitos: ["Cálculo 2", "Álgebra lineal"]},
      { nombre: "Termodinámica", requisitos: ["Cálculo 2", "Química"]},
      { nombre: "Laboratorio termodinámica", requisitos: ["Cálculo 2", "Química"] },
      { nombre: "Biológico" },
      { nombre: "Ecuaciones diferenciales", requisitos: ["Cálculo 2", "Álgebra"] },
      { nombre: "Ecología integral/sustentabilidad" }

    ]
  },
  {
    semestre: "4to Semestre",
    etapa: "plancomun",
    ramos: [
      { nombre: "Probabilidades y estadística", requisitos: ["Cálculo 2"] },
      { nombre: "Introducción a la economía", requisitos: ["Cálculo 2"]},
      { nombre: "Electricidad y magnetismo", requisitos: ["Cálculo 3"] },
      { nombre: "Laboratorio electricidad y magnetismo", requisitos: ["Cálculo 3"] },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Área humanidades" }
    ]
  },
  {
    semestre: "Verano 2",
    etapa: "bachillerato",
    ramos: [
      { nombre: "idk" }
    ]
  },
  {
    semestre: "5to Semestre",
    etapa: "licenciatura",
    ramos: [
      { nombre: "Salud y bienestar" },
      { nombre: "INNOVA", requisitos: ["Práctica 1"] },
      { nombre: "Fundamentos de ciencias de ingeniería", requisitos: ["Práctica 1"] },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Major", requisitos: ["Práctica 1"] }
    ]
  },
  {
    semestre: "6to Semestre",
    etapa: "licenciatura",
    ramos: [
      { nombre: "Ciencias sociales" },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Minor", requisitos: ["Práctica 1"] },
      { nombre: "Minor", requisitos: ["Práctica 1"] }
    ]
  },
  {
    semestre: "7mo Semestre",
    etapa: "licenciatura",
    ramos: [
      { nombre: "Artes" },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Minor", requisitos: ["Práctica 1"] }
    ]
  },
  {
    semestre: "8vo Semestre",
    etapa: "licenciatura",
    ramos: [
      { nombre: "Libre" },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Major", requisitos: ["Práctica 1"] },
      { nombre: "Minor", requisitos: ["Práctica 1"] },
      { nombre: "Minor", requisitos: ["Práctica 1"] }
    ]
  }
];

const container = document.getElementById("malla-container");

function crearTarjeta(semestre, etapa, ramos) {
  const bloque = document.createElement("div");
  bloque.className = "semestre";
  const titulo = document.createElement("h2");
  titulo.textContent = semestre;
  bloque.appendChild(titulo);
  ramos.forEach(ramo => {
    const tarjeta = document.createElement("div");
    tarjeta.className = `ramo pendiente ${etapa}`;
    tarjeta.textContent = ramo.nombre;
    if (ramo.corequisitos) tarjeta.dataset.corequisitos = JSON.stringify(ramo.corequisitos);
    if (ramo.requisitos) tarjeta.dataset.requisitos = JSON.stringify(ramo.requisitos);
    tarjeta.onclick = () => cambiarEstado(tarjeta);
    bloque.appendChild(tarjeta);
  });
  container.appendChild(bloque);
}

function cambiarEstado(tarjeta) {
  if (tarjeta.classList.contains("bloqueado")) return;
  const estados = ["pendiente", "encurso", "aprobado"];
  let actual = estados.findIndex(e => tarjeta.classList.contains(e));
  tarjeta.classList.remove(estados[actual]);
  tarjeta.classList.add(estados[(actual + 1) % estados.length]);
  guardarEstado();
  verificarBloqueos(); // actualizar bloqueos
}

function guardarEstado() {
  const estado = [];
  document.querySelectorAll(".ramo").forEach(t => {
    estado.push({ nombre: t.textContent.replace('🔒','').trim(), clase: [...t.classList].filter(c => ["pendiente", "encurso", "aprobado"].includes(c))[0] });
  });
  localStorage.setItem("estadoMalla", JSON.stringify(estado));
}

function cargarEstado() {
  const guardado = JSON.parse(localStorage.getItem("estadoMalla"));
  if (!guardado) return;
  const tarjetas = document.querySelectorAll(".ramo");
  guardado.forEach((e, i) => {
    const t = tarjetas[i];
    if (t) {
      t.classList.remove("pendiente", "encurso", "aprobado");
      t.classList.add(e.clase);
    }
  });
}

function verificarBloqueos() {
  const aprobados = new Set();
  const enCurso = new Set();
  document.querySelectorAll(".ramo.encurso").forEach(t => enCurso.add(t.textContent.replace('🔒','').trim()));
  document.querySelectorAll(".ramo.aprobado").forEach(t => aprobados.add(t.textContent.replace('🔒','').trim()));

  document.querySelectorAll(".ramo").forEach(t => {
    const reqs = t.dataset.requisitos ? JSON.parse(t.dataset.requisitos) : [];
    const cumplido = reqs.every(r => aprobados.has(r));
    
    const coreqs = t.dataset.corequisitos ? JSON.parse(t.dataset.corequisitos) : [];
    const cocumplido = coreqs.every(r => (aprobados.has(r) || enCurso.has(r)));
    
    t.classList.toggle("bloqueado", (reqs.length && !cumplido) || (coreqs.length &&!cocumplido));
  });
}

malla.forEach(({ semestre, etapa, ramos }) => crearTarjeta(semestre, etapa, ramos));
cargarEstado();
verificarBloqueos();
