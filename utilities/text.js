
function t(){
    let m = 'hey'
    console.log(m)
    return m
}

console.log(new Date())
c = '15-07-2019'
b = c.replace(/(\d{1,2})-(\d{1,2})-(\d{2,4})/, '$3-$2-$1')
console.log(new Date(b))
