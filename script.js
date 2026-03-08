let l = document.getElementById("Language");
let g = document.getElementById("Geo");
let h = document.getElementById("Histoire");
let c = document.getElementById("Cinéma");
let M = document.getElementById("Menu");

// -------------------------- Chargement des questions ------------------------------

let toutesLesQuestions = [];

fetch("questions.txt")
  .then((res) => res.text())
  .then((text) => {
    text.split("\n").forEach((line) => {
      line = line.trim();
      if (line && !line.startsWith("#") && !line.startsWith("[")) {
        const parts = line.split("|");
        if (parts.length === 7) {
          toutesLesQuestions.push({
            theme: parts[0],
            question: parts[1],
            reponses: { A: parts[2], B: parts[3], C: parts[4], D: parts[5] },
            bonne: parts[6].trim(),
          });
        }
      }
    });
  });

// -------------------------- Affichage QCM ------------------------------

let questionIndex = 0;
let questionsActuelles = [];
let score = 0;

function afficherQuestion() {
  const conteneur = document.getElementById("qcm-conteneur");
  conteneur.innerHTML = "";

  if (questionIndex >= questionsActuelles.length) {
    conteneur.innerHTML = `
      <div class="score-final">
        <h2>Terminé ! 🎉</h2>
        <p>Score : ${score} / ${questionsActuelles.length}</p>
        <button id="rejouer">Rejouer</button>
      </div>`;
    document.getElementById("rejouer").addEventListener("click", () => {
      conteneur.innerHTML = "";
      entrer();
    });
    return;
  }

  const q = questionsActuelles[questionIndex];

  const titre = document.createElement("h2");
  titre.textContent = `Question ${questionIndex + 1} / ${questionsActuelles.length}`;
  titre.className = "qcm-titre";
  conteneur.appendChild(titre);

  const enonce = document.createElement("p");
  enonce.textContent = q.question;
  enonce.className = "qcm-question";
  conteneur.appendChild(enonce);

  const grille = document.createElement("div");
  grille.className = "qcm-grille";

  Object.entries(q.reponses).forEach(([lettre, texte]) => {
    const btn = document.createElement("button");
    btn.textContent = `${lettre}. ${texte}`;
    btn.className = "qcm-btn";

    btn.addEventListener("click", () => {
      grille.querySelectorAll("button").forEach((b) => (b.disabled = true));

      if (lettre === q.bonne) {
        btn.classList.add("correct");
        score++;
      } else {
        btn.classList.add("incorrect");
        grille.querySelectorAll("button").forEach((b) => {
          if (b.textContent.startsWith(q.bonne)) b.classList.add("correct");
        });
      }

      setTimeout(() => {
        questionIndex++;
        afficherQuestion();
      }, 1200);
    });

    grille.appendChild(btn);
  });

  conteneur.appendChild(grille);
}

function lancerQCM(theme) {
  score = 0;
  questionIndex = 0;
  questionsActuelles = toutesLesQuestions
    .filter((q) => q.theme === theme)
    .sort(() => Math.random() - 0.5);

  const conteneur = document.getElementById("qcm-conteneur");
  conteneur.style.display = "flex";
  afficherQuestion();
}

// -------------------------- Animation ------------------------------

const boutons = [l, g, h, c];

function entrer() {
  score = 0;
  questionIndex = 0;
  const conteneur = document.getElementById("qcm-conteneur");
  conteneur.style.display = "none";
  conteneur.innerHTML = "";

  boutons.forEach((element) => {
    element.style.display = "block";
    element.classList.remove("exit");
    element.classList.remove("enter");
    void element.offsetWidth;
    element.classList.add("enter");
  });
}

function sortir(theme) {
  boutons.forEach((element) => {
    element.classList.remove("enter");
    element.classList.remove("exit");
    void element.offsetWidth;
    element.classList.add("exit");
  });

  setTimeout(() => lancerQCM(theme), 700);
}

l.addEventListener("click", () => sortir("Language"));
g.addEventListener("click", () => sortir("Geo"));
h.addEventListener("click", () => sortir("Histoire"));
c.addEventListener("click", () => sortir("Cinéma"));
M.addEventListener("click", entrer);
