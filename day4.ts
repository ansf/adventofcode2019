const min = 153517
const max = 630395
//const min = 123455
//const max = 123500

let count = 0 
for(let i = min; i <= max; i++) {
	if(valid(i)) {
		count++
	}
}

function valid(code) {
	const s = code.toString()
	for(let i = 1; i < s.length; i++) {
		if(s.charAt(i) < s.charAt(i - 1)) {
			console.log(`F ${code}`)
			return false
		}
	}
	for(let i = 1; i < s.length; i++) {
		if(s.charAt(i) == s.charAt(i - 1)) {
			console.log(`T ${code}`)
			return true
		}
	}
	console.log(`F ${code}`)
	return false
}

console.log(count)
