const loadButton = document.getElementById('button')
const barbellRadioNode = document.getElementsByName('barbell')
const referenceWeightInput = document.getElementById('referenced-weight')
const percentageInput = document.getElementById('percentage')
const availablePlates = [45,35,25,15,10,5,2.5,2,1.5,1,0.5]

function getBarbellWeight (radioNode){
    // Iteramos los nodos y devolvemos el valor del que esté checkeado
    for (const element of radioNode) {
        if (element.checked){
            return element.value
        }
    }
}

function convertPercentage (percent){
    return (percent/100)
}

function calculateRealWeight (barbellWeight, referenceWeight, percentage){
    // Calculamos el porcentaje deseado al peso de referencia, restamos el peso de la barra y dividimos entre dos
    return ((referenceWeight * percentage)-(barbellWeight))/2
}

function calculatePlates (sideWeight){
    // Creamos un array vacío que almacenará los discos a usar
    let loadingArray = []
    // Recorremos el array de discos disponibles
    for (let i = 0; i < availablePlates.length; i++) {
        // Si nuestro peso es mayor al disco, le restamos hasta que este sea menor
        while (sideWeight >= availablePlates[i]){
            sideWeight -= availablePlates[i]
            loadingArray.push(availablePlates[i])
        }
    }

    console.log(`Remaining weight: ${sideWeight}`)

    return{
        plates: loadingArray,
        remainingWeight: sideWeight
    }
}

loadButton.addEventListener('click', () => {
    // Guardamos el peso de la barra elegida
    const emptyBarbellWeight = parseInt(getBarbellWeight(barbellRadioNode))
    // Guardamos el peso a ser referenciado
    const totalWeight = parseFloat(referenceWeightInput.value)
    // Guardamos el peso neto que hay que cargar en un solo lado de la barra segun el porcentaje elegido
    const sidePlatesWeight = calculateRealWeight(emptyBarbellWeight, totalWeight, convertPercentage(percentageInput.value))
    console.log(sidePlatesWeight)
    // Calculamos los diferente discos a cargar de cada lado y lo guardamos en una variable
    const platesBySide = calculatePlates(sidePlatesWeight)
    console.log(platesBySide.plates)
    console.log(`Remaining weight: ${platesBySide.remainingWeight}`)
})

