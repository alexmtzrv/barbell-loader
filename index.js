const loadButton = document.getElementById('button')
const barbellRadioNode = document.getElementsByName('barbell')
const referenceWeightInput = document.getElementById('referenced-weight')
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
    let targetWeight = referenceWeight * percentage
    let weightBySide = (targetWeight - barbellWeight) / 2
    return{
        targetWeight,
        weightBySide
    }
}

function calculatePlates (sideWeight){
    // Creamos un array vacío que almacenará los discos a usar
    const loadingArray = []
    // Recorremos el array de discos disponibles
    for (const plate of availablePlates) {
        let plateCounter = 0
        // Si nuestro peso es mayor al disco, le restamos hasta que este sea menor y contamos cuantos discos de ese peso necesitamos
        while (sideWeight >= plate){
            plateCounter ++
            sideWeight -= plate
        }
        //Evaluamos si necesitamos al menos un disco de ese peso, guardamos un objeto con el peso del disco, y la cantidad necesitada
        if (plateCounter > 0){
            loadingArray.push({
                plateWeight: plate,
                quantity: plateCounter,
            })
        }
    }
    // Devolvemos un objeto que contiene, el el array de discos a usar, y el peso restante
    return{
        loadingArray,
        remainingWeight: sideWeight
    }
}


loadButton.addEventListener('click', () => {
    // Guardamos el peso de la barra elegida
    const emptyBarbellWeight = parseInt(getBarbellWeight(barbellRadioNode))
    // Guardamos el peso a ser referenciado
    const referenceWeight = parseFloat(referenceWeightInput.value)
    // Guardamos el peso total del porcentaje y el peso de carga de discos
    const percentage = parseFloat(document.getElementById('percentage').value)
    const weightCalculation = calculateRealWeight(emptyBarbellWeight, referenceWeight, convertPercentage(percentage))
    // Calculamos los diferente discos a cargar de cada lado y lo guardamos en una variable
    const platesCalculation = calculatePlates(weightCalculation.weightBySide)
    // Creamos un objeto para almacenar toda la información del porcentaje consultado
    const loadingResult = {
        emptyBarbellWeight,
        referenceWeight,
        percentage,
        weightCalculation,
        platesCalculation
    }
    console.log(loadingResult)
})

