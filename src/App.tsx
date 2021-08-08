import React from 'react';
import logo from './logo.svg';
import './App.css';
import { isArguments, sampleSize } from 'lodash';
import { Either, left, right, chain, map, fold } from 'fp-ts/lib/Either';
import { pipe } from 'fp-ts/lib/function';
import { sequenceT } from 'fp-ts/lib/Apply';
import * as EitherFP from 'fp-ts/lib/Either';

interface Kid {
  name: string;
  age: number;
  isWellBehaved: boolean;
  wishList: string[];
}

const kidBing: Kid = {
  name: 'Bing',
  age: 4,
  isWellBehaved: true,
  wishList: ['book', 'candy', 'ice skates']
}

const getGiftNumber = (age: number): Either<Error, number> => {
  if (age > 0 && age < 13) {
    return right(Math.round(12 / age));
  } else {
    return left(new Error('Age is invalid.'));
  }
}

const ifDeserveGift = (
  isWellBehaved: boolean
): Either<Error, true> => {
  return isWellBehaved ? right(true) : left(new Error('Not well-behaved.'));
}

const decideGifts = (numberOfGifts: number, wishList: string[]): Either<Error, string[]> => {
  if (wishList.includes('diamond')) {
    return left(new Error('Should not ask for diamond. No gifts.'))
  } else {
    return right(
      numberOfGifts < wishList.length ?
        wishList.slice(wishList.length - numberOfGifts) :
        [...wishList, ...new Array(numberOfGifts - wishList.length).fill('video games')]
    )
  }
}

const getGifts = pipe(
  kidBing.isWellBehaved,
  ifDeserveGift,
  chain(
    (deserveGift) => pipe(
      getGiftNumber(kidBing.age),
      chain(
        (num: number) => decideGifts(num, kidBing.wishList)
      )
    )
  )
)


/* original */
// const ifDeserveGift = (
//   isWellBehaved: boolean
// ) => {
//   return isWellBehaved;
// }

// const getGiftNumber = (
//   age: number
// ) => {
//   return Math.round(12 / age);
// }

// const decideGifts = (numberOfGifts: number, wishList: string[]) => {
//   if (numberOfGifts < wishList.length) {
//     return wishList.splice(wishList.length - numberOfGifts);
//   } else {
//     const giftCandidates = ['socks', 'video game', 'doll', 'chocolate'];
//     const pickedGifts = sampleSize(giftCandidates, numberOfGifts - wishList.length);
//     return [...wishList, ...pickedGifts];
//   }
// }

// const decideGifts = (numberOfGifts: number, wishList: string[]) => {
//   if (numberOfGifts < wishList.length) {
//     return wishList.slice(wishList.length - numberOfGifts);
//   } else {
//     return [...wishList, ...new Array(numberOfGifts - wishList.length).fill('video games')];
//   }
// }

// const getGifts = pipe(
//   kidBing.isWellBehaved,
//   ifDeserveGift,
//   chain(
//     () => pipe(
//       getGiftNumber(kidBing.age),
//       chain(
//         (num: number) => decideGifts(num, kidBing.wishList)
//       )
//     )
//   ),
//   fold(
//     (error) => {
//       console.error(error);
//     },
//     (gifts) => gifts
//   )
//   // map(
//   //   (gifts: string[]) => gifts
//   // )
// )

// const reqA = (x: string): Either<Error, string>  => {
//   return right('some');
// }

// const reqB = (y: number): Either<Error, number>  => {
//   return right(1);
// }

// const reqC = (): Either<Error, number[]> => {
//   return right([8, 8])
// }

// const seq = sequenceT(EitherFP.either);
// const seqTRes = seq(reqA('good'), reqB(1), reqC());
// console.log('seqTRes: ', seqTRes);

// const wrapGifts = (gifts: string[]) => {
//   let giftsWrapPaperColor = [];

//   for (let i = 0; i < gifts.length; i++) {
//     const nextColor = i % 2 === 0 ? 'red' : 'green';
//     giftsWrapPaperColor.push(nextColor);
//   }
//   return giftsWrapPaperColor;
// }

// const attachGiftMessages = (gifts: string[]) => {
//   let giftsWrapPaperColor = [];

//   for (let i = 0; i < gifts.length; i++) {
//     const nextColor = i % 2 === 0 ? 'red' : 'green';
//     giftsWrapPaperColor.push(nextColor);
//   }
//   return giftsWrapPaperColor;
// }

// /* put together */
// // const getGifts = (
// //   kid: Kid
// // ) => {
// //   if (ifDeserveGift(kid.isWellBehaved)) {
// //     const giftNumber = getGiftNumber(kid.age);
// //     return decideGifts(giftNumber, kid.wishList);
// //   } else {
// //     throw Error('Not well-behaved. No gifts.');
// //   }
// // }

// /* put together age */
// // const getGifts = (
// //   kid: Kid
// // ) => {
// //   if (ifDeserveGift(kid.isWellBehaved)) {
// //     if (kid.age < 13 && kid.age > 0) {
// //       const giftNumber = getGiftNumber(kid.age);
// //       return decideGifts(giftNumber, kid.wishList);
// //     } else {
// //       throw Error('Age not valid. No gifts.');
// //     }
// //   } else {
// //     throw Error('Not well-behaved. No gifts.');
// //   }
// // }

// /* put together diamond */
// const getGifts = ( kid: Kid ) => {
//   if (ifDeserveGift(kid.isWellBehaved)) {
//     if (kid.age < 13 && kid.age > 0) {
//       const giftNumber = getGiftNumber(kid.age);
//       if (!kid.wishList.includes('diamond')) {
//         const potentialGifts = decideGifts(giftNumber, kid.wishList);
//         return potentialGifts;
//       } else {
//         throw Error('Should not ask for diamond. No gifts.');
//       }
//     } else {
//       throw Error('Age not valid. No gifts.');
//     }
//   } else {
//     throw Error('Not well-behaved. No gifts.');
//   }
// }

function App() {
  console.log('getGifts: ', getGifts);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}


export default App;
