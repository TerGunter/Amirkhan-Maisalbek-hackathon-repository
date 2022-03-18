const API = "http://localhost:8001/product";

let inpName = document.querySelector("#name");
let inpSurname = document.querySelector("#surname");
let inpNumber = document.querySelector("#number");
let btnSave = document.querySelector("#btn-save");
let modal = document.querySelector("#exampleModal");
let list = document.querySelector("#list");
let inpSkills = document.querySelector("#skills");
let inpEmail = document.querySelector("#email");
// edit part
let editInpName = document.querySelector("#edit-name");
let editInpSurname = document.querySelector("#edit-surname");
let editInpNumber = document.querySelector("#edit-number");
let editBtnSave = document.querySelector("#edit-btn-save");
let editModal = document.querySelector("#editModal");
let editInpSkills = document.querySelector("#edit-skills");
let editInpEmail = document.querySelector("#edit-email");
// search
let searchInp = document.querySelector("#search");
let searchVal = "";
// pagination
let paginationList = document.querySelector("#pagination-list");
let prev = document.querySelector("#prev");
let next = document.querySelector("#next");
let currentPage = 1;
let pageCount = 1;
// todo ADD NEW PRODUCT
btnSave.addEventListener("click", () => {
  let name = inpName.value;
  let surname = inpSurname.value;
  let number = inpNumber.value;
  let skills = inpSkills.value;
  let email = inpEmail.value;

  if (!name || !surname || !number || !skills || !email) {
    alert("Заполните поля!");
    return;
  }

  let obj = {
    name: name,
    surname: surname,
    number: number,
    skills: skills,
    email: email,
  };
  postNewProduct(obj);
});

// TODO ADD REQUEST
function postNewProduct(newProduct) {
  // console.log(newProduct)

  fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(newProduct),
  })
    .then(() => {
      modal.click();
      inpName.value = "";
      inpSurname.value = "";
      inpNumber.value = "";
      inpSkills.value = "";
      inpEmail.value = "";
      render();
    })
    .catch((err) => {
      console.log(err);
    });
}

// TODO READ
function render() {
  fetch(`${API}?q=${searchVal}&_limit=4&_page=${currentPage}`)
    .then((res) => res.json())
    .then((data) => {
      // console.log(data);
      list.innerHTML = "";
      data.forEach((item) => {
        let card = drawCard(item);
        list.innerHTML += card;
      });
      drawPagBtns();
    });
}
render();

function drawCard(obj) {
  // console.log(obj)
  return `
    <div class="card" style="width: 50%; background-color: lightgrey; margin-top: 25px;">
      <div  class="card-body">
        <h5 style="text-align: center;" class="card-name">${obj.name}</h5>
        <h5 style="text-align: center;" class="card-surname">${obj.surname}</h5>
        <h5 style="text-align: center;" class="card-number">${obj.number}</h5>
        <h5 style="text-align: center;" class="card-skills">${obj.skills}</h5>
        <h5 style="text-align: center;" class="card-email">${obj.email}</h5>
        <button style="width: 100%; margin-bottom: 10px" id="${obj.id}" class="btn btn-outline-danger btn-del">Delete</button>
        <button style="width: 100%" id="${obj.id}" class="btn btn-outline-dark btn-edit"

        data-bs-toggle="modal" data-bs-target="#editModal"

        >Edit</button>
      </div>
    </div>
  `;
}

// TODO DELETE
document.addEventListener("click", (e) => {
  // console.log(e.target);
  let arr = [...e.target.classList];
  if (arr.includes("btn-del")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    }).then((res) => {
      console.log(res);
      render();
    });
  }
});

// TODO EDIT
document.addEventListener("click", (e) => {
  // console.log(e.target);
  let arr = [...e.target.classList];
  if (arr.includes("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        editInpName.value = data.name;
        editInpSurname.value = data.surname;
        editInpNumber.value = data.number;
        editInpSkills.value = data.skills;
        editInpEmail.value = data.email;
        editBtnSave.setAttribute("id", data.id);
      });
  }
});

editBtnSave.addEventListener("click", () => {
  let name = editInpName.value;
  let surname = editInpSurname.value;
  let number = editInpNumber.value;
  let skills = editInpSkills.value;
  let email = editInpEmail.value;
  let obj = {
    name: name,
    surname: surname,
    number: number,
    skills: skills,
    email: email,
  };
  let answer = confirm("Are you sure");
  if (!answer) {
    return;
  }
  // console.log(obj);
  editProduct(obj, editBtnSave.id);
});

function editProduct(obj, editId) {
  console.log(obj, editId);
  fetch(`${API}/${editId}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  }).then(() => {
    editModal.click();
    render();
  });
}

searchInp.addEventListener("input", (e) => {
  searchVal = e.target.value;
  render();
});

// todo pagination
function drawPagBtns() {
  fetch(`${API}?q=${searchVal}`)
    .then((res) => res.json())
    .then((data) => {
      pageCount = Math.ceil(data.length / 4);
      paginationList.innerHTML = "";
      for (let i = 1; i <= pageCount; i++) {
        paginationList.innerHTML += `
      <li class="page-item ${i == currentPage ? "active" : null}">
      <a class="page-link page_number" href="#">${i}</a></li>
      `;
      }
    });
}
next.addEventListener("click", () => {
  if (currentPage >= pageCount) return;
  currentPage++;
  render();
});

prev.addEventListener("click", () => {
  if (currentPage <= 1) return;
  currentPage--;
  render();
});

document.addEventListener("click", (e) => {
  // console.log(e.target.classList);
  let classes = e.target.classList;
  if (classes.contains("page_number")) {
    // console.log(e.target.innerText);
    currentPage = e.target.innerText;
    render();
  }
});
