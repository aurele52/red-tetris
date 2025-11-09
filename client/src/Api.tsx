import { useEffect, useState } from "react";

type Todo = { id: number; title: string; done: boolean };

function Api() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/todos")
      .then((r) => r.json())
      .then(setTodos)
      .catch(console.error);
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;
    const res = await fetch("http://localhost:5000/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: text }),
    });
    const todo = await res.json();
    setTodos((prev) => [todo, ...prev]);
    setText("");
  };

  const toggleTodo = async (id: number) => {
    const res = await fetch(`http://localhost:5000/api/todos/${id}/toggle`, {
      method: "PATCH",
    });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  return (
    <div style={{ padding: 24, maxWidth: 640, margin: "0 auto" }}>
      <h1>Todos</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Nouvelle tâche…"
          style={{ flex: 1 }}
        />
        <button onClick={addTodo}>Ajouter</button>
      </div>

      <ul>
        {todos.map((t) => (
          <li
            key={t.id}
            style={{ cursor: "pointer" }}
            onClick={() => toggleTodo(t.id)}
          >
            <input type="checkbox" readOnly checked={t.done} />
            <span
              style={{
                marginLeft: 8,
                textDecoration: t.done ? "line-through" : "none",
              }}
            >
              {t.title}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Api;
