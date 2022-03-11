import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import 'react-quill/dist/quill.snow.css';
import 'prismjs/prism';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-jsx';
import 'nprogress/nprogress.css';
import '../src/assets/css/prism.css';
import "cropperjs/dist/cropper.css";
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { enableES5 } from 'immer';
import * as serviceWorker from '../src/serviceWorker';
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
import store from '../src/store';
import { SettingsProvider } from '../src/contextapi/contexts/SettingsContext';
import App from '../src/App';

enableES5();
const persistor = persistStore(store);


ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SettingsProvider>
        <App />
      </SettingsProvider>
    </PersistGate>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.register();
