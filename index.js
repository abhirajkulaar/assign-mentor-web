

//const URLserver="http://localhost:5000"

const URLserver="https://mentor-student-server.herokuapp.com"

//Add new user Submit
document.querySelector("#addStudentForm").addEventListener("submit",async (e)=>{  e.preventDefault()
  
    
    
    const req=await fetch(URLserver+"/students",{method:"POST",headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },body:JSON.stringify({name:e.target.name.value,age:parseInt(e.target.age.value),batch:parseInt(e.target.batch.value),contact:parseInt(e.target.contact.value),email:e.target.email.value})})
   
    
  
    if(req.status==200){

        $("#successAlert").show();
        document.querySelector("#successAlert").innerText="Student "+e.target.name.value+" successfully created!"
        setTimeout(()=>$("#successAlert").hide(),1500)

    }
    else{ 
    const reqJSON = await req.json();
    $("#failAlert").show();
    document.querySelector("#failAlert").innerText=  reqJSON.reason
    setTimeout(()=>$("#failAlert").hide(),1500)}

    populateMentorsinStudentSelect()
    await updateStudentDropDown()
     updateMentorDropDown()
     
})

//Add new mentor Submit
document.querySelector("#addMentorForm").addEventListener("submit",async (e)=>{  e.preventDefault()
  
    
    
    const req=await fetch(URLserver+"/mentors",{method:"POST",headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },body:JSON.stringify({name:e.target.name.value,age:parseInt(e.target.age.value),contact:parseInt(e.target.contact.value),email:e.target.email.value})})
   
    
  
    if(req.status==200){

        $("#successAlert").show();
        document.querySelector("#successAlert").innerText="Mentor "+e.target.name.value+" successfully created!"
        setTimeout(()=>$("#successAlert").hide(),1500)

    }
    else{ 
    const reqJSON = await req.json();
    $("#failAlert").show();
    document.querySelector("#failAlert").innerText=  reqJSON.reason
    setTimeout(()=>$("#failAlert").hide(),1500)}

    
     updateMentorDropDown()
     populateMentorsinStudentSelect()

})




//Update dropdown of students (in View/Assign Mentor)
async function updateStudentDropDown(){

    const req=await fetch(URLserver+"/students");
    const reqJson =await req.json();
    document.getElementById("studentsList").innerHTML=""
    for(let i=0;i<reqJson.length;i++)
{
    let option = document.createElement("option");
    option.setAttribute("value",reqJson[i].name)
    option.innerText=reqJson[i].name
    document.getElementById("studentsList").appendChild(option)
}
    




}

//Update dropdown of mentor (in View/Assign Mentor)
async function updateMentorDropDown(){


    document.getElementById("mentorChangeSubmitButton").setAttribute("disabled","")
    const req=await fetch(URLserver+"/mentors");
    const reqJson =await req.json();
    const curStudent=await fetch(URLserver+"/students/"+document.getElementById("studentsList").value);
    const curStudentJson = await curStudent.json();
    document.getElementById("mentorsList").innerHTML=""
    for(let i=0;i<reqJson.length;i++)
{
    let option = document.createElement("option");
    option.setAttribute("value",reqJson[i].name)
    if(reqJson[i].name==curStudentJson.mentor_name){option.setAttribute("selected","");option.setAttribute("disabled","")}
    option.innerText=reqJson[i].name
    
    document.getElementById("mentorsList").appendChild(option)
}
    

if(curStudentJson.mentor_name=="")
{
    let option = document.createElement("option");
    option.setAttribute("value","")
    option.setAttribute("selected","")
    option.setAttribute("disabled","")
    option.innerText=""
    
    document.getElementById("mentorsList").appendChild(option)
}


}

//Update mentor dropdown (in View/Assign Mentor) when user is changed -> Current mentor is selected and disabled
document.getElementById("mentorsList").addEventListener("change",()=>document.getElementById("mentorChangeSubmitButton").removeAttribute("disabled"))

    //Submit change mentor for user form (in View/Assign Mentor)
document.getElementById("assignMentorForm").addEventListener("submit",async (e)=>{

e.preventDefault();

    
    
const req=await fetch(URLserver+"/assignMentor",{method:"POST",headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },body:JSON.stringify({student_name:e.target.student_name.value,mentor_name:e.target.mentor_name.value})})



if(req.status==200){

    $("#successAlert").show();
    document.querySelector("#successAlert").innerText="Mentor "+e.target.mentor_name.value+" successfully assigned to "+e.target.student_name.value;
    setTimeout(()=>$("#successAlert").hide(),1500)

}
else{ 
const reqJSON = await req.json();
$("#failAlert").show();
document.querySelector("#failAlert").innerText=  reqJSON.reason
setTimeout(()=>$("#failAlert").hide(),1500)}

 updateMentorDropDown()
 populateMentorsinStudentSelect()


})

