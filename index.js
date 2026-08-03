const loadButton = document.getElementById('button')
const barbellSelect = document.getElementById('barbellWeightSelect')
const referenceWeightInput = document.getElementById('referenced-weight')
// const availablePlates = [45,35,25,15,10,5,2.5,2,1.5,1,0.5]
const resultSection = document.getElementById('resultsSection')
const availablePlates = [45,35,25,15,10,5,2.5]
const plateStyle = {
    45: {
        info: '45 lb',
        class: 'plate-blue'
    },
    35: {
        info: '35 lb',
        class: 'plate-yellow'
    },
    25: {
        info: '25 lb',
        class: 'plate-green'
    },
    15: {
        info: '15 lb',
        class: 'plate-black'
    },
    10: {
        info: '10 lb',
        class: 'plate-gray'
    },
    5: {
        info: '5 lb',
        class: 'plate-black',
        size: '30px',
    },
    2.5: {
        info: '2.5 lb',
        class: 'plate-black',
        size: '25px',
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
    // Devolvemos un objeto que contiene, el array de discos a usar, y el peso restante
    return{
        loadingArray,
        remainingWeight: sideWeight
    }
}

// Esta función recibe el valor de loadingArray, el cual contiene plateWeight y quantity
function populatePlateGrid(loadingArray){
    // Creamos el grid
    const platesGrid = document.createElement('div')
    platesGrid.classList.add('plates-grid')
    // Iteramos el objeto
    for (const plate of loadingArray){
        // Creamos una referencia para acceder facilmente al mapa de colores
        const style = plateStyle[plate.plateWeight]
        // Creamos el cuerpo del disco y se le asgina el color mediante el mapa
        const plateBody = document.createElement('div')
        plateBody.classList.add('plate', style.class)
        // Si el objeto tiene una medida en específico se lo asignamos
        if (style.size){
            plateBody.style.width = style.size
        }

        const plateCenter = document.createElement('div')
        plateCenter.classList.add('plate-center')
        plateBody.appendChild(plateCenter)

        const plateText = document.createElement('p')
        plateText.classList.add('plate-weight')
        plateText.textContent = style.info

        const plateQuantity = document.createElement('p')
        plateQuantity.classList.add('plate-quantity')
        plateQuantity.textContent = `×${plate.quantity}`
        // Agregamos los valores al grid en cada iteracion
        platesGrid.append(plateBody, plateText,plateQuantity)
    }
    // Devolvemos el elemento grid
    return platesGrid
}

function formatWeight (weight){
    return Number.isInteger(weight) ? weight : weight.toFixed(2)
}

function renderResult(loadingResult){
    const resultCard = document.createElement('div')
    resultCard.classList.add('result-card')

    //
    const cardHead = document.createElement('div')
    cardHead.classList.add('card-head')

    // const headerTitle = document.createElement('p')
    // headerTitle.classList.add('header-title')
    // headerTitle.textContent = 'PERCENTAGE'

    const headerNumber = document.createElement('p')
    headerNumber.classList.add('header-number')

    const spanNumber = document.createElement('span')
    spanNumber.classList.add('span-number')
    spanNumber.textContent = `${loadingResult.percentage}`

    const spanPercent = document.createElement('span')
    spanPercent.classList.add('span-percent')
    spanPercent.textContent = '%'

    const spanPr = document.createElement('span')
    spanPr.classList.add('span-pr')
    spanPr.textContent = `of ${loadingResult.referenceWeight} lb`
    headerNumber.append(spanNumber,spanPercent,spanPr)
    cardHead.append(headerNumber)

    resultCard.append(cardHead)

    //

    const cardBody = document.createElement('div')
    cardBody.classList.add('card-body')

    const bodyTitle = document.createElement('div')
    bodyTitle.classList.add('body-title')
    bodyTitle.textContent = 'Target Weight'

    const bodyWeight = document.createElement('div')
    bodyWeight.classList.add('body-weight')
    // bodyWeight.textContent = `${loadingResult.weightCalculation.targetWeight.toFixed(2)} lbs`
    bodyWeight.textContent = `${formatWeight(loadingResult.weightCalculation.targetWeight)} lbs`

    cardBody.append(bodyTitle, bodyWeight)
    resultCard.append(cardBody)

    //
    const cardPlates = document.createElement('div')
    cardPlates.classList.add('card-plates')

    const platesTitle = document.createElement('div')
    platesTitle.classList.add('plates-title')
    platesTitle.textContent = 'Plates per side'

    const platesContainer = document.createElement('div')
    platesContainer.classList.add('plates-container')

    const platesGrid = populatePlateGrid(loadingResult.platesCalculation.loadingArray)

    platesContainer.appendChild(platesGrid)

    if (loadingResult.platesCalculation.remainingWeight > 0.01){
        const cardFooter = document.createElement('div')
        cardFooter.classList.add('card-footer')

        const footerTitle = document.createElement('div')
        footerTitle.classList.add('footer-title')
        footerTitle.textContent = 'Remaining'

        const footerRemaining = document.createElement('div')
        footerRemaining.classList.add('footer-remaining')
        // footerRemaining.textContent = `${loadingResult.platesCalculation.remainingWeight.toFixed(2)} lb`
        footerRemaining.textContent = `${formatWeight(loadingResult.platesCalculation.remainingWeight)} lb`

        cardFooter.append(footerTitle,footerRemaining)
        platesContainer.append(cardFooter)
    }

    cardPlates.append(platesTitle,platesContainer)
    resultCard.append(cardPlates)


    resultSection.appendChild(resultCard)
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

