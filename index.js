const loadButton = document.getElementById('button')
const barbellSelect = document.getElementById('barbellWeightSelect')
const referenceWeightInput = document.getElementById('referenced-weight')
// const availablePlates = [45,35,25,15,10,5,2.5,2,1.5,1,0.5]
const resultSection = document.getElementById('resultsSection')
const availablePlates = [45,35,25,15,10,5,2.5]
const plateStyle = {
    45: {
        color: '#0057B8',
    },
    35: {
        color: '#FFD60A'
    },
    25: {
        color: '#00A651'
    },
    15: {
        color: '#1F1F1F'
    },
    10: {
        color: '#7A7A7A'
    },
    5: {
        color: '#1F1F1F',
        width: '30px',
        height: '30px'
    },
    2.5: {
        color: '#1F1F1F',
        width: '25px',
        height: '25px'
    }
}

// function getBarbellWeight (radioNode){
//     // Iteramos los nodos y devolvemos el valor del que esté checkeado
//     for (const element of radioNode) {
//         if (element.checked){
//             return element.value
//         }
//     }
// }

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
    // Devolvemos un objeto que contiene, el array de discos a usar, y el peso restante
    return{
        loadingArray,
        remainingWeight: sideWeight
    }
}

function drawPlates(result){
    // Creamos un array que almacenará elementos span que representan los discos a renderizar
    const plateElements = []
    // Recorremos el parámetro que es un array de discos por lado del resultado
    for (const plate of result.loadingArray) {
        // Hace un loop para producir n cantidad de discos de cada peso
        for (let i = 0; i < plate.quantity; i++){
            // Guardamos el objeto que corresponde al disco según su peso
            const style = plateStyle[plate.plateWeight]
            // Creamos el elemento span
            const plateDisplayDraw = document.createElement('span')
            plateDisplayDraw.classList.add('plates-display-draw')
            // Mediante el objeto guardado anteriormente, asignamos color al disco
            plateDisplayDraw.style.backgroundColor = style.color
            // Si el objeto tiene un width y height específico, lo asignamos
            if(style.width && style.height){
                plateDisplayDraw.style.width = style.width
                plateDisplayDraw.style.height = style.height
            }
            // Guardamos ese disco en el arreglo
            plateElements.push(plateDisplayDraw)
        }
    }
    return plateElements
}

function renderResult(result){
    // Contenedor de caja
    const card = document.createElement('div')
    card.classList.add('results-card')

    // Porcentaje
    const cardPercentage = document.createElement('div')
    cardPercentage.classList.add('card-percentage')

    const cardPercentageText = document.createElement('p')
    cardPercentage.classList.add('card-percentage-text')
    cardPercentageText.textContent = `${result.percentage.toFixed(2)} % of ${result.referenceWeight.toFixed(2)} lbs = ${result.weightCalculation.targetWeight.toFixed(2)} lbs`
    cardPercentage.appendChild(cardPercentageText)
    card.appendChild(cardPercentage)

    // Barbell
    const cardBarbell = document.createElement('div')
    cardBarbell.classList.add('card-barbell')
    card.appendChild(cardBarbell)

    const cardBarbellText = document.createElement('p')
    cardBarbellText.classList.add('card-barbell-text')
    cardBarbellText.textContent = `Barbell : ${result.emptyBarbellWeight}`
    cardBarbell.appendChild(cardBarbellText)

    // const cardBarbellDraw = document.createElement('div')
    // cardBarbellDraw.classList.add('card-barbell-draw')
    // cardBarbell.appendChild(cardBarbellDraw)
    //
    // const barbellDrawBarrel = document.createElement('span')
    // barbellDrawBarrel.classList.add('barbell-draw-barrel')
    // cardBarbellDraw.appendChild(barbellDrawBarrel)
    //
    // const barbellDrawCollar = document.createElement('span')
    // barbellDrawCollar.classList.add('barbell-draw-collar')
    // cardBarbellDraw.appendChild(barbellDrawCollar)
    //
    // const barbellDrawTube = document.createElement('span')
    // barbellDrawTube.classList.add('barbell-draw-tube')
    // cardBarbellDraw.appendChild(barbellDrawTube)
    //
    // const barbellDrawCollar2 = document.createElement('span')
    // barbellDrawCollar2.classList.add('barbell-draw-collar')
    // cardBarbellDraw.appendChild(barbellDrawCollar2)
    //
    // const barbellDrawBarrel2 = document.createElement('span')
    // barbellDrawBarrel2.classList.add('barbell-draw-barrel')
    // cardBarbellDraw.appendChild(barbellDrawBarrel2)

    // Plates
    const cardPlates = document.createElement('div')
    cardPlates.classList.add('card-plates')
    card.appendChild(cardPlates)

    const cardPlatesTitle = document.createElement('p')
    cardPlatesTitle.classList.add('card-plates-title')
    cardPlatesTitle.textContent = `Plates per side`
    cardPlates.appendChild(cardPlatesTitle)

    const platesDisplay = document.createElement('div')
    platesDisplay.classList.add('plates-display')
    cardPlates.appendChild(platesDisplay)

    const drawnPlates = drawPlates(result.platesCalculation)

    for (const draw of drawnPlates) {
        platesDisplay.appendChild(draw)
    }

    if (result.platesCalculation.remainingWeight > 0.01){
        const platesDisplayRemainingWeight = document.createElement('p')
        platesDisplayRemainingWeight.classList.add('plates-display-remaining-weight')
        platesDisplayRemainingWeight.textContent = `Remaining weight: ${result.platesCalculation.remainingWeight.toFixed(2)} lbs`
        cardPlates.appendChild(platesDisplayRemainingWeight)
    }

    resultSection.appendChild(card)
}

loadButton.addEventListener('click', () => {
    // Guardamos el peso de la barra elegida
    const emptyBarbellWeight = Number(barbellSelect.value)
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
    renderResult(loadingResult)
})

