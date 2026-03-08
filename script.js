let l = document.getElementById("Language");
let g = document.getElementById("Geo");
let h = document.getElementById("Histoire");
let c = document.getElementById("Cinéma");
let M = document.getElementById("Menu");

let unter = true;

// -------------------------- QCM ------------------------------

class Question {
  constructor(type, id, reponseJuste) {
    this.type = type;
    this.id = id;
    this.reponses = [];
    this.reponse = reponseJuste;
  }

  ajouterReponse(rep) {
    this.reponses.push(rep);
  }
}

fetch("questions.txt")
  .then((res) => res.text())
  .then((text) => {
    const questions = [];
    let currentTheme = "";

    text.split("\n").forEach((line) => {
      line = line.trim();
      if (line.startsWith("[")) {
        currentTheme = line.slice(1, -1); // ex: "Geo"
      } else if (line && !line.startsWith("#")) {
        const parts = line.split("|");
        if (parts.length === 7) {
          questions.push({
            theme: parts[0],
            question: parts[1],
            reponses: { A: parts[2], B: parts[3], C: parts[4], D: parts[5] },
            bonne: parts[6], // "A", "B", "C" ou "D"
          });
        }
      }
    });

    // Filtrer par thème :
    const questionsGeo = questions.filter((q) => q.theme === "Geo");
  });

//------------------------------- Animation ------------------------------

const boutons = [l, g, h, c];

function entrer() {
  boutons.forEach((element) => {
    element.classList.remove("exit"); // ❗ important
    element.classList.remove("enter"); // reset
    void element.offsetWidth; // reset animation
    element.classList.add("enter"); // rejoue l’entrée
  });
}

function sortir() {
  boutons.forEach((element) => {
    element.classList.remove("enter"); // ❗ important
    element.classList.remove("exit"); // reset
    void element.offsetWidth; // reset animation
    element.classList.add("exit"); // rejoue la sortie
  });
}

l.addEventListener("click", sortir);
g.addEventListener("click", sortir);
h.addEventListener("click", sortir);
c.addEventListener("click", sortir);

M.addEventListener("click", entrer);
