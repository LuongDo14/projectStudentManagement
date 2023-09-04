document.getElementById("btnCourseManagement").addEventListener("click", function () {
    window.location.href = "course_page.html";
})
document.getElementById("btnAccountManagement").addEventListener("click", function () {
    window.location.href = "account_page.html";
})
document.getElementById("btnClassManagement").addEventListener("click", function () {
    window.location.href = "class_page.html";
})
document.getElementById("btnStudentManagement").addEventListener("click", function () {
    window.location.href = "student_page.html";
})
document.getElementById("btnControlManagement").addEventListener("click", function () {
    window.location.href = "home_page.html";
})
let btnlogout = JSON.parse(localStorage.getItem("studentManagement")) || [];
document.getElementById("btnLogout").addEventListener("click", function () {
    //Xử lý logout
    //1. Xóa item có tên userLogin trong localStorage
    localStorage.removeItem("userLogin");
    //2. Điều hướng về trang login
    window.location.href = "login_page.html";
})
function openNav() {
    document.getElementById("side_bar").style.width = "300px";
    document.getElementById("main").style.marginLeft = "300px";
  }
  
  function closeNav() {
    document.getElementById("side_bar").style.width = "0";
    document.getElementById("main").style.marginLeft= "0";
  }

let studentManagement = JSON.parse(localStorage.getItem("studentManagement")) || [];
  // Thêm dữ liệu để test

