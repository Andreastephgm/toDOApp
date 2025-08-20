
const apiUrl = "http://localhost:8080/todos";


let newTaskInput = document.getElementById("newTask");
let goButton = document.getElementById("goButton");
let taskList = document.getElementById("taskList");
const cleanButton = document.getElementById("cleanButton");
const modal = document.getElementById("cleanModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

const checkIcon = `
<svg class="icon-check" viewBox="0 0 24 24" aria-hidden="true"
     fill="none" stroke="currentColor" stroke-width="2"
     stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 6L9 17l-5-5"></path>
</svg>`;

const deleteIcon =` <svg class="icon-delete" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <polyline points="3 6 5 6 21 6"></polyline>
  <path d="M19 6l-2 14H7L5 6"></path>
  <path d="M10 11v6"></path>
  <path d="M14 11v6"></path>
  <path d="M9 6V4h6v2"></path>
</svg>`;

const modifyIcon = `
<svg class="icon-modify" viewBox="0 0 24 24" fill="none" stroke="currentColor"
     stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 20h9"></path>
  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"></path>
</svg>`;


loadTasks();

async function loadTasks() {
  try {
    const todos = await apiRequest(apiUrl);
    taskList.innerHTML = ""; 

    todos.forEach(todo => {
      let li = document.createElement("li");
      li.innerHTML = `
        <span class="task-text ${todo.completed ? 'completed' : ''}">${todo.name}</span>
        <button class="done-btn" data-id="${todo.id}">
        ${checkIcon}
        </button>
        <button class="delete-btn" data-id="${todo.id}">${deleteIcon}</button>
        <button class="modify-btn" data-id="${todo.id}">${modifyIcon}</button>
      `;

      li.querySelector(".delete-btn").addEventListener("click", async () => {
        await fetch(`${apiUrl}/${todo.id}`, { method: "DELETE" });
        li.remove(); 
      });

      taskList.appendChild(li);
    });

  } catch (error) {
    console.error("Error loading tasks:", error);
  }
}


async function addTask(name) {
  await apiRequest(apiUrl, 'POST', { name });
  loadTasks();
}

async function toggleDone(id, currentName, currentCompleted) {
  await apiRequest(`${apiUrl}/${id}`, 'PUT', { name: currentName, completed: !currentCompleted });
  loadTasks();
}

async function deleteTask(id) {
  await apiRequest(`${apiUrl}/${id}`, 'DELETE');
  loadTasks();
}

async function modifyTask(id, newName, completed) {
  await apiRequest(`${apiUrl}/${id}`, 'PUT', { name: newName, completed });
  loadTasks();  
}

goButton.addEventListener("click", async function () {
    let taskText = newTaskInput.value.trim();
    if (taskText) {
        await addTask(taskText);
        newTaskInput.value = "";
    } else {
        alert("Write a task, please!");
    }
});

taskList.addEventListener("click", function (e) {
    const deleteBtn = e.target.closest(".delete-btn");
    const doneBtn = e.target.closest(".done-btn");
    const modifyBtn = e.target.closest(".modify-btn");

    if (deleteBtn) {
        deleteTask(deleteBtn.dataset.id);
    }

    if (doneBtn) {
        const li = doneBtn.parentElement;
        const taskText = li.querySelector(".task-text").textContent;
        const done = li.querySelector(".task-text").classList.contains("completed");
        toggleDone(doneBtn.dataset.id, taskText, done);
    }

   if (modifyBtn) {
    const li = modifyBtn.parentElement;
    const currentName = li.querySelector(".task-text").textContent;
    const isCompleted = li.querySelector(".task-text").classList.contains("completed");
    const newTaskName = prompt("Modify task:", currentName);

    if (newTaskName && newTaskName.trim() !== "") {
        modifyTask(modifyBtn.dataset.id, newTaskName.trim(), isCompleted);
    } else {
        alert("Please enter a valid task name.");
    } 
}

});


cleanButton.addEventListener("click", function () {
    modal.style.display = "block";
});

yesBtn.addEventListener("click", async function () {
    try {
        const todos = await apiRequest(apiUrl);

        for (let todo of todos) {
            await deleteTask(todo.id);
        }
        taskList.innerHTML = "";

        modal.style.display = "none";
    } catch (error) {
        console.error("Error al eliminar todos:", error);
    }
});


noBtn.addEventListener("click", function () {
    modal.style.display = "none";
});

window.addEventListener("click", function (e) {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

async function apiRequest(endpoint, method = 'GET', body = null) {
  const options = {
       method,
       headers: {
            'Content-Type': 'application/json'
        }
    };
    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        const response = await fetch(endpoint, options);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error during API request:', error);
        throw error;
    }
    
  }