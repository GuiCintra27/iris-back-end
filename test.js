function test() {
  const findTopics = ["a", "b", "c", "d", "e", "f", "g", "h", "i"];

  const arr = [];
  for (let i = 0; i < 100; i++) {
    console.log(findTopics.length);
    console.log(Math.floor(Math.random() * (findTopics.length - 1)));
    arr.push(Math.floor(Math.random() * (findTopics.length - 1)));
  }
  return arr.length;
}
console.log(test());
