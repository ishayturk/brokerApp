// FILE_NAME: app.js | VERSION: 2.6.0 (Force Parse)
let lessonsData = [];
let currentQuiz = [];
let quizIdx = 0;
let score = 0;
let timerInterval;
let completedLessons = JSON.parse(localStorage.getItem('broker_completed_v2')) || [];

async function loadData() {
    const log = document.getElementById('error-log');
    const tag = document.getElementById('progress-tag');
    try {
        const response = await fetch(`./index.json?v=${Date.now()}`);
        if (!response.ok) throw new Error("לא נמצא קובץ index.json");
        
        let rawData = await response.text(); // קורא כטקסט גולמי
        let indexData;
        
        try {
            indexData = JSON.parse(rawData); // הופך לאובייקט JS
        } catch (e) {
            throw new Error("קובץ index.json אינו בפורמט JSON תקין");
        }
        
        // וידוי שהנתונים הם מערך (Array)
        let list = Array.isArray(indexData) ? indexData : (indexData.lessons || []);
        
        if (list.length === 0) throw new Error("רשימת השיעורים ריקה");

        const promises = list.map(item => 
            fetch(`./${item.file}?v=${Date.now()}`).then(r => r.json())
        );
        
        lessonsData = await Promise.all(promises);
        renderLessonsList();
        if(tag) tag.textContent = `${completedLessons.length} מתוך ${lessonsData.length} הושלמו`;
    } catch (e) {
        console.error(e);
        if(log) log.textContent = "שגיאה: " + e.message;
    }
}

function showTab(tab) {
    clearInterval(timerInterval);
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    let target = tab === 'lessons' ? 'screen-lessons-list' : (tab === 'exams' ? 'screen-quiz' : 'screen-home');
    document.getElementById(target).classList.remove('hidden');
    if(tab === 'lessons') renderLessonsList();
    if(tab === 'exams') startFullExam();
}

function renderLessonsList() {
    const grid = document.getElementById('lessons-grid');
    if(!grid || lessonsData.length === 0) return;
    grid.innerHTML = lessonsData.map((l, i) => `
        <div onclick="openLesson(${i})" class="bg-white p-5 rounded-xl border shadow-sm mb-2 flex justify-between items-center cursor-pointer">
            <span class="font-bold">${l.title}</span>
            <span>${completedLessons.includes(i) ? '✅' : '⬅️'}</span>
        </div>
    `).join('');
}

function openLesson(i) {
    document.getElementById('screen-lessons-list').classList.add('hidden');
    const s = document.getElementById('screen-study');
    s.classList.remove('hidden');
    s.dataset.idx = i;
    document.getElementById('lesson-body').innerHTML = lessonsData[i].content;
    if(!completedLessons.includes(i)) {
        completedLessons.push(i);
        localStorage.setItem('broker_completed_v2', JSON.stringify(completedLessons));
    }
}

function startChapterQuiz() {
    const idx = document.getElementById('screen-study').dataset.idx;
    currentQuiz = [...lessonsData[idx].questions];
    initQuiz(600);
}

function startFullExam() {
    let allQ = [];
    lessonsData.forEach(l => { if(l.questions) allQ = [...allQ, ...l.questions]; });
    currentQuiz = allQ.sort(() => 0.5 - Math.random()).slice(0, 25);
    initQuiz(3600);
}

function initQuiz(sec) {
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
        <button onclick="checkAns(${i})" class="w-full text-right p-4 border rounded-xl mb-2 bg-slate-50">${opt}</button>
    `).join('');
}

function checkAns(i) {
    const q = currentQuiz[quizIdx];
    if(i === q.correct) score++;
    document.getElementById('exp-text').textContent = q.exp;
    document.getElementById('explanation').classList.remove('hidden');
}

function nextQuestion() {
    if(++quizIdx < currentQuiz.length) renderQuestion();
    else { alert(`ציון: ${Math.round(score/currentQuiz.length*100)}`); showTab('home'); }
}

loadData();
showTab('home');
