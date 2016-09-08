import React from 'react';

// import Accordion from './elements/accordion/Accordion';
import Counter from './elements/counter/Counter';

import '../styles/reset.css';
import '../styles/global.css';
import './App.css';

// const segments = [
//   {
//     title: 'Something happened',
//     body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus ut facilisis tellus. Morbi aliquet consequat pretium. In sit amet felis dolor. Nullam feugiat massa sed rutrum varius. Cras lobortis, dolor nec pharetra dapibus, magna nibh malesuada velit, a consectetur mauris ligula quis orci. Duis pretium nisi at sodales semper. Vestibulum augue urna, condimentum quis lacinia aliquet, placerat non quam. Mauris eleifend leo ut lacus tempor ornare.', // eslint-disable-line
//     isOpen: true,
//   },
//   {
//     title: 'Something else happened',
//     body: 'Phasellus rutrum, lorem eu rutrum aliquam, ex nulla posuere turpis, a eleifend nisl arcu id elit. In eget urna consectetur, tincidunt elit eu, efficitur nulla. Donec sollicitudin libero libero. Suspendisse feugiat dolor nunc, sit amet mollis dui fermentum et. Donec quis nunc molestie, mattis leo vitae, tempor felis. Praesent et elit hendrerit nibh venenatis vestibulum. Sed molestie nulla nisl, at lacinia est posuere eget.', // eslint-disable-line
//   },
//   {
//     title: 'And another thing',
//     body: 'Nullam nec ultricies lectus, in elementum eros. Nam nibh leo, interdum vel euismod quis, euismod quis tortor. Aenean at metus urna. Etiam interdum lacus orci, at hendrerit diam efficitur nec. Sed dictum vehicula lectus id sollicitudin. Donec ultrices viverra venenatis. Etiam massa nibh, tincidunt sit amet augue sit amet, luctus aliquam nunc. Morbi purus massa, sodales id eros id, cursus laoreet tortor. Proin sed consectetur sapien, a hendrerit massa.', // eslint-disable-line
//   },
// ];

// const title = 'News';

const App = () => (
  <div className="App">
    <Counter />
    {/*
      <Accordion segments={segments} title={title} showToggles />
    */}
  </div>
);

export default App;
