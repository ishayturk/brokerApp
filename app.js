let lessonsData = [];
let currentQuiz = [];
let quizIdx = 0;
let score = 0;
let timerInterval;
let completedLessons = JSON.parse(localStorage.getItem('broker_comp_v3')) || [];

async function loadData() {
    const errorEl = document.getElementById('error-log');
    try {
        const res = await fetch('./index.json?v=' + Date.now());
        if (!res.ok) throw new Error("Could not find index.json");
        const list = await res.json();
        
        const promises = list.map(item => 
            fetch(`./${item.file}?v=${Date.now()}`)
                .then(r => r.ok ? r.json() : null)
                .catch(e => { console.error("Error loading " + item.file); return null; })
        );
        
        const results = await Promise.all(promises);
        lessonsData = results.filter(r => r !== null);
        
        document.getElementById('progress-tag').textContent = `${completedLessons.length} מתוך ${lessonsData.length} הושלמו`;
    } catch (e) {
        if(errorEl) errorEl.textContent = "שגיאת טעינה: " + e.message;
    }
}

function showTab(tab) {
    clearInterval(timerInterval);
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    let target = tab === 'lessons' ? 'screen-lessons-list' : (tab === 'exams' ? 'screen-quiz' : 'screen-home');
    document.getElementById(target).classList.remove('hidden');
    if(tab === 'lessons') renderLessons();
    if(tab === 'exams') startFullExam();
}

function renderLessons() {
    const grid = document.getElementById('lessons-grid');
    grid.innerHTML = lessonsData.map((l, i) => `
        <div onclick="openLesson(${i})" class="bg-white p-4 rounded-xl border-2 border-transparent shadow-sm flex justify-between items-center cursor-pointer active:bg-blue-50">
            <span class="font-bold text-slate-700">${l.title}</span>
            <span>${completedLessons.includes(i) ? '✅' : '⬅️'}</span>
        </div>
    `).join('');
}

function openLesson(i) {
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    const s = document.getElementById('screen-study');
    s.classList.remove('hidden');
    s.dataset.idx = i;
    document.getElementById('lesson-body').innerHTML = lessonsData[i].content;
    if(!completedLessons.includes(i)) {
        completedLessons.push(i);
        localStorage.setItem('broker_comp_v3', JSON.stringify(completedLessons));
    }
}

function startChapterQuiz() {
    const idx = document.getElementById('screen-study').dataset.idx;
    currentQuiz = [...lessonsData[idx].questions];
    initQuiz();
}

function startFullExam() {
    let allQ = [];
    lessonsData.forEach(l => { if(l.questions) allQ = [...allQ, ...l.questions]; });
    currentQuiz = allQ.sort(() => 0.5 - Math.random()).slice(0, 25);
    initQuiz();
}

function initQuiz() {
    quizIdx = 0; score = 0;
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    document.getElementById('screen-quiz').classList.remove('hidden');
    renderQuestion();
}

function renderQuestion() {
    const q = currentQuiz[quizIdx];
    document.getElementById('counter').textContent = `${quizIdx + 1}/${currentQuiz.length}`;
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('explanation').classList.add('hidden');
    document.getElementById('options').innerHTML = q.options.map((opt, i) => `
        <button onclick="checkAns(${i})" class="w-full text-right p-4 border rounded-xl bg-slate-50 font-bold active:bg-blue-100">${opt}</button>
    `).join('');
}

function checkAns(i) {
    if(!document.getElementById('explanation').classList.contains('hidden')) return;
    const q = currentQuiz[quizIdx];
    if(i === q.correct) score++;
    document.getElementById('exp-text').textContent = q.exp;
    document.getElementById('explanation').classList.remove('hidden');
}

function nextQuestion() {
    if(++quizIdx < currentQuiz.length) renderQuestion();
    else { alert(`סיימת! ציון: ${Math.round(score/currentQuiz.length*100)}`); showTab('home'); }
}

loadData();
showTab('home');
