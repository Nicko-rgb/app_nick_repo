import { useNavigate } from 'react-router-dom'

export default function Home() {
    const navigate = useNavigate()

    return (
        <div style={{ padding: '1rem' }}>
            <h1>Bienvenido al Gestor de Tareas Personales</h1>
            <p>Organiza tus tareas y mejora tu productividad.</p>
            <button onClick={() => navigate('/tasks')}>Ir a Lista de Tareas</button>
        </div>
    )
}
