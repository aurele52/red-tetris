import { useEffect, useState } from 'react'
import { io } from 'socket.io-client'

const socket = io('http://localhost:4000', { autoConnect: false })

export default function App() {
  const [room, setRoom] = useState('demo')
  const [connected, setConnected] = useState(false)
  const [state, setState] = useState(null)

  useEffect(() => {
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('game/state', (st) => setState(st))
    return () => socket.off()
  }, [])

  const join = () => { if(!socket.connected) socket.connect(); socket.emit('join_room', {roomId: room}) }
  const tick = () => socket.emit('game/tick')
  const move = (dir) => socket.emit('game/move', dir)
  const rotate = (dir) => socket.emit('game/rotate', dir)

  return (
    <div style={{padding:20}}>
      <h1>Front 8081 ↔ Back 4000</h1>
      <p>Statut: {connected ? 'connecté' : 'déconnecté'}</p>
      <input value={room} onChange={e=>setRoom(e.target.value)} />
      <button onClick={join}>Join</button>
      <button onClick={tick}>Tick</button>
      <button onClick={()=>move('left')}>←</button>
      <button onClick={()=>move('right')}>→</button>
      <button onClick={()=>rotate('cw')}>⟳</button>
      <pre>{JSON.stringify(state,null,2)}</pre>
    </div>
  )
}