// FILE_NAME: app.js | VERSION: 2.4.0
let lessonsData = [];
let currentQuiz = [];
let quizIdx = 0;
let score = 0;
let timerInterval;
let completedLessons = JSON.parse(localStorage.getItem('broker_completed_v2')) || [];

async function loadData() {
    try {
        // טעינת האינדקס - שימוש בנתיב יחסי
        const response = await fetch(`./index.json?v=${new Date().getTime()}`);
        if (!response.ok) throw new Error("Could not find index.json");
        const indexData = await response.json();
        
        // טעינת כל השיעורים במקביל
        const promises = indexData.map(item => 
            fetch(`./${item.file}?v=${new Date().getTime()}`).then(r => {
                if (!r.ok) throw new Error(`Missing: ${item.file}`);
                return r.json();
            })
        );
        
        lessonsData = await Promise.all(promises);
        console.log("Data loaded successfully");
        updateHomeProgress();
    } catch (e) {
        console.error("Load Error:", e);
        const tag = document.getElementById('progress-tag');
        if(tag) tag.textContent = "שגיאה בטעינת נתונים";
    }
}

function updateHomeProgress() {
    const tag = document.getElementById('progress-tag');
    if(tag && lessonsData.length > 0) {
        tag.textContent = `${completedLessons.length} מתוך ${lessonsData.length} הושלמו`;
    }
}

function showTab(tab) {
    clearInterval(timerInterval);
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    let target = 'screen-home';
    if(tab === 'lessons') target = 'screen-lessons-list';
    if(tab === 'exams') target = 'screen-quiz';
    
    const targetEl = document.getElementById(target);
    if(targetEl) targetEl.classList.remove('hidden');
    
    const navBtn = document.getElementById(`nav-${tab}`);
    if(navBtn) navBtn.classList.add('active');

    if(tab === 'lessons') renderLessonsList();
    if(tab === 'exams') startFullExam();
    document.getElementById('main-content').scrollTop = 0;
}

function renderLessonsList() {
    const grid = document.getElementById('lessons-grid');
    if(!grid) return;
    
    if(lessonsData.length === 0) {
        grid.innerHTML = "<div class='text-center p-10 text-slate-500'>טוען תכנים... וודא שחיברת את כל הקבצים</div>";
        return;
    }

    grid.innerHTML = lessonsData.map((l, i) => {
        const isDone = completedLessons.includes(i);
        return `
            <div onclick="openLesson(${i})" class="bg-white p-5 rounded-2xl border-2 ${isDone ? 'border-green-200 bg-green-50' : 'border-transparent'} shadow-sm flex justify-between items-center cursor-pointer active:scale-95 transition-all">
                <div class="flex items-center gap-4">
                    <div class="w-10 h-10 rounded-xl ${isDone ? 'bg-green-500 text-white' : 'bg-blue-100 text-blue-600'} flex items-center justify-center font-black">
                        ${isDone ? '✓' : i + 1}
                    </div>
                    <span class="font-bold text-slate-700">${l.title}</span>
                </div>
                <span class="text-slate-300">←</span>
            </div>
        `;
    }).join('');
}

function openLesson(i) {
    document.getElementById('screen-lessons-list').classList.add('hidden');
    const s = document.getElementById('screen-study');
    s.classList.remove('hidden');
    document.getElementById('lesson-body').innerHTML = lessonsData[i].content;
    s.dataset.idx = i;
    
    if(!completedLessons.includes(i)) {
        completedLessons.push(i);
        localStorage.setItem('broker_completed_v2', JSON.stringify(completedLessons));
        updateHomeProgress();
    }
    document.getElementById('main-content').scrollTop = 0;
}

function startChapterQuiz() {
    const idx = document.getElementById('screen-study').dataset.idx;
    currentQuiz = [...lessonsData[idx].questions];
    initQuiz(600);
}

function startFullExam() {
    let allQ = [];
    lessonsData.forEach(l => { if(l.questions) allQ = [...allQ, ...l.questions]; });
    if(allQ.length === 0) { alert("לא נמצאו שאלות במערכת"); return; }
    currentQuiz = allQ.sort(() => 0.5 - Math.random()).slice(0, 25);
    initQuiz(3600);
}

function initQuiz(sec) {
    quizIdx = 0; score = 0;
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    document.getElementById('screen-quiz').classList.remove('hidden');
    
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        let m = Math.floor(sec/60), s = sec%60;
        document.getElementById('timer').textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
        if(--sec < 0) { clearInterval(timerInterval); alert("תם הזמן!"); showTab('home'); }
    }, 1000);
    renderQuestion();
}

function renderQuestion() {
    const q = currentQuiz[quizIdx];
    document.getElementById('counter').textContent = `${quizIdx + 1}/${currentQuiz.length}`;
    document.getElementById('q-text').textContent = q.q;
    document.getElementById('explanation').classList.add('hidden');
    document.getElementById('options').innerHTML = q.options.map((opt, i) => `
        <button onclick="checkAns(${i})" class="w-full text-right p-5 border-2 border-slate-100 rounded-2xl font-bold bg-slate-50 active:bg-blue-100 transition-all">${opt}</button>
    `).join('');
}

function checkAns(i) {
    if(!document.getElementById('explanation').classList.contains('hidden')) return;
    const q = currentQuiz[quizIdx];
    const btns = document.getElementById('options').children;
    if(i === q.correct) {
        btns[i].classList.add('border-green-500', 'bg-green-50', 'text-green-700');
        score++;
    } else {
        btns[i].classList.add('border-red-500', 'bg-red-50', 'text-red-700');
        btns[q.correct].classList.add('border-green-500', 'bg-green-50');
    }
    document.getElementById('exp-text').textContent = q.exp;
    document.getElementById('explanation').classList.remove('hidden');
}

function nextQuestion() {
    if(++quizIdx < currentQuiz.length) renderQuestion();
    else { 
        clearInterval(timerInterval); 
        alert(`המבחן הסתיים! ציון: ${Math.round(score/currentQuiz.length*100)}`); 
        showTab('home'); 
    }
}

// התחלה
loadData();
showTab('home');
