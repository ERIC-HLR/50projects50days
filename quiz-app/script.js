const quizData = [
    { question: "Which language runs in a web browser?",
      a: "Java", b: "C", c: "Python", d: "JavaScript", correct: "d" },
    { question: "What does CSS stand for?",
      a: "Central Style Sheets", b: "Cascading Style Sheets",
      c: "Cascading Simple Sheets", d: "Cars SUVs Sailboats", correct: "b" },
    { question: "What does HTML stand for?",
      a: "Hypertext Markup Language", b: "Hypertext Markdown Language",
      c: "Hyperloop Machine Language", d: "Helicopters Terminals Motorboats Lamborginis", correct: "a" },
    { question: "What year was JavaScript launched?",
      a: "1996", b: "1995", c: "1994", d: "none of the above", correct: "b" },
  ];
  
  /* -------- DOM 选择 -------- */
  // 人机验证
  const verifyContainer = document.getElementById('verify-container');
  const drag  = document.getElementById('drag');
  const drop  = document.getElementById('drop');
  const verifyMsg = document.getElementById('verify-msg');
  
  // Quiz
  const quiz       = document.getElementById('quiz');
  const answerEls  = document.querySelectorAll('.answer');
  const questionEl = document.getElementById('question');
  const a_text     = document.getElementById('a_text');
  const b_text     = document.getElementById('b_text');
  const c_text     = document.getElementById('c_text');
  const d_text     = document.getElementById('d_text');
  const feedbackEl = document.getElementById('feedback');
  const submitBtn  = document.getElementById('submit');
  
  /* -------- 人机验证逻辑 -------- */
  drag.addEventListener('dragstart', e => {
    e.dataTransfer.setData('text/plain', 'drag');
  });
  
  drop.addEventListener('dragover', e => e.preventDefault());
  
  drop.addEventListener('drop', e => {
    e.preventDefault();
    const data = e.dataTransfer.getData('text/plain');
    if (data === 'drag') {
      drop.appendChild(drag);      
      drag.style.cursor = 'default';
      verifyMsg.textContent = '✅ Verification passed! Click to start 👉';
      verifyMsg.style.color = '#27ae60';
      // 点击开始答题
      verifyMsg.style.cursor = drop.style.cursor = 'pointer';
      verifyMsg.addEventListener('click', startQuiz);
      drop.addEventListener('click', startQuiz);
    }
  });
  
  function startQuiz() {
    // 1. 收起人机验证
    verifyContainer.classList.add('hidden');
  
    // 2. 展示 Quiz
    quiz.classList.remove('hidden');       
    quiz.style.visibility = 'visible';
    quiz.classList.add('fade-in');
  
    // 3. 载入第一题
    loadQuiz();
  }
  
  /* -------- Quiz 逻辑 -------- */
  let currentQuiz = 0;
  let score       = 0;
  let submitted   = false;   // 标记当前题是否已提交
  
  function loadQuiz() {
    deselectAnswers();
    const cur = quizData[currentQuiz];
    questionEl.innerText = cur.question;
    a_text.innerText = cur.a;
    b_text.innerText = cur.b;
    c_text.innerText = cur.c;
    d_text.innerText = cur.d;
  }
  
  function deselectAnswers() {
    answerEls.forEach(el => (el.checked = false));
  }
  
  function getSelected() {
    let answer = null;
    answerEls.forEach(el => {
      if (el.checked) answer = el.id;
    });
    return answer;
  }
  
  submitBtn.addEventListener('click', () => {
    if (!submitted) {
      const answer = getSelected();
      if (!answer) return;  
  
      const correct = quizData[currentQuiz].correct;
      if (answer === correct) {
        score++;
        feedbackEl.textContent = '✅ Correct!';
        feedbackEl.style.color = 'green';
      } else {
        const correctText = quizData[currentQuiz][correct];
        feedbackEl.textContent = `❌ Wrong! Correct answer: ${correctText}`;
        feedbackEl.style.color = 'red';
      }
  
      submitted = true;
      submitBtn.textContent = currentQuiz === quizData.length - 1 ? 'Finish' : 'Next';
    }
    else {
      currentQuiz++;
      submitted = false;
  
      if (currentQuiz < quizData.length) {
        feedbackEl.textContent = '';
        submitBtn.textContent  = 'Submit';
        loadQuiz();
      } else {
        quiz.innerHTML = `
          <h2>You answered ${score} / ${quizData.length} questions correctly</h2>
          <button onclick="location.reload()">Reload</button>
        `;
      }
    }
  });
