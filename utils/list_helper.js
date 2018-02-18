const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {

  const reducer = (sum, item) => {
    if (item.likes) {
      return sum + item.likes
    } else {
      console.log("Item did not contain the likes attribute: ", item)
      console.log(blogs)
      return sum + 0
    }
    
  }

  return blogs.reduce(reducer, 0)
}

module.exports = {
  dummy,
  totalLikes
}