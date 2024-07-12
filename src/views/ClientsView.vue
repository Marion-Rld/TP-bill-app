<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between">
      <h2 class="mb-4">Liste des clients</h2>
      <button class="btn btn-primary mb-3" @click="navigateToAddClient">
        <i class="fa-solid fa-circle-plus"></i> Ajouter un client
      </button>
    </div>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Entreprise</th>
          <th>Date d'ajout</th>
          <th class="text-end">Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="client in clients" :key="client.idclient">
          <td>
            <i class="fa-solid fa-user me-2 text-muted"></i> {{ client.firstName }}
            {{ client.lastName }}
          </td>
          <td>{{ client.companyName }}</td>
          <td>{{ client.additionDate }}</td>
          <td class="text-end">
            <button class="btn btn-danger me-2" @click="deleteClient(client.idclient)">
              <i class="fa fa-trash"></i> Supprimer
            </button>
            <button class="btn btn-secondary" @click="editClient(client.idclient)">
              <i class="fa fa-edit"></i> Éditer
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { useClientStore } from '../stores/useClientStore'
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'

export default {
  setup() {
    const clientStore = useClientStore()
    const router = useRouter()

    const navigateToAddClient = () => {
      router.push({ name: 'addClient' })
    }

    const deleteClient = (idclient) => {
      clientStore.deleteItem(idclient)
    }

    const editClient = (idclient) => {
      router.push({ name: 'editClient', params: { id: idclient } })
    }

    const clients = computed(() => clientStore.clients)

    onMounted(() => {
      clientStore.getItems()
    })

    return {
      clients,
      deleteClient,
      editClient,
      navigateToAddClient
    }
  }
}
</script>

<style>
.container {
  max-width: 1200px;
}
.table {
  margin-top: 20px;
}
.text-end {
  text-align: right;
}
</style>
