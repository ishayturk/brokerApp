const internalLessons = [
    {
        title: "1. רישוי ואגרות",
        content: "<h2>חוק המתווכים - רישוי</h2><p>כדי לעסוק בתיווך חובה להחזיק ברישיון. התנאים: גיל 18, אזרח/תושב, ללא עבר פלילי ב-5 שנים האחרונות.</p>",
        questions: [{ q: "מהו גיל המינימום לרישיון?", options: ["16", "18", "21", "אין הגבלה"], correct: 1, exp: "לפי החוק גיל המינימום הוא 18." }]
    },
    {
        title: "2. דרישת הכתב",
        content: "<h2>הזמנה בכתב</h2><p>חובה לחתום על הזמנת תיווך בכתב הכוללת שמות, מחיר, ונכס.</p>",
        questions: [{ q: "האם הסכם בעל פה מזכה בדמי תיווך?", options: ["כן", "רק אם יש עדים", "לא, חובה הסכם בכתב", "רק מעל מיליון ש\"ח"], correct: 2, exp: "סעיף 9 קובע חובת כתב לזכאות." }]
    },
    {
        title: "3. בלעדיות",
        content: "<h2>בלעדיות</h2><p>מוגבלת ל-6 חודשים בדירה ומחייבת 2 פעולות שיווק.</p>",
        questions: [{ q: "מה משך הבלעדיות המקסימלי לדירה?", options: ["3 חודשים", "6 חודשים", "שנה", "חודש"], correct: 1, exp: "החוק מגביל ל-6 חודשים בדירת מגורים." }]
    }
];

let currentQuiz = [];
let quizIdx = 0;
let score = 0;
let completedLessons = JSON.parse(localStorage.getItem('broker_v5')) || [];

function showTab(tab) {
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    let target = 'screen-home';
    if(tab === 'lessons') target = 'screen-lessons-list';
    if(tab === 'exams') target = 'screen-quiz';
    if(tab === 'study') target = 'screen-study';
    
    document.getElementById(target).classList.remove('hidden');
    if(tab === 'lessons') renderLessons();
    if(tab === 'exams') startFullExam();
}

function renderLessons() {
    const grid = document.getElementById('lessons-grid');
    grid.innerHTML = internalLessons.map((l, i) => `
        <div onclick="openLesson(${i})" class="bg-white p-4 rounded-xl border-2 border-slate-100 shadow-sm flex justify-between items-center cursor-pointer">
            <span class="font-bold">${l.title}</span>
            <span>${completedLessons.includes(i) ? '✅' : '⬅️'}</span>
        </div>
    `).join('');
}

function openLesson(i) {
    showTab('study');
    const s = document.getElementById('screen-study');
    s.dataset.idx = i;
    document.getElementById('lesson-body').innerHTML = internalLessons[i].content;
}

function startChapterQuiz() {
    const idx = document.getElementById('screen-study').dataset.idx;
    currentQuiz = [...internalLessons[idx].questions];
    initQuiz();
}

function startFullExam() {
    let allQ = [];
    internalLessons.forEach(l => { allQ = [...allQ, ...l.questions]; });
    currentQuiz = allQ.sort(() => 0.5 - Math.random());
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
        <button onclick="checkAns(${i})" class="w-full text-right p-4 border rounded-xl bg-slate-50 font-bold">${opt}</button>
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
    else { alert(`ציון: ${Math.round(score/currentQuiz.length*100)}`); showTab('home'); }
}

// חשיפת פונקציות לעולם החיצון (לחלון)
window.showTab = showTab;
window.openLesson = openLesson;
window.startChapterQuiz = startChapterQuiz;
window.checkAns = checkAns;
window.nextQuestion = nextQuestion;

// הפעלה ראשונית
showTab('home');
