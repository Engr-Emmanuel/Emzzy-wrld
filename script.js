const btnPopup = document.querySelector('.lanthanyde');
const lantha = document.querySelector('.lantha');
btnPopup.addEventListener('click', ()=>{
  lantha.classList.add('active-lantha');
})
const btnPopupp = document.querySelector('.actinide');
const actina = document.querySelector('.actina');
btnPopupp.addEventListener('click', ()=>{
  actina.classList.add('active-actina');
})
const iconclose = document.querySelector('.icon_close');
iconclose.addEventListener('click', ()=>{
  lantha.classList.remove('active-lantha');
})
const iconclosee = document.querySelector('.icon_closes');
iconclosee.addEventListener('click', ()=>{
  actina.classList.remove('active-actina');
})



