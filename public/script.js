console.log("Is Script File Loading");
const RESPONSE_DONE = 4;
const STATUS_OK = 200;
const TODOS_LIST_ID = "todos_list_div";
const NEW_TODO_INPUT_ID = "new_todo_input";
const active_list = "active_list";
const completed_list = "completed_list";
const deleted_list = "deleted_list"

// IF you want to run a function everytime the page loads
// window.onload OR document.onload
// HW : Differences : Subtle difference when this method is called
// window.onload - more widely supported
//
window.onload = getTodosAJAX();
// window.onload=completeTodoAJAX();
// addTodos
// id = "todos_list_div"
// todos_data_jgson =
// parent = div
function addTodoElements(id, todos_data_json){

    var todos = JSON.parse(todos_data_json);

    var parent = document.getElementById(id);

 //   else{
    // HW : Figure out "encouraged" view of doing this
    parent.innerHTML = "";

  //  if(id==active_list||id==TODOS_LIST_ID) {
        var active = document.getElementById(active_list);
        active.innerHTML = "";
    //}
    //else if(id==completed_list) {
        var complete = document.getElementById(completed_list);
        complete.innerHTML = "";
    //}
    //else {
        var deleted = document.getElementById(deleted_list);
        deleted.innerHTML = "";
    //}
    if (parent){

        // todos { id : {todo object}, id : {todo:object} ..}
        Object.keys(todos).forEach(

            function(key) {
                var todo_element = createTodoElement(key, todos[key]);
                if(todos[key].status == "ACTIVE"){

                    active.appendChild(todo_element);}
                if(todos[key].status == "COMPLETE"){

                    complete.appendChild(todo_element);}
                if(todos[key].status == "DELETED"){

                    deleted.appendChild(todo_element);}


                // parent.appendChild(todo_element);
            }
        )
    }
}
// id : 1
// todo_object : {title: A Task, status : ACTIVE}
function createTodoElement(id, todo_object){

    var todo_element = document.createElement("div");

    if (todo_object.status == "ACTIVE"){

        var cb = document.createElement("INPUT");
        cb.setAttribute("type", "checkbox");

        cb.setAttribute("onclick", "completeTodoAJAX("+id+")");
        cb.setAttribute("class", "breathHorizontal");
        todo_element.appendChild(cb);
        todo_element.insertAdjacentHTML('beforeend',todo_object.title);
        todo_element.insertAdjacentHTML('beforeend',"&#10008");

        todo_element.setAttribute(
            "data-id", id
        );

        todo_element.setAttribute(
            "class", "todoStatus"+ todo_object.status + " " + "breathVertical"
        );

        var complete_button = document.createElement("button");
        //complete_button.innerText = "Mark as Complete";
        //complete_button
        complete_button.setAttribute("onclick", "deleteTodoAJAX("+id+")");
        complete_button.setAttribute("class", "breathHorizontal");
        complete_button.innerText="delete";
        todo_element.appendChild(complete_button);
    //}



    }



    if (todo_object.status == "DELETED"){
        todo_element.insertAdjacentHTML('beforeend', todo_object.title);
        return todo_element;
        // HW : Add this functionality
        // Add Delete Buttons for ACTIVE, COMPLETE TODO ITEMS
        // add a delete button
        // HW : Write this code
    }



    if (todo_object.status == "COMPLETE") {

        var cb = document.createElement("INPUT");
        cb.setAttribute("type", "checkbox");

        cb.setAttribute("onclick", "activeTodoAJAX("+id+")");
        cb.setAttribute("class", "breathHorizontal");
        todo_element.appendChild(cb);



        todo_element.insertAdjacentHTML('beforeend', todo_object.title);
        todo_element.setAttribute(
            "data-id", id
        );

        todo_element.setAttribute(
            "class", "todoStatus"+ todo_object.status + " " + "breathVertical"
        );

        return todo_element;
    }
    if (todo_object.status == "ACTIVE")return todo_element;

}
// Repo URL - https://github.com/malikankit/todo-august-28

function getTodosAJAX(){

    // xhr - JS object for making requests to server via JS
    var xhr = new XMLHttpRequest();
    //
    xhr.open("GET", "/api/todos", true);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE){

            if(xhr.status == STATUS_OK){
                console.log(xhr.responseText);
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
        }
    }// end of callback

    xhr.send(data=null);

}



function addTodoAJAX(){

    var title= document.getElementById(NEW_TODO_INPUT_ID).value;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/todos", true);
    // the data in this body will be of this form
    xhr.setRequestHeader(
        "Content-type", "application/x-www-form-urlencoded");

    // HW : Read format of X-W-F-U-E
    // HW : Look up encodeURI
    var data = "todo_title=" + encodeURI(title);

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(TODOS_LIST_ID, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }

    xhr.send(data);

}



function completeTodoAJAX(id){

    // Make a AJAX Request to update todo with the above id
    // If Response is 200 : refreshTodoElements


    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=COMPLETE";

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(completed_list, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
     }



    xhr.send(data);

    // The body can contain these parameters (XWFUE format)
    //todo_title=newtitle
    //todo_status= ACTIVE/COMPLETE/DELETED

}




function activeTodoAJAX(id){

    // Make a AJAX Request to update todo with the above id
    // If Response is 200 : refreshTodoElements


    var xhr = new XMLHttpRequest();
    xhr.open("PUT", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=ACTIVE";

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(active_list, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }



    xhr.send(data);

    // The body can contain these parameters (XWFUE format)
    //todo_title=newtitle
    //todo_status= ACTIVE/COMPLETE/DELETED

}









function deleteTodoAJAX(id){

    // Make a AJAX Request to update todo with the above id
    // If Response is 200 : refreshTodoElements


    var xhr = new XMLHttpRequest();
    xhr.open("delete", "/api/todos/"+id, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    data = "todo_status=DELETE";

    xhr.onreadystatechange = function(){

        if (xhr.readyState == RESPONSE_DONE) {
            if (xhr.status == STATUS_OK) {
                addTodoElements(deleted_list, xhr.responseText);
            }
            else {
                console.log(xhr.responseText);
            }
        }
    }



    xhr.send(data);

    // The body can contain these parameters (XWFUE format)
    //todo_title=newtitle
    //todo_status= ACTIVE/COMPLETE/DELETED

}














