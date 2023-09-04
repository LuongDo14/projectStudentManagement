
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
function openNav() {
    document.getElementById("side_bar").style.width = "300px";
    document.getElementById("main").style.marginLeft = "300px";
}

function closeNav() {
    document.getElementById("side_bar").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
}
let btnlogout = JSON.parse(localStorage.getItem("studentManagement")) || [];
document.getElementById("btnLogout").addEventListener("click", function () {
    //Xử lý logout
    //1. Xóa item có tên userLogin trong localStorage
    localStorage.removeItem("userLogin");
    //2. Điều hướng về trang login
    window.location.href = "login_page.html";
})

let currentPage = 1;
let recordsPerPage = 4;
let action = "Create";
function renderData(page, arrCourse) {
    // 1. Lấy arrCourse từ localStorage 
   
    // Trường hợp trong localStorage chưa có key là arrCourse -> khởi tạo arrCourse = []
    // let arrCourse = localStorage.getItem("arrCourse") ? JSON.parse(localStorage.getItem("arrCourse")) : [];
    // 2. Validate page
    let pageMax = getTotalPage(arrCourse);
    if (page < 1) {
        page = 1;
    }
    if (page > pageMax) {
        page = pageMax;
    }
    // 3. Render dữ liệu lên table ở trang page

    // 3.1. truy cập vào phần tử tbody có id là arrCourse

    let listCourse = document.getElementById("listCourse");
    listCourse.innerHTML = "";
    
    // 3.2. Tính toán render dữ liệu lên table từ phần tử nào đến phần tử nào
    let indexMinOnPage = (page - 1) * recordsPerPage;
    let indexMaxOnPage;
    
    if (page * recordsPerPage > arrCourse.length) {
        indexMaxOnPage = arrCourse.length;
    } else {
        indexMaxOnPage = page * recordsPerPage;
    }
    
    // 3.3. Render dữ liệu với indexMinOnPage <= index < indexMaxOnPage
    for (let index = indexMinOnPage; index < indexMaxOnPage; index++) {
        let course = arrCourse[index];
    
        listCourse.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${course.courseId}</td>
                <td>${course.courseName}</td>
                <td>${course.courseTime}</td>
                <td>${course.status ? "Hoạt động" : "Không hoạt động"}</td>
                <td>
                <button onclick=updateCourse class="fa-solid fa-pen-to-square" data-bs-toggle="modal" data-bs-target="#updateCourse" ></i>
                <button onclick=deleteCourse class="fa-solid fa-trash" ></i>
                </td>
            </tr>
        `;
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
function getTotalPage(arrCourse) {
    return Math.ceil(arrCourse.length / recordsPerPage);
}
// Hàm render dữ liệu theo trang khi click vào các trang
function clickPage(page) {
    currentPage = page;
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    renderData(page, arrCourse);
}
// Hàm previewPage
function previewPage() {
    currentPage--;
    // render lại dữ liệu lên table
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    renderData(currentPage, arrCourse);
}
// Hàm nextPage
function nextPage() {
    currentPage++;
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    renderData(currentPage, arrCourse);
}
let btnSave = document.getElementById("btnCreateCourse");
btnSave.addEventListener("click", function (event) {
    // Chặn sự kiện mặc định submit form
    event.preventDefault();
    if (action == "Create") {
        createCatalog();
    }
})
let btnUpdate = document.getElementById("btnUpdateCourse");
btnUpdate.addEventListener("click", function (event) {
    // Chặn sự kiện mặc định submit form
    event.preventDefault();
    if (action == "Update") {
        updateCourse();
    }
})
// Hàm thêm mới một danh mục
function getCourseForm() {
    let courseId = document.getElementById("courseId").value;
    let courseName = document.getElementById("courseName").value;
    let courseTime = document.getElementById("courseTime").value;
    let status = document.getElementById("active").checked = true;
    let course = { courseId, courseName, courseTime, status };
    return course;
}
function createCatalog() {
    // 1. lấy dữ liệu arrCourse từ localStorage
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy dữ liệu trên form nhập và đưa vào đối tượng newCourse
    let newCourse = getCourseForm();
    // 3. Thêm newCourse vào đầu danh sách
    arrCourse.unshift(newCourse);
    // 4. set arrCourse vào localStorage
    localStorage.setItem("studentManagement", JSON.stringify(arrCourse));
    // 5. renderData ở trang 1
    renderData(1, arrCourse);
    // 6. reset Form
    resetForm();

}
// Hàm lấy dữ liệu trên inputForm
var newCourseModal = new bootstrap.Modal(document.getElementById('newCourse'), {
    keyboard: false
})
document.getElementById("btnCreateCourse").addEventListener("click", function () {
    //1. Lấy dữ liệu arrCourse từ localStorage
    let arrCourse = JSON.parse(localStorage.getItem("studentManagement")) || [];
    //2. Lấy dữ liệu trên modal
    let courseId = document.getElementById("courseId").value;
    let courseName = document.getElementById("courseName").value;
    let courseTime = document.getElementById("courseTime").value;
    let status = document.querySelector("input[type='radio']:checked").value == "true" ? true : false;
    let newCourse = { courseId, courseName, courseTime, status, arrClass: [] };
    //3. push dư liệu thêm mới vào arrCourse
    arrCourse.push(newCourse);
    //4. Đẩy arrCourse vào localStorage
    localStorage.setItem("studentManagement", JSON.stringify(arrCourse));
    //5. Đóng modal
    document.getElementById("courseId").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("courseTime").value = "";
    document.getElementById("active").checked = true;
    newCourseModal.hide();
    //6. render lại dữ liệu
    renderData();

})

// Hàm resetForm
function resetForm() {
    document.getElementById("courseId").value = "";
    document.getElementById("courseName").value = "";
    document.getElementById("courseTime").value = "";
    document.getElementById("active").checked = true;
}
var updateCourseModal = new bootstrap.Modal(document.getElementById('updateCourse'), {
    keyboard: false
})
// Hàm hiển thị thông tin danh mục cần cập nhật lên Input Form
function initEdit(courseId) {
    // 1. Lấy arrCourse từ localStorage
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy thông tin danh mục cần cập nhật
    let index = getCatalogById(arrCourse, courseId);
    // 3. Hiển thị thông tin danh mục cần cập nhật lên Input Form
    document.getElementById("courseId").value = arrCourse[index].courseId;
    document.getElementById("courseName").value = arrCourse[index].courseName;
    document.getElementById("courseTime").value = arrCourse[index].courseTime;
    if (arrCourse[index].active == "active") {
        document.getElementById("active").checked = true;
    } else {
        document.getElementById("inActive").checked = true;
    }
    // 4. Đặt lại cờ
    action = "Update";
}
// Hàm lấy thông tin danh mục theo mã danh mục
function getCatalogById(arrCourse, courseId) {
    for (let index = 0; index < arrCourse.length; index++) {
        if (arrCourse[index].courseId == courseId) {
            return index;
        }
    }
    return -1;
}
// Hàm cập nhật danh mục

document.getElementById("btnUpdateCourse").addEventListener("click", function () {
    // 1. Lấy arrCourse từ localStorage
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy thông tin danh mục sản phẩm từ Input Form
    let updateCourse = getCourseForm();
    // 3. Cập nhật updateCourse trong arrCourse
    // 3.1. Lấy chỉ số phần tử cần cập nhật
    let index = getCatalogById(arrCourse, updateCourse.courseId);
    // 3.2. Cập nhật
    if (index > -1) {
        arrCourse[index] = updateCourse;
    }
    // 4. set arrCourse vào localStorage
    localStorage.setItem("studentManagement", JSON.stringify(arrCourse));
    // 5. đặt lại cờ action
    action = "Create";
    // 6. resetForm
    resetForm();
    // 7. Đặt lại courseId readOnly
    document.getElementById("btnUpdateCourse").readOnly = false;
    // 8. renderData table
    renderData(1, arrCourse);
})
// Hàm xóa danh mục sản phẩm
function deleteCourse(courseId) {
    // 1. Lấy dữ liệu arrCourse từ localStorage
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Xóa catalog trong arrCourse theo courseId
    let index = getCatalogById(arrCourse, courseId);
    arrCourse.splice(index, 1);
    // 3. set arrCourse vào localStorage
    localStorage.setItem("studenManagement", JSON.stringify(arrCourse));
    // 4. render Data
    renderData(1, arrCourse);
}
let btnSearch = document.getElementById("btnSearchCourseName");

btnSearch.addEventListener("click", function (event) {
    event.preventDefault();
    // 1. Lấy arrCourse từ localStorage
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 2. Lấy dữ liệu nhập trên ô tìm kiếm
    let courseNameSearch = document.getElementById("searchCourseName").value;
    // 3. tìm các danh mục có tên chứa courseNameSearch
    // Tìm hiểu về hàm filter
    let listCourseSearch = arrCourse.filter(course => course.courseName.includes(courseNameSearch));
    // 4. render data
    renderData(1, listCourseSearch);
})
// Hàm sắp xếp danh mục
function handSortCatalog() {
    // 1. Lấy tiêu chí sắp xếp
    let sortTarget = document.getElementById("sort").value;
    // 2. Lấy arrCourse từ localStorage
    let arrCourse = localStorage.getItem("studentManagement") ? JSON.parse(localStorage.getItem("studentManagement")) : [];
    // 3. Sắp xếp theo các tiêu chí
    switch (sortTarget) {
        case "courseNameABC":
            // sắp xếp theo tên danh mục tăng dần: sử dụng hàm sort (tìm hiểu thêm)
            arrCourse.sort((a, b) => (a.courseName > b.courseName) ? 1 : (a.courseName < b.courseName) ? -1 : 0);
            break;
        case "courseNameDESC":
            // Sắp xếp theo tên danh mục giảm dần
            arrCourse.sort((a, b) => (a.courseName > b.courseName) ? -1 : (a.courseName < b.courseName) ? 1 : 0);
            break;
        case "priorityASC":
            // Sắp xếp theo độ ưu tiên tăng dần
            arrCourse.sort((a, b) => a.courseTime - b.courseTime);
            break;
        case "priorityDESC":
            // Sắp xếp theo độ ưu tiên giảm dần
            arrCourse.sort((a, b) => b.courseTime - a.courseTime);
            break;
    }
    // 4. set vào trong localStorage
    localStorage.setItem("studenManagement", JSON.stringify(arrCourse));
    // 5. render Data
    renderData(1, arrCourse);
}

document.onload = renderData;
