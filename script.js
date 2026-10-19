const CATS = {
    "Еда": "#7a9fd4",
    "Дом": "#4a6fa5",
    "Транспорт": "#3a8a9e",
    "Развлечения": "#7a5fb8",
    "Здоровье": "#b84a5a",
    "Покупки": "#b89a5a",
    "Другое": "#5a6a7a"
};
const cn = Object.keys(CATS);

// по этим словам угадываем категорию
const RU = {
    "Еда": /кофе|еда|обед|ужин|завтрак|пят[её]р|магнит|перекр|вкусвилл|лент|ресторан|кафе|пицц|суши|доставк|продукт|макдон|булк/i,
    "Дом": /аренд|квартир|жкх|свет|интернет|ремонт|мебел|икеа/i,
    "Транспорт": /такси|метро|бензин|яндекс|убер|uber|автобус|парков|заправк|проезд/i,
    "Развлечения": /кино|бар|концерт|игр|steam|netflix|театр|клуб|подписк/i,
    "Здоровье": /аптек|врач|стомат|спорт|зал|анализ|лекарств/i,
    "Покупки": /одежд|обув|wildberries|озон|ozon|телефон|ноут|подар|куртк/i
};

const DAY_NAMES = ['', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const ALL_DAYS = [1, 2, 3, 4, 5, 6, 7];

const $ = id => document.getElementById(id);
const guess = t => cn.find(c => RU[c] && RU[c].test(t)) || "Другое";
const fm = n => Math.round(n).toLocaleString("ru-RU") + " ₽";
const iso = d => d.toLocaleDateString("sv");
const today = iso(new Date());

// 1 = понедельник ... 7 = воскресенье
const isoWeekday = (d = new Date()) => d.getDay() || 7;

// чтобы комментарий вроде "<b>" не ломал страницу
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

let S = { income: {}, savePercent: 20, topups: [], ex: [], subs: [], habits: [] };

try {
    const saved = localStorage.getItem("fin6");
    if (saved) S = Object.assign(S, JSON.parse(saved));
} catch (e) {}

const save = () => {
    try { localStorage.setItem("fin6", JSON.stringify(S)); } catch (e) {}
};

const toast = text => {
    const el = $("toast");
    el.textContent = text;
    el.style.opacity = 1;
    setTimeout(() => el.style.opacity = 0, 1800);
};

$("month").value = today.slice(0, 7);
$("month").onchange = render;

const catOptions = cn.map(c => `<option>${c}</option>`).join("");
$("expCat").innerHTML = catOptions;
$("catFilter").innerHTML = '<option value="">Все</option>' + catOptions;
$("expDate").value = today;

document.querySelectorAll("#nav button").forEach(btn => {
    btn.onclick = () => {
        document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b === btn));
        ["o", "t", "p", "h"].forEach(id => $(id).hidden = id !== btn.dataset.t);
    };
});

// пополнения
function showTopup() {
    $("topupForm").classList.remove("hidden");
    $("expenseForm").classList.add("hidden");
    $("topupAmount").focus();
}

function hideTopup() {
    $("topupForm").classList.add("hidden");
    $("topupAmount").value = "";
    $("topupNote").value = "";
}

function doTopup() {
    const amount = +$("topupAmount").value;
    if (!amount || amount <= 0) return toast("Введи сумму");
    S.topups.push({ id: Date.now(), amount, date: today, note: $("topupNote").value.trim() });
    save();
    hideTopup();
    toast(`💰 +${fm(amount)}`);
    render();
}

const delTopup = id => { S.topups = S.topups.filter(t => t.id != id); save(); render(); };

// траты
function showExpense() {
    $("expenseForm").classList.remove("hidden");
    $("topupForm").classList.add("hidden");
    $("expAmount").focus();
}

function hideExpense() {
    $("expenseForm").classList.add("hidden");
    $("expAmount").value = "";
    $("expNote").value = "";
    $("expDate").value = today;
}

function doExpense() {
    const amount = +$("expAmount").value;
    if (!amount || amount <= 0) return toast("Введи сумму");
    const cat = $("expCat").value;
    S.ex.push({ id: Date.now(), d: $("expDate").value || today, c: cat, a: amount, n: $("expNote").value.trim() });
    save();
    hideExpense();
    toast(`🧾 ${cat} · ${fm(amount)}`);
    render();
}

// быстрый ввод: «вчера такси 700», категория угадывается по тексту
function quickAdd() {
    let text = $("quick").value.trim();
    if (!text) return;

    let date = today;
    if (/вчера/i.test(text)) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        date = iso(yesterday);
        text = text.replace(/вчера/i, "");
    }

    const nums = text.match(/\d+(?:[.,]\d+)?/g);
    if (!nums) return toast("Не вижу сумму");

    const amount = +nums[nums.length - 1].replace(",", ".");
    const note = text.replace(/\d+(?:[.,]\d+)?\s*(₽|руб\w*|р\b)?/g, "").trim();
    const cat = guess(note);

    S.ex.push({ id: Date.now(), d: date, c: cat, a: amount, n: note });
    save();
    $("quick").value = "";
    toast(`🧾 ${cat} · ${fm(amount)}`);
    render();
}

