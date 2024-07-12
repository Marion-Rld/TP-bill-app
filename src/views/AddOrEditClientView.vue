<template>
  <div class="container mt-5 mb-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>{{ isEdit ? 'Éditer un client' : 'Ajouter un client' }}</h2>
      <div>
        <button v-if="isEdit" class="btn btn-danger me-2" @click="deleteClient">
          <i class="fa fa-trash"></i> Supprimer
        </button>
        <button class="btn btn-secondary" @click="goBack">
          <i class="fa fa-arrow-left"></i> Retour
        </button>
      </div>
    </div>
    <form @submit.prevent="saveClient">
      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Contact</h5>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="firstName" class="form-label">Prénom:</label>
              <input type="text" v-model="client.firstName" id="firstName" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="lastName" class="form-label">Nom:</label>
              <input type="text" v-model="client.lastName" id="lastName" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="role" class="form-label">Fonction:</label>
              <input type="text" v-model="client.role" id="role" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="phone" class="form-label">Téléphone:</label>
              <input type="text" v-model="client.phone" id="phone" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="email" class="form-label">Email:</label>
              <input type="email" v-model="client.email" id="email" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="companyName" class="form-label">Entreprise:</label>
              <select v-model="client.companyName" id="companyName" class="form-select">
                <option v-for="company in companies" :key="company.id" :value="company.name">
                  {{ company.name }}
                </option>
              </select>
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="dateAdded" class="form-label">Date d'ajout:</label>
              <input
                type="date"
                v-model="client.additionDate"
                id="dateAdded"
                class="form-control"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="card mb-4">
        <div class="card-body">
          <h5 class="card-title">Coordonnées</h5>
          <div class="row mb-3">
            <div class="col-md-12">
              <label for="address1" class="form-label">Adresse 1:</label>
              <input type="text" v-model="client.address1" id="address1" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-12">
              <label for="address2" class="form-label">Adresse 2:</label>
              <input type="text" v-model="client.address2" id="address2" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="postalCode" class="form-label">Code Postal:</label>
              <input type="text" v-model="client.postalCode" id="postalCode" class="form-control" />
            </div>
            <div class="col-md-6">
              <label for="city" class="form-label">Ville:</label>
              <input type="text" v-model="client.city" id="city" class="form-control" />
            </div>
          </div>
          <div class="row mb-3">
            <div class="col-md-6">
              <label for="country" class="form-label">Pays:</label>
              <select v-model="client.country" id="country" class="form-select">
                <option value="FRANCE">FRANCE</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <button type="submit" class="btn btn-primary">
          {{ isEdit ? 'Enregistrer' : 'Ajouter' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { useClientStore } from '../stores/useClientStore'
import { useRoute } from 'vue-router'
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    const clientStore = useClientStore()
    const route = useRoute()
    const client = ref({
      firstName: '',
      lastName: '',
      role: '',
      phone: '',
      email: '',
      companyName: '',
      address1: '',
      address2: '',
      postalCode: '',
      city: '',
      country: 'FRANCE',
      additionDate: new Date().toISOString().slice(0, 10)
    })

    const companies = ref([])

    const isEdit = computed(() => !!route.params.id)

    onMounted(async () => {
      await clientStore.getCompanies()
      companies.value = clientStore.companies

      if (isEdit.value) {
        const clientId = parseInt(route.params.id)
        const existingClient = await clientStore.getItem(clientId)
        if (existingClient) {
          Object.assign(client.value, existingClient)
        }
      }
    })

    const saveClient = () => {
      if (isEdit.value) {
        clientStore.patchItem(client.value)
      } else {
        client.value.additionDate = new Date().toISOString().slice(0, 10)
        clientStore.postItem(client.value)
      }
      window.history.back()
    }

    const deleteClient = () => {
      if (isEdit.value) {
        clientStore.deleteItem(parseInt(route.params.id))
      }
      window.history.back()
    }

    const goBack = () => {
      window.history.back()
    }

    return {
      client,
      companies,
      isEdit,
      saveClient,
      deleteClient,
      goBack
    }
  }
}
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
}
.card-title {
  font-weight: bold;
  font-size: 1.25rem;
}
</style>
