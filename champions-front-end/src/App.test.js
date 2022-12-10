import React from 'react';
import ReactDOM from 'react-dom';
import DemoAPP from './index';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DemoAPP />, div);
  ReactDOM.unmountComponentAtNode(div);
});
