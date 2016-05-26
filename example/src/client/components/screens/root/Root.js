import React from 'react';

import '../../../styles/reset.css';
import '../../../styles/global.css';
import './Root.css';

const Root = ({ children }) => (
  <div className="Root">
    <h1>Root</h1>
    {children}
  </div>
);

Root.propTypes = {
  children: React.PropTypes.node,
};

export default Root;
