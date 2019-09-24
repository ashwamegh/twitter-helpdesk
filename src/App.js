import React from 'react';
import  Auth  from './components/Auth';

const App = () => {
  console.log(process.env.REACT_APP_NOT_SECRET_CODE)
  return (
    <div className="App">
      <Auth />  
    </div>
  );
}

export default App;
