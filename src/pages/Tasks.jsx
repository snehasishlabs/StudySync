import React, { useState, useEffect } from 'react';
import { Plus, Trash2, CheckCircle, Circle } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import './Tasks.css';

// Helper to reorder list based on drag result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const Tasks = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('studysync_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');

  useEffect(() => {
    localStorage.setItem('studysync_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([...tasks, { id: Date.now(), text: newTask, completed: false }]);
    setNewTask('');
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const reordered = reorder(tasks, result.source.index, result.destination.index);
    setTasks(reordered);
  };

  return (
    <div className="tasks-page">
      <h1 className="page-title">To-Do List</h1>
      <form onSubmit={addTask} className="task-form glass-panel">
        <input
          type="text"
          className="input-field"
          placeholder="What do you need to study today?"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit" className="btn">
          <Plus size={20} /> Add Task
        </button>
      </form>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tasksDroppable">
          {(provided) => (
            <div
              className="task-list"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {tasks.length === 0 ? (
                <div className="empty-state glass-panel">
                  <p>No tasks yet. Add one above!</p>
                </div>
              ) : (
                tasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={String(task.id)} index={index}>
                    {(provided, snapshot) => (
                      <div
                        className={`task-item glass-panel ${task.completed ? 'completed' : ''} ${snapshot.isDragging ? 'dragging' : ''}`}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <button className="task-toggle" onClick={() => toggleTask(task.id)}>
                          {task.completed ? <CheckCircle className="icon-success" size={24} /> : <Circle className="icon-muted" size={24} />}
                        </button>
                        <span className="task-text">{task.text}</span>
                        <button className="task-delete" onClick={() => deleteTask(task.id)}>
                          <Trash2 size={20} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Tasks;
