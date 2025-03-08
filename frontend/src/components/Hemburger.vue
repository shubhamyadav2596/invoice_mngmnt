<template>
    <div class="hamburger-btn d-md-none" >
   <i class="bi bi-list fs-5"></i>
 </div>
</template>

<script>
export default {
 name: 'HemBurger'
}
</script>

<style scoped>
 /* Hamburger button styles */
.hamburger-btn {
position: fixed;
top: 10px;
left: 10px;
z-index: 1030;
background-color: #fff;
border-radius: 50%;
width: 35px;
height: 35px;
display: flex;
align-items: center;
justify-content: center;
box-shadow: 0 2px 5px rgba(0,0,0,0.2);
cursor: pointer;
}

.hamburger-btn i {
font-size: 1.5rem;
}
</style>