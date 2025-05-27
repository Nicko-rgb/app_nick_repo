export default function Login() {
    return (
        <div style={{ padding: '1rem' }}>
            <h2>Login</h2>
            <form>
                <div>
                    <label>Email:</label><br />
                    <input type="email" />
                </div>
                <div>
                    <label>Contraseña:</label><br />
                    <input type="password" />
                </div>
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    )
}
