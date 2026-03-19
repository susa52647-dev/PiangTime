// ===== SUPABASE =====
const supabaseUrl = "https://mjqazsuzgcmigsoqfpka.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qcWF6c3V6Z2NtaWdzb3FmcGthIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0MDAxMDEsImV4cCI6MjA4ODk3NjEwMX0.diKc0JKRowJ7LzSQhsS6ZOuAD6xwr8HN62i4jGinOxQ"
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey)

// เริ่มทำงานเมื่อเปิดหน้าเว็บ
window.onload = function() {
    // ถ้ามีฟังก์ชันหัวใจ ให้เรียกใช้ตรงนี้
    if (typeof createHearts === "function") createHearts();
}

// ===== LOGIN =====
function checkPassword(){
    const pass = document.getElementById("passwordInput").value
    if(pass === "1234"){
        document.getElementById("lockScreen").style.display = "none"
        loadMemories() // โหลดข้อมูลเมื่อรหัสผ่านถูกต้อง 
    } else {
        alert("รหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง!"); // เพิ่มการแจ้งเตือนตามที่ต้องการ
        document.getElementById("passwordInput").value = "" 
    }
}

// ===== LOAD MEMORIES =====
async function loadMemories(){
    const container = document.getElementById("memoryContainer")
    container.innerHTML = "กำลังโหลดความทรงจำ..."

    const {data, error} = await supabase
        .from("memories")
        .select("*")
        .order("date", {ascending: false}) // แก้ไข Syntax ตรงนี้ที่เคยทำให้ Error 

    if(error){
        console.log(error)
        container.innerHTML = "ไม่สามารถโหลดข้อมูลได้"
        return
    }

    container.innerHTML = ""
    data.forEach(function(memory){
        const card = document.createElement("div")
        card.className = "memory-card"
        card.innerHTML = `
            <img src="${memory.image}" onclick="openViewer('${memory.image}')">
            <h3>${memory.date}</h3>
            <p>${memory.text}</p>
            <button onclick="deleteMemory(${memory.id})">Delete</button>
        `
        container.appendChild(card)
    })
}

// ===== ADD MEMORY =====
async function addMemory(){
    const date = document.getElementById("dateInput").value
    const text = document.getElementById("textInput").value
    const file = document.getElementById("imageInput").files[0]

    if(!date || !text || !file){
        alert("กรุณากรอกข้อมูลให้ครบถ้วน") [cite: 5]
        return
    }

    const reader = new FileReader()
    reader.onload = async function(){
        const base64 = reader.result
        const { error } = await supabase
            .from("memories")
            .insert([{ date: date, text: text, image: base64 }])

        if(error) {
            alert("บันทึกไม่สำเร็จ: " + error.message)
        } else {
            document.getElementById("dateInput").value=""
            document.getElementById("textInput").value=""
            document.getElementById("imageInput").value=""
            loadMemories()
        }
    }
    reader.readAsDataURL(file)
}

// ===== DELETE =====
async function deleteMemory(id){
    if(!confirm("คุณต้องการลบความทรงจำนี้ใช่หรือไม่?")) return [cite: 5]
    
    await supabase.from("memories").delete().eq("id", id)
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
