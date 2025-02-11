import useGameStore from '../store/gameStore';

function Scoreboard() {
  const players = useGameStore((state) => state.players);
  const localPlayer = useGameStore((state) => state.localPlayer);

  return (
    <div style={{
      position: 'absolute',
      top: 20,
      right: 20,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontFamily: 'Arial, sans-serif',
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 10px 0', textAlign: 'center' }}>Scoreboard</h3>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.3)', marginBottom: '10px' }} />
      
      {/* Local player first */}
      {localPlayer && (
        <div style={{
          padding: '5px',
          marginBottom: '5px',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '4px'
        }}>
          <div style={{ color: '#ff0000', fontWeight: 'bold' }}>
            You (#{localPlayer.id?.slice(-4)})
          </div>
          <div>HP: {localPlayer.health}/100</div>
          <div>Score: {localPlayer.score || 0}</div>
        </div>
      )}

      {/* Other players */}
      {Object.entries(players)
        .filter(([id]) => id !== localPlayer?.id)
        .map(([id, data]) => (
          <div key={id} style={{
            padding: '5px',
            marginBottom: '5px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '4px'
          }}>
            <div style={{ color: '#00ff00', fontWeight: 'bold' }}>
              Player #{id.slice(-4)}
            </div>
            <div>HP: {data.health}/100</div>
            <div>Score: {data.score || 0}</div>
          </div>
        ))}
    </div>
  );
}

export default Scoreboard; 