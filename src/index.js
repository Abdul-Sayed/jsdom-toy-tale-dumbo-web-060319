
// ---------------------------Define all global variables

const url = "http://localhost:3000/toys";
const toyForm = document.querySelector('.container');
const addToyForm = document.querySelector('.add-toy-form');
const addBtn = document.querySelector('#new-toy-btn');
const toyCollection = document.querySelector('#toy-collection');
const addButton = document.querySelector('#new-toy-btn');



// ---------------------Call Fetches 

// GET Fetch
fetchToys()

// POST Fetch
let addToy = false
addBtn.addEventListener('click', () => {
  // hide & seek with the form
  addToy = !addToy
  if (addToy) {
    toyForm.style.display = 'block'
    toyForm.addEventListener('submit', event => {
      event.preventDefault();
      console.log(event.target)
      postToy(event.target)
      event.target.reset()
    })
  } else {
    toyForm.style.display = 'none'
  }
})



// ----------------------Fetch the API and Get all the Toys
const fetchToys = () => {
  fetch(url)
    .then(resp => resp.json())
    .then(toyData => renderToys(toyData))
    .catch(error => {
      console.log(error.message);
    });
}

// --------------------Display all the Toys to the Index
renderToys = function (toys) {
  console.log(toys)
  toyCollection.innerHTML = ""
  toys.forEach(toy => {
    toyCollection.innerHTML +=
      `<div class="card" data-id=${toy.id}>
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn">Like</button>
          <button class="delete-btn">Delete</button>
      </div>`
  })
}



// ---------------Fetch the API and POST A new Toy

const postToy = (form) => {
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: "application/json"
    },
    body: JSON.stringify({
      name: form.name.value,
      image: form.image.value,
      likes: 0
    })
  })
    .then(resp => resp.json())
    .then(toyData => {
      let newToy = renderOneToy(toyData);
      toyCollection.append(newToy)

    })
    .catch(error => {
      console.log(error.message);
    });
}

// --------------------Display ONE Toy to the Index
renderOneToy = function (toy) {
  console.log(toy)
  toyCollection.innerHTML +=
    `<div class="card" data-id=${toy.id}>
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn">Like</button>
          <button class="delete-btn">Delete</button>
      </div>`
}



// --------------------Update (PATCH) Likes & Delete Card

toyCollection.addEventListener('click', event => {
  console.log(event.target)
  if (event.target.classList.contains("like-btn")) {

    let id = event.target.parentElement.dataset.id
    let likeParagraph = event.target.previousElementSibling
    let likeCount = parseInt(likeParagraph.innerText.match(/\d+/)[0])
    likeParagraph.textContent = `${likeCount + 1} Likes`
    console.log("like clicked")

    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'PATCH',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: likeCount
      })
    })
      .then(resp => resp.json())
      .then(data => console.log(data))
      .catch(err => console.log(err.message))

  } else if (event.target.classList.contains("delete-btn")) {
    console.log(event.target.parentElement)
    let id = event.target.parentElement.dataset.id;

    fetch(`http://localhost:3000/toys/${id}`, {
      method: 'DELETE'
    })
      .then(resp => resp.json())
      .then(event.target.parentElement.remove())
      .catch(err => console.log(err.message))

  }

})








