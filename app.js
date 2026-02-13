let lessonsData = [];
let currentQuiz = [];
let quizIdx = 0;
let score = 0;
let timer;

// טעינת הנתונים מקובץ ה-JSON המקומי
async function loadData() {
    try {
        const response = await fetch('lessons.json');
        lessonsData = await response.json();
    } catch (e) {
        console.error("שגיאה בטעינת הקובץ. וודא שאתה מריץ על שרת מקומי או דפדפן תומך.");
    }
}

function showTab(tab) {
    clearInterval(timer);
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(`screen-${tab === 'exams' ? 'quiz' : (tab === 'lessons' ? 'lessons-list' : 'home')}`).classList.remove('hidden');
    document.getElementById(`nav-${tab}`).classList.add('active');

    if(tab === 'lessons') renderLessonsList();
    if(tab === 'exams') startFullExam();
}

function renderLessonsList() {
    const grid = document.getElementById('lessons-grid');
    grid.innerHTML = lessonsData.map((l, i) => `
        <div onclick="openLesson(${i})" class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center cursor-pointer">
            <span class="font-bold text-slate-700">${l.title}</span>
            <span class="text-blue-500">←</span>
        </div>
    `).join('');
}

function openLesson(i) {
    document.getElementById('screen-lessons-list').classList.add('hidden');
    const screen = document.getElementById('screen-study');
    screen.classList.remove('hidden');
    document.getElementById('lesson-body').innerHTML = lessonsData[i].content;
    screen.dataset.idx = i;
}

function startChapterQuiz() {
    const idx = document.getElementById('screen-study').dataset.idx;
    currentQuiz = [...lessonsData[idx].questions];
    initQuiz(600);
}

function startFullExam() {
    // מייצר מבחן מכל השאלות במאגר ומערבב
    let allQ = [];
    lessonsData.forEach(l => allQ = [...allQ, ...l.questions]);
    currentQuiz = allQ.sort(() => 0.5 - Math.random()).slice(0, 25);
    initQuiz(3600);
}

function initQuiz(seconds) {
    quizIdx = 0; score = 0;
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    document.getElementById('screen-quiz').classList.remove('hidden');
    runTimer(seconds);
    renderQuestion();
}

function runTimer(t) {
    timer = setInterval(() => {
        let m = Math.floor(t/60), s = t%60;
        document.getElementById('timer').textContent = `${m}:${s<10?'0':''}${s}`;
        if(--t < 0) { clearInterval(timer); showTab('home'); }
    }, 1000);
}

function renderQuestion() {
    const q = currentQuiz[quizIdx];
    document.getElementById('counter').textContent = `${quizIdx + 1}/${currentQuiz.length}`;
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('explanation').classList.add('hidden');
    
    document.getElementById('options').innerHTML = q.options.map((opt, i) => `
        <button onclick="checkAnswer(${i})" class="w-full text-right p-4 border-2 border-slate-100 rounded-xl hover:border-blue-200 bg-slate-50 font-semibold transition-all">${opt}</button>
    `).join('');
}

function checkAnswer(i) {
    const q = currentQuiz[quizIdx];
    if(!document.getElementById('explanation').classList.contains('hidden')) return;
    
    if(i === q.correct) score++;
    document.getElementById('exp-text').textContent = q.exp;
    document.getElementById('explanation').classList.remove('hidden');
}

function nextQuestion() {
    if(++quizIdx < currentQuiz.length) renderQuestion();
    else {
        alert(`סיימת! ציון: ${Math.round(score/currentQuiz.length*100)}`);
        showTab('home');
    }
}

loadData();
showTab('home');