//Populate the table (in View/Assign Students)
async function populateMentorsinStudentSelect()
{

    const mentorsReq=await fetch(URLserver+"/mentors");
    const mentorsJson =await mentorsReq.json();
    
    const studentsReq=await fetch(URLserver+"/students/");
    const studentsJson = await studentsReq.json();
    freeStudentsJson=studentsJson.filter((e)=>e.mentor_name=="")

    document.getElementById("mentorsContainer").innerHTML=""

    
    for(let i=0;i<mentorsJson.length;i++)
    {
        let mName=document.createElement("div")
        mName.classList.add("col","col-6","mb-4");
        mName.innerText=mentorsJson[i].name;

        let opContainer = document.createElement("div");
        opContainer.classList.add("col","col-6","mb-4");
        let listContainer = document.createElement("ul");
        listContainer.classList.add("list-group")

        for(let j=0;j<mentorsJson[i].students.length;j++)
        {

            let listItem = document.createElement("li")
            listItem.classList.add("list-group-item");
            listItem.innerText=mentorsJson[i].students[j];
            let btn = document.createElement("button")
            btn.classList.add("btn")
            btn.innerHTML='<i class="fa fa-user-times"></i>'
            //Remove user from mentor on clicking remove icon (in View/Assign Mentor)
            btn.addEventListener("click",async ()=>{

                const req=await fetch(URLserver+"/removeMentor",{method:"POST",headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                  },body:JSON.stringify({student_name:mentorsJson[i].students[j]})})
                
                  if(req.status==200){
                
                    $("#successAlert").show();
                    document.querySelector("#successAlert").innerText="Student "+mentorsJson[i].students[j]+" successfully removed! "
                    setTimeout(()=>$("#successAlert").hide(),1500)
                    updateMentorDropDown()
                    populateMentorsinStudentSelect()
                }
                else{ 
                const reqJSON = await req.json();
                $("#failAlert").show();
                document.querySelector("#failAlert").innerText=  reqJSON.reason
                setTimeout(()=>$("#failAlert").hide(),1500)}
                    updateMentorDropDown()
                    u

            })
            listItem.appendChild(btn)
            listContainer.appendChild(listItem);
            
           
        }

        opContainer.appendChild(listContainer)
        document.getElementById("mentorsContainer").appendChild(mName)
        document.getElementById("mentorsContainer").appendChild(opContainer)







        let addUserForm = document.createElement("form");
        addUserForm.setAttribute("data-mentor_name",mentorsJson[i].name)
        let rw = document.createElement("div")
        rw.classList.add("row")
        let selectContainer=document.createElement("div")
        selectContainer.classList.add("col","col-10")
        let select = document.createElement("select");
        select.classList.add("form-control")
        select.setAttribute("name","student_name")
        for(let j=0;j<freeStudentsJson.length;j++)
        {
            let opt = document.createElement("option");
            opt.value=freeStudentsJson[j].name;
            opt.innerText=freeStudentsJson[j].name;
            select.appendChild(opt)
    
    
    
        }

        selectContainer.appendChild(select)
        rw.appendChild(selectContainer)
        rw.innerHTML+=' <div class="col col-2 p-0"><button  class="btn" type="submit"><i class="fa fa-user-plus"></i></button></div>'
        addUserForm.appendChild(rw)
        opContainer.appendChild(addUserForm)
        //Add new stuent to mentor (in View/Assign Mentor)
        addUserForm.addEventListener("submit",async(e)=>{
            e.preventDefault();

            const req=await fetch(URLserver+"/assignMentor",{method:"POST",headers: {
    'Content-Type': 'application/json'
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },body:JSON.stringify({student_name:e.target.student_name.value,mentor_name:e.target.dataset.mentor_name})})

  if(req.status==200){

    $("#successAlert").show();
    document.querySelector("#successAlert").innerText="Student "+e.target.student_name.value+" successfully assigned to "+e.target.dataset.mentor_name;
    setTimeout(()=>$("#successAlert").hide(),1500)

}
else{ 
const reqJSON = await req.json();
$("#failAlert").show();
document.querySelector("#failAlert").innerText=  reqJSON.reason
setTimeout(()=>$("#failAlert").hide(),1500)}


await updateMentorDropDown()
await populateMentorsinStudentSelect()
        })

    }




}







document.querySelector("#addStudentToggle").addEventListener("click",()=>
{
    document.querySelector("#addStudentForm").classList.toggle("d-none")
})

document.querySelector("#addMentorToggle").addEventListener("click",()=>
{
    document.querySelector("#addMentorForm").classList.toggle("d-none")
})

document.querySelector("#studentsView").addEventListener("click",()=>
{
    document.querySelector("#assignMentorForm").classList.toggle("d-none")
})

document.querySelector("#mentorView").addEventListener("click",()=>
{
    document.querySelector("#mentorsContainer").classList.toggle("d-none")
})


async function main(){
    await updateStudentDropDown()
    await updateMentorDropDown()
    await populateMentorsinStudentSelect()
 document.getElementById("studentsList").addEventListener("change",updateMentorDropDown)

}
main()