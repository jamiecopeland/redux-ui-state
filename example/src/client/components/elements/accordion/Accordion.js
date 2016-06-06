import React from 'react';
import { connect } from 'react-redux';

import { addReduxUIState, defaultMapStateToProps } from 'redux-ui-state';

import './Accordion.css';

function setIsOpenAtIndex(segmentStates, index, isOpen) {
  const output = [...segmentStates];
  output[index] = { isOpen };
  return output;
}

const Accordion = (
  { title, segments, showToggles, uiState: { segmentStates }, setUIState, resetUIState }
) => (
  <div className="Accordion">
    {
      showToggles
      ? <span className="Accordion_TogglesContainer">
          <button onClick={() => setUIState({
            segmentStates: segmentStates.map(() => ({ isOpen: true })),
          })}
          >Open all</button>
          <button onClick={() => setUIState({
            segmentStates: segmentStates.map(() => ({ isOpen: false })),
          })}
          >Close all</button>
          <button onClick={() => resetUIState()}>Reset</button>
        </span>
      : null
    }

    {
      title
      ? <h1 className="Accordion_Title">{title}</h1>
      : null
    }

    <ul className="Accordion_List">
      {
        segments.map(({ title: segmentTitle, body }, index) => (
          <li key={index} className="Accordion_Segment">
            <a
              className="Accordion_SegmentTitle"
              onClick={() => setUIState({
                segmentStates: setIsOpenAtIndex(
                  segmentStates, index, !segmentStates[index].isOpen
                ),
              })}
            >
              {segmentTitle}
            </a>
            {
              segmentStates[index].isOpen
              ? <p className="Accordion_SegmentContent">{body}</p>
              : null
            }

          </li>
        ))
      }
    </ul>
  </div>
);

Accordion.propTypes = {
  title: React.PropTypes.string,
  segments: React.PropTypes.array.isRequired,
  showToggles: React.PropTypes.bool,

  uiState: React.PropTypes.object,
  setUIState: React.PropTypes.func,
  resetUIState: React.PropTypes.func,
};

const StateWrappedComponent = addReduxUIState({
  id: 'newsAccordion',
  destroyOnUnmount: true,
  getInitialState: ({ segments }) => ({
    segmentStates: segments.map(({ isOpen }) => ({ isOpen })),
  }),
})(Accordion);

export default connect(defaultMapStateToProps)(StateWrappedComponent);
