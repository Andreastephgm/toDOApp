
const apiUrl = "http://localhost:8080/todos";


let newTaskInput = document.getElementById("newTask");
let goButton = document.getElementById("goButton");
let taskList = document.getElementById("taskList");
const cleanButton = document.getElementById("cleanButton");
const modal = document.getElementById("cleanModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

loadTasks();

async function loadTasks() {
  try {
    const todos = await apiRequest(apiUrl);
    taskList.innerHTML = ""; 

    todos.forEach(todo => {
      let li = document.createElement("li");
      li.innerHTML = `
        <span class="task-text ${todo.completed ? 'completed' : ''}">${todo.name}</span>
        <button class="done-btn" data-id="${todo.id}">✅</button>
        <button class="delete-btn" data-id="${todo.id}">❌</button>
      `;

      li.querySelector(".done-btn").addEventListener("click", () => {
        li.querySelector(".task-text").classList.toggle("completed");
      });
      
      li.querySelector(".delete-btn").addEventListener("click", async () => {
        const todoId = todo.id;
        await fetch(`${apiUrl}/${todoId}`, { method: "DELETE" });
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
    if (e.target.classList.contains("delete-btn")) {
        deleteTask(e.target.dataset.id);
    }
    if (e.target.classList.contains("done-btn")) {
        const li = e.target.parentElement;
        const taskText = li.querySelector(".task-text").textContent;
        const done = li.querySelector(".task-text").classList.contains("completed");
        toggleDone(e.target.dataset.id, taskText, completed);
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