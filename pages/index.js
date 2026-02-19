export default function Home() {
  return (
    <div style={styles.container}>
      <h1>Em Construção</h1>
      <p>Esta página está sendo desenvolvida. Volte em breve!</p>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    backgroundColor: '#f5f5f5',
    fontFamily: 'Arial, sans-serif',
  },
};