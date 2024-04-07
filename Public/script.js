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

async function readData() {
    try {
        let rollDataR = await fetch('http://localhost:3000/tasks/getUser/' + userID); // Change from objectId to userID
        let rollData = await rollDataR.json();
        return rollData;
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return null;
    }
}

async function load() {
    const dt = new Date();
    const eventForDay = await readData();

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

    document.getElementById('monthDisplay').innerText =
        `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;

    calendar.innerHTML = '';

    for (let i = 1; i <= paddingDays + daysInMonth; i++) {
        const daySquare = document.createElement('div');
        daySquare.classList.add('day');

        if (i > paddingDays) {
            const day = i - paddingDays;
            const isoDayString = formatDateToISO(day, month + 1, year);

            daySquare.innerText = day;

            if (eventForDay) {
                for (const event of eventForDay) {
                    const eventDate = new Date(event.taskDateDue); // Assuming taskDateDue is the correct field for due date
                    const eventDay = eventDate.getDate();
                    const eventMonth = eventDate.getMonth();
                    const eventYear = eventDate.getFullYear();

                    if (eventDay === day && eventMonth === month && eventYear === year) {
                        const eventDiv = document.createElement('div');
                        eventDiv.classList.add('event');
                        eventDiv.innerText = event.taskName;
                        daySquare.appendChild(eventDiv);
                    }
                }
            }
        } else {
            daySquare.classList.add('padding');
        }

        calendar.appendChild(daySquare);
    }
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
