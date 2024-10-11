import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bulma';
import '@fortawesome/fontawesome-free/css/all.css';
import './index.css';
import { Root } from './Root';
// import { GoogleOAuthProvider } from '@react-oauth/google';

// const clientId = '731360179208-m1pkerk2frqvk5ddtskejvq2q5fr784t.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(<GoogleOAuthProvider clientId={clientId}><Root /></GoogleOAuthProvider>,
root.render(<Root />);
