let totalWeight = 287.7
let platesWeight = (totalWeight-45)/2
let remainingWeight

let availablePlates = [45,35,25,15,10,5,2.5,2,1.5,1,0.5]
let loadingArray = []

console.log(`Peso introducido es ${totalWeight}, y el peso neto de los discos en un lado es ${platesWeight}`)

for (let i = 0; i < availablePlates.length; i++) {
    while (platesWeight >= availablePlates[i]) {
        platesWeight -= availablePlates[i]
        loadingArray.push(availablePlates[i])
    }
}

remainingWeight = Number(platesWeight.toFixed(2))
loadingArray.reverse()
console.log(loadingArray)

if (remainingWeight !== 0) {
    console.log(`Restan ${remainingWeight} libras`)
}else{
    console.log(`Barra completa`)
}

