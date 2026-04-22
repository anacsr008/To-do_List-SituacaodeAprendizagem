let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

document.addEventListener('DOMContentLoaded', () => {
    updateUI();
});

function saveAndRefresh() {
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    updateUI();
}

function updateUI() {
    const isHomePage = !!document.getElementById('task-list');
    const isBudgetPage = !!document.getElementById('budget-details-list');
    if (isHomePage) renderHome();
    if (isBudgetPage) renderBudget();
}

// --- LÓGICA DA PÁGINA INICIAL---
function addTask() {
    const nameInput = document.getElementById('task-name');
    const hoursInput = document.getElementById('task-hours');
    const rateInput = document.getElementById('task-rate'); 

    if (!nameInput.value || !hoursInput.value || !rateInput.value) {
        alert("Preencha o nome, as horas e o valor por hora!");
        return;
    }

    const task = {
    id: Date.now(),
    name: nameInput.value,
    hours: parseFloat(hoursInput.value),
    rate: parseFloat(document.getElementById('task-rate').value), 
    done: false
};

    tasks.push(task);

    nameInput.value = '';
    hoursInput.value = '';
    rateInput.value = '';
    
    saveAndRefresh();
}

function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, done: !t.done } : t);
    saveAndRefresh();
}

function removeTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRefresh();
}

function renderHome() {
    const list = document.getElementById('task-list');
    const empty = document.getElementById('empty-state');
    
    list.innerHTML = '';
    
    if (tasks.length === 0) {
        empty.style.display = 'block';
    } else {
        empty.style.display = 'none';
        tasks.forEach(t => {
            const taskTotalValue = (t.hours * t.rate).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
            
            list.innerHTML += `
                <li class="task-item ${t.done ? 'done' : ''}">
                    <div onclick="toggleTask(${t.id})" style="cursor:pointer; flex: 1; display: flex; align-items: center; gap: 28px;">
                        <input class="inputBox" type="checkbox" ${t.done ? 'checked' : ''}>
                        <span>
                            ${t.name} 
                            <strong>(${t.hours}h - ${taskTotalValue})</strong>
                        </span>
                    </div>
                    <button class="btn-del" onclick="removeTask(${t.id})">✕</button>
                </li>
            `;
        });
    }

    const totalHours = tasks.reduce((acc, t) => acc + t.hours, 0);
    const completedCount = tasks.filter(t => t.done).length;

    document.getElementById('stat-total-tarefas').innerText = tasks.length;
    const totalHoursDisplay = document.getElementById('stat-horas-totais') || document.getElementById('stat-total-horas');
    if(totalHoursDisplay) totalHoursDisplay.innerText = totalHours.toFixed(1) + 'h';
    
    document.getElementById('stat-concluidas').innerText = completedCount;
}

// --- LÓGICA DA PÁGINA DE ORÇAMENTO ---
function renderBudget() {
    const urgencyElement = document.getElementById('urgency-level').value;
    
    const urgencyMultiplier = urgencyElement == "1" ? 1 : (1 + parseFloat(urgencyElement)/100);

    console.log(urgencyMultiplier);

    let totalHours = 0;
    let totalPrice = 0;

    const detailsList = document.getElementById('budget-details-list');
    

    detailsList.innerHTML = tasks.map(t => {
        const taskValueBase = t.hours * t.rate;
        const taskValueWithUrgency = taskValueBase * urgencyMultiplier;
 
        totalHours += t.hours;
        totalPrice += taskValueWithUrgency;

        return `
            <div class="budget-row" style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding: 5px 0;">
                <span>${t.name} (${t.hours}h)</span>
                <strong>R$ ${taskValueWithUrgency.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
            </div>
        `;
    }).join('');

    const formattedPrice = `R$ ${totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

    document.getElementById('orc-total-tasks').innerText = tasks.length;
    document.getElementById('orc-total-hours').innerText = totalHours.toFixed(1) + 'h';
    document.getElementById('orc-total-value').innerText = formattedPrice;

    document.getElementById('final-price').innerText = formattedPrice;
}

function calculateBudget() {
    renderBudget();
}