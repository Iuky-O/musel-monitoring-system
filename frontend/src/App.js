import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Visao from './pages/admin/Visao';
import Obra from './pages/user/Obra';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/admin/visao" element={<Visao />} />
                <Route path="/user/obra" element={<Obra />} />
            </Routes>
        </Router>
    );
};

export default App;