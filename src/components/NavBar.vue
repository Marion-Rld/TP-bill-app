<template>
  <header class="shadow">
    <nav class="navbar navbar-expand-lg bg-white">
      <div class="container-fluid">
        <RouterLink class="navbar-brand" exact to="/">
          <i class="fa-solid fa-wallet"></i> Factures
        </RouterLink>

        <ul class="navbar-nav gap-4">
          <li class="nav-item">
            <RouterLink
              class="nav-link text-primary"
              active-class="active"
              aria-current="page"
              exact
              to="/"
            >
              <i class="fa-solid fa-house"></i> Accueil
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link text-primary"
              active-class="active"
              aria-current="page"
              to="/bills"
            >
              <i class="fa-solid fa-file"></i> Factures
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link text-primary"
              active-class="active"
              aria-current="page"
              to="/clients"
            >
              <i class="fa-solid fa-user-group"></i> Clients
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink
              class="nav-link text-primary"
              active-class="active"
              aria-current="page"
              to="/about"
            >
              A propos
            </RouterLink>
          </li>
        </ul>
      </div>
    </nav>
  </header>
</template>

<script>
import { RouterLink } from 'vue-router'

export default {
  components: {
    RouterLink
  }
}
</script>

<style>
.navbar-brand {
  font-size: 1.5rem;
  color: grey;
}

.nav-link.active {
  border: 1px solid var(--bs-primary);
  border-radius: 10px;
}
</style>
