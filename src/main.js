import "./style.css";
import { Questions } from "./question.js";

//selecteur CSS
//document.getElementById(id) -->  document.querySelector("#id")
//document.getElementsByClassName(className) --> document.querySelector(".className")
//document.getElementsByTagName(tagName) -->  document.querySelector("tagName")

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");

let currentQuestion = 0;
let score = 0;

startButton.addEventListener("click", startQuiz);

function startQuiz() {
  displayQuestion(currentQuestion); // affiche la question actuelle
}

//  Nettoyage de l'écran          --> clean()
//  Récupération de la question   --> Questions[index]
//  Si fin de quiz                --> displayFinishMessage()
// Création du titre             --> getTitleElement()
//  Ajout des réponses            --> createAnswers()
//  Création du bouton            --> getSubmitButton()
//  Ajout du bouton + écouteur    --> addEventListener("click", submit)
//  Tout est ajouté à l'élément 'app'

function displayQuestion(index) {
  clean();
  const question = Questions[index];
  //Si la question n’existe pas (fin du quiz)
  if (!question) {
    displyFinishMessage();
    return;
  }
  const title = getTitleElement(question.question);
  app.appendChild(title);

  const answerDiv = createAnswers(question.answers);
  app.appendChild(answerDiv);

  const buttonSubmit = getSubmitButton();
  buttonSubmit.addEventListener("click", submit);
  app.appendChild(buttonSubmit);
}

// Création du titre
function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerHTML = text;
  return title;
}

//  Nettoyage de l'écran
function clean() {
  while (app.firstElementChild) {
    app.firstElementChild.remove();
  }
  const progress = getprogresseBar(Questions.length, currentQuestion);
  app.appendChild(progress);
}

//  Ajout des réponses
function createAnswers(answers) {
  const answerDiv = document.createElement("div");
  answerDiv.classList.add("answers");
  for (const i of answers) {
    const label = getAnswerElement(i);
    answerDiv.appendChild(label);
  }
  return answerDiv;
}

//générer dynamiquement une réponse au format bouton radio avec label
function getAnswerElement(text) {
  const label = document.createElement("label");

  const input = document.createElement("input");
  const id = formatID(text);
  //Ça permet que lorsqu’on clique sur le texte du label, le bouton radio se sélectionne automatiquement
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", text);

  label.appendChild(input); // d'abord le bouton
  label.append(" " + text);
  return label;
}

function formatID(text) {
  return text.replaceAll(" ", "-").toLowerCase();
}

function getSubmitButton() {
  const buttonSubmit = document.createElement("button");
  buttonSubmit.innerText = "Submit";
  return buttonSubmit;
}

// Récupérer la réponse sélectionnée,
// Vérifier si elle est correcte,
// Mettre à jour le score,
// Afficher un retour visuel (feedback),
// Passer à la question suivante après un court délai.

function submit() {
  const selectedAns = document.querySelector(`input[name="answer"]:checked`);
  const value = selectedAns.value;
  const question = Questions[currentQuestion];
  const isCorrect = question.correct === value;

  if (isCorrect) {
    score++;
  }
  showFeedBack(isCorrect, question.correct, value);
  const feedback = getMessageFeedBack(isCorrect, question.correct);
  app.appendChild(feedback);
  setTimeout(() => {
    currentQuestion++;
    displayQuestion(currentQuestion);
  }, 3000);
}

function showFeedBack(isCorrect, correct, answer) {
  const correctAnswerId = formatID(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatID(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );
  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

function getMessageFeedBack(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerHTML = isCorrect
    ? "Bravo ! tu as eu la bonne réponse"
    : `Désolé... mais la bonne réponse était ${correct}`;
  return paragraph;
}

function displyFinishMessage() {
  const h = document.createElement("h1");
  h.innerText = "Bravo ! Tu as terminé le quiz.";
  const p = document.createElement("p");
  p.innerText = `Tu as eu ${score} sur ${Questions.length} piont !`;
  app.appendChild(h);
  app.appendChild(p);
}

function getprogresseBar(max, currentvalue) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", currentvalue);
  return progress;
}
