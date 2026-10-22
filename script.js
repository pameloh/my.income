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

const ICONS = { "Еда": "food", "Дом": "home", "Транспорт": "car", "Развлечения": "play", "Здоровье": "heart", "Покупки": "bag", "Другое": "dots" };

// линейные иконки (24x24), цвет берут у текста
const PATHS = {
    food: '<path d="M3 2v7a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V2M7 2v20M21 15V2a5 5 0 0 0-5 5v6a2 2 0 0 0 2 2h3Zm0 0v7"/>',
    home: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10"/>',
    car: '<path d="M19 17h2a1 1 0 0 0 1-1v-3a2 2 0 0 0-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3A3 3 0 0 0 12 7H5a1.5 1.5 0 0 0-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4a1 1 0 0 0 1 1h2M9 17h6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    play: '<circle cx="12" cy="12" r="10"/><path d="m10 8 6 4-6 4z"/>',
    heart: '<path d="M19 14c1.5-1.5 3-3.2 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.8 0-3 .5-4.5 2-1.5-1.5-2.7-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7z"/>',
    bag: '<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0"/>',
    dots: '<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    grid: '<path d="M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
    target: '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    flame: '<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2.1-.2-4 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.2.4-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>'
};
const icon = (name, size = 20) =>
    `<svg class="i" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${PATHS[name]}</svg>`;
const badge = c => `<span class="ico" style="background:${CATS[c]}26;color:${CATS[c]}">${icon(ICONS[c] || "dots", 18)}</span>`;

document.querySelectorAll("[data-ic]").forEach(el => el.innerHTML = icon(el.dataset.ic, 22));

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

let S = { income: {}, incomeMode: {}, weekIncome: {}, payMode: "month", savePercent: 20, pct: {}, piggy: [], topups: [], ex: [], subs: [], habits: [] };

try {
    const saved = localStorage.getItem("fin6");
    if (saved) S = Object.assign(S, JSON.parse(saved));
} catch (e) {}

delete S.weekRates;   // поле из прошлой версии, больше не нужно

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
const hour = new Date().getHours();
const hello = hour < 5 ? "Доброй ночи" : hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";
$("dateLine").textContent = hello + " · " + new Date().toLocaleDateString("ru-RU", { weekday: "long", day: "numeric", month: "long" });

function shiftMonth(delta) {
    const [y, m] = $("month").value.split("-").map(Number);
    $("month").value = iso(new Date(y, m - 1 + delta, 1)).slice(0, 7);
    render();
}

const catOptions = cn.map(c => `<option value="${c}">${c}</option>`).join("");
$("expCat").innerHTML = catOptions;
$("catFilter").innerHTML = '<option value="">Все</option>' + catOptions;
$("expDate").value = today;

// плитки категорий как в CoinKeeper: тап вместо выпадающего списка
$("expChips").innerHTML = cn.map(c => `<button type="button" data-c="${c}" onclick="setCat('${c}')">${icon(ICONS[c], 16)} ${c}</button>`).join("");
function setCat(c) {
    $("expCat").value = c;
    document.querySelectorAll("#expChips button").forEach(b => b.classList.toggle("on", b.dataset.c === c));
}
setCat(cn[0]);

function openTab(tab) {
    document.querySelectorAll("#nav button").forEach(b => b.classList.toggle("on", b.dataset.t === tab));
    ["o", "t", "p", "h"].forEach(id => $(id).hidden = id !== tab);
}

