function chunk (array, chunkLen) {
    let ret = [];
    for (let i = 0; i < array.length; i += chunkLen) ret.push(array.slice(i, i + chunkLen))
    return ret
}
let sum = (...numbers) => numbers.reduce((prev, num) => num + prev)
let average = (array) => array.reduce((c, p) => c + p) / array.length
function deviation (array) { // I ran out of names, okay? This just returns standard deviation of an array, and the mean of its numbers.
    const average = array.reduce((a, b) => a + b) / array.length
    return Math.sqrt(array.map(x => Math.pow(x - average, 2)).reduce((a, b) => a + b) / array.length)
}

function quadTree (ctx, maxRecursion = 5, distance = 50) {
    // Get all the pixels in the image in a single, long array and then convert them to a list of lists so we can get colors like pixels[y][x]:
    let alldata = chunk(chunk(ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height).data, 4), ctx.canvas.width)
    
    // A function to extract a list of pixels from the image data list we have
    function getData (x1, x2, y1, y2) {
        let ret = []
        for (let y = y1; y < y2; y++) {
            for (let x = x1; x < x2; x++) {
                alldata[y][x] ? ret.push(alldata[y][x]) : console.log(y, x)
            }
        }
        return ret
    }

    function recurse (x1, x2, y1, y2, depth = 0) {
        let data = getData(x1, x2, y1, y2)
        let brightness = data.map((c) => c.slice(0, 3).reduce((p,c) => c + p))
        let midx = Math.floor((x1+x2)/2)
        let midy = Math.floor((y1+y2)/2)
        depth += 1
        //console.log(`deviation: ${deviation}\ndepth: ${depth}\ndifx: ${midx - x1}\ndify: ${midy - y1}\nrecursion: ${depth}`)
        if (depth < maxRecursion && midx - x1 > 0 && midy - y1 > 0 && deviation(brightness) > distance) {
                return [
                    [ x1, midx, y1, midy ], // top-left corner
                    [ midx, x2, y1, midy ], // top-right corner
                    [ x1, midx, midy, y2 ], // bottom-left corner
                    [ midx, x2, midy, y2 ] // bottom-right corner
            ].map((coords, i) => recurse(...coords, depth))
        }
        else return {
            start: [x1, y1],
            stop: [x2, y2],
            color: [...Array(3).fill(0).map((e, i) => average(data.map(d => d[i]))), average(data.map(d => d[3])) / 255]
            //color: Array(3).fill(deviation)
        }
    } 
    return recurse(0, canvas.width, 0, canvas.height)
}