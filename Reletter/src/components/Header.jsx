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
      {/* 왼쪽: 로고 이미지 */}
      <img
        src="/reletter_logo.png"
        alt="Reletter 로고"
        style={{
          height: '36px',
          objectFit: 'contain',
        }}
      />

      {/* 오른쪽: 유저 이름 */}
      <div style={{ fontSize: '14px', color: '#555' }}>
        안녕, 유저님!
      </div>
    </header>
  );
}

export default Header;
