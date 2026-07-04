function Hud() {
  return (
    <div
      style={{
        position: 'absolute',
        top: 16,
        left: 16,
        padding: '10px 16px',
        borderRadius: 12,
        background: 'rgba(255, 255, 255, 0.8)',
        color: '#22331a',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        pointerEvents: 'none',
      }}
    >
      <div style={{ fontSize: '1.3rem', fontWeight: 700 }}>🌱 Ферма</div>
      <div style={{ fontSize: '0.85rem', opacity: 0.8, marginTop: 4 }}>
        Кликни по грядке, чтобы посадить / убрать растение.
      </div>
    </div>
  )
}

export default Hud
