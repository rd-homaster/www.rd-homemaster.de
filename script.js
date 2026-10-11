document.addEventListener('DOMContentLoaded',()=>{
  const btn=document.querySelector('.menu-button');
  const nav=document.querySelector('.main-nav');
  if(btn&&nav){
    btn.addEventListener('click',()=>{
      const open=nav.classList.toggle('open');
      btn.setAttribute('aria-expanded',String(open));
    });
    nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      nav.classList.remove('open');btn.setAttribute('aria-expanded','false');
    }));
  }

  // Ausschließlich der bestätigte RD-Homemaster-Bewertungslink darf
  // im öffentlichen Bewertungsbereich als externer Link erscheinen.
  const reviewSection=document.getElementById('google-bewertungen');
  const correctReviewUrl='https://search.google.com/local/writereview?placeid=ChIJ-fPa1LmVmUcRpBwKODdd7JY';
  if(reviewSection){
    reviewSection.querySelectorAll('a[href]').forEach(link=>{
      link.href=correctReviewUrl;
      link.target='_blank';
      link.rel='noopener noreferrer';
      link.setAttribute('aria-label','Nur RD Homemaster Hausmeisterservice bei Google bewerten');
    });
  }
});
