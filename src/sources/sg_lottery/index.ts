export { default as FourD } from './fourD';
export { default as Sweep } from './sweep';
export { default as Toto } from './toto';

// const getLottery = async (browser:) => {
//   let lottery = await Promise.all([
//     fourD(browser),
//     toto(browser),
//     sweep(browser),
//   ])
//     .then((values) => {
//       // convert to dict
//       return {
//         FourD: values[0],
//         Toto: values[1],
//         Sweep: values[2],
//       };
//     })
//     .catch((error) => {
//       console.log(error);
//       return {};
//     });
//   return lottery;
// };

// export {getLottery as sg_lottery};
