const sidebar = document.getElementById('sidebar')
const toggleMenu = document.getElementById('toggle-bar')
const closeMenu = document.getElementById('close-menu')

toggleMenu.addEventListener('click', () => {
    sidebar.classList.add('show')
})

closeMenu.addEventListener('click', () => {
    sidebar.classList.remove('show')
})


const fashionbar = document.getElementById('fashionbar')
const toggleFashionMenu = document.getElementById('fashion-toggle-bar')
const closeFashionMenu = document.getElementById('close-fashion-bar')


toggleFashionMenu.addEventListener('click', () => {
    fashionbar.classList.add('show')
})

closeFashionMenu.addEventListener('click', () => {
    fashionbar.classList.remove('show')
})



const accessoriesbar = document.getElementById('accessoriesbar')
const toggleAccessoriesMenu = document.getElementById('accessories-toggle-bar')
const closeAccessoriesMenu = document.getElementById('close-accessories-bar')

toggleAccessoriesMenu.addEventListener('click', () => {
    accessoriesbar.classList.add('show')
})

closeAccessoriesMenu.addEventListener('click', () => {
    accessoriesbar.classList.remove('show')
})


const explorebar = document.getElementById('explorebar')
const toggleExploreMenu = document.getElementById('explore-toggle-bar')
const closeExploreMenu = document.getElementById('close-explore-bar')

toggleExploreMenu.addEventListener('click', () => {
    explorebar.classList.add('show')
})

closeExploreMenu.addEventListener('click', () => {
    explorebar.classList.remove('show')
})



function showUserTable() {
    var tableContainer = document.getElementById("table-container");
    if (tableContainer.style.display === "none") {
      tableContainer.style.display = "block";
    } else {
      tableContainer.style.display = "none";
    }
  }


  function showOrderTable() {
    var orderContainer = document.getElementById("order-container");
    if (orderContainer.style.display === "none") {
      orderContainer.style.display = "block";
    } else {
      orderContainer.style.display = "none";
    }
  }
  
  

  function showProductForm() {
    var productForm = document.getElementById("productForm");
    if (productForm.style.display === "none") {
        productForm.style.display = "block";
    } else {
        productForm.style.display = "none";
    }
  }

  function displayProduct() {
    var displayProduct = document.getElementById("displayProduct");
    if (displayProduct.style.display === "none") {
        displayProduct.style.display = "block";
    } else {
        displayProduct.style.display = "none";
    }
  }
  

document.getElementById('contactForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    var formData = new FormData(event.target);
    
    console.log({
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message')
    });
    
    document.getElementById('contactForm').classList.add('hidden');
    document.getElementById('confirmation').classList.remove('hidden');
  });


  