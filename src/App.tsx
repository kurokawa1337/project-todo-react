import React, { useState, useEffect } from "react";
import TodoItem from "./components/TodoItem";
import { Todo, SortOrder } from "./types";

const App: React.FC = () => {
  // Лінива ініціалізація стану з localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [inputValue, setInputValue] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("none");

  // Автозбереження при зміні списку задач
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Оновлення заголовка вкладки
  useEffect(() => {
    document.title = `Задач: ${todos.length} | Todo App`;
  }, [todos.length]);

  const handleAddTodo = () => {
    const trimmed = inputValue.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: Date.now(),
      text: trimmed,
      completed: false,
    };

    setTodos((prev) => [...prev, newTodo]);
    setInputValue("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleDeleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  // Сортування копії масиву перед рендером
  const displayedTodos = [...todos].sort((a, b) => {
    if (sortOrder === "asc") return a.text.localeCompare(b.text);
    if (sortOrder === "desc") return b.text.localeCompare(a.text);
    return 0;
  });

  const completedCount = todos.filter((t) => t.completed).length;

  return (
    <main className="todo-app">
      <header className="app-header">
        <h1>Todo List</h1>
        <p className="subtitle">Організуй свої щоденні справи та завдання</p>
      </header>

      <div className="controls">
        <input
          type="text"
          id="todo-input"
          placeholder="Що потрібно зробити?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        <button id="add-button" onClick={handleAddTodo} title="Додати задачу">
          <span className="btn-icon">＋</span> Додати
        </button>
        <button id="sort-button" onClick={handleToggleSort} title="Сортувати за алфавітом">
          <span className="btn-icon">⇅</span>{" "}
          {sortOrder === "asc" ? "А-Я" : sortOrder === "desc" ? "Я-А" : "Сортувати"}
        </button>
      </div>

      <div className="counter">
        <span className="counter-label">
          Задач: {todos.length} (виконано: {completedCount})
        </span>
        <span id="todo-count">{todos.length}</span>
      </div>

      <div id="todo-list" className="todo-container">
        {displayedTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </div>
    </main>
  );
};

export default App;
