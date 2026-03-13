// SUPABASE
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"

const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcWF6c3V6Z2NtaWdzb3FmcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAxMDEsImV4cCI6MjA4ODk3NjEwMX0.diKc0JKRowJ7LzSQhsS6ZOuAD6xwr8HN62i4jGinOxQ"

const supabaseClient = supabase.createClient(supabaseUrl, supabaseKey)



// PASSWORD
function checkPassword(){

const pass = document.getElementById("passwordInput").value.trim()

if(pass === "Tumpihungry"){
document.getElementById("lockScreen").style.display="none"
}
else{
alert("Wrong password")
}

}



// UPLOAD IMAGE
async function uploadImage(){

let fileInput = document.getElementById("imageInput")

if(!fileInput.files.length){
alert("กรุณาเลือกรูป")
return null
}

let file = fileInput.files[0]

let formData = new FormData()
formData.append("file", file)
formData.append("upload_preset", "memory_upload")

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

console.log(err)
alert("Upload error")
return null

}

}



// ADD MEMORY
async function addMemory(){

let date = document.getElementById("dateInput").value
let text = document.getElementById("textInput").value

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

loadMemories()

document.getElementById("textInput").value=""
document.getElementById("imageInput").value=""

}



// LOAD MEMORIES
async function loadMemories(){

let { data, error } = await supabaseClient
.from("memories")
.select("*")
.order("date",{ascending:false})

if(error){
console.log(error)
return
}

let container = document.getElementById("memoryContainer")

container.innerHTML=""

data.forEach(memory=>{

let card = document.createElement("div")

card.className="memory-card"

card.innerHTML=`
<img src="${memory.image}" onclick="openViewer('${memory.image}')">
<p><b>${memory.date}</b></p>
<p>${memory.text}</p>
`

container.appendChild(card)

})

}



// IMAGE VIEWER
function openViewer(src){

document.getElementById("viewerImage").src = src
document.getElementById("imageViewer").style.display="flex"

}

function closeViewer(){

document.getElementById("imageViewer").style.display="none"

}



// ENTER KEY LOGIN
document.addEventListener("DOMContentLoaded",()=>{

let input=document.getElementById("passwordInput")

if(input){
input.addEventListener("keypress",(e)=>{
if(e.key==="Enter"){
checkPassword()
}
})
}

loadMemories()

})
card.innerHTML=`

<img src="${memory.image}" onclick="openViewer('${memory.image}')">

<p><b>${memory.date}</b></p>

<p>${memory.text}</p>

<div class="memory-buttons">

<button onclick="deleteMemory('${memory.id}')">Delete</button>

<button onclick="editImage('${memory.id}')">Change Image</button>

</div>

`async function editImage(id){

let input = document.createElement("input")
input.type = "file"
input.accept = "image/*"

input.onchange = async () => {

let file = input.files[0]

let formData = new FormData()

formData.append("file", file)
formData.append("upload_preset", "memory_upload")

let res = await fetch(
"https://api.cloudinary.com/v1_1/dtzmwztuj/image/upload",
{
method:"POST",
body:formData
}
)

let data = await res.json()

let newURL = data.secure_url

await supabaseClient
.from("memories")
.update({image:newURL})
.eq("id",id)

loadMemories()

}

input.click()

}
