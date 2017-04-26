import * as React from 'react';

import Counter from './Counter';

const App: React.StatelessComponent<{}> = () => (
  <div>
    <Counter initialValue={0} />
  </div>
);

export default App;