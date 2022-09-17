import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'redux/store';

import Layout from 'components/Layout/Layout';
import Home from 'views/home';
import AddPost from 'views/addPost';
import Login from 'views/login';
import Profile from 'views/profile';
import Chat from 'views/chat';
import Setting from 'views/setting';
import Register from 'views/register';
import FindAccount from 'views/findAccount';

import 'styles/globals.scss';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/addPost" element={<AddPost />} />
            <Route path="login" element={<Login />} />
            <Route path="login/register" element={<Register />} />
            <Route path="login/findAccount" element={<FindAccount />} />
            <Route path="profile" element={<Profile />} />
            <Route path="chat" element={<Chat />} />
            <Route path="setting" element={<Setting />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
