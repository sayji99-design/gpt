const questions = [
  "갈등이 생기면 내 의견을 분명하게 말하는 편이다.",
  "갈등 상황에서는 빠른 결정을 내리는 것이 중요하다고 생각한다.",
  "갈등이 커질 것 같으면 일단 피하거나 시간을 두는 편이다.",
  "분위기가 나빠질 것 같으면 내 의견을 줄이고 상대에게 맞추는 편이다.",
  "서로 조금씩 양보해서 중간 지점을 찾는 것이 현실적이라고 생각한다.",
  "갈등이 생기면 양쪽 입장을 충분히 듣고 함께 해결책을 찾으려 한다.",
  "상대가 틀렸다고 생각되면 직설적으로 말하는 편이다.",
  "불편한 대화를 미루다가 문제가 커진 경험이 있다.",
  "관계가 깨지는 것보다 내가 양보하는 것이 낫다고 생각할 때가 많다.",
  "갈등 상황에서 문제의 원인과 구조를 먼저 정리하려고 한다."
];

const conflictTypes = [
  {
    name: "경쟁형",
    questionIndexes: [0, 1, 6],
    feature: "내 의견을 강하게 주장하고 빠른 결정을 선호합니다.",
    strength: "빠른 판단과 추진이 가능합니다.",
    caution: "상대가 방어적으로 변할 수 있습니다.",
    advice: "주장하기 전에 상대 입장을 먼저 확인해 보세요."
  },
  {
    name: "회피형",
    questionIndexes: [2, 7],
    feature: "갈등을 피하거나 뒤로 미루는 경향이 있습니다.",
    strength: "감정 충돌을 줄일 수 있습니다.",
    caution: "문제가 반복되거나 커질 수 있습니다.",
    advice: "미룰 문제와 지금 다룰 문제를 구분해 보세요."
  },
  {
    name: "순응형",
    questionIndexes: [3, 8],
    feature: "관계 유지를 위해 상대에게 맞추는 경향이 있습니다.",
    strength: "관계 유지에 강점이 있습니다.",
    caution: "자신의 의견이나 기준이 사라질 수 있습니다.",
    advice: "양보와 기준 포기를 구분해 보세요."
  },
  {
    name: "타협형",
    questionIndexes: [4],
    feature: "서로 양보하여 현실적 해결을 선호합니다.",
    strength: "현실적 합의가 가능합니다.",
    caution: "근본 원인 해결이 부족할 수 있습니다.",
    advice: "합의 후 재발 방지 기준을 만들어 보세요."
  },
  {
    name: "협력형",
    questionIndexes: [5, 9],
    feature: "원인과 입장을 함께 정리하며 해결책을 찾습니다.",
    strength: "신뢰와 성과를 함께 확보할 수 있습니다.",
    caution: "시간이 오래 걸릴 수 있습니다.",
    advice: "모든 사안에 과도한 시간을 쓰지 않도록 우선순위를 정해 보세요."
  }
];

const questionsEl = document.querySelector("#questions");
const surveyEl = document.querySelector("#survey");
const answeredCountEl = document.querySelector("#answered-count");
const primaryTypeEl = document.querySelector("#primary-type");
const resultCardEl = document.querySelector("#result-card");
const resultTitleEl = document.querySelector("#result-title");
const resultCopyEl = document.querySelector("#result-copy");
const progressBarEl = document.querySelector("#progress-bar");
const scoreBoardEl = document.querySelector("#score-board");
const resetButtonEl = document.querySelector("#reset-button");