document.querySelectorAll("#nav button").forEach(btn => {
    btn.onclick = () => openTab(btn.dataset.t);
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
    toast(`Пополнение +${fm(amount)}`);
    render();
}

const delTopup = id => { S.topups = S.topups.filter(t => t.id != id); save(); render(); };

// траты
function showExpense() {
    openTab("o");
    $("expenseForm").classList.remove("hidden");
    $("expenseForm").scrollIntoView({ behavior: "smooth", block: "center" });
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
    toast(`${cat} · ${fm(amount)}`);
    render();
}

// сводка месяца: куда ушли деньги, где вышел за бюджет
function openSummary() {
    const m = $("month").value;
    const st = monthStats(m);
    const [y, mo] = m.split("-").map(Number);
    const dim = new Date(y, mo, 0).getDate();
    const shortDate = day => new Date(y, mo - 1, day).toLocaleDateString("ru-RU", { day: "numeric", month: "short" });

    $("summaryTitle").textContent = new Date(y, mo - 1, 1).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });

    if (!st.income && !st.topups && !st.ex.length) {
        $("summaryBody").innerHTML = emptyText("За этот месяц данных пока нет");
        $("summary").showModal();
        return;
    }

    // расходы по категориям
    const by = {};
    st.ex.forEach(e => by[e.c] = (by[e.c] || 0) + e.a);
    const cats = Object.entries(by).sort((a, b) => b[1] - a[1]);
    const catRows = cats.map(([c, v]) => `
        <div class="cat-bar">
            <div class="cat-bar-header"><span class="cat-bar-name" style="color:${CATS[c]}">${c}</span><span class="cat-bar-amount">${fm(v)} · ${Math.round(v / st.spent * 100)}%</span></div>
            <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${(v / cats[0][1] * 100).toFixed(1)}%;background:${CATS[c]}"></div></div>
        </div>`).join("");

    // бюджет на траты и дневной лимит (равная доля на каждый день)
    const budget = st.income - st.saved - st.fixed + st.topups;
    const dayLimit = budget / dim;
    const byDay = Array(dim).fill(0);
    st.ex.forEach(e => byDay[+e.d.slice(8) - 1] += e.a);
    const over = byDay.map((v, i) => ({ day: i + 1, v, over: v - dayLimit }))
        .filter(d => d.over > 0).sort((a, b) => b.over - a.over);

    let overHtml;
    if (budget <= 0) {
        overHtml = '<div class="mu">Укажи доход на вкладке «План», и я посчитаю бюджет</div>';
    } else {
        overHtml = `
            <div class="mu" style="margin-bottom:8px">Бюджет на траты = доход − копилка − постоянные платежи + пополнения</div>
            <div class="li"><span>Бюджет на месяц</span><span>${fm(budget)}</span></div>
            <div class="li"><span>Потрачено</span><span class="${st.spent > budget ? "bad" : ""}">${fm(st.spent)} · ${Math.round(st.spent / budget * 100)}%</span></div>
            <div class="li"><span>Можно тратить в день</span><span>${fm(dayLimit)}</span></div>
            <div class="mu" style="margin:14px 0 6px">${over.length
                ? "Дни, когда потратил больше дневного лимита:"
                : "Дневной лимит не превышен ни в один день."}</div>` +
            over.slice(0, 5).map(d => `<div class="li"><span>${shortDate(d.day)}</span><span>${fm(d.v)} · <span class="bad">на ${fm(d.over)} больше</span></span></div>`).join("");
    }

    const cell = (label, value) => `<div class="sum-cell"><div class="big">${value}</div><div class="mu">${label}</div></div>`;

    $("summaryBody").innerHTML = `
        <div class="sum-verdict">${st.balance < 0
            ? `<span class="bad">Перерасход ${fm(-st.balance)}</span>`
            : `<span class="ok">В рамках бюджета, остаток ${fm(st.balance)}</span>`}</div>
        <div class="sum-grid">
            ${cell("Доход", fm(st.income))}${cell("Потрачено", fm(st.spent))}
            ${cell("Отложено", fm(st.saved))}${cell("Постоянные платежи", fm(st.fixed))}
        </div>
        <h2>На что потрачено</h2>${catRows || emptyText("Трат нет")}
        <h2>Где вышел за бюджет</h2>${overHtml}`;
    $("summary").showModal();
}

const del = id => { S.ex = S.ex.filter(e => e.id != id); save(); render(); };

// план
function saveIncome() {
    const m = $("month").value;
    if (incomeModeFor(m) === "month") {      // в недельном режиме доход вписывается по неделям
        S.income[m] = +$("income").value || 0;
        S.incomeMode[m] = "month";
    }
    save();
    render();
}

// процент в копилку: 0 или пустое поле = ничего не откладывать
function savePercentValue() {
    const pct = Math.min(100, Math.max(0, +$("savePercent").value || 0));
    S.savePercent = pct;                  // для новых месяцев
    S.pct[$("month").value] = pct;        // старые месяцы не пересчитываются
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
    toast(`Серия: ${h.streak} дн.`);
    render();
}

const dhabit = id => { S.habits = S.habits.filter(x => x.id != id); save(); render(); };

// переключатель «Сегодня / Неделя» для дашбордов
let period = "day";
document.querySelectorAll(".seg button").forEach(btn => {
    btn.onclick = () => {
        period = btn.dataset.p;
        document.querySelectorAll(".seg button").forEach(b => b.classList.toggle("on", b === btn));
        render();
    };
});

