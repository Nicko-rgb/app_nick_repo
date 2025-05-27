import { useState } from 'react'

export default function TaskList({ tasks, setTasks }) {
    const [selectedTaskId, setSelectedTaskId] = useState(null)

    const toggleDetails = (id) => {
        setSelectedTaskId(selectedTaskId === id ? null : id)
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Lista de Tareas</h2>
            {tasks.length === 0 ? (
                <p>No hay tareas aún.</p>
            ) : (
                tasks.map((task, index) => (
                    <div key={index} style={{ marginBottom: '1rem', borderBottom: '1px solid #ccc' }}>
                        <h3>{task.title}</h3>
                        <p>Estado: {task.completed ? 'Completada' : 'Pendiente'}</p>
                        <button onClick={() => toggleDetails(index)}>
                            {selectedTaskId === index ? 'Ocultar Detalles' : 'Ver Detalles'}
                        </button>
                        {selectedTaskId === index && (
                            <p style={{ marginTop: '0.5rem' }}>{task.description}</p>
                        )}
                    </div>
                ))
            )}
        </div>
    )
}