const del = id => { S.ex = S.ex.filter(e => e.id != id); save(); render(); };

// план
function saveIncome() {
    S.income[$("month").value] = +$("income").value || 0;
    S.savePercent = Math.min(100, Math.max(0, +$("savePercent").value || 0));
    save();
    render();
}

function addSub() {
    const name = $("subName").value.trim();
    const amount = +$("subAmount").value;
    if (!name || !amount) return;
    S.subs.push({ id: Date.now(), n: name, a: amount, d: Math.min(31, +$("subDay").value || 1) });
    $("subName").value = $("subAmount").value = $("subDay").value = "";
    save();
    render();
}

const dsub = id => { S.subs = S.subs.filter(x => x.id != id); save(); render(); };

// привычки
function addHabit() {
    const name = $("habitName").value.trim();
    if (!name) return;
    S.habits.push({ id: Date.now(), n: name, streak: 0, lastDate: "", days: [...ALL_DAYS] });
    $("habitName").value = "";
    save();
    render();
}

function toggleHabitDay(habitId, day) {
    const h = S.habits.find(x => x.id == habitId);
    if (!h) return;
    if (!h.days) h.days = [...ALL_DAYS];

    const i = h.days.indexOf(day);
    if (i > -1) {
        if (h.days.length > 1) h.days.splice(i, 1); // хотя бы один день должен остаться
    } else {
        h.days.push(day);
        h.days.sort((a, b) => a - b);
    }
    save();
    render();
}

// последний запланированный день до сегодняшнего
function getPrevScheduledDate(days) {
    const d = new Date();
    for (let i = 0; i < 7; i++) {
        d.setDate(d.getDate() - 1);
        if (days.includes(isoWeekday(d))) return iso(d);
    }
    return null;
}

// серия сгорает, если пропустил запланированный день
function currentStreak(h) {
    const days = h.days || ALL_DAYS;
    const alive = h.lastDate === today || h.lastDate === getPrevScheduledDate(days);
    return alive ? h.streak : 0;
}

function checkHabit(id) {
    const h = S.habits.find(x => x.id == id);
    if (!h) return;

    const days = h.days || ALL_DAYS;
    if (!days.includes(isoWeekday())) return toast("Не запланировано на сегодня");
    if (h.lastDate === today) return toast("Уже выполнено сегодня");

    h.streak = h.lastDate === getPrevScheduledDate(days) ? h.streak + 1 : 1;
    h.lastDate = today;
    save();
    toast(`🔥 Серия: ${h.streak} дн.`);
    render();
}

const dhabit = id => { S.habits = S.habits.filter(x => x.id != id); save(); render(); };

// расчёты за выбранный месяц
function calc() {
    const m = $("month").value;
    const income = S.income[m] || 0;
    const saved = income * (S.savePercent / 100);
    const fixed = S.subs.reduce((sum, x) => sum + x.a, 0);

    const topupsMonth = S.topups.filter(t => t.date.startsWith(m)).reduce((sum, t) => sum + t.amount, 0);
    const ex = S.ex.filter(e => e.d.startsWith(m));
    const spent = ex.reduce((sum, e) => sum + e.a, 0);

    const by = {};
    cn.forEach(c => by[c] = 0);
    ex.forEach(e => by[e.c] = (by[e.c] || 0) + e.a);

    const balance = income - saved - fixed + topupsMonth - spent;

    // сколько дней осталось (только для текущего месяца)
    const [y, mo] = m.split("-").map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();
    const rem = today.startsWith(m) ? daysInMonth - +today.slice(8) + 1 : 0;

    const safeDay = rem > 0 && balance > 0 ? balance / rem : 0;
    const safeWeek = rem > 0 && balance > 0 ? balance / (rem / 7) : 0;

    return { m, income, saved, fixed, topupsMonth, spent, balance, safeDay, safeWeek, ex, by };
}

function renderCatDashboard(k) {
    const maxVal = Math.max(...Object.values(k.by), 1);
    const html = cn.filter(c => k.by[c] > 0).map(c => `
        <div class="cat-bar">
            <div class="cat-bar-header"><span class="cat-bar-name" style="color:${CATS[c]}">${c}</span><span class="cat-bar-amount">${fm(k.by[c])}</span></div>
            <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${(k.by[c] / maxVal * 100).toFixed(1)}%;background:${CATS[c]}"></div></div>
            <div class="cat-bar-percent">${(k.by[c] / k.spent * 100).toFixed(0)}% от трат</div>
        </div>`).join("");
    $("catDashboard").innerHTML = html || '<div class="mu" style="text-align:center;padding:20px 0">Трат пока нет</div>';
}

function renderTopupDashboard(k) {
    const list = S.topups.filter(t => t.date.startsWith(k.m));
    if (!list.length) {
        $("topupDashboard").innerHTML = '<div class="mu" style="text-align:center;padding:20px 0">Пополнений нет</div>';
        return;
    }
    const rows = list.slice(-5).reverse().map(t => `
        <div class="topup-mini"><span class="topup-mini-date">${t.date.slice(5)}${t.note ? ' · ' + esc(t.note) : ''}</span><span class="topup-mini-amount">+${fm(t.amount)}</span></div>`).join("");
    $("topupDashboard").innerHTML = rows +
        `<div class="topup-total"><span>Всего за месяц</span><span class="ok">+${fm(k.topupsMonth)}</span></div>`;
}

