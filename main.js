function goToCalendar() {
  window.location.href = 'Calendar.html';
}
function goToCharacters() {
  window.location.href = 'Character.html';
}
function goToGacha() {
  window.location.href = 'gacha.html';
}
function goToStore() {
  window.location.href = 'Store.html';
}

function logout() {
  localStorage.removeItem('currentUserID');
  window.location.href = 'landingpage.html';
}
function closeProfileModal() {
  document.getElementById('profileModal').style.display = 'none';
}
function hideModal() {
  document.getElementById("form").style.display = "none";
}
let fetchUserData = async () => {
  try {
    let userID = localStorage.getItem('currentUserID');
    // Fetch user data from the database
    const response = await fetch(`/getUserData/${userID}`); // Assuming you have an endpoint to retrieve user data
    if (!response.ok) {
      throw new Error('Failed to fetch user data');
    }
    const userData = await response.json();

    // Populate profile information in the modal
    document.getElementById("profileName").innerText = userData.userName;
    document.getElementById("profileEmail").innerText = userData.email;
    document.getElementById("profileDateCreated").innerText = userData.dateCreated;
    document.getElementById("profileTasksCompleted").innerText = userData.TotalTasksCompleted;
    document.getElementById("coins").innerText = userData.credits;

    // Display the modal
    document.getElementById("profileModal").style.display = "block";
  } catch (err) {
    console.error("Error fetching user data:", err);
  }
};

function openProfileModal() {
  // Display the modal
  document.getElementById('profileModal').style.display = 'block';
  fetchUserData();
}

// Task form handling
let form = document.getElementById("form");
form.addEventListener('submit', (e) => {
  e.preventDefault();
  formValidation();
});

let formValidation = () => {
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");
  let msg = document.getElementById("msg");
  let difficulty = document.getElementById("difficulty");

  // Convert the input and today's date to Date objects for comparison
  let inputDate = new Date(dateInput.value);
  let today = new Date();
  // Reset the time part to ensure only the date is compared
  today.setHours(0,0,0,0);

  if (textInput.value === "") {
    msg.innerHTML = "Task cannot be blank!";
  } else if (dateInput.value === "" || inputDate < today) { // Added check for date being before today
    msg.innerHTML = "Due Date cannot be blank or in the past!";
  } else if (difficulty.value === "Choose a Difficulty") {
    msg.innerHTML = "You must choose a difficulty!";
  } else {
    msg.innerHTML = "";
    if (currentTaskID) {
      updateTask(currentTaskID);
    } else {
      createNewTask();
    }
  }
};

let createNewTask = () => {
  let userID = localStorage.getItem('currentUserID');
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");
  let difficulty = document.getElementById("difficulty");

  const taskData = {
    userID,
    taskName: textInput.value,
    taskDesc: textArea.value,
    taskDateDue: dateInput.value,
    taskCreditsReward: difficulty.value,
  };

  fetch('http://localhost:3000/createTask', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to create task');
    }
    return response.json();
  })
  .then(data => {
    alert('Task created successfully');
    displayTasks();
    resetForm();
  })
  .catch(error => {
    console.error('Error:', error);
    alert('An error occurred while creating the task');
  });
};


let updateTask = (taskID) => {
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");

  const taskData = {
    taskName: textInput.value,
    taskDesc: textArea.value,
    taskDateDue: dateInput.value
  };

  fetch(`http://localhost:3000/updateTask/${taskID}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(taskData),
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      return response.text();
    })
    .then(data => {
      alert(data); // Display success message
      displayTasks(); // Refresh task list
      resetForm(); // Clear form fields
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while updating the task');
    });
};

// Delete task
let deleteTask = (taskID) => {
  fetch(`http://localhost:3000/deleteTask/${taskID}`, {
    method: 'PATCH',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      return response.text();
    })
    .then(data => {
      alert(data); // Display success message
      displayTasks(); // Refresh task list
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while deleting the task');
    });
};

let currentTaskID = null;
function showModal() {
  // Check if the elements exist before accessing their properties
  const profileNameElement = document.getElementById("profileName");
  const profileEmailElement = document.getElementById("profileEmail");
  const profileDateCreatedElement = document.getElementById("profileDateCreated");
  const profileTasksCompletedElement = document.getElementById("profileTasksCompleted");
  const coinsElement = document.getElementById("coins");

  // Check if elements are found before accessing properties
  if (profileNameElement && profileEmailElement && profileDateCreatedElement && profileTasksCompletedElement && coinsElement) {
    // Set innerText properties
    profileNameElement.innerText = "Some Name";
    profileEmailElement.innerText = "email@example.com";
    profileDateCreatedElement.innerText = "Some Date";
    profileTasksCompletedElement.innerText = "Some Tasks Completed";
    coinsElement.innerText = "Some Coins";
    // Other actions in showModal()
  } else {
    console.error("Elements not found");
  }
}
function editTask(taskID) {
  fetch(`http://localhost:3000/getTask/${taskID}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch task data');
      }
      return response.json();
    })
    .then(taskData => {
      const dateDue = new Date(taskData.taskDateDue).toISOString().split('T')[0];
      // Populate form fields with task data for editing
      document.getElementById("textInput").value = taskData.taskName;
      document.getElementById("dateInput").value = dateDue;
      document.getElementById("textArea").value = taskData.taskDesc;
      showModal();
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred while fetching task data');
    });
}



let resetForm = () => {
  document.getElementById("textInput").value = "";
  document.getElementById("dateInput").value = "";
  document.getElementById("textArea").value = "";
  form.removeAttribute("data-task-id");
};

document.addEventListener("DOMContentLoaded", function () {
  const editButtons = document.querySelectorAll(".edit-btn");

  // Attach click event listener to each edit button
  editButtons.forEach(button => {
    button.addEventListener("click", function () {
      // Extract task ID from the button's dataset
      const taskID = button.dataset.taskId;
      // Call editTask function with the task ID
      editTask(taskID);
    });
  });

  displayTasks();
});

function displayTasks() {
  let userID = localStorage.getItem('currentUserID');
  let tasksContainer = document.getElementById("tasks");
  tasksContainer.innerHTML = ''; // Clear existing tasks

  fetch(`http://localhost:3000/getTasks?userID=${userID}`)
    .then(response => response.json())
    .then(tasks => {
      tasks.forEach(task => {
        // Skip tasks marked as deleted
        if (task.isTaskDeleted) return;

        const taskElement = document.createElement("div");
        taskElement.id = `task-${task._id}`;



        const taskNameHeader = document.createElement("h3");
        taskNameHeader.textContent = task.taskName;
        taskElement.appendChild(taskNameHeader);

        const taskDescParagraph = document.createElement("p");
        taskDescParagraph.textContent = task.taskDesc;
        taskElement.appendChild(taskDescParagraph);

        const taskDueSpan = document.createElement("span");
        taskDueSpan.textContent = `Due: ${new Date(task.taskDateDue).toLocaleDateString()}`;
        taskElement.appendChild(taskDueSpan);

        const editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.setAttribute("type", "button");
        editButton.setAttribute("data-bs-toggle", "modal");
        editButton.setAttribute("data-bs-target", "#form");
        editButton.setAttribute("data-task-id", task._id);
        editButton.classList.add("edit-btn");
        editButton.addEventListener("click", () => editTask(task._id));
        taskElement.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => deleteTask(task._id));
        taskElement.appendChild(deleteButton);

        tasksContainer.appendChild(taskElement);
      });
    })
    .catch(error => {
      console.error('Error fetching tasks:', error);
    });
}
