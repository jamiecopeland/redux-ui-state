// import { expect } from 'chai';

// import reducer, { initialState as defaultInitialState } from '../pojoReducer';
// import { setUIState, replaceUIState } from '../actions';

// const COMPONENT_ID = 'thing';

// describe('pojoReducer', () => {
//   let testStrings;

//   beforeEach(() => {
//     testStrings = {
//       person: {
//         firstName: 'Darth',
//         lastName: 'Vader',
//       },
//     };
//   });

//   describe('SET_UI_STATE', () => {
//     it('set a new primitive value in empty initial state', () => {
//       const action = setUIState({
//         state: {
//           firstName: testStrings.person.firstName,
//         },
//         id: COMPONENT_ID,
//       });
//       const newState = reducer(defaultInitialState, action);

//       expect(newState).to.deep.equal({
//         components: {
//           [COMPONENT_ID]: {
//             firstName: testStrings.person.firstName,
//           },
//         },
//       });
//     });

//     it('set a new primitive value in populated initial state', () => {
//       const initialState = {
//         components: {
//           [COMPONENT_ID]: {
//             lastName: testStrings.person.lastName,
//           },
//         },
//       };
//       const action = setUIState({
//         state: {
//           firstName: testStrings.person.firstName,
//         },
//         id: COMPONENT_ID,
//       });
//       const newState = reducer(initialState, action);
//       expect(newState).to.deep.equal({
//         components: {
//           [COMPONENT_ID]: {
//             firstName: testStrings.person.firstName,
//             lastName: testStrings.person.lastName,
//           },
//         },
//       });
//     });

//     it('shouldDeepMerge defaults to false', () => {
//       const initialState = {
//         components: {
//           [COMPONENT_ID]: {
//             user: {
//               firstName: testStrings.person.firstName,
//             },
//           },
//         },
//       };

//       const action = setUIState({
//         state: {
//           user: {
//             lastName: testStrings.person.lastName,
//           },
//         },
//         id: COMPONENT_ID,
//       });

//       const newState = reducer(initialState, action);

//       expect(newState).to.deep.equal({
//         components: {
//           [COMPONENT_ID]: {
//             user: {
//               lastName: testStrings.person.lastName,
//             },
//           },
//         },
//       });
//     });

//     const address = {
//       line1: '1 Long Corridor',
//       city: 'Death Star',
//     };

//     it('deep merging works', () => {
//       const initialState = {
//         components: {
//           [COMPONENT_ID]: {
//             user: {
//               firstName: testStrings.person.firstName,
//               address: {
//                 line1: address.line1,
//               },
//             },
//           },
//         },
//       };

//       const action = setUIState({
//         state: {
//           user: {
//             lastName: testStrings.person.lastName,
//             address: {
//               city: address.city,
//             },
//           },
//         },
//         shouldDeepMerge: true,
//         id: COMPONENT_ID,
//       });

//       const newState = reducer(initialState, action);

//       expect(newState).to.deep.equal({
//         components: {
//           [COMPONENT_ID]: {
//             user: {
//               firstName: testStrings.person.firstName,
//               lastName: testStrings.person.lastName,
//               address,
//             },
//           },
//         },
//       });
//     });
//   });

//   describe('REPLACE_UI_STATE', () => {
//     it('should replace ui state with empty state', () => {
//       const initialState = {
//         components: {
//           [COMPONENT_ID]: {
//             firstName: testStrings.person.firstName,
//           },
//         },
//       };

//       const replacementState = null;

//       const action = replaceUIState({
//         id: COMPONENT_ID,
//         state: replacementState,
//       });

//       const newState = reducer(initialState, action);
//       expect(newState).to.deep.equal({
//         components: {
//           [COMPONENT_ID]: replacementState,
//         },
//       });
//     });

//     it('should replace ui state with populated state', () => {
//       const initialState = {
//         components: {
//           [COMPONENT_ID]: {
//             firstName: testStrings.person.firstName,
//           },
//         },
//       };

//       const replacementState = {
//         lastName: testStrings.person.lastName,
//       };

//       const action = replaceUIState({
//         id: COMPONENT_ID,
//         state: replacementState,
//       });

//       const newState = reducer(initialState, action);
//       expect(newState).to.deep.equal({
//         components: {
//           [COMPONENT_ID]: replacementState,
//         },
//       });
//     });
//   });
// });
