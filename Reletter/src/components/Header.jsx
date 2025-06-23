function Header() {
  return (
    <header style={{
      height: '60px',
      backgroundColor: '#fdf2f8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}>
       
       <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <img
          src="/reletter_logo.png"
          alt="Reletter 로고"
          style={{ height: '30px' }}
        />
        <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#9d174d' }}>
          Reletter
        </span>
      </div>
      

      {/* 오른쪽: 버튼 3개 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <button style={roundedButtonStyle}>친구추가</button>
        <button style={roundedButtonStyle}>마이페이지</button>
        <button style={roundedButtonStyle}>설정</button>
      </div>
    </header>
  );
}

function HoverButton({ label }) {
  return (
    <button
      style={roundedButtonStyle}
      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f472b6'}
      onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
    >
      {label}
    </button>
  );
}

const roundedButtonStyle = {
  backgroundColor: '#ffffff',
  border: '1.5px solid 	#eab5c5',
  borderRadius: '12px',
  padding: '6px 14px',
  fontSize: '14px',
  color: '#9d174d',
  cursor: 'pointer',
  transition: 'all 0.2s ease-in-out',
};

export default Header;
