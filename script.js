let nav = 0;
let userID = localStorage.getItem('currentUserID'); // Change from objectId to userID
const backDrop = document.getElementById('modalBackDrop');
const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function formatDateToISO(day, month, year) {
    const formattedMonth = month < 10 ? '0' + month : month.toString();
    const formattedDay = day < 10 ? '0' + day : day.toString();
    return `${year}-${formattedMonth}-${formattedDay}`;
}

let tasksByDate = {}; // Object to hold tasks organized by their due dates

function fetchTasks() {
    return fetch(`http://localhost:3000/getTasks?userID=${userID}`)
        .then(response => response.json())
        .then(tasks => {
            tasksByDate = {}; // Reset tasksByDate
            tasks.forEach(task => {
                const dueDate = new Date(task.taskDateDue).toISOString().split('T')[0]; // Use ISO string to avoid locale issues
                if (!tasksByDate[dueDate]) {
                    tasksByDate[dueDate] = [];
                }
                tasksByDate[dueDate].push(task);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

function load() {
    const dt = new Date();

    if (nav !== 0) {
        dt.setMonth(new Date().getMonth() + nav);
    }

    const year = dt.getFullYear();
    const month = dt.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dateString = firstDayOfMonth.toLocaleDateString('en-us', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });
    const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);

    document.getElementById('monthDisplay').innerText = `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    fetch(`http://localhost:3000/getTasks?userID=${userID}`)
    .then(response => response.json())
    .then(tasks => {
        for (let i = 1; i <= paddingDays + daysInMonth; i++) {
            const daySquare = document.createElement('div');
            daySquare.classList.add('day');

            if (i > paddingDays) {
                const day = i - paddingDays;
                const isoDayString = formatDateToISO(day, month + 1, year);
                daySquare.innerText = day;

                // Filter tasks for this date and append them with class 'event'
                const tasksForDay = tasks.filter(task => new Date(task.taskDateDue).toISOString().split('T')[0] === isoDayString);
                tasksForDay.forEach(task => {
                    const taskElement = document.createElement('div');
                    taskElement.classList.add('event'); // Apply 'event' class for styling
                    taskElement.textContent = task.taskName; // Simplify for demonstration
                    daySquare.appendChild(taskElement);
                });
                
            } else {
                daySquare.classList.add('padding');
            }

            calendar.appendChild(daySquare);
        }
    })
    .catch(error => console.error('Error fetching tasks:', error));
}

function initButtons() {
    document.getElementById('nextButton').addEventListener('click', () => {
        nav++;
        load();
    });

    document.getElementById('backButton').addEventListener('click', () => {
        nav--;
        load();
    });

    document.getElementById('returnButton').addEventListener('click', () => {
        window.location.href = "../main.html";
    });
}

initButtons();
load();
