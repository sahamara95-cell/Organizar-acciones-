function addTask() {
    const input = document.getElementById('taskInput');
    const task = input.value;
    if (task === '') return;

    const li = document.createElement('li');
    li.innerHTML = `${task} <span class="delete-btn" onclick="this.parentElement.remove()">X</span>`;
    
    document.getElementById('taskList').appendChild(li);
    input.value = '';
}