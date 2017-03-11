// iterate over array of words
// find longest word in array
const words = ['hamburger', 'fries', 'ketchup', 'coke', 'cheesecake'];
function findLogestWord(words) {
  let longestWord = "";
  // forEach method
  words.forEach((word) => {
    // compare each item's length to the length of longestWord and store the longest
    if (word.length > longestWord.length) {
      longestWord = word;
    }
  });
  // // regular for loop method
  // for (let index = 0; index < words.length; index++) {
  //   if (words[index].length > longestWord.length) {
  //     longestWord = words[index];
  //   }
  // }
  return longestWord;
};

let longWord = findLogestWord(words);
console.log(longWord);
