document.querySelector(".nav-toggle").addEventListener("click",event=>{const header=document.querySelector(".site-header");header.classList.toggle("open");event.currentTarget.setAttribute("aria-expanded",header.classList.contains("open"))});
document.querySelectorAll(".site-header nav a").forEach(link=>link.addEventListener("click",()=>document.querySelector(".site-header").classList.remove("open")));
document.querySelector("#year").textContent=new Date().getFullYear();
