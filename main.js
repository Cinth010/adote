//PEGAR ITENS NO BANCO DE DADOS
const getLocalStorage = () =>
  JSON.parse(localStorage.getItem('data_base_pet')) ?? []

//INSERIR ITENS NO BANCO DE DADOS
const setLocalStorage = dataBasePets =>
  localStorage.setItem('data_base_pet', JSON.stringify(dataBasePets))

//CONSTROI UM PET
const createDataBasePets = pet => {
  const dataBasePets = getLocalStorage()
  dataBasePets.push(pet)
  setLocalStorage(dataBasePets)
}

//LER OS PETS NO BANCO DE DADOS
const readPet = () => getLocalStorage()

//ATUALIZA
const updatePet = (index, pet) => {
  const dataBasePets = readPet() // ler os pets no banco de dados
  dataBasePets[index] = pet // inserir o novo pet na posição do index
  setLocalStorage(dataBasePets) // atualizar  o novo pet no banco de dados
}

//DELETE PETS INSRINDO O INDEX E QUANTIDADE
const deletePet = index => {
  const dataBasePets = readPet()
  dataBasePets.splice(index, 1)
  setLocalStorage(dataBasePets)
}

//FUNCOES COM INTERAÇÃO
// VALIANDANDO FORMULÁRIO
const isValidFields = () => {
  return document.getElementById('form_pet').reportValidity()
}

//LIMPAR CAMPOS DO FORMULÁRIO
const cleanFields = () => {
  const fields = document.querySelectorAll('.input-pet')
  fields.forEach(field => (field.value = ''))
}

//CAPUTURANDO INFORMAÇÕES DA IMAGEM
var pet_image_url = ''

document.querySelector('#photo').addEventListener('change', function () {
  console.log(this.files)
  //PARA ARMAZENAR ESSES ARQUVIOS PRECISA CONVERTER ESSA ENTRADA EM UM DATA URL
  const reader = new FileReader()

  reader.addEventListener('load', () => {
    console.log(reader.result)
    pet_image_url = reader.result
    // ATRIBUINDO A DATA URL NA VARIÁVEL PET_IMAGE_URL
  })
  reader.readAsDataURL(this.files[0])
})

//SALVANDO INFORMAÇÕES DO FORMULÁRIO NO BANCO DE DADOS
const savePetData = () => {
  if (isValidFields()) {
    //criando um arquivo json
    const pet = {
      nome: document.getElementById('name_pet').value,
      foto: pet_image_url,
      descricao: document.getElementById('description').value,
      responsavel: document.getElementById('guardian_name').value,
      telefoneResponsável: document.getElementById('guardian_contact').value
    }
    createDataBasePets(pet)
    cleanFields()
  }
}

// APRESENTANDO O PET EM FORMATO DE DIV
const creatPetItem = pet => {
  const newPetItem = document.createElement('th')
  newPetItem.innerHTML = `
  <th>
  <div class="pet-info">
    <img id="foto" src="${pet.foto}" width="290px" height="316px" />
    <h4>${pet.nome}</h4>
    <p>
      ${pet.descricao}
    </p>
    <p><span>Responsável:</span> ${pet.responsavel}</p>
    <a class="contato" href="https://wa.me/${pet.telefoneResponsável}">Entre em contato</a>
  </div>
</th>
  `
  document.querySelector('.infos').appendChild(newPetItem)
}

//limpar divs
const clearDivs = () => {
  const div = document.querySelectorAll('#container item')
  div.forEach(div => div.parentNode.removeChild())
}

//ATUALIZANDO DIV
function updateAnimals() {
  const dataBasePets = readPet()

  dataBasePets.forEach(creatPetItem)
}

//EVENTOS
const addPet = document.getElementById('savePet')
addPet.addEventListener('click', savePetData)
addPet.addEventListener('click', updateAnimals)
