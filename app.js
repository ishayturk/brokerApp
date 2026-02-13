// הנתונים מוטמעים ישירות כדי למנוע שגיאות טעינה מ-GitHub
const internalLessons = [
    {
        title: "1. רישוי ואגרות",
        content: "<h2>חוק המתווכים - רישוי</h2><p>כדי לעסוק בתיווך חובה להחזיק ברישיון בתוקף. התנאים: אזרח ישראל, מעל גיל 18, ללא עבר פלילי ב-5 שנים האחרונות, ולא פושט רגל.</p>",
        questions: [
            {
                q: "מי רשאי לקבל רישיון תיווך?",
                options: ["כל אדם מעל גיל 16", "אזרח ישראל מעל גיל 18 ללא עבירות קלון", "רק מי שיש לו תואר אקדמי", "רק תושב חוץ"],
                correct: 1,
                exp: "לפי החוק, התנאים הם גיל 18, אזרחות/תושבות והיעדר עבירות שיש עמן קלון."
            }
        ]
    }
];

let currentQuiz = [];
let quizIdx = 0;
let score = 0;
let completedLessons = JSON.parse(localStorage.getItem('broker_v4')) || [];

function showTab(tab) {
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    let target = tab === 'lessons' ? 'screen-lessons-list' : (tab === 'exams' ? 'screen-quiz' : 'screen-home');
    document.getElementById(target).classList.remove('hidden');
    if(tab === 'lessons') renderLessons();
    if(tab === 'exams') startFullExam();
}

function renderLessons() {
    const grid = document.getElementById('lessons-grid');
    grid.innerHTML = internalLessons.map((l, i) => `
        <div onclick="openLesson(${i})" class="bg-white p-4 rounded-xl shadow-sm border mb-2 flex justify-between items-center cursor-pointer">
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
    else { alert(`סיימת! ציון: ${Math.round(score/currentQuiz.length*100)}`); showTab('home'); }
}

// אתחול ראשוני
document.getElementById('progress-tag').textContent = `${completedLessons.length} מתוך ${internalLessons.length} הושלמו`;
showTab('home');
