<!-- Footer.vue -->
<template>
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <p>© 2023 xxxxx. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </template>
  
  <script setup>
  // No script logic needed for this simple component
  </script>
  
  <style scoped>
  .footer {
    background-color: #b0b2b4;
    padding: 1px;
    text-align: center;
  }
  
  .footer-content {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  
  .footer-section {
    margin: 1px;
  }
  
  .footer-section h3, .footer-section h4 {
    margin-bottom: 10px;
  }
  
  .footer-section ul {
    list-style: none;
    padding: 0;
  }
  
  .footer-section ul li {
    margin: 5px 0;
  }
  
  .footer-section ul li a {
    text-decoration: none;
    color: #333;
  }
  
  .footer-section ul li a:hover {
    text-decoration: underline;
  }
  
  .social-links {
    display: flex;
    justify-content: center;
  }
  
  .social-links li {
    margin: 0 5px;
  }

  </style>