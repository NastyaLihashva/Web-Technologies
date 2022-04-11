import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux'
import Admin from './Components/Admin/Admin';
import Menu from './Components/Menu/Menu';
import Participant from './Components/Participant/Participant';

import { createStore } from 'redux';
import rootReducer from './store/reducers/rootReducer';


const store = createStore(rootReducer);

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Menu />} />
          <Route path="/participant/:name" element={<Participant />} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
