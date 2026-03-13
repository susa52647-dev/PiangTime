// SUPABASE
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcWF6c3V6Z2NtaWdzb3FmcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAxMDEsImV4cCI6MjA4ODk3NjEwMX0.diKc0JKRowJ7LzSQhsS6ZOuAD6xwr8HN62i4jGinOxQ"

let supabaseClient = null

// โหลด Supabase หลังหน้าเว็บเปิด
document.addEventListener("DOMContentLoaded", () => {

if(window.supabase){

supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)

}

loadMemories()

setupEnterKey()

})



// PASSWORD
function checkPassword(){

let input = document.getElementById("passwordInput")

if(!input) return

let pass = input.value.trim()

if(pass === "Tumpihungry"){

let lock = document.getElementById("lockScreen")

if(lock) lock.style.display="none"

}else{

alert("Wrong password")

}

}



// ENTER KEY LOGIN
function setupEnterKey(){

let input=document.getElementById("passwordInput")

if(!input) return

input.addEventListener("keypress",function(e){

if(e.key==="Enter"){
checkPassword()
}

})

}



// UPLOAD IMAGE
async function uploadImage(){

let input = document.getElementById("imageInput")

if(!input || !input.files.length){

alert("กรุณาเลือกรูป")

return null

}

let file = input.files[0]

let formData = new FormData()

formData.append("file",file)
formData.append("upload_preset","memory_upload")

try{

let res = await fetch(
"https://api.cloudinary.com/v1_1/dtzmwztuj/image/upload",
{
method:"POST",
body:formData
}
)

let data = await res.json()

return data.secure_url

}catch(err){

console.log("upload error",err)

alert("Upload image error")

return null

}

}



// ADD MEMORY
async function addMemory(){

let date = document.getElementById("dateInput")?.value
let text = document.getElementById("textInput")?.value

if(!date || !text){

alert("Please fill everything")

return

}

let imageURL = await uploadImage()

if(!imageURL) return

let { error } = await supabaseClient
.from("memories")
.insert([
{
date:date,
text:text,
image:imageURL
}
])

if(error){

console.log(error)

alert("Save error")

return

}

document.getElementById("textInput").value=""
document.getElementById("imageInput").value=""

loadMemories()

}



// LOAD MEMORIES
async function loadMemories(){

if(!supabaseClient) return

let { data, error } = await supabaseClient
.from("memories")
.select("*")
.order("date",{ascending:false})

if(error){

console.log(error)

return

}

let container = document.getElementById("memoryContainer")

if(!container) return

container.innerHTML=""

data.forEach(memory=>{

let card=document.createElement("div")

card.className="memory-card"

card.innerHTML=`

<img src="${memory.image}" onclick="openViewer('${memory.image}')">

<p><b>${memory.date}</b></p>

<p>${memory.text}</p>

<div class="memory-buttons">

<button onclick="deleteMemory('${memory.id}')">Delete</button>

<button onclick="editImage('${memory.id}')">Change Image</button>

</div>

`

container.appendChild(card)

})

}



// DELETE MEMORY
async function deleteMemory(id){

let ok = confirm("Delete this memory?")

if(!ok) return

await supabaseClient
.from("memories")
.delete()
.eq("id",id)

loadMemories()

}



// EDIT IMAGE
async function editImage(id){

let input=document.createElement("input")

input.type="file"

input.accept="image/*"

input.onchange=async()=>{

let file=input.files[0]

let formData=new FormData()

formData.append("file",file)
formData.append("upload_preset","memory_upload")

let res=await fetch(
"https://api.cloudinary.com/v1_1/dtzmwztuj/image/upload",
{
method:"POST",
body:formData
}
)

let data=await res.json()

await supabaseClient
.from("memories")
.update({image:data.secure_url})
.eq("id",id)

loadMemories()

}

input.click()

}



// IMAGE VIEWER
function openViewer(src){

let viewer=document.getElementById("imageViewer")

let img=document.getElementById("viewerImage")

if(!viewer || !img) return

img.src=src

viewer.style.display="flex"

}

function closeViewer(){

let viewer=document.getElementById("imageViewer")

if(viewer) viewer.style.display="none"

}
