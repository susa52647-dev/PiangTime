// SUPABASE CONNECT
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcWF6c3V6Z2NtaWdzb3FmcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAxMDEsImV4cCI6MjA4ODk3NjEwMX0.diKc0JKRowJ7LzSQhsS6ZOuAD6xwr8HN62i4jGinOxQ"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

let editingId = null


// PASSWORD
function checkPassword(){

const pass=document.getElementById("passwordInput").value

if(pass==="1234"){
document.getElementById("lockScreen").style.display="none"
loadMemories()
}else{
alert("Wrong password")
}

}



// LOAD MEMORIES
async function loadMemories(){

const container=document.getElementById("memoryContainer")

container.innerHTML="Loading..."

const {data,error}=await supabase
.from("memories")
.select("*")
.order("date",{ascending:false})

if(error){
container.innerHTML="Load error"
return
}

container.innerHTML=""

data.forEach(memory=>{

const card=document.createElement("div")

card.className="memory-card fade-in"

card.innerHTML=`

<img src="${memory.image}" onclick="openViewer('${memory.image}')">

<h3>${memory.date}</h3>

<p>${memory.text}</p>

<button onclick="editMemory(${memory.id})">Edit</button>

<button onclick="deleteMemory(${memory.id})">Delete</button>

`

container.appendChild(card)

})

}



// ADD MEMORY
async function addMemory(){

const date=document.getElementById("dateInput").value
const text=document.getElementById("textInput").value
const file=document.getElementById("imageInput").files[0]

if(!date || !text){
alert("Please fill everything")
return
}

let imageBase64 = null

if(file){

const reader=new FileReader()

reader.onload=async function(){

imageBase64=reader.result

saveMemory(date,text,imageBase64)

}

reader.readAsDataURL(file)

}else{

saveMemory(date,text,null)

}

}



async function saveMemory(date,text,image){

if(editingId){

const updateData={
date:date,
text:text
}

if(image){
updateData.image=image
}

await supabase
.from("memories")
.update(updateData)
.eq("id",editingId)

editingId=null
alert("Memory updated")

}else{

await supabase
.from("memories")
.insert([
{
date:date,
text:text,
image:image
}
])

alert("Saved!")

}

document.getElementById("dateInput").value=""
document.getElementById("textInput").value=""
document.getElementById("imageInput").value=""

loadMemories()

}



// EDIT MEMORY
async function editMemory(id){

const {data}=await supabase
.from("memories")
.select("*")
.eq("id",id)
.single()

document.getElementById("dateInput").value=data.date
document.getElementById("textInput").value=data.text

editingId=id

window.scrollTo({
top:document.getElementById("add").offsetTop,
behavior:"smooth"
})

}



// DELETE MEMORY
async function deleteMemory(id){

const confirmDelete = confirm("Are you sure you want to delete this memory?")

if(!confirmDelete) return

const confirmAgain = confirm("This cannot be undone. Delete?")

if(!confirmAgain) return

await supabase
.from("memories")
.delete()
.eq("id",id)

loadMemories()

}



// IMAGE VIEWER
function openViewer(src){

document.getElementById("viewerImage").src=src
document.getElementById("imageViewer").style.display="flex"

}

function closeViewer(){

document.getElementById("imageViewer").style.display="none"

}



// HEART EFFECT
setInterval(()=>{

const heart=document.createElement("div")

heart.className="heart"
heart.innerHTML="❤"

heart.style.left=Math.random()*100+"vw"
heart.style.bottom="0px"

document.getElementById("heartContainer").appendChild(heart)

setTimeout(()=>{
heart.remove()
},3000)

},800)
