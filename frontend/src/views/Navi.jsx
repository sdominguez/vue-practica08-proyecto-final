import React, { useState } from 'react';

function App() {
  // useState te permite añadir estado a tu componente funcional
  const [count, setCount] = useState(0);

  // Función para incrementar el contador
  const increment = () => {
    setCount(count + 1);
  };

  return (
    <div>
      <h1>Contador: {count}</h1>
      <p>No se vue</p>
      <button onClick={increment}>Incrementar</button>
    </div>
  );
}

export default App;
