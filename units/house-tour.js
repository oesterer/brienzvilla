const houseTourRooms=[
  {title:"Living room",file:"living-room-1.jpg",description:"Main living area with fireplace.",upper:true},
  {title:"Lower living room",file:"living-room-2.jpg",description:"Second living area in the lower-level apartment."},
  {title:"Full kitchen",file:"full-kitchen.jpg",description:"Well-equipped with oven, dishwasher, Nespresso machine, raclette and fondue sets.",upper:true},
  {title:"Kitchenette",file:"kitchenette.jpg",description:"Private kitchen in the lower-level apartment."},
  {title:"Dining area",file:"dining-area-1.jpg",description:"Dining area with panoramic lake views.",upper:true},
  {title:"Lower dining area",file:"dining-area-2.jpg",description:"Additional dining space in the lower-level apartment."},
  {title:"Bedroom 1",file:"bedroom-1.jpg",description:"King bed, 180 × 200 cm, with private bathroom.",upper:true},
  {title:"Bedroom 2",file:"bedroom-2.jpg",description:"King bed, 180 × 200 cm; a baby cot is available on request.",upper:true},
  {title:"Bedroom 3",file:"bedroom-3.jpg",description:"Two single beds, each 90 × 200 cm.",upper:true},
  {title:"Bedroom 4",file:"bedroom-4.jpg",description:"Queen bed, 160 × 200 cm, closet and mountain view.",upper:true},
  {title:"Bedroom 5",file:"bedroom-5.jpg",description:"Lower-level king bedroom with direct patio access."},
  {title:"Full bathroom 1",file:"full-bathroom-1.jpg",description:"Private bathroom for Bedroom 1 with bathtub and shower.",upper:true},
  {title:"Full bathroom 2",file:"full-bathroom-2.jpg",description:"Bathroom with shower serving Bedrooms 2, 3 and 4.",upper:true},
  {title:"Full bathroom 3",file:"full-bathroom-3.jpg",description:"Bathroom with shower in the lower-level apartment."},
  {title:"Half bathroom",file:"half-bathroom.jpg",description:"Guest bathroom beside the entrance area.",upper:true},
  {title:"Lower patio",file:"backyard.jpg",description:"Private patio and garden area for the lower-level apartment."},
  {title:"Lake-view patio",file:"patio.jpg",description:"Outdoor seating overlooking Lake Brienz and the mountains.",upper:true},
  {title:"Terrace & garden",file:"terrace.jpg",description:"The villa’s private garden and outdoor gathering space.",upper:true},
  {title:"Laundry room",file:"laundry-area.jpg",description:"Washer and dryer with complimentary detergent.",upper:true},
  {title:"Exterior & parking",file:"exterior.jpg",description:"Private entrance and on-site parking.",upper:true},
  {title:"Entrance hall",file:"additional-photos.jpg",description:"Interior stairs connecting the villa’s levels.",upper:true}
];

const tour=document.querySelector("[data-house-tour]");
if(tour){
  const rooms=tour.dataset.houseTour==="house"?houseTourRooms.filter(room=>room.upper):houseTourRooms;
  const grid=tour.querySelector(".tour-grid");
  grid.innerHTML=rooms.map((room,index)=>`<button class="tour-card" type="button" data-index="${index}"><img src="../../assets/images/house-tour/${room.file}" alt="${room.description}" loading="lazy"><span><strong>${room.title}</strong><small>${room.description}</small></span></button>`).join("");
  const dialog=document.createElement("dialog");
  dialog.className="tour-dialog";
  dialog.innerHTML=`<button class="tour-close" type="button" aria-label="Close house tour">×</button><button class="tour-arrow tour-prev" type="button" aria-label="Previous room">←</button><figure><img alt=""><figcaption><strong></strong><span></span><small></small></figcaption></figure><button class="tour-arrow tour-next" type="button" aria-label="Next room">→</button>`;
  document.body.append(dialog);
  let current=0;
  const show=index=>{
    current=(index+rooms.length)%rooms.length;
    const room=rooms[current],image=dialog.querySelector("img");
    image.src=`../../assets/images/house-tour/${room.file}`;
    image.alt=room.description;
    dialog.querySelector("figcaption strong").textContent=room.title;
    dialog.querySelector("figcaption span").textContent=room.description;
    dialog.querySelector("figcaption small").textContent=`${current+1} / ${rooms.length}`;
  };
  grid.addEventListener("click",event=>{const card=event.target.closest(".tour-card");if(!card)return;show(Number(card.dataset.index));dialog.showModal()});
  dialog.querySelector(".tour-close").addEventListener("click",()=>dialog.close());
  dialog.querySelector(".tour-prev").addEventListener("click",()=>show(current-1));
  dialog.querySelector(".tour-next").addEventListener("click",()=>show(current+1));
  dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
  document.addEventListener("keydown",event=>{if(!dialog.open)return;if(event.key==="ArrowLeft")show(current-1);if(event.key==="ArrowRight")show(current+1)});
}
