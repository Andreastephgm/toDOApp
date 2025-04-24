let newTaskInput = document.getElementById("newTask");
let goButton = document.getElementById("goButton");
let taskList = document.getElementById("taskList");
const cleanButton = document.getElementById("cleanButton");
const modal = document.getElementById("cleanModal");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

taskList.innerHTML = localStorage.getItem("tasks") || "";

goButton.addEventListener("click", function() {
    let taskText = newTaskInput.value.trim(); 

    if (taskText !== "") {
        let li = document.createElement("li"); 
        li.innerHTML = `
            <span class="task-text">${taskText}</span>
            <button class="done-btn">✅</button>
            <button class="delete-btn">❌</button>
        `;
        taskList.appendChild(li);
        localStorage.setItem("tasks", taskList.innerHTML);
        newTaskInput.value = ""; 
    } else {
        alert("Write a task, please!");
    }
});

taskList.addEventListener("click", function(e) {
    if (e.target.classList.contains("delete-btn")) {
        e.target.parentElement.remove();
        localStorage.setItem("tasks", taskList.innerHTML);
    }
    if (e.target.classList.contains("done-btn")) {
        const taskSpan = e.target.parentElement.querySelector(".task-text");
        taskSpan.classList.toggle("done");
        localStorage.setItem("tasks", taskList.innerHTML);
    }
});

cleanButton.addEventListener("click", function () {
    const tasks = taskList.querySelectorAll("li");
  
    if (tasks.length === 0) {
      alert("La lista de todo's está vacía");
      return;
    }
  
    modal.style.display = "block";
  });
  
  yesBtn.addEventListener("click", function () {
    taskList.innerHTML = "";
    localStorage.removeItem("tasks");
    modal.style.display = "none";
  });
  
  noBtn.addEventListener("click", function () {
    modal.style.display = "none";
  });
  
  window.addEventListener("click", function (e) {
    if (e.target === modal) {
      modal.style.display = "none";
    }
  });