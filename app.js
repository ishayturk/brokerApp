// FILE_NAME: app.js | VERSION: 3.0.0 (Full Content Integration)

const internalLessons = [
    {
        title: "1. רישוי ואגרות",
        content: "<h2>פרק 1: חוק המתווכים - רישוי</h2><p>כדי לעסוק בתיווך מקרקעין בישראל, חובה להחזיק ברישיון בתוקף מטעם רשם המתווכים.</p><h3>תנאי סף לקבלת רישיון:</h3><ul><li>אזרח או תושב ישראל.</li><li>מלאו לו 18 שנים.</li><li>לא הוכרז כפושט רגל.</li><li>לא הורשע בעבירה שיש עמה קלון ב-5 השנים האחרונות.</li><li>עבר בהצלחה את בחינת רשם המתווכים.</li></ul><h3>אגרות:</h3><p>על המתווך לשלם אגרה שנתית. אי תשלום האגרה בזמן משמעו שהרישיון אינו בתוקף לאותה תקופה.</p>",
        questions: [
            {
                q: "מה קורה אם מתווך לא שילם את האגרה השנתית במועד?",
                options: ["הוא יקבל קנס כספי בלבד", "רישיונו מותלה אוטומטית והוא לא זכאי לדמי תיווך", "הוא יוכל לשלם בשנה הבאה ללא סנקציה", "הוא חייב לעבור את הבחינה מחדש"],
                correct: 1,
                exp: "לפי סעיף 18 לחוק, מתווך שלא שילם את האגרה לא רשאי לשמש כמתווך באותה תקופה."
            }
        ]
    },
    {
        title: "2. דרישת הכתב והזמנה",
        content: "<h2>פרק 2: הזמנה בכתב</h2><p>מתווך במקרקעין לא יהיה זכאי לדמי תיווך אלא אם כן חתם הלקוח על הזמנה בכתב לביצוע פעולת תיווך במקרקעין.</p><h3>פרטי חובה בהזמנה:</h3><ul><li>שמות, כתובות ומספרי זיהוי של המתווך ושל הלקוח.</li><li>סוג העסקה (מכירה, קנייה, שכירות).</li><li>תיאור הנכס נשוא פעולת התיווך.</li><li>מחיר העסקה המבוקשת, בקירוב.</li><li>הסכום המוסכם של דמי התיווך או שיעור דמי התיווך המוסכם מתוך המחיר שבו תתבצע העסקה.</li></ul>",
        questions: [
            {
                q: "מהו תנאי הכרחי לזכאות למתווך לדמי תיווך לפי חוק המתווכים?",
                options: ["לחיצת יד בין הצדדים", "הסכם בעל פה בנוכחות עד", "הזמנה בכתב הכוללת את כל פרטי החובה", "רישום העסקה בטאבו"],
                correct: 2,
                exp: "סעיף 9(א) קובע שחובה לחתום על הזמנה בכתב הכוללת את הפרטים שנקבעו בתקנות."
            }
        ]
    },
    {
        title: "3. בלעדיות ופעולות שיווק",
        content: "<h2>פרק 3: בלעדיות</h2><p>מתווך רשאי להסכים עם לקוח על מתן שירותי תיווך בבלעדיות, בתנאי שמתקיימים התנאים הבאים:</p><ul><li>מתן הבלעדיות ותקופתה יאושרו במסמך נפרד מההזמנה בכתב.</li><li>במהלך תקופת הבלעדיות המתווך יבצע לפחות שתי פעולות שיווק (כמו שלט, פרסום בעיתון, אינטרנט).</li></ul><p>תקופת הבלעדיות בדירה לא תעלה על 6 חודשים (אם לא נקבע זמן, היא תסתיים לאחר 30 יום).</p>",
        questions: [
            {
                q: "מהי תקופת הבלעדיות המקסימלית למכירת דירה?",
                options: ["3 חודשים", "6 חודשים", "שנה אחת", "אין הגבלה"],
                correct: 1,
                exp: "לפי סעיף 9(ב1), תקופת הבלעדיות לעניין דירה לא תעלה על 6 חודשים."
            }
        ]
    }
    // ניתן להוסיף כאן את שאר הפרקים באותו פורמט
];

let currentQuiz = [];
let quizIdx = 0;
let score = 0;
let completedLessons = JSON.parse(localStorage.getItem('broker_vfinal')) || [];

function showTab(tab) {
    document.querySelectorAll('main > div').forEach(d => d.classList.add('hidden'));
    let target = tab === 'lessons' ? 'screen-lessons-list' : (tab === 'exams' ? 'screen-quiz' : 'screen-home');
    document.getElementById(target).classList.remove('hidden');
    
    // ניהול עיצוב כפתורי הניווט
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('text-blue-600'));
    
    if(tab === 'lessons') renderLessons();
    if(tab === 'exams') startFullExam();
    
    document.getElementById('main-content').scrollTop = 0;
}

function renderLessons() {
    const grid = document.getElementById('lessons-grid');
    grid.innerHTML = internalLessons.map((l, i) => `
        <div onclick="openLesson(${i})" class="bg-white p-5 rounded-xl border shadow-sm mb-2 flex justify-between items-center cursor-pointer active:bg-blue-50">
            <div class="flex items-center gap-3">
                <span class="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">${i+1}</span>
                <span class="font-bold text-slate-700">${l.title}</span>
            </div>
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
    
    if(!completedLessons.includes(i)) {
        completedLessons.push(i);
        localStorage.setItem('broker_vfinal', JSON.stringify(completedLessons));
        updateProgress();
    }
}

function startChapterQuiz() {
    const idx = document.getElementById('screen-study').dataset.idx;
    currentQuiz = [...internalLessons[idx].questions];
    initQuiz();
}

function startFullExam() {
    let allQ = [];
    internalLessons.forEach(l => { allQ = [...allQ, ...l.questions]; });
    if(allQ.length === 0) return;
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
    const btns = document.getElementById('options').children;
    if(i === q.correct) {
        btns[i].classList.add('border-green-500', 'bg-green-50');
        score++;
    } else {
        btns[i].classList.add('border-red-500', 'bg-red-50');
        btns[q.correct].classList.add('border-green-500', 'bg-green-50');
    }
    document.getElementById('exp-text').textContent = q.exp;
    document.getElementById('explanation').classList.remove('hidden');
}

function nextQuestion() {
    if(++quizIdx < currentQuiz.length) renderQuestion();
    else { alert(`הסתיים! ציון: ${Math.round(score/currentQuiz.length*100)}`); showTab('home'); }
}

function updateProgress() {
    const tag = document.getElementById('progress-tag');
    if(tag) tag.textContent = `${completedLessons.length} מתוך ${internalLessons.length} הושלמו`;
}

// הפעלה ראשונית
updateProgress();
showTab('home');
