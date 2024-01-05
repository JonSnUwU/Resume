document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
  
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
  
      if (targetSection) {
        const targetOffset = targetSection.offsetTop;
        const duration = 100; // Adjust this value for the duration of the scroll animation (in seconds)
        const steps = 100; // Increase the number of steps for slower movement
        const stepValue = (targetOffset - window.scrollY) / steps;
        let currentStep = 0;
  
        const scrollInterval = setInterval(() => {
          currentStep++;
          if (currentStep >= steps) {
            clearInterval(scrollInterval);
          }
          window.scrollTo(0, window.scrollY + stepValue);
        }, duration * 2000 / steps);
      }
    });
  });
  