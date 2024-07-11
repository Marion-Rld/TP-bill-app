<template>
  <div class="container mt-5">
    <div class="d-flex justify-content-between">
      <h2 class="mb-4">Liste des clients</h2>
      <button class="btn btn-primary mb-3" @click="addClient">
        <i class="fa-solid fa-circle-plus"></i> Ajouter un client
      </button>
    </div>
    <table class="table table-striped">
      <tbody>
        <tr v-for="client in clients" :key="client.idclient">
          <td>{{ client.firstName }} {{ client.lastName }}</td>
          <td>{{ client.companyName }}</td>
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
import { clients } from '../seeds/clients'

export default {
  data() {
    return {
      clients
    }
  },
  methods: {
    deleteClient(id) {
      this.clients = this.clients.filter((client) => client.idclient !== id)
    },
    editClient(id) {
      console.log(`Edit client with ID: ${id}`)
    },
    addClient() {
      console.log('Add new client')
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
