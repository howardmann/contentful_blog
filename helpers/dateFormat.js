module.exports = (str) => {
  let options = {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }
  return new Date(str).toLocaleDateString('en-US', options)
}