let currentPage = 1;
let recordsPerPage = 4 ;
let action = "Create";
function renderData(page, studentManagement) {
    // 1. Lấy studentManagement từ localStorage 
    // Trường hợp trong localStorage chưa có key là studentManagement -> khởi tạo studentManagement = []
    // let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Validate page
    let pageMax = getTotalPage(studentManagement);
    if (page < 1) {
        page = 1;
    }
    if (page > pageMax) {
        page = pageMax;
    }
    // 3. Render dữ liệu lên table ở trang page
    // 3.1. truy cập vào phần tử tbody có id là content
    let content = document.getElementById("content");
    content.innerHTML = "";
    // 3.2. Tính toán render dữ liệu lên table từ phần tử nào đến phần tử nào
    let indexMinOnPage = (page - 1) * recordsPerPage;
    let indexMaxOnPage;
    if (page * recordsPerPage > studentManagement.length) {
        indexMaxOnPage = studentManagement.length;
    } else {
        indexMaxOnPage = page * recordsPerPage;
    }
    // 3.3. Render dữ liệu với indexMinOnPage<=index<indexMaxOnPage
    for (let index = indexMinOnPage; index < indexMaxOnPage; index++) {
        content.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${studentManagement[index].studentIdId}</td>
                <td>${studentManagement[index].studentName}</td>
                <td>${studentManagement[index].yead}</td>
                <td>${studentManagement[index].address}</td>
                <td>${studentManagement[index].email}</td>
                <td>${studentManagement[index].phone}</td>
                <td>${studentManagement[index].sex}</td>
                <td>${studentManagement[index].status}</td>

                <td>
                    <button onclick=initEdit('${studentManagement[index].studentId}')>Edit</button>
                    <button onclick=deleteCatalog('${studentManagement[index].studentId}')>Delete</button>
                </td>
            </tr>
        `
    }
    //3.4. Render ra các trang
    let listPages = document.getElementById("listPages");
    listPages.innerHTML = "";
    for (let i = 1; i <= pageMax; i++) {
        listPages.innerHTML += `<li><a href="javascript:clickPage('${i}')">${i}</a></li>`;
    }
    // 3.5. Ẩn hiện Preview và Next
    let preview = document.getElementById("preview");
    let next = document.getElementById("next");
    if (currentPage == 1) {
        preview.style.visibility = "hidden";
    } else {
        preview.style.visibility = "visible";
    }
    if (currentPage == pageMax) {
        next.style.visibility = "hidden";
    } else {
        next.style.visibility = "visible";
    }
}
// Hàm tính tổng số trang trên tổng dữ liệu
function getTotalPage(studentManagement) {
    return Math.ceil(studentManagement.length / recordsPerPage);
}
// Hàm render dữ liệu theo trang khi click vào các trang
function clickPage(page) {
    currentPage = page;
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    renderData(page, studentManagement);
}
// Hàm previewPage
function previewPage() {
    currentPage--;
    // render lại dữ liệu lên table
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    renderData(currentPage, studentManagement);
}
// Hàm nextPage
function nextPage() {
    currentPage++;
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    renderData(currentPage, studentManagement);
}
let btnSave = document.getElementById("btnSave");
btnSave.addEventListener("click", function (event) {
    // Chặn sự kiện mặc định submit form
    event.preventDefault();
    if (action == "Create") {
        createCatalog();
    } else {
        updateCatalog();
    }
})
// Hàm thêm mới một danh mục
function createCatalog() {
    // 1. lấy dữ liệu studentManagement từ localStorage
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy dữ liệu trên form nhập và đưa vào đối tượng newCatalog
    let newCatalog = getDataForm();
    // 3. Thêm newCatalog vào đầu danh sách
    studentManagement.unshift(newCatalog);
    // 4. set studentManagement vào localStorage
    localStorage.setItem("studentManagement", JSON.stringify(studentManagement));
    // 5. renderData ở trang 1
    renderData(1, studentManagement);
    // 6. reset Form
    resetForm();

}
// Hàm lấy dữ liệu trên inputForm
function getDataForm() {
    let studentId = document.getElementById("studentId").value;
    let studentName = document.getElementById("studentName").value;
    let year = document.getElementById("year").value;
    let address = document.getElementById("address").value;
    let email = document.getElementById("email").value;
    let phone = document.getElementById("phone").value;
    let sex = document.querySelector("input[type='radio']:checked").value;
    let status = document.getElementById("status").value;
    let catalog = { studentId, studentName, year, address, email , phone , sex , status };
    return catalog;
}
// Hàm resetForm
function resetForm() {
    document.getElementById("studentId").value = "";
    document.getElementById("studentName").value = "";
    document.getElementById("year").value = "";
    document.getElementById("address").value = "";
    document.getElementById("email").value = "";
    document.getElementById("phone").value = "";
    document.getElementById("nam").checked = true;
    document.getElementById("status").value = "";
}
// Hàm hiển thị thông tin danh mục cần cập nhật lên Input Form
function initEdit(studentId) {
    // 1. Lấy studentManagement từ localStorage
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy thông tin danh mục cần cập nhật
    let index = getCatalogById(studentManagement, studentId);
    // 3. Hiển thị thông tin danh mục cần cập nhật lên Input Form
    document.getElementById("studentId").value = studentManagement[index].studentId;
    document.getElementById("studentId").readOnly = true;
    document.getElementById("studentName").value = studentManagement[index].studentName;
    document.getElementById("year").value = studentManagement[index].year.getFullYear();
    document.getElementById("address").value = studentManagement[index].address;
    if (studentManagement[index].sex == "nam") {
        document.getElementById("Nam").checked = true;
    } else {
        document.getElementById("Nu").checked = true;
    }
    if (studentManagement[index].sex == "Đang học") {
        document.getElementById("Đang học").value = "Đang học";
    } else if(studentManagement[index].sex == "Chờ lớp"){
        document.getElementById("Chờ lớp").value = "Chờ lớp";
    } else if(studentManagement[index].sex == "Bảo lưu"){
        document.getElementById("Bảo lưu").value = "Bảo lưu";
    } else if(studentManagement[index].sex == "Dình chỉ"){
        document.getElementById("Dình chỉ").value = "Đình chỉ";
    } else {
        document.getElementById("Tốt nghiệp").value = "Tốt nghiẹp";
    }
    // 4. Đặt lại cờ
    action = "Edit";
}
// Hàm lấy thông tin danh mục theo mã danh mục
function getCatalogById(studentManagement, studentId) {
    for (let index = 0; index < studentManagement.length; index++) {
        if (studentManagement[index].studentId == studentId) {
            return index;
        }
    }
    return -1;
}
// Hàm cập nhật danh mục
function updateCatalog() {
    // 1. Lấy studentManagement từ localStorage
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy thông tin danh mục sản phẩm từ Input Form
    let updateCatalog = getDataForm();
    // 3. Cập nhật updateCatalog trong studentManagement
    // 3.1. Lấy chỉ số phần tử cần cập nhật
    let index = getCatalogById(studentManagement, updateCatalog.studentId);
    // 3.2. Cập nhật
    if (index > -1) {
        studentManagement[index] = updateCatalog;
    }
    // 4. set studentManagement vào localStorage
    localStorage.setItem("studentManagement", JSON.stringify(studentManagement));
    // 5. đặt lại cờ action
    action = "Create";
    // 6. resetForm
    resetForm();
    // 7. Đặt lại studentId readOnly
    document.getElementById("studentId").readOnly = false;
    // 8. renderData table
    renderData(1, studentManagement);
}
// Hàm xóa danh mục sản phẩm
function deleteCatalog(studentId) {
    // 1. Lấy dữ liệu studentManagement từ localStorage
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Xóa catalog trong studentManagement theo studentId
    let index = getCatalogById(studentManagement, studentId);
    studentManagement.splice(index, 1);
    // 3. set studentManagement vào localStorage
    localStorage.setItem("studentManagement", JSON.stringify(studentManagement));
    // 4. render Data
    renderData(1, studentManagement);
}
let btnSearch = document.getElementById("btnSearch");

btnSearch.addEventListener("click", function (event) {
    event.preventDefault();
    // 1. Lấy studentManagement từ localStorage
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy dữ liệu nhập trên ô tìm kiếm
    let catalogNameSearch = document.getElementById("catalogNameSearch").value;
    // 3. tìm các danh mục có tên chứa catalogNameSearch
    // Tìm hiểu về hàm filter
    let listCatalogSearch = studentManagement.filter(catalog => catalog.studentName.includes(catalogNameSearch));
    // 4. render data
    renderData(1, listCatalogSearch);
})
// Hàm sắp xếp danh mục
function handSortCatalog() {
    // 1. Lấy tiêu chí sắp xếp
    let sortTarget = document.getElementById("sort").value;
    // 2. Lấy studentManagement từ localStorage
    let studentManagement = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 3. Sắp xếp theo các tiêu chí
    switch (sortTarget) {
        case "catalogNameASC":
            // sắp xếp theo tên danh mục tăng dần: sử dụng hàm sort (tìm hiểu thêm)
            studentManagement.sort((a, b) => (a.studentName > b.studentName) ? 1 : (a.studentName < b.studentName) ? -1 : 0);
            break;
        case "catalogNameDESC":
            // Sắp xếp theo tên danh mục giảm dần
            studentManagement.sort((a, b) => (a.studentName > b.studentName) ? -1 : (a.studentName < b.studentName) ? 1 : 0);
            break;
        case "priorityASC":
            // Sắp xếp theo độ ưu tiên tăng dần
            studentManagement.sort((a, b) => a.year - b.year);
            break;
        case "priorityDESC":
            // Sắp xếp theo độ ưu tiên giảm dần
            studentManagement.sort((a, b) => b.year - a.year);
            break;
    }
    // 4. set vào trong localStorage
    localStorage.setItem("studentManagement", JSON.stringify(studentManagement));
    // 5. render Data
    renderData(1, studentManagement);
}
let listCatalogOnload = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
document.onload = renderData(1, listCatalogOnload);