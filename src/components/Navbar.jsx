import { Link } from 'react-router-dom'

export default function Navbar() {
    return (
        <nav style={{ display: 'flex', gap: '1rem', padding: '1rem', background: '#eee' }}>
            <Link to="/">Inicio</Link>
            <Link to="/tasks">Lista de Tareas</Link>
            <Link to="/tasks/new">Nueva Tarea</Link>
            <Link to="/login">Login</Link>
        </nav>
    )
}
