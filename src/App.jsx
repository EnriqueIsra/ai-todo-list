import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, input]);
      setInput('');
    }
  };

  /*const referer =
  window.location.hostname === 'localhost'
    ? 'http://localhost:5173'
    : 'https://ai-todo-list-4dmuymp6p-enrique-israel-torres-mendozas-projects.vercel.app';*/

  const suggestTask = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'mistralai/mistral-7b-instruct:free', // o 'openrouter/meta-llama/3-8b-instruct'
          messages: [
            {
              role: 'system',
              content: 'Eres un asistente que ayuda a generar tareas del día.',
            },
            {
              role: 'user',
              content: `Sugiere una tarea simple relacionada con: ${input}`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://ai-todo-list-4dmuymp6p-enrique-israel-torres-mendozas-projects.vercel.app', // URL final del proyecto
            'X-Title': 'AI To-Do List',
          },
        }
      );

      const suggestion = response.data.choices[0].message.content;
      setTasks([...tasks, suggestion]);
    } catch (error) {
      alert('Error al obtener sugerencia: ' + error.message);
    }
    setLoading(false);
    setInput('');
  };

  return (
    <div className="App">
      <h1>Lista de tareas con IA 🧠</h1>
      <input
        type="text"
        placeholder="Escribe una tarea o categoría"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <div>
        <button onClick={addTask}>Agregar tarea</button>
        <button onClick={suggestTask} disabled={loading}>
          {loading ? 'Generando...' : 'Sugerir tarea IA'}
        </button>
      </div>
      <ul>
        {tasks.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
