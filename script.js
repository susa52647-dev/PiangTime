```javascript
// ===== SUPABASE =====
const supabaseUrl = "https://mjgazsuzgcmigsoqfpka.supabase.co"
const supabaseKey = "ใส่คีย์ของคุณตรงนี้"
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)


// ===== LOGIN =====
function checkPassword(){

const pass = document.getElementById("passwordInput").value

if(pass === "1234"){

document.getElementById("lockScreen").style.display = "none"
loadMemories()

}else{

alert("Wrong password")

}

}



// ===== LOAD MEMORIES =====
async function loadMemories(){

const container = document.getElementById("memoryContainer")

container.innerHTML = "Loading..."

const {data,error} = await supabase
.from("memories")
.select("*")
.order("date",{ascending:false})

if(error){

console.log(error)
container.innerHTML = "Error loading memories"
return

}

container.innerHTML = ""

data.forEach(function(memory){

const card = document.createElement("div")
card.className = "memory-card"

card.innerHTML =
'<img src="'+memory.image+'" onclick="openViewer(\''+memory.image+'\')">'+
'<h3>'+memory.date+'</h3>'+
'<p>'+memory.text+'</p>'+
'<button onclick="deleteMemory('+memory.id+')">Delete</button>'

container.appendChild(card)

})

}



// ===== ADD MEMORY =====
async function addMemory(){

const date = document.getElementById("dateInput").value
const text = document.getElementById("textInput").value
const file = document.getElementById("imageInput").files[0]

if(!date || !text || !file){

alert("Please fill everything")
return

}

const reader = new FileReader()

reader.onload = async function(){

const base64 = reader.result

await supabase
.from("memories")
.insert([
{
date:date,
text:text,
image:base64
}
])

document.getElementById("dateInput").value=""
document.getElementById("textInput").value=""
document.getElementById("imageInput").value=""

loadMemories()

}

reader.readAsDataURL(file)

}



// ===== DELETE =====
async function deleteMemory(id){

const confirm1 = confirm("Delete this memory?")
if(!confirm1) return

const confirm2 = confirm("Are you sure?")
if(!confirm2) return

await supabase
.from("memories")
.delete()
.eq("id",id)

loadMemories()

}



// ===== IMAGE VIEW =====
function openViewer(src){

document.getElementById("viewerImage").src = src
document.getElementById("imageViewer").style.display = "flex"

}

function closeViewer(){

document.getElementById("imageViewer").style.display = "none"

}
```
