const API_URL = "http://127.0.0.1:8000/tasks";

const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");

console.log("script.js yüklendi");
console.log("taskInput:", taskInput);
console.log("addButton:", addButton);
console.log("taskList:", taskList);

async function getTasks() {
    const response = await fetch(API_URL);
    const tasks = await response.json();

    taskList.innerHTML = "";

    tasks.forEach(task => {
        const li = document.createElement("li");

        const leftSide = document.createElement("div");
        leftSide.style.display = "flex";
        leftSide.style.alignItems = "center";
        leftSide.style.gap = "10px";

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleTask(task));

        const span = document.createElement("span");
        span.textContent = task.title;

        if (task.completed) {
            span.style.textDecoration = "line-through";
            span.style.opacity = "0.6";
        }

        leftSide.appendChild(checkbox);
        leftSide.appendChild(span);

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Sil";
        deleteButton.className = "delete-btn";
        deleteButton.addEventListener("click", () => deleteTask(task.id));

        li.appendChild(leftSide);
        li.appendChild(deleteButton);

        taskList.appendChild(li);
    });
}

async function addTask() {
    console.log("addTask çalıştı");

    const title = taskInput.value.trim();

    if (title === "") {
        alert("Lütfen bir görev gir.");
        return;
    }

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                completed: false
            })
        });

        const data = await response.json();
        console.log("POST cevabı:", data);

        taskInput.value = "";
        getTasks();
    } catch (error) {
        console.error("addTask hatası:", error);
    }
}

async function deleteTask(taskId) {
    try {
        await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE"
        });

        getTasks();
    } catch (error) {
        console.error("deleteTask hatası:", error);
    }
}
async function toggleTask(task) {
    await fetch(`${API_URL}/${task.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: task.title,
            completed: !task.completed
        })
    });

    getTasks();
}
addButton.addEventListener("click", addTask);

getTasks();