// ---- доход: раз в месяц или по неделям ----
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

// недели (пн-вс), которые касаются месяца, и сколько дней каждой попадает в месяц
function weeksOf(m) {
    const [y, mo] = m.split("-").map(Number);
    const first = new Date(y, mo - 1, 1);
    const last = new Date(y, mo, 0);
    const weeks = [];
    for (let mon = addDays(first, 1 - isoWeekday(first)); mon <= last; mon = addDays(mon, 7)) {
        const sun = addDays(mon, 6);
        const from = mon < first ? first : mon;
        const to = sun > last ? last : sun;
        weeks.push({ key: iso(mon), mon, sun, days: Math.round((to - from) / 86400000) + 1 });
    }
    return weeks;
}

// доход недели: ровно то, что вписано на эту неделю (на следующую не переносится)
const weekAmount = key => S.weekIncome[key] || 0;
const currentWeekKey = () => iso(addDays(new Date(), 1 - isoWeekday()));

// режим месяца: если там уже стоит месячный доход, он остаётся месячным
const incomeModeFor = m => S.incomeMode[m] ?? (S.income[m] !== undefined ? "month" : S.payMode);

// доход месяца; недели на стыке месяцев делятся по дням
const incomeFor = m => incomeModeFor(m) === "week"
    ? Math.round(weeksOf(m).reduce((sum, w) => sum + weekAmount(w.key) * w.days / 7, 0))
    : (S.income[m] || 0);

function saveWeekIncome() {
    if ($("weekIncome").value === "") return toast("Введи сумму");
    S.weekIncome[currentWeekKey()] = Math.max(0, +$("weekIncome").value || 0);
    S.incomeMode[$("month").value] = S.payMode = "week";
    save();
    toast("Доход на неделю сохранён");
    render();
}

function renderWeekPanel(m) {
    const short = d => d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
    const mon = addDays(new Date(), 1 - isoWeekday());
    $("weekLabel").textContent = `Текущая неделя: ${short(mon)} – ${short(addDays(mon, 6))}`;
    if ($("weekIncome") !== document.activeElement) $("weekIncome").value = S.weekIncome[currentWeekKey()] ?? "";

    // уже записанные недели выбранного месяца (только просмотр)
    const past = weeksOf(m).filter(w => w.key !== currentWeekKey() && S.weekIncome[w.key] !== undefined);
    $("weekList").innerHTML = past.length
        ? '<div class="mu" style="margin-bottom:4px">Прошлые недели</div>' + past.map(w =>
            `<div class="li"><span>${short(w.mon)} – ${short(w.sun)}</span><span>${fm(S.weekIncome[w.key])}</span></div>`).join("")
        : "";
}

// процент накоплений у каждого месяца свой
const pctFor = m => S.pct[m] ?? S.savePercent;

function monthStats(m) {
    const income = incomeFor(m);
    const saved = income * pctFor(m) / 100;
    const fixed = S.subs.reduce((sum, x) => sum + x.a, 0);
    const topups = S.topups.filter(t => t.date.startsWith(m)).reduce((sum, t) => sum + t.amount, 0);
    const ex = S.ex.filter(e => e.d.startsWith(m));
    const spent = ex.reduce((sum, e) => sum + e.a, 0);
    return { income, saved, fixed, topups, ex, spent, balance: income - saved - fixed + topups - spent };
}