function render() {
    const k = calc();

    $("balance").textContent = fm(k.balance);
    $("balance").className = "balance-value " + (k.balance < 0 ? "bad" : k.balance > 0 ? "ok" : "");

    if (k.income === 0 && k.topupsMonth === 0) {
        $("balanceSub").textContent = "Заполни доход во вкладке «План»";
    } else if (k.balance < 0) {
        $("balanceSub").textContent = `Перерасход ${fm(-k.balance)}`;
    } else {
        $("balanceSub").textContent = `Доход ${fm(k.income)} − копилка ${fm(k.saved)} − постоянные ${fm(k.fixed)} + пополнения ${fm(k.topupsMonth)} − траты ${fm(k.spent)}`;
    }

    $("spent").textContent = fm(k.spent);
    $("safeDay").textContent = fm(k.safeDay);
    $("safeWeek").textContent = fm(k.safeWeek);
    const broke = k.balance <= 0;
    $("safeDay").className = "big " + (broke ? "bad" : "");
    $("safeWeek").className = "big " + (broke ? "bad" : "");

    renderCatDashboard(k);
    renderTopupDashboard(k);

    // вкладка «План»
    $("income").value = k.income || "";
    $("savePercent").value = S.savePercent;
    $("incomeInfo").innerHTML = k.income > 0
        ? `В копилку уходит: <b>${fm(k.saved)}</b><br>Постоянные платежи: <b>${fm(k.fixed)}</b><br>Чистый бюджет на жизнь: <b style="color:var(--ac)">${fm(k.income - k.saved - k.fixed)}</b>`
        : "Введи доход, чтобы увидеть распределение";

    const topupsList = S.topups.filter(t => t.date.startsWith(k.m));
    $("topups").innerHTML = topupsList.map(t =>
        `<div class="li"><span>${t.date.slice(5)}${t.note ? " · " + esc(t.note) : ""}</span><span class="ok">+${fm(t.amount)}<span class="x" onclick="delTopup(${t.id})">✕</span></span></div>`
    ).join("") || '<span class="mu">Пусто</span>';

    $("subs").innerHTML = S.subs.map(x =>
        `<div class="li"><span>${esc(x.n)} · ${x.d}-го</span><span>${fm(x.a)}<span class="x" onclick="dsub(${x.id})">✕</span></span></div>`
    ).join("") || '<span class="mu">Пусто</span>';

    // вкладка «Операции»
    const query = $("search").value.toLowerCase();
    const cat = $("catFilter").value;
    const rows = k.ex.filter(e => (!cat || e.c === cat) && (e.n + e.c).toLowerCase().includes(query));
    $("opsSummary").textContent = `${rows.length} операций · ${fm(rows.reduce((sum, e) => sum + e.a, 0))}`;
    $("list").innerHTML = rows.map(e =>
        `<div class="li"><span>${e.d.slice(5)} · <span style="color:${CATS[e.c]}">${e.c}</span>${e.n ? " · " + esc(e.n) : ""}</span><span>${fm(e.a)}<span class="x" onclick="del(${e.id})">✕</span></span></div>`
    ).join("") || '<span class="mu">Пока пусто</span>';

    // вкладка «Привычки»
    const todayDay = isoWeekday();
    $("habitsList").innerHTML = S.habits.map(h => {
        const days = h.days || ALL_DAYS;
        const done = h.lastDate === today;
        const scheduled = days.includes(todayDay);
        const dayButtons = ALL_DAYS.map(d =>
            `<button class="day-btn ${days.includes(d) ? 'active' : ''}" onclick="toggleHabitDay(${h.id},${d})">${DAY_NAMES[d]}</button>`
        ).join("");
        return `<div class="c habit-card">
            <div class="habit-name">${esc(h.n)}</div>
            <div class="habit-days">${dayButtons}</div>
            <div class="habit-streak">${currentStreak(h)}</div>
            <div class="habit-streak-label">дней подряд</div>
            <button class="habit-btn p" onclick="checkHabit(${h.id})" ${done || !scheduled ? "disabled" : ""}>
                ${done ? "✓ Готово" : scheduled ? "Отметить" : "Не сегодня"}
            </button>
            <span class="x" onclick="dhabit(${h.id})">удалить</span>
        </div>`;
    }).join("") || '<span class="mu">Добавь первую привычку</span>';
}

// пока печатаешь комментарий, категория подставляется сама
$("expNote").oninput = e => {
    if (e.target.value) $("expCat").value = guess(e.target.value);
};

// Enter отправляет форму
[["quick", quickAdd], ["expAmount", doExpense], ["expNote", doExpense],
 ["topupAmount", doTopup], ["topupNote", doTopup], ["habitName", addHabit]
].forEach(([id, fn]) => {
    $(id).addEventListener("keydown", e => { if (e.key === "Enter") fn(); });
});

render();