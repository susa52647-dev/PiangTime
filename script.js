// SUPABASE CONNECT
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcWF6c3V6Z2NtaWdzb3FmcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAxMDEsImV4cCI6MjA4ODk3NjEwMX0.diKc0JKRowJ7LzSQhsS6ZOuAD6xwr8HN62i4jGinOxQ"

const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)


// PASSWORD
function checkPassword() {

const pass = document.getElementById("passwordInput").value

if(pass === "1234"){
document.getElementById("lockScreen").style.display="none"
loadMemories()
}else{
alert("Wrong password")
}

}


// LOAD MEMORIES
async function loadMemories(){

const container = document.getElementById("memoryContainer")
container.innerHTML="Loading..."

const { data, error } = await supabase
.from("memories")
.select("*")
.order("date",{ascending:false})

if(error){
container.innerHTML="Load error"
return
}

container.innerHTML=""

data.forEach(memory => {

const card=document.createElement("div")
card.className="memory-card"

card.innerHTML=`

<img src="${memory.image}" onclick="openViewer('${memory.image}')">

<h3>${memory.date}</h3>

<p>${memory.text}</p>

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

if(!date || !text || !file){
alert("Please fill everything")
return
}

const reader=new FileReader()

reader.onload=async function(){

const imageBase64=reader.result

const { error } = await supabase
.from("memories")
.insert([
{
date:date,
text:text,
image:imageBase64
}
])

if(error){
alert("Save error")
console.log(error)
return
}

alert("Saved!")

document.getElementById("textInput").value=""
document.getElementById("imageInput").value=""

loadMemories()

}

reader.readAsDataURL(file)

}


// DELETE MEMORY
async function deleteMemory(id){

const confirmDelete = confirm("Delete this memory?")

if(!confirmDelete) return

const { error } = await supabase
.from("memories")
.delete()
.eq("id",id)

if(error){
alert("Delete error")
return
}

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
heart.innerHTML="❤️"
heart.style.position="fixed"
heart.style.left=Math.random()*100+"vw"
heart.style.top="-20px"
heart.style.fontSize="20px"

document.body.appendChild(heart)

let pos=0

const fall=setInterval(()=>{

pos+=3
heart.style.top=pos+"px"

if(pos>window.innerHeight){

clearInterval(fall)
heart.remove()

}

},30)

},800)