function calc() {
    const m = $("month").value;
    const st = monthStats(m);

    const by = {};
    cn.forEach(c => by[c] = 0);
    st.ex.forEach(e => by[e.c] = (by[e.c] || 0) + e.a);

    const [y, mo] = m.split("-").map(Number);
    const daysInMonth = new Date(y, mo, 0).getDate();
    const rem = today.startsWith(m) ? daysInMonth - +today.slice(8) + 1 : 0;

    // лимит на день считаем «с утра»: всё, что потрачено не сегодня, делим на оставшиеся дни.
    // Трата сегодня не меняет лимит, а только уменьшает остаток на сегодня
    const spentToday = st.ex.filter(e => e.d === today).reduce((sum, e) => sum + e.a, 0);
    // пополнение «сегодня» гасит траты «сегодня»: чистые траты = траты − пополнения за день
    const topupsToday = S.topups.filter(t => t.date === today && t.date.startsWith(m)).reduce((sum, t) => sum + t.amount, 0);
    const netToday = spentToday - topupsToday;
    // недельный режим: лимиты считаем от дохода текущей недели, а не от месяца
    let wk = null;
    let pool = st.balance;
    let rateDays = rem;
    let weekDays = Math.min(rem, 8 - isoWeekday());   // дней до воскресенья, включая сегодня
    if (rem > 0 && incomeModeFor(m) === "week") {
        const mon = currentWeekKey();
        const sun = iso(addDays(new Date(), 7 - isoWeekday()));
        const inWeek = d => d >= mon && d <= sun;
        const income = weekAmount(mon);
        const saved = income * pctFor(m) / 100;
        const fixed = st.fixed * 7 / daysInMonth;      // доля постоянных платежей на неделю
        const spent = S.ex.filter(e => inWeek(e.d)).reduce((sum, e) => sum + e.a, 0);
        const topups = S.topups.filter(t => inWeek(t.date)).reduce((sum, t) => sum + t.amount, 0);
        wk = { income, saved, fixed, spent, topups, balance: income - saved - fixed + topups - spent };
        pool = wk.balance;
        rateDays = weekDays = 8 - isoWeekday();
    }
    const rate = rem > 0 ? Math.max(0, pool + netToday) / rateDays : 0;

    return {
        m, ...st, by, rem, rate, spentToday, netToday, weekDays, wk,
        topupsMonth: st.topups,
        hasIncome: wk ? wk.income > 0 || wk.topups > 0 : st.income > 0 || st.topups > 0,
        todayLeft: rate - netToday,
        weekLimit: rate * weekDays,
        weekLeft: rate * weekDays - netToday
    };
}

// копилка = процент с дохода + нетронутые остатки прошлых месяцев + то, что положил вручную
function piggyBank() {
    const nowMonth = today.slice(0, 7);
    const keys = [
        ...Object.keys(S.income), ...Object.keys(S.incomeMode),
        ...Object.keys(S.weekIncome).map(k => k.slice(0, 7)),
        ...S.ex.map(e => e.d.slice(0, 7)), ...S.topups.map(t => t.date.slice(0, 7))
    ].filter(k => k <= nowMonth).sort();
    const months = [];
    if (keys.length) {                       // месяцы без записей тоже считаем: в недельном режиме доход идёт сам
        let [y, mo] = keys[0].split("-").map(Number);
        for (let m = keys[0]; m <= nowMonth; m = `${y}-${String(mo).padStart(2, "0")}`) {
            months.push(m);
            if (++mo > 12) { mo = 1; y++; }
        }
    }
    let percentSum = 0, leftoverSum = 0;
    const rows = months.map(m => {
        const st = monthStats(m);
        const leftover = m < nowMonth ? Math.max(0, st.balance) : 0; // текущий месяц ещё не закончился
        percentSum += st.saved;
        leftoverSum += leftover;
        return { m, saved: st.saved, leftover };
    });
    const manualSum = S.piggy.reduce((sum, p) => sum + p.amount, 0);
    return { percentSum, leftoverSum, manualSum, total: percentSum + leftoverSum + manualSum, rows };
}

function addPiggy() {
    const amount = +$("piggyAmount").value;
    if (!amount || amount <= 0) return toast("Введи сумму");
    S.piggy.push({ id: Date.now(), amount, date: today });
    $("piggyAmount").value = "";
    save();
    toast(`В копилку +${fm(amount)}`);
    render();
}

const delPiggy = id => { S.piggy = S.piggy.filter(p => p.id != id); save(); render(); };

function renderPiggy() {
    const p = piggyBank();
    $("piggyMini").textContent = fm(p.total);
    $("piggyTotal").textContent = fm(p.total);
    $("piggyInfo").innerHTML =
        `Процент с дохода: <b>${fm(p.percentSum)}</b><br>` +
        `Остатки прошлых месяцев: <b>${fm(p.leftoverSum)}</b><br>` +
        `Добавлено вручную: <b>${fm(p.manualSum)}</b>`;

    const monthName = m => {
        const [y, mo] = m.split("-").map(Number);
        return new Date(y, mo - 1, 1).toLocaleDateString("ru-RU", { month: "long", year: "numeric" });
    };
    const monthRows = p.rows.filter(r => r.saved || r.leftover).reverse().map(r =>
        `<div class="li"><span>${monthName(r.m)}<span class="mu"> · процент ${fm(r.saved)}${r.leftover ? " + остаток " + fm(r.leftover) : ""}</span></span><span class="ok">+${fm(r.saved + r.leftover)}</span></div>`);
    const manualRows = S.piggy.slice().reverse().map(x =>
        `<div class="li"><span>${x.date.slice(5)}<span class="mu"> · вручную</span></span><span class="ok">+${fm(x.amount)}<span class="x" onclick="delPiggy(${x.id})">✕</span></span></div>`);
    $("piggyRows").innerHTML = [...manualRows, ...monthRows].join("");
}

