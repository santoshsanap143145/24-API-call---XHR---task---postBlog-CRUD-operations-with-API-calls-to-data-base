const cl = console.log;

const postForm = document.getElementById("postForm");
const titleControl = document.getElementById("title");
const contentControl = document.getElementById("content");
const userIdControl = document.getElementById("userId");
const submitBtn = document.getElementById("submitBtn");
const updateBtn = document.getElementById("updateBtn");
const postContainer = document.getElementById("postContainer");
const loader = document.getElementById("loader");

const BASE_URL = "https://jsonplaceholder.typicode.com/";
const POST_URL = `${BASE_URL}/posts`;

const snackBar = (msg, icon) => {
  swal.fire({
    title: msg,
    icon: icon,
    timer: 3000,
  });
};

const editOnclick = (ele) => {
  let EDIT_ID = ele.closest(".card").id;
  localStorage.setItem("EDIT_ID", EDIT_ID);
  let EDIT_URL = `${BASE_URL}/posts/${EDIT_ID}`;
  let xhr = new XMLHttpRequest();
  xhr.open("GET", EDIT_URL);
  xhr.send(null);
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let data = JSON.parse(xhr.response);
      cl(data);
      titleControl.value = data.title;
      contentControl.value = data.body;
      userIdControl.value = data.userId;
      submitBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");
    }
  };
};

const removeOnclick = (ele) => {
  Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
  }).then((result) => {
    if (result.isConfirmed) {
      let REMOVE_ID = ele.closest(".card").id;
      let REMOVE_URL = `${BASE_URL}/posts/${REMOVE_ID}`;
      let xhr = new XMLHttpRequest();
      xhr.open("DELETE", REMOVE_URL);
      xhr.send(null);
      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status <= 299) {
          ele.closest(".card").remove();
        }
      };
      Swal.fire({
        title: "Deleted!",
        text: "Your Post has been deleted.",
        icon: "success",
      });
    }
  });
};

const templatingPost = (arr) => {
  result = "";
  arr.forEach((ele) => {
    result += `
          <div class="card mb-5" id=${ele.id}>
            <div class="card-header">
              <h3 class="m-0">${ele.title}</h3>
            </div>
            <div class="card-body">
              <p class="m-0">${ele.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button
                class="btn btn-sm btn-outline-info"
                onclick="editOnclick(this)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                onclick="removeOnclick(this)"
              >
                Remove
              </button>
            </div>
          </div>`;
  });
  postContainer.innerHTML = result;
};

const fetchAllDAta = () => {
  loader.classList.remove("d-none");
  let xhr = new XMLHttpRequest();
  xhr.open("GET", POST_URL, true);
  xhr.send(null);
  xhr.onload = function () {
    try {
      if (xhr.status >= 200 && xhr.status <= 299) {
        let data = JSON.parse(xhr.response);
        templatingPost(data);
      } else {
        alert(`Error : ${xhr.status} !!!`);
      }
    } catch (err) {
      // client side error
    } finally {
      loader.classList.add("d-none");
    }
  };
};

fetchAllDAta();

const postOnSubmit = (eve) => {
  eve.preventDefault();
  let newPostObj = {
    title: titleControl.value,
    body: contentControl.value,
    userId: userIdControl.value,
  };
  postForm.reset()
  loader.classList.remove("d-none");
  let xhr = new XMLHttpRequest();
  xhr.open("POST", POST_URL);
  xhr.send(JSON.stringify(newPostObj));
  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let data = JSON.parse(xhr.response);
      cl(data);
      let card = document.createElement("div");
      card.className = `card mb-5`;
      card.id = data.id;
      card.innerHTML = `
            <div class="card-header">
              <h3 class="m-0">${newPostObj.title}</h3>
            </div>
            <div class="card-body">
              <p class="m-0">${newPostObj.body}</p>
            </div>
            <div class="card-footer d-flex justify-content-between">
              <button
                class="btn btn-sm btn-outline-info"
                onclick="editOnclick(this)"
              >
                Edit
              </button>
              <button
                class="btn btn-sm btn-outline-danger"
                onclick="removeOnclick(this)"
              >
                Remove
              </button>
            </div>`;
      postContainer.append(card);
      loader.classList.add("d-none");
      snackBar(`New Post Created Successfully !!!`, "success");
    } else {
      snackBar(xhr.response, "error");
    }
  };
};

const updateOnClick = () => {
  let updatedPostObj = {
    title: titleControl.value,
    body: contentControl.value,
    userId: userIdControl.value,
  };
  let UPDATE_ID = localStorage.getItem("EDIT_ID");
  let UPDATE_URL = `${BASE_URL}/posts/${UPDATE_ID}`;
  loader.classList.remove("d-none");
  let xhr = new XMLHttpRequest();
  xhr.open("PATCH", UPDATE_URL);
  xhr.send(JSON.stringify(updatedPostObj));

  xhr.onload = function () {
    if (xhr.status >= 200 && xhr.status <= 299) {
      let data = xhr.response;
      cl(data);
      let card = document.getElementById(UPDATE_ID).children;
      card[0].innerHTML = `<h3 class="m-0">${updatedPostObj.title}</h3>`;
      card[1].innerHTML = `<p class="m-0">${updatedPostObj.body}</p>`;
      postForm.reset();
      submitBtn.classList.add("d-none");
      updateBtn.classList.remove("d-none");
      loader.classList.add("d-none");
      snackBar("Post is Updated Successfully !!!", "success");
    } else {
      cl(xhr.response, "error");
    }
  };
};

postForm.addEventListener("submit", postOnSubmit);
updateBtn.addEventListener("click", updateOnClick);
