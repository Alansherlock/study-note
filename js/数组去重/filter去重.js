// 定义数组Aarr
let arr = [1,1,2,3,4,4,5,6,7,8];
function unique(arr) {
    return arr.filter(function(item, index, arr) {
      //当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
      return arr.indexOf(item, 0) === index;
    });
  }
console.log(unique(arr))