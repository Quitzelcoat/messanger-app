import { useEffect } from 'react';

function App() {
  useEffect(() => {
    fetch('http://localhost:3000/api/test')
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.log('Error:', error));
  }, []);

  return (
    <div>
      <h1>Messanger App</h1>
    </div>
  );
}

export default App;