function createQuestion(question, index) {
  const article = document.createElement("article");
  article.className = "question-card";

  const header = document.createElement("div");
  header.className = "question-header";

  const number = document.createElement("span");
  number.className = "number-badge";
  number.textContent = index + 1;

  const text = document.createElement("p");
  text.className = "question-text";
  text.textContent = question;

  header.append(number, text);

  const scale = document.createElement("div");
  scale.className = "scale";
  scale.setAttribute("role", "radiogroup");
  scale.setAttribute("aria-label", `${index + 1}번 문항 점수`);

  for (let score = 1; score <= 5; score += 1) {
    const id = `q${index + 1}-${score}`;
    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q${index + 1}`;
    input.id = id;
    input.value = score;

    const label = document.createElement("label");
    label.htmlFor = id;
    label.textContent = score;

    scale.append(input, label);
  }

  const caption = document.createElement("div");
  caption.className = "scale-caption";
  caption.innerHTML = "<span>전혀 아니다</span><span>매우 그렇다</span>";

  article.append(header, scale, caption);
  return article;
}

function getAnswers() {
  return questions.map((_, index) => {
    const checked = surveyEl.querySelector(`input[name="q${index + 1}"]:checked`);
    return checked ? Number(checked.value) : 0;
  });
}

function getTypeScores(answers) {
  return conflictTypes.map((type) => {
    const sum = type.questionIndexes.reduce((total, questionIndex) => total + answers[questionIndex], 0);
    const answeredItems = type.questionIndexes.filter((questionIndex) => answers[questionIndex] > 0).length;
    const average = answeredItems === type.questionIndexes.length ? sum / type.questionIndexes.length : 0;

    return {
      ...type,
      sum,
      average
    };
  });
}

function formatScore(score) {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

function renderScoreBoard(typeScores, isComplete) {
  scoreBoardEl.innerHTML = "";

  typeScores.forEach((type) => {
    const row = document.createElement("div");
    row.className = "score-row";

    const label = document.createElement("span");
    label.textContent = type.name;

    const meter = document.createElement("div");
    meter.className = "meter";
    const bar = document.createElement("span");
    bar.style.width = `${(type.average / 5) * 100}%`;
    meter.append(bar);

    const score = document.createElement("strong");
    score.textContent = isComplete ? `${formatScore(type.average)}점` : "-";

    row.append(label, meter, score);
    scoreBoardEl.append(row);
  });
}

function updateResult() {
  const answers = getAnswers();
  const answered = answers.filter(Boolean).length;
  const progress = (answered / questions.length) * 100;
  const isComplete = answered === questions.length;
  const typeScores = getTypeScores(answers);

  answeredCountEl.textContent = answered;
  progressBarEl.style.width = `${progress}%`;
  renderScoreBoard(typeScores, isComplete);

  if (!isComplete) {
    primaryTypeEl.textContent = "진단 전";
    resultTitleEl.textContent = "모든 문항을 체크해 주세요";
    resultCopyEl.textContent = "10개 문항을 모두 선택하면 나의 주된 갈등관리 유형과 리더로서 보완할 점이 표시됩니다.";
    resultCardEl.classList.remove("complete");
    return;
  }

  const sortedScores = [...typeScores].sort((a, b) => b.average - a.average);
  const topScore = sortedScores[0].average;
  const topTypes = sortedScores.filter((type) => type.average === topScore);
  const title = topTypes.map((type) => type.name).join(" · ");
  const mainType = topTypes[0];

  primaryTypeEl.textContent = title;
  resultTitleEl.textContent = `나의 주된 갈등관리 유형: ${title}`;
  resultCopyEl.innerHTML = `
    <strong>${mainType.feature}</strong>
    <span>장점: ${mainType.strength}</span>
    <span>주의점: ${mainType.caution}</span>
    <span>리더로서 보완할 점: ${mainType.advice}</span>
  `;
  resultCardEl.classList.add("complete");
}

questions.forEach((question, index) => {
  questionsEl.append(createQuestion(question, index));
});

surveyEl.addEventListener("change", updateResult);
resetButtonEl.addEventListener("click", () => {
  surveyEl.reset();
  updateResult();
  window.scrollTo({ top: 0, behavior: "smooth" });
});

updateResult();