// попадает ли дата в выбранный период (сегодня или текущая неделя пн-вс)
function inPeriod(dateStr) {
    if (period === "day") return dateStr === today;
    const mon = new Date();
    mon.setDate(mon.getDate() - (isoWeekday() - 1));
    const sun = new Date(mon);
    sun.setDate(mon.getDate() + 6);
    return dateStr >= iso(mon) && dateStr <= iso(sun);
}

const periodName = () => period === "day" ? "сегодня" : "за неделю";
const emptyText = text => `<div class="empty">${text}</div>`;

function renderCatDashboard() {
    const list = S.ex.filter(e => inPeriod(e.d)).sort((a, b) => b.d.localeCompare(a.d) || b.id - a.id);
    if (!list.length) {
        $("catDashboard").innerHTML = emptyText("Трат пока нет");
        return;
    }
    const by = {};
    list.forEach(e => by[e.c] = (by[e.c] || 0) + e.a);
    const total = list.reduce((sum, e) => sum + e.a, 0);
    const maxVal = Math.max(...Object.values(by));

    const bars = cn.filter(c => by[c]).map(c => `
        <div class="cat-bar">
            <div class="cat-bar-header"><span class="cat-bar-name" style="color:${CATS[c]}">${c}</span><span class="cat-bar-amount">${fm(by[c])}</span></div>
            <div class="cat-bar-track"><div class="cat-bar-fill" style="width:${(by[c] / maxVal * 100).toFixed(1)}%;background:${CATS[c]}"></div></div>
        </div>`).join("");

    const items = list.map(e => `
        <div class="topup-mini"><span class="who">${badge(e.c)}<span>${e.n ? esc(e.n) : e.c}<small class="mu">${period === "week" ? e.d.slice(5) + " · " : ""}${e.c}</small></span></span><span>${fm(e.a)}</span></div>`).join("");

    $("catDashboard").innerHTML =
        `<div class="topup-total" style="margin:0 0 12px;padding:0;border:0"><span>Потрачено ${periodName()}</span><span>${fm(total)}</span></div>` +
        bars + `<div class="items">${items}</div>`;
}

function renderTopupDashboard() {
    const list = S.topups.filter(t => inPeriod(t.date)).sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id);
    if (!list.length) {
        $("topupDashboard").innerHTML = emptyText("Пополнений нет");
        return;
    }
    const total = list.reduce((sum, t) => sum + t.amount, 0);
    const rows = list.map(t => `
        <div class="topup-mini"><span class="who"><span class="ico" style="background:rgba(90,184,154,0.15);color:var(--ok)">${icon("plus", 18)}</span><span>${t.note ? esc(t.note) : "Пополнение"}<small class="mu">${t.date.slice(5)}</small></span></span><span class="topup-mini-amount">+${fm(t.amount)}</span></div>`).join("");
    $("topupDashboard").innerHTML =
        `<div class="topup-total" style="margin:0 0 8px;padding:0;border:0"><span>Всего ${periodName()}</span><span class="ok">+${fm(total)}</span></div>` +
        `<div class="items">${rows}</div>`;
}

// большая карточка: лимит и остаток на сегодня и на неделю
function renderHero(k) {
    const hasBudget = k.rem > 0 && k.hasIncome;

    const show = (id, left, limit, spentPart) => {
        $(id + "Left").textContent = hasBudget ? fm(left) : "—";
        $(id + "Left").className = "hero-value " + (hasBudget ? (left < 0 ? "bad" : "ok") : "");
        // полоска меняет цвет: синяя -> жёлтая (больше 75%) -> красная (лимит съеден)
        const ratio = !hasBudget ? 0 : left < 0 ? 1 : limit > 0 ? spentPart / limit : 0;
        $(id + "Bar").style.width = Math.max(0, Math.min(100, ratio * 100)) + "%";
        $(id + "Bar").style.background = ratio >= 1 ? "var(--bad)" : ratio > 0.75 ? "var(--gold)" : "var(--ac)";
    };
    show("today", k.todayLeft, k.rate, k.netToday);
    show("week", k.weekLeft, k.weekLimit, k.netToday);

    if (!hasBudget) {
        const hint = k.rem ? "Заполни доход во вкладке «План»" : "Выбери текущий месяц";
        $("todaySub").textContent = hint;
        $("weekSub").textContent = "";
        return;
    }
    $("todaySub").textContent = k.todayLeft < 0
        ? `Перерасход на сегодня: ${fm(-k.todayLeft)}`
        : `Лимит на день ${fm(k.rate)} · потрачено ${fm(Math.max(0, k.netToday))}`;
    $("weekSub").textContent = k.weekLeft < 0
        ? `Перерасход на неделю: ${fm(-k.weekLeft)}`
        : `${k.weekDays} дн. до воскресенья · лимит ${fm(k.weekLimit)}`;
}

