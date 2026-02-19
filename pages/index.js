export default function Home() {
  return (
    <div style={styles.container}>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={styles.content}>
        <h1 style={styles.title}>🚧 Página em Construção</h1>
        <p style={styles.text}>
          Estamos trabalhando para trazer um conteúdo incrível para você em breve!
        </p>
        <div style={styles.loader}></div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
  },
  content: {
    textAlign: 'center',
    padding: '40px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '20px',
  },
  text: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '40px',
  },
  loader: {
    border: '4px solid #e0e0e0',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 1s linear infinite',
    margin: '0 auto',
  },
};