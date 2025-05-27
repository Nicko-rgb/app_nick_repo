import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function NewTask({ setTasks }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!title.trim()) return alert("El título es obligatorio")

        const newTask = { title, description, completed: false }
        setTasks(prev => [...prev, newTask])
        navigate('/tasks')
    }

    return (
        <div style={{ padding: '1rem' }}>
            <h2>Nueva Tarea</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Título:</label><br />
                    <input value={title} onChange={e => setTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Descripción:</label><br />
                    <textarea value={description} onChange={e => setDescription(e.target.value)} />
                </div>
                <button type="submit">Guardar Tarea</button>
            </form>
        </div>
    )
}