function render() {
    const k = calc();

    renderHero(k);

    const freeNow = k.wk ? k.wk.balance : k.balance;
    $("balance").textContent = fm(freeNow);
    $("balance").className = "big " + (freeNow < 0 ? "bad" : "");
    $("spent").textContent = fm(k.wk ? k.wk.spent : k.spent);
    $("balanceLabel").textContent = k.wk ? "Свободно на неделю" : "Свободно на месяц";
    $("spentLabel").textContent = k.wk ? "Потрачено за неделю" : "Потрачено за месяц";

    renderCatDashboard();
    renderTopupDashboard();
    renderPiggy();

    // вкладка «План»
    const mode = incomeModeFor(k.m);
    document.querySelectorAll(".modes button").forEach(b => b.classList.toggle("on", b.dataset.mode === mode));
    $("incMonth").hidden = mode === "week";
    $("incWeek").hidden = mode !== "week";
    $("income").value = mode === "month" ? (S.income[k.m] || "") : "";
    if (mode === "week") renderWeekPanel(k.m);
    $("savePercent").value = pctFor(k.m);
    $("incomeInfo").innerHTML = k.wk
        ? `Доход на неделю: <b>${fm(k.wk.income)}</b><br>В копилку уходит: <b>${fm(k.wk.saved)}</b><br>Постоянные платежи (доля недели): <b>${fm(k.wk.fixed)}</b><br>Чистый бюджет на неделю: <b style="color:var(--ac)">${fm(k.wk.income - k.wk.saved - k.wk.fixed)}</b>`
        : k.income > 0
            ? `${mode === "week" ? `Доход за месяц по неделям: <b>${fm(k.income)}</b><br>` : ""}В копилку уходит: <b>${fm(k.saved)}</b><br>Постоянные платежи: <b>${fm(k.fixed)}</b><br>Чистый бюджет на жизнь: <b style="color:var(--ac)">${fm(k.income - k.saved - k.fixed)}</b>`
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
        `<div class="li"><span class="who">${badge(e.c)}<span>${e.n ? esc(e.n) : e.c}<small class="mu">${e.d.slice(5)} · ${e.c}</small></span></span><span>${fm(e.a)}<span class="x" onclick="del(${e.id})">✕</span></span></div>`
    ).join("") || emptyText("Операций пока нет");

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
            <div class="habit-streak">${icon("flame", 26)}<span>${currentStreak(h)}</span></div>
            <div class="habit-streak-label">дней подряд</div>
            <button class="habit-btn p" onclick="checkHabit(${h.id})" ${done || !scheduled ? "disabled" : ""}>
                ${done ? "✓ Готово" : scheduled ? "Отметить" : "Не сегодня"}
            </button>
            <span class="x" onclick="dhabit(${h.id})">удалить</span>
        </div>`;
    }).join("") || emptyText("Добавь первую привычку");
}

// переключатель «Раз в месяц / Каждую неделю»
document.querySelectorAll(".modes button").forEach(btn => {
    btn.onclick = () => {
        S.incomeMode[$("month").value] = S.payMode = btn.dataset.mode;
        save();
        render();
    };
});

// пока печатаешь комментарий, категория подставляется сама
$("expNote").oninput = e => {
    if (e.target.value) setCat(guess(e.target.value));
};

// Enter отправляет форму
[["expAmount", doExpense], ["expNote", doExpense],
 ["topupAmount", doTopup], ["weekIncome", saveWeekIncome], ["piggyAmount", addPiggy], ["topupNote", doTopup], ["habitName", addHabit]
].forEach(([id, fn]) => {
    $(id).addEventListener("keydown", e => { if (e.key === "Enter") fn(); });
});

render();

// чтобы сайт ставился как приложение и работал без интернета
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
}
