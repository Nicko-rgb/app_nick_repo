import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Navbar from './components/NavBar'
import TaskList from './pages/TaskList'
import NewTask from './pages/NewTask'
import Login from './pages/Login'
import { useState } from 'react'

function App() {
  const [tasks, setTasks] = useState([])

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TaskList tasks={tasks} setTasks={setTasks} />} />
        <Route path="/tasks/new" element={<NewTask setTasks={setTasks} />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App
