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
  e.preventDefault(); // Always prevent default form submission
  let isFormValid = formValidation();

  if (isFormValid) {
    if (currentTaskID) {
      updateTask(currentTaskID);
    } else {
      createNewTask();
    }
    // Assuming Bootstrap 5, hide the modal like this:
    var modalInstance = bootstrap.Modal.getInstance(document.getElementById('form').closest('.modal'));
    modalInstance.hide();
  }
  // If form is not valid, the modal will stay open for corrections
});


let formValidation = () => {
  let isValid = true; // Assume form is valid

  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");
  let msg = document.getElementById("msg");
  let difficulty = document.getElementById("difficulty");
  let statusInput = document.getElementById("statusInput");

  let inputDate = new Date(dateInput.value);
  let today = new Date();
  today.setHours(0,0,0,0); // Reset the time part to ensure only the date is compared

  if (textInput.value === "") {
    msg.innerHTML = "Task cannot be blank!";
    isValid = false; // Form is invalid
  } else if (dateInput.value === "" || inputDate < today) {
    msg.innerHTML = "Due Date cannot be blank or in the past!";
    isValid = false; // Form is invalid
  } else if (difficulty.value === "Choose a Difficulty") {
    msg.innerHTML = "You must choose a difficulty!";
    isValid = false; // Form is invalid
  } else if (statusInput.value === "") {
    msg.innerHTML = "You must choose a status!";
    isValid = false; // Form is invalid
  } else {
    msg.innerHTML = ""; // Clear previous error message
  }

  // Only proceed if form is valid
  if (isValid) {
    if (currentTaskID) {
      updateTask(currentTaskID);
    } else {
      createNewTask();
    }
    return true; // Indicate that form processing should continue
  }

  // Prevent modal from closing by not calling hide function
  return false; // Indicate form is not valid
};


let createNewTask = () => {
  let userID = localStorage.getItem('currentUserID');
  let textInput = document.getElementById("textInput");
  let dateInput = document.getElementById("dateInput");
  let textArea = document.getElementById("textArea");
  let difficulty = document.getElementById("difficulty");
  let statusInput = document.getElementById("statusInput")

  const taskData = {
    userID,
    taskName: textInput.value,
    taskDesc: textArea.value,
    taskDateDue: dateInput.value,
    taskCreditsReward: difficulty.value,
    taskStatus: statusInput.value,
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
      // Set global task ID to current editing task
      currentTaskID = taskID; // This is important
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
  // Reset the currentTaskID
  currentTaskID = null; // This ensures the form is reset for creation
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
              const dueDate = new Date(task.taskDateDue);
              const currentDate = new Date();
              currentDate.setHours(0, 0, 0, 0); // Normalize current date to start of day for comparison

              // Check if the task is overdue
              if (dueDate < currentDate) {
                  taskDueSpan.textContent = `Due: ${dueDate.toLocaleDateString()} - Overdue`;
                  taskDueSpan.style.color = 'red'; // Change color to red or any visual indication
              } else {
                  taskDueSpan.textContent = `Due: ${dueDate.toLocaleDateString()}`;
              }

              taskElement.appendChild(taskDueSpan);

              const editButton = document.createElement("button");
              editButton.textContent = "Edit";
              editButton.setAttribute("type", "button");
              editButton.classList.add("edit-btn", "btn", "btn-primary");
              editButton.setAttribute("data-bs-toggle", "modal");
              editButton.setAttribute("data-bs-target", "#form");
              editButton.setAttribute("data-task-id", task._id);
              editButton.addEventListener("click", () => editTask(task._id));
              taskElement.appendChild(editButton);

              const deleteButton = document.createElement("button");
              deleteButton.textContent = "Delete";
              deleteButton.classList.add("delete-btn", "btn", "btn-danger");
              deleteButton.addEventListener("click", () => deleteTask(task._id));
              taskElement.appendChild(deleteButton);

              tasksContainer.appendChild(taskElement);
          });
      })
      .catch(error => {
          console.error('Error fetching tasks:', error);
      });
}

