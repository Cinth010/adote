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
//Variável para capturar URL da Imagem
var pet_image_url = ''
var pet_qtd_database = 0

// VALIANDANDO FORMULÁRIO
const isValidFields = () => {
  return document.getElementById('form_pet').reportValidity()
}

//LIMPAR CAMPOS DO FORMULÁRIO
const cleanFields = () => {
  const fields = document.querySelectorAll('.input-pet')
  fields.forEach(field => (field.value = ''))
}

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
    const index = document.getElementById('name_pet').dataset.index
    console.log('estou criando', index)
    if (index == 'new') {
      createDataBasePets(pet)
      updateAnimals()
      cleanFields()
      closeModal()
      pet_qtd_database++
    } else {
      console.log('estou editando', index)
      updatePet(index, pet)
      updateAnimals()
      closeModal()
      document.location.reload(true)
    }
  }
}

// APRESENTANDO O PET EM FORMATO DE DIV
const creatPetItem = (pet, index) => {
  const newPetItem = document.createElement('th')
  newPetItem.innerHTML = `
  <th>
  <div class="pet-info">
    <img id="foto" src="${pet.foto}" class="photo-pet" />
    <h4>${pet.nome}</h4>
    <p>
      ${pet.descricao}
    </p>
    <p><span>Responsável:</span> ${pet.responsavel}</p>
    <a class="contato" href="https://wa.me/${pet.telefoneResponsável}">Entre em contato</a>
    
    <div style="display: flex; flex-direction=row; gap: 20px; font-size:14px; margin-inline: auto;">  
    <button  class= "edit" id="edit ${index}"> Editar </button>
    <button  class= "delete" id="delete ${index}" > Excluir  </button>
    </div>
   
  </div>
</th>
  `
  document.querySelector('.infos').appendChild(newPetItem)
}

//NOPETS
const noPets = pet_qtd_database => {
  if (pet_qtd_database === 0) {
    const info_pets = document.createElement('h2')
    info_pets.innerHTML = `<h2> Nnehum pet Cadastrado</h2>`
    document.getElementById('title').appendChild(info_pets)
  }
}

//limpar divs
const clearTable = () => {
  const colums = document.querySelectorAll('#tableInfo>tbody>tr th')
  colums.forEach(colum => colum.parentNode.removeChild(colum))
}

//ATUALIZANDO DIV
function updateAnimals() {
  const dataBasePets = readPet()
  clearTable()
  dataBasePets.forEach(creatPetItem)
}
console.log(pet_qtd_database)
//PREENCHE CAMPOS AO EDITAR INFORMAÇÕES
const fillFields = pet => {
  document.getElementById('name_pet').value = pet.nome
  document.getElementById('description').value = pet.descricao
  document.getElementById('guardian_name').value = pet.responsavel
  document.getElementById('guardian_contact').value = pet.telefoneResponsável
  document.getElementById('name_pet').dataset.index = pet.index
}

//EDITAR INFORMAÇÕES DO PET
const editPet = index => {
  const pet = readPet()[index]
  pet.index = index
  fillFields(pet)
  openModal()
}

//FUNÇÕES PARA EDITAR E EXCLUIR PET
const editDeletePet = event => {
  if (event.target.type == 'submit') {
    const [action, index] = event.target.id.split(' ')
    if (action == 'edit') {
      editPet(index)
    } else {
      const pet = readPet()[index]
      const response = confirm(
        `Deseja realmente exluir o pet ${pet.nome}  da lista de adoção?`
      )
      if (response) {
        deletePet(index)
        updateAnimals()
        pet_qtd_database - 1
      }
    }
  }
}

updateAnimals()

//EVENTOS
const addPet = document.getElementById('savePet')
addPet.addEventListener('click', savePetData)
addPet.addEventListener('click', updateAnimals)
document.addEventListener('DOMContentLoaded', noPets())

document
  .querySelector('#tableInfo> tbody')
  .addEventListener('click', editDeletePet)
//MODAL
// Get the modal
var modal = document.getElementById('myModal')

// Get the button that opens the modal
var btn = document.getElementById('myBtn')

// Get the <span> element that closes the modal
var span = document.getElementsByClassName('close')[0]

// When the user clicks on the button, open the modal

const openModal = () => {
  modal.style.display = 'block'
}

const closeModal = () => {
  modal.style.display = 'none'
}

btn.onclick = function () {
  openModal()
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  closeModal()
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = 'none'
  }
}

//CAPUTURANDO INFORMAÇÕES DA IMAGEM
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
