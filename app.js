<!DOCTYPE html>
<html lang="he" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <title>מתווך-PRO | גרסה מלאה</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Assistant:wght@300;400;600;700;800&display=swap');
        
        body { 
            font-family: 'Assistant', sans-serif; 
            background-color: #f8fafc; 
            height: 100vh; 
            display: flex; 
            flex-direction: column; 
            overflow: hidden; 
            margin: 0;
        }

        .content-area { 
            flex: 1; 
            overflow-y: auto; 
            padding: 20px; 
            padding-bottom: 100px; 
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        /* ניווט תחתון */
        .nav-bar { 
            height: 75px; 
            background: white; 
            border-top: 1px solid #e2e8f0; 
            display: flex; 
            position: fixed; 
            bottom: 0; 
            width: 100%; 
            z-index: 50; 
        }

        .nav-btn { 
            flex: 1; 
            display: flex; 
            flex-direction: column; 
            align-items: center; 
            justify-content: center; 
            color: #94a3b8; 
            font-size: 0.85rem; 
            font-weight: 700; 
            border: none; 
            background: none; 
            cursor: pointer;
        }

        .nav-btn.active { color: #2563eb; }

        /* עיצוב תוכן השיעור */
        .lesson-content h2 { font-size: 1.7rem; font-weight: 800; color: #1e40af; margin-bottom: 1rem; border-right: 4px solid #2563eb; padding-right: 15px; }
        .lesson-content h3 { font-size: 1.3rem; font-weight: 700; color: #334155; margin-top: 1.5rem; }
        .lesson-content p { color: #475569; line-height: 1.7; margin-bottom: 1rem; font-size: 1.1rem; }
        .lesson-content ul { padding-right: 20px; margin-bottom: 1rem; list-style-type: disc; }
        .lesson-content li { margin-bottom: 8px; color: #475569; }

        .important-box { 
            background: #fff7ed; 
            border-right: 5px solid #f97316; 
            padding: 20px; 
            border-radius: 15px; 
            margin: 20px 0; 
            color: #9a3412; 
            font-weight: 600; 
        }

        .hidden { display: none !important; }

        /* כרטיס תפריט */
        .menu-card {
            background: white;
            border-radius: 20px;
            padding: 20px;
            width: 100%;
            max-width: 320px;
            box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
            display: flex;
            align-items: center;
            justify-content: space-between;
            border: 1px solid #e2e8f0;
            cursor: pointer;
            transition: transform 0.1s;
        }
        .menu-card:active { transform: scale(0.97); }
    </style>
</head>
<body>

    <main class="content-area" id="main-content">
        
        <div id="screen-home" class="flex flex-col items-center justify-center min-h-full text-center w-full">
            <div class="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center shadow-xl mb-6 shadow-blue-200">
                <span class="text-4xl text-white">🏠</span>
            </div>
            <h1 class="text-3xl font-black text-slate-800 mb-2">מתווך-PRO</h1>
            <p class="text-slate-500 mb-10 px-10">הכנה מקיפה לבחינת רשם המתווכים</p>
            
            <div class="flex flex-col gap-4 w-full items-center">
                <div onclick="showTab('lessons')" class="menu-card border-r-4 border-r-blue-600">
                    <div class="text-right">
                        <span class="block text-lg font-bold text-slate-800">שיעורי לימוד</span>
                        <span id="progress-tag" class="text-xs text-blue-500 font-bold">טוען נתונים...</span>
                    </div>
                    <span class="text-3xl">📖</span>
                </div>

                <div onclick="showTab('exams')" class="menu-card border-r-4 border-r-amber-500">
                    <div class="text-right">
                        <span class="block text-lg font-bold text-slate-800">סימולציית בחינה</span>
                        <span class="text-[11px] text-slate-400">25 שאלות רנדומליות</span>
                    </div>
                    <span class="text-3xl">⏱️</span>
                </div>
            </div>
        </div>

        <div id="screen-lessons-list" class="hidden w-full max-w-sm">
            <h2 class="text-2xl font-black mb-6 text-slate-800 text-center">תכנית הלימודים</h2>
            <div id="lessons-grid" class="space-y-4"></div>
        </div>

        <div id="screen-study" class="hidden w-full max-w-md">
            <div class="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 mb-6">
                <div id="lesson-body" class="lesson-content"></div>
                <div class="mt-8 pt-6 border-t border-slate-100">
                    <button onclick="startChapterQuiz()" class="w-full bg-blue-600 text-white p-5 rounded-2xl font-black shadow-lg mb-4">תרגול שאלות הפרק ✍️</button>
                    <button onclick="showTab('lessons')" class="w-full text-slate-400 font-bold py-2">חזרה לרשימה</button>
                </div>
            </div>
        </div>

        <div id="screen-quiz" class="hidden w-full max-w-sm flex flex-col min-h-full">
            <div class="flex justify-between items-center mb-6">
                <div id="timer" class="text-red-600 font-black bg-red-50 px-4 py-2 rounded-2xl tabular-nums border border-red-100">00:00</div>
                <div id="counter" class="text-slate-400 font-black text-xl"></div>
            </div>
            <div id="question-box" class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-50 flex-grow relative">
                <h3 id="q-text" class="text-xl font-bold mb-8 text-slate-800 leading-tight"></h3>
                <div id="options" class="space-y-4"></div>
                
                <div id="explanation" class="mt-8 p-6 bg-blue-50 border-r-4 border-blue-500 rounded-2xl hidden">
                    <p id="exp-text" class="text-slate-700 font-medium leading-relaxed"></p>
                    <button onclick="nextQuestion()" class="w-full bg-blue-600 text-white p-4 rounded-xl font-black mt-6 shadow-md">המשך ←</button>
                </div>
            </div>
        </div>

    </main>

    <nav class="nav-bar">
        <button onclick="showTab('home')" class="nav-btn" id="nav-home">
            <span class="text-xl">🏠</span><span class="mt-1">ראשי</span>
        </button>
        <button onclick="showTab('lessons')" class="nav-btn" id="nav-lessons">
            <span class="text-xl">📖</span><span class="mt-1">לימוד</span>
        </button>
        <button onclick="showTab('exams')" class="nav-btn" id="nav-exams">
            <span class="text-xl">📝</span><span class="mt-1">בחינה</span>
        </button>
    </nav>

    <script src="app.js"></script>
</body>
</html>
