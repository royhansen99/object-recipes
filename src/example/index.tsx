import React from 'react';
import { createRoot } from 'react-dom/client';
import UseStateExample from './UseStateExample';
import UseReducerExample from './UseReducerExample';
import ReduxExample from './ReduxExample';
import JotaiExample from './JotaiExample';
import ZustandExample from './ZustandExample';

const path = window.location.pathname;

const App = () => {
  return (
    <div>
      <div>
        [<a href="/">React useState() example</a>] &nbsp; [
        <a href="/use-reducer-example">React useReducer() example</a>] &nbsp; [
        <a href="/redux-example">React + Redux example</a>] &nbsp; [
        <a href="/jotai-example">React + Jotai example</a>] &nbsp; [
        <a href="/zustand-example">React + Zustand example</a>]
      </div>
      {path === '/' && <UseStateExample />}
      {path === '/use-reducer-example' && <UseReducerExample />}
      {path === '/redux-example' && <ReduxExample />}
      {path === '/jotai-example' && <JotaiExample />}
      {path === '/zustand-example' && <ZustandExample />}
